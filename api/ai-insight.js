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

    console.log("REQ BODY:", JSON.stringify(req.body, null, 2));

    if (!data) {
      return res.status(400).json({ error: "Missing data payload" });
    }

    const {
  directCapital,
  accessibleCapital,
  lockedCapital,
  age = "not provided",
} = data;

if (
  directCapital === undefined ||
  accessibleCapital === undefined ||
  lockedCapital === undefined
) {
  return res.status(400).json({
    error: "Missing capital fields",
    received: { directCapital, accessibleCapital, lockedCapital, age },
  });
}

    const prompt = `
You are the MoneyMind Financial Intelligence Engine.

Explain the user's capital structure.

Direct Capital: €${directCapital}
Accessible Capital: €${accessibleCapital}
Locked Capital: €${lockedCapital}
Age: ${age}

Structure:
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
      input: prompt,
    });

    console.log("OPENAI RESPONSE:", JSON.stringify(response, null, 2));

    const insight =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No insight returned.";

    return res.status(200).json({ insight });
  } catch (error) {
    console.error("OPENAI ERROR FULL:", error);
    console.error("OPENAI ERROR MESSAGE:", error?.message);
    console.error("OPENAI ERROR STATUS:", error?.status);
    console.error("OPENAI ERROR DETAILS:", error?.response?.data);

    return res.status(500).json({
      error: "AI request failed",
      details: error?.message || "Unknown error",
    });
  }
}
