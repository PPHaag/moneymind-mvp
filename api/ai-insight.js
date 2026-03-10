import OpenAI from "openai";

function safeParseJSON(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (_) {
      return null;
    }
  }
}

export default async function handler(req, res) {
  console.log("METHOD:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      receivedMethod: req.method,
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing");
    return res.status(500).json({
      error: "OpenAI API key missing",
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { tool, data } = req.body || {};

    console.log("REQ BODY:", JSON.stringify(req.body, null, 2));

    if (!data) {
      return res.status(400).json({
        error: "Missing data payload",
      });
    }

    const directCapital = Number(data.directCapital ?? 0);
    const accessibleCapital = Number(data.accessibleCapital ?? 0);
    const lockedCapital = Number(data.lockedCapital ?? 0);
    const age = data.age ?? "not provided";

    const totalCapital = directCapital + accessibleCapital + lockedCapital;

    const directShare =
      totalCapital > 0 ? ((directCapital / totalCapital) * 100).toFixed(1) : "0.0";
    const accessibleShare =
      totalCapital > 0 ? ((accessibleCapital / totalCapital) * 100).toFixed(1) : "0.0";
    const lockedShare =
      totalCapital > 0 ? ((lockedCapital / totalCapital) * 100).toFixed(1) : "0.0";

    const prompt = `
You are the MoneyMind Financial Intelligence Engine.

Your role is NOT to give generic personal finance advice.
Your role is to interpret a person's capital structure clearly, sharply, and strategically.

The user completed the Capital Map tool.

Tool: ${tool || "capital-map"}

Capital structure data:
- Direct Capital: €${directCapital}
- Accessible Capital: €${accessibleCapital}
- Locked Capital: €${lockedCapital}
- Age: ${age}

Capital mix:
- Direct Capital Share: ${directShare}%
- Accessible Capital Share: ${accessibleShare}%
- Locked Capital Share: ${lockedShare}%

Interpret this through a wealth architecture lens.

Focus on:
- concentration of capital
- liquidity versus structural depth
- deployability of capital
- imbalance between flexibility and long-term positioning
- whether the structure feels early-stage, balanced, or under-structured
- whether capital appears available but not yet intentionally layered

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation before or after the JSON.

Use exactly this JSON shape:

{
  "structure_signal": "...",
  "liquidity_signal": "...",
  "what_stands_out": "...",
  "why_it_matters": "...",
  "moneymind_view": "...",
  "reflection": "..."
}
structure_signal:
Short classification of the capital structure maturity.

Possible examples:
- "Early-stage structure"
- "Balanced structure"
- "Liquidity-heavy structure"
- "Locked-heavy structure"
- "Under-layered capital structure"
- "Well-layered capital structure"

Keep it short (max 4 words).

liquidity_signal:
Short description of how liquid the capital structure is.

Possible examples:
- "High liquidity"
- "Moderate liquidity"
- "Low liquidity"
- "Highly deployable capital"
- "Structurally locked capital"

Keep it short (max 3 words).

Rules for signals:
- These signals must be short classifications, not sentences.
- Do not repeat the same phrase in both signals.
- Base the signals on the capital distribution.

Writing rules:
- Sound intelligent, calm, premium, and slightly sharp.
- Be specific to the numbers given.
- Do NOT sound like a generic finance blog.
- Do NOT use clichés such as "diversification is important" unless directly relevant.
- Do NOT give direct financial advice.
- Do NOT tell the user what to buy, sell, or allocate.
- Do NOT moralize.
- Do NOT use hype.
- Make the interpretation structural, not motivational.
- Keep each field concise: 2 to 3 sentences maximum.
- "MoneyMind view" should feel like a strategic interpretation of the structure.
- "Reflection" should provoke thought, not give instructions.

Tone examples:
Good:
- "This structure is highly liquid, but not yet deeply layered."
- "The capital is available, but not strongly positioned."
- "Flexibility is high, structural depth is limited."
- "This looks more like capital in holding formation than a mature wealth structure."

Bad:
- "It is important to diversify for long-term success."
- "Consider speaking to a financial advisor."
- "This is a great starting point for your journey."
- "Make sure you invest wisely."

Output must be valid JSON only.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const rawText =
      response.output_text ||
      response.output
        ?.map((item) =>
          (item.content || [])
            .map((c) => c.text || c.content || "")
            .join("")
        )
        .join("\n")
        .trim() ||
      "";

    console.log("RAW AI TEXT:", rawText);

    const parsed = safeParseJSON(rawText);

    if (!parsed) {
      console.error("JSON PARSE FAILED");
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw_insight: rawText,
      });
    }

return res.status(200).json({
  success: true,
  structure_signal: parsed.structure_signal || "",
  liquidity_signal: parsed.liquidity_signal || "",
  what_stands_out: parsed.what_stands_out || "No section returned.",
  why_it_matters: parsed.why_it_matters || "No section returned.",
  moneymind_view: parsed.moneymind_view || "No section returned.",
  reflection: parsed.reflection || "No section returned.",
});
  } catch (error) {
    console.error("OPENAI ERROR FULL:", error);
    console.error("OPENAI ERROR MESSAGE:", error?.message);
    console.error("OPENAI ERROR STATUS:", error?.status);

    if (error?.status === 429) {
      return res.status(500).json({
        error: "OpenAI quota exceeded",
        details:
          "The OpenAI API key is connected, but the project has no available quota or billing is not active.",
      });
    }

    return res.status(500).json({
      error: "AI request failed",
      details: error?.message || "Unknown error",
    });
  }
}
