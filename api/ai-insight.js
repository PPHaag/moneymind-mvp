import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildCapitalMapPrompt(data) {
  const {
    directCapital = 0,
    accessibleCapital = 0,
    lockedCapital = 0,
    age = "",
  } = data;

  return `
You are the MoneyMind Financial Intelligence Engine.

Your role:
- Explain financial structure clearly
- Be analytical, sharp, calm, and practical
- Do not give investment advice
- Do not tell the user what to buy or sell
- Do not use hype, fluff, or generic AI language

Tone of voice:
- Clear
- Intelligent
- Slightly sharp when useful
- Educational
- Compact

Return valid JSON only with this exact structure:
{
  "title": "Financial Structure Insight",
  "what_stands_out": "...",
  "why_it_matters": "...",
  "moneymind_view": "...",
  "reflection": "..."
}

User data:
- Age: ${age}
- Direct Capital: ${directCapital}
- Accessible Capital: ${accessibleCapital}
- Locked Capital: ${lockedCapital}

Interpret the capital structure.
Focus on liquidity, deployability, flexibility, and structural friction.
Keep each field concise.
`.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tool, data } = req.body || {};

    if (tool !== "capital-map") {
      return res.status(400).json({ error: "Unsupported tool" });
    }

    const prompt = buildCapitalMapPrompt(data || {});

    const response = await client.responses.create({
      model: "gpt-5",
      reasoning: { effort: "low" },
      input: prompt,
    });

    const rawText = response.output_text?.trim();

    if (!rawText) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      return res.status(500).json({
        error: "AI did not return valid JSON",
        raw: rawText,
      });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("AI Insight error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
