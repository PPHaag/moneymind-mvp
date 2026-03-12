window.ROAST_DATA = {
  questions: [
    {
      id: "age",
      eyebrow: "Question 1",
      title: "How old are you?",
      hint: "This helps estimate your compounding runway.",
      options: [
        { label: "18–25", value: "18-25", yearsTo60: 38 },
        { label: "26–35", value: "26-35", yearsTo60: 30 },
        { label: "36–45", value: "36-45", yearsTo60: 20 },
        { label: "46–55", value: "46-55", yearsTo60: 10 },
        { label: "56+", value: "56+", yearsTo60: 5 }
      ]
    },
    {
      id: "income",
      eyebrow: "Question 2",
      title: "What is your monthly income?",
      hint: "Choose the range that fits best.",
      options: [
        { label: "< €2k", value: "<2k", amount: 1500 },
        { label: "€2k–4k", value: "2k-4k", amount: 3000 },
        { label: "€4k–6k", value: "4k-6k", amount: 5000 },
        { label: "€6k–10k", value: "6k-10k", amount: 8000 },
        { label: "€10k+", value: "10k+", amount: 12000 }
      ]
    },
    {
      id: "savings",
      eyebrow: "Question 3",
      title: "How much have you saved or invested so far?",
      hint: "Think total accessible savings + investments.",
      options: [
        { label: "< €5k", value: "<5k", amount: 2500 },
        { label: "€5k–20k", value: "5k-20k", amount: 12500 },
        { label: "€20k–100k", value: "20k-100k", amount: 60000 },
        { label: "€100k–500k", value: "100k-500k", amount: 250000 },
        { label: "€500k+", value: "500k+", amount: 600000 }
      ]
    },
    {
      id: "invest",
      eyebrow: "Question 4",
      title: "How much do you invest each month?",
      hint: "Approximate is fine. No accountant drama needed.",
      options: [
        { label: "€0", value: "0", amount: 0 },
        { label: "€100–300", value: "100-300", amount: 200 },
        { label: "€300–800", value: "300-800", amount: 550 },
        { label: "€800–2000", value: "800-2000", amount: 1400 },
        { label: "€2000+", value: "2000+", amount: 2500 }
      ]
    },
    {
      id: "goal",
      eyebrow: "Question 5",
      title: "What is your biggest financial goal right now?",
      hint: "This helps shape the tone of your Roast.",
      options: [
        { label: "Financial freedom", value: "freedom" },
        { label: "Wealth building", value: "wealth" },
        { label: "Security", value: "security" },
        { label: "Not sure yet", value: "unsure" }
      ]
    }
  ],

  profiles: {
    potential_builder: {
      name: "The Potential Builder",
      description:
        "You have meaningful wealth potential, but your current capital formation is weaker than it should be for your income level.",
      opportunity:
        "Increase your investment allocation and focus more aggressively on turning income into assets."
    },
    disciplined_investor: {
      name: "The Disciplined Investor",
      description:
        "Your financial behavior shows strong long-term discipline. You are already doing what most people only talk about.",
      opportunity:
        "Refine your allocation and expand your wealth architecture instead of starting from scratch."
    },
    lifestyle_optimizer: {
      name: "The Lifestyle Optimizer",
      description:
        "Your income is likely supporting a comfortable life, but your structure suggests lifestyle growth may be moving faster than wealth growth.",
      opportunity:
        "Redirect part of your income toward assets before your future becomes an expensive side effect."
    },
    security_seeker: {
      name: "The Security Seeker",
      description:
        "You value stability and protection, but your wealth may be growing slower than it could because too much capital stays defensive.",
      opportunity:
        "Introduce gradual investing and let time do more of the heavy lifting."
    },
    future_architect: {
      name: "The Future Architect",
      description:
        "Your structure suggests strategic thinking and a serious wealth-building mindset. You are building systems, not just reacting.",
      opportunity:
        "Optimize your capital structure, diversification, and long-term compounding strategy."
    }
  },

  behaviorConcepts: {
    lifestyle_inflation: {
      title: "Lifestyle Inflation Risk",
      text:
        "As income rises, spending often rises with it. That feels harmless in the moment, but over time it slows capital formation and quietly steals future wealth.",
      lessonLabel: "Learn: Lifestyle Inflation"
    },
    discipline_gap: {
      title: "Discipline Gap",
      text:
        "Many people know what they should do financially, but their monthly structure says something else. The gap between intention and execution is where wealth quietly leaks away.",
      lessonLabel: "Learn: Discipline Gap"
    },
    risk_illusion: {
      title: "Risk Illusion",
      text:
        "Avoiding visible risk can feel safe, but not investing enough over time carries its own hidden risk: falling behind inflation and losing compounding power.",
      lessonLabel: "Learn: Risk Illusion"
    },
    compounding_patience: {
      title: "Compounding Patience",
      text:
        "Your structure shows the kind of consistency that gives compounding a real chance to work. Not flashy. Just effective. Which is annoyingly how wealth is usually built.",
      lessonLabel: "Learn: Compounding Patience"
    }
  }
};
