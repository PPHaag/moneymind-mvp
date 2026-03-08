import OpenAI from "openai";

export default async function handler(req, res) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {

    const { directCapital, accessibleCapital, lockedCapital, age } = req.body;

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
      model: "gpt-4.1-mini",
      input: prompt
    });

    res.status(200).json({
      insight: response.output_text
    });

  } catch (error) {

    res.status(500).json({
      error: "AI request failed"
    });

  }
}
