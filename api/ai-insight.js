import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    const prompt = `
You are the MoneyMind AI Insight Layer.

Your task is to interpret a user's financial dashboard in a sharp, structured, and practical way.

STRICT RULES:
- Do NOT give financial advice
- Do NOT recommend products
- Do NOT say "you should invest"
- Focus on understanding and structure
- Be clear, slightly confronting when needed, but never aggressive
- Avoid generic AI language

OUTPUT FORMAT:
Return ONLY valid JSON with:
{
  "title": "...",
  "whatYouSee": "...",
  "whyItMatters": "...",
  "thinkAbout": "...",
  "nextStep": "..."
}
- Use double quotes for all keys and string values.
- Do not use single quotes.
- Do not use markdown.
- Do not wrap the JSON in code fences.
- Do not add any text before or after the JSON

NEXT STEP RULES:
- "nextStep" must be practical
- It must identify the most logical next area of attention
- It must guide focus, not prescribe investment action
- It should feel useful and specific, not generic

TONE:
- intelligent
- calm
- sharp
- practical
- no fluff

USER DATA:
${JSON.stringify(data, null, 2)}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    const text = response.output_text;

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("AI returned invalid JSON:", text);

      return res.status(500).json({
        title: "AI response error",
        whatYouSee: "The AI returned an invalid response format.",
        whyItMatters: "This usually happens when the output is not strict JSON.",
        thinkAbout: "Check prompt structure and enforce JSON-only output.",
        nextStep: "Review the API output format before trying again."
      });
    }

    return res.status(200).json(parsed);

  } catch (error) {
    console.error("AI route error:", error);

    return res.status(500).json({
      title: "AI unavailable",
      whatYouSee: "We could not generate your insight right now.",
      whyItMatters: "The AI connection failed or the API key is missing.",
      thinkAbout: "Check your OpenAI API key and deployment settings.",
      nextStep: "Restore the AI connection before relying on this insight."
    });
  }
}
