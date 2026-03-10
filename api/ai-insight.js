import OpenAI from "openai";

function safeParseJSON(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    // probeer code fences weg te halen
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

const prompt = `
You are the MoneyMind Financial Intelligence Engine.

Your job is not to give generic personal finance advice.
Your job is to interpret capital structure sharply, clearly, and strategically.

The user completed the Capital Map tool.
Tool: ${tool || "capital-map"}

Capital structure:
- Direct Capital: €${directCapital}
- Accessible Capital: €${accessibleCapital}
- Locked Capital: €${lockedCapital}
- Age: ${age}

Interpret the structure through a wealth architecture lens.

Focus on:
- concentration of capital
- liquidity versus structural positioning
- deployability of capital
- imbalance between flexibility and long-term positioning
- whether the capital structure looks early-stage, balanced, or under-structured

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation before or after the JSON.

Use exactly this shape:

{
  "what_stands_out": "...",
  "why_it_matters": "...",
  "moneymind_view": "...",
  "reflection": "..."
}

Writing rules:
- Sound intelligent, calm, premium, and slightly sharp.
- Do NOT sound like a generic financial blog.
- Do NOT use clichés like "diversification is important" unless directly relevant.
- Do NOT give direct financial advice or tell the user what to buy.
- Do NOT moralize.
- Be specific to the numbers given.
- Make the insight feel structural, not motivational.
- Each field should be 2-3 sentences max.
- MoneyMind view should sound like a strategic interpretation, not a disclaimer.

Style examples:
- Good: "This structure is highly liquid, but not yet deeply layered."
- Good: "The capital is available, but not strongly positioned."
- Good: "Flexibility is high, structural depth is limited."
- Bad: "It is important to diversify for long-term success."
- Bad: "Consider speaking to a financial advisor."
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
