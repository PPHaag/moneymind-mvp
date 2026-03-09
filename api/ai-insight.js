import OpenAI from "openai";

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
    return res.status(500).json({ error: "OpenAI API key missing" });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {

    const { tool, data } = req.body;

    console.log("AI REQUEST:", tool, data);

    if (!data) {
      return res.status(400).json({ error: "Missing data payload" });
    }

    const {
      directCapital,
      accessibleCapital,
      lockedCapital,
      age
    } = data;

    const prompt = `
You are the MoneyMind Financial Intelligence Engine.

Explain the user's capital structure.

Direct Capital: €${directCapital}
Accessible Capital: €${accessibleCapital}
Locked Capital: €${lockedCapital}
Age: ${age}

Structure:

Financial Structure Insight
What stands out
Why it matters
MoneyMind view
Reflection

Tone:
Clear, intelligent, calm, slightly sharp.
No financial advice.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    return res.status(200).json({
      insight: response.output_text
    });

  } catch (error) {

    console.error("OPENAI ERROR:", error);
    console.error("MESSAGE:", error?.message);

    return res.status(500).json({
      error: "AI request failed",
      details: error?.message || "Unknown error"
    });
  }
}
