import OpenAI from "openai";

function extractSection(text, sectionName, nextSections = []) {
  const nextPattern = nextSections.length
    ? `(?=${nextSections.join("|")}|$)`
    : `(?=$)`;

  const regex = new RegExp(
    `${sectionName}[:\\s]*([\\s\\S]*?)${nextPattern}`,
    "i"
  );

  const match = text.match(regex);
  return match?.[1]?.trim() || "";
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

The user completed the Capital Map tool.
Tool: ${tool || "capital-map"}

Capital structure:
Direct Capital: €${directCapital}
Accessible Capital: €${accessibleCapital}
Locked Capital: €${lockedCapital}
Age: ${age}

Write the response using EXACTLY these section headers and nothing else:

What stands out
Why it matters
MoneyMind view
Reflection

Rules:
- Clear, intelligent, calm, practical.
- Slightly sharp is fine.
- No hype.
- No financial advice.
- Keep each section short and useful.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const insightText =
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

    console.log("RAW AI TEXT:", insightText);

    if (!insightText) {
      return res.status(500).json({
        error: "No insight returned from AI",
      });
    }

    const what_stands_out = extractSection(insightText, "What stands out", [
      "Why it matters",
      "MoneyMind view",
      "Reflection",
    ]);

    const why_it_matters = extractSection(insightText, "Why it matters", [
      "MoneyMind view",
      "Reflection",
    ]);

    const moneymind_view = extractSection(insightText, "MoneyMind view", [
      "Reflection",
    ]);

    const reflection = extractSection(insightText, "Reflection", []);

    console.log("PARSED SECTIONS:", {
      what_stands_out,
      why_it_matters,
      moneymind_view,
      reflection,
    });

    return res.status(200).json({
      success: true,
      what_stands_out: what_stands_out || "No section returned.",
      why_it_matters: why_it_matters || "No section returned.",
      moneymind_view: moneymind_view || "No section returned.",
      reflection: reflection || "No section returned.",
      raw_insight: insightText,
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
