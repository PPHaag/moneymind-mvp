const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic.default
  ? new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
  : new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async function handler(req, res) {
  console.log("API KEY aanwezig:", !!process.env.ANTHROPIC_API_KEY);
  console.log("API KEY start:", process.env.ANTHROPIC_API_KEY?.slice(0, 8));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    const prompt = `You are the MoneyMind AI Insight Layer.
Your task is to interpret a user's financial dashboard in a sharp, structured, and practical way.

STRICT RULES:
- Do NOT give financial advice
- Do NOT recommend products
- Do NOT say "you should invest"
- Focus on understanding and structure
- Be clear, slightly confronting when needed, but never aggressive
- Avoid generic AI language
- Do not exaggerate
- Interpret low ratios and missing fields conservatively
- A building ratio of 12 should not be described as high

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
- Do not add any text before or after the JSON.

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
${JSON.stringify(data, null, 2)}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content?.map((b) => b.text || "").join("") || "";
    console.log("Raw AI output:", text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("AI returned invalid JSON:", text);
      const repaired = text
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/":\s*"([^"]*)'\s*,/g, '": "$1",');
      try {
        parsed = JSON.parse(repaired);
        console.log("Recovered AI JSON after repair");
      } catch (repairErr) {
        return res.status(500).json({
          title: "AI response error",
          whatYouSee: "The AI returned an invalid response format.",
          whyItMatters: "The content looked useful, but the JSON structure was broken.",
          thinkAbout: "This usually happens when the model mixes quote styles.",
          nextStep: "Try again while we tighten the output formatting.",
        });
      }
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("AI route error:", error.message, error.stack);
    return res.status(500).json({
      title: "AI unavailable",
      whatYouSee: "We could not generate your insight right now.",
      whyItMatters: error.message,
      thinkAbout: "Check your Anthropic API key and deployment settings.",
      nextStep: "Restore the AI connection before relying on this insight.",
    });
  }
};
