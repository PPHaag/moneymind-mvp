export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const dashboardData = req.body;

    return res.status(200).json({
      title: "Your financial pattern",
      whatYouSee:
        "Your wealth base exists, but too much capital is still tied up while your building ratio remains low.",
      whyItMatters:
        "That reduces flexibility and slows the speed at which income turns into long-term capital.",
      thinkAbout:
        "Are you actively building wealth each month, or mostly maintaining your current position?"
    });
  } catch (error) {
    console.error("AI insight route error:", error);
    return res.status(500).json({ error: "Failed to generate insight" });
  }
}
