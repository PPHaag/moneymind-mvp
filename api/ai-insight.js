import OpenAI from "openai";

export default async function handler(req, res) {

  // Alleen POST toestaan
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check of API key bestaat
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing");
    return res.status(500).json({ error: "OpenAI API key missing" });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {

    const { directCapital, accessibleCapital, lockedCapital, age } = req.body;

    // simpele check
    if (
      directCapital === undefined ||
      accessibleCapital === undefined ||
      lockedCapital === undefined ||
      age === undefined
    ) {
      return res.status(400).json({ error: "Missing input values" });
    }

    const prompt = `
You are the MoneyMind Financial Intelligence Engine.

Explain the user's capital structure.

Direct Capital: €${directCapital}
Accessible Capital: €${accessibleCapital}
Locked Capital: €${lockedCapital}
Age: ${age}

Structure your answer like this:

1. Financial Structure Insight
2. What stands out
3. Why it matters
4. MoneyMind view
5. Reflection

Tone:
Clear, intelligent, calm, slightly sharp.
No financial advice.
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    const aiText = response.output_text;

    return res.status(200).json({
      insight: aiText
    });

  } catch (error) {

    console.error("OPENAI ERROR:", error);
    console.error("MESSAGE:", error?.message);
    console.error("STATUS:", error?.status);

    return res.status(500).json({
      error: "AI request failed",
      details: error?.message || "Unknown error"
    });
  }
}
