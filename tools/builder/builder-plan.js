const { Anthropic } = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const d = req.body;

    const prompt = `You are a sharp, direct financial coach — not a cheerleader, not a therapist. You give honest, specific, actionable advice.

Here is the user's financial snapshot:
- Monthly income: €${Math.round(d.income || 0).toLocaleString('nl-NL')}
- Fixed costs: €${Math.round(d.fixed || 0).toLocaleString('nl-NL')}
- Lifestyle spending: €${Math.round(d.lifestyle || 0).toLocaleString('nl-NL')}
- Currently building: €${Math.round(d.building || 0).toLocaleString('nl-NL')}/month (${d.buildingRatio || 0}% of income)
- Liquid assets: €${Math.round(d.liquid || 0).toLocaleString('nl-NL')}
- Invested capital: €${Math.round(d.invested || 0).toLocaleString('nl-NL')}
- Debt: €${Math.round(d.debt || 0).toLocaleString('nl-NL')}
- Monthly leakage: €${Math.round(d.monthlyLeakage || 0).toLocaleString('nl-NL')} (${d.leakageRatio || 0}% of income)
- Financial goal: ${d.goal || 'Not specified'}
- Profile: ${d.profile || 'Not specified'}
- Data quality: ${d.dataQuality || 'Unknown'}

Top priorities identified:
${d.priorities || 'None specified'}

Write a 90-day action plan in 4-6 short, punchy paragraphs. Be specific — use the actual numbers. Where data is estimated, acknowledge briefly but still give concrete direction. No bullet points. No generic advice. No empty praise. Start with the most important action. Plain language. End with one concrete monthly habit that will have the most impact.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const plan = response.content
      ?.filter(b => b.type === "text")
      .map(b => b.text)
      .join("") || "";

    return res.status(200).json({ plan });

  } catch (error) {
    console.error("Builder plan error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
