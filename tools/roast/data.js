window.ROAST_DATA = {
questions: [
{
id: “age”,
eyebrow: “Question 1”,
title: “How old are you?”,
hint: “This helps estimate your compounding runway.”,
options: [
{ label: “18–25”, value: “18-25”, yearsTo60: 38 },
{ label: “26–35”, value: “26-35”, yearsTo60: 30 },
{ label: “36–45”, value: “36-45”, yearsTo60: 20 },
{ label: “46–55”, value: “46-55”, yearsTo60: 10 },
{ label: “56+”,   value: “56+”,   yearsTo60: 5  }
]
},
{
id: “income”,
eyebrow: “Question 2”,
title: “What is your monthly income?”,
hint: “Choose the range that fits best.”,
options: [
{ label: “< €2k”,    value: “<2k”,    amount: 1500  },
{ label: “€2k–4k”,  value: “2k-4k”,  amount: 3000  },
{ label: “€4k–6k”,  value: “4k-6k”,  amount: 5000  },
{ label: “€6k–10k”, value: “6k-10k”, amount: 8000  },
{ label: “€10k+”,   value: “10k+”,   amount: 12000 }
]
},
{
id: “savings”,
eyebrow: “Question 3”,
title: “How much have you saved or invested so far?”,
hint: “Think total accessible savings + investments.”,
options: [
{ label: “< €5k”,       value: “<5k”,       amount: 2500   },
{ label: “€5k–20k”,    value: “5k-20k”,    amount: 12500  },
{ label: “€20k–100k”,  value: “20k-100k”,  amount: 60000  },
{ label: “€100k–500k”, value: “100k-500k”, amount: 250000 },
{ label: “€500k+”,     value: “500k+”,     amount: 600000 }
]
},
{
id: “invest”,
eyebrow: “Question 4”,
title: “How much do you invest each month?”,
hint: “Approximate is fine. No accountant drama needed.”,
options: [
{ label: “€0”,        value: “0”,        amount: 0    },
{ label: “€100–300”,  value: “100-300”,  amount: 200  },
{ label: “€300–800”,  value: “300-800”,  amount: 550  },
{ label: “€800–2000”, value: “800-2000”, amount: 1400 },
{ label: “€2000+”,    value: “2000+”,    amount: 2500 }
]
},
{
id: “goal”,
eyebrow: “Question 5”,
title: “What is your biggest financial goal right now?”,
hint: “This shapes your Roast and Dashboard focus.”,
options: [
{ label: “Financial freedom”, value: “freedom”  },
{ label: “Wealth building”,   value: “wealth”   },
{ label: “Security”,          value: “security” },
{ label: “Not sure yet”,      value: “unsure”   }
]
}
],

// Single source of truth for all profiles.
// engine.js reads from here — no duplicate definitions.
profiles: {
future_architect: {
name: “The Future Architect”,
description: “You’re already doing the hard part: building with intent. Now the risk is not laziness. It’s hidden inefficiency.”,
opportunity: “You do not need a reset. You need sharper allocation, tighter structure, and less money sitting in the wrong place.”,
headline: “You’re doing a lot right. That still doesn’t mean you’re optimized.”,
observation: “Your base is strong. Good. But once you reach this level, inefficiency becomes expensive. Precision is now the game.”
},
disciplined_investor: {
name: “The Disciplined Investor”,
description: “You’re doing the hard part already: consistency. Now stop wasting the advantage by settling for good enough.”,
opportunity: “The next step is not working harder. It’s making more of what already comes in.”,
headline: “You’re doing better than most. You’re still leaving money on the table.”,
observation: “You’ve built a stronger base than most people. But once the basics are in place, small allocation mistakes start costing real money.”
},
security_seeker: {
name: “The Security Seeker”,
description: “You’ve built a cushion, which is smart. But too much safety can quietly turn into underperformance.”,
opportunity: “You do not need more comfort. You need more of your capital pointed at actual growth.”,
headline: “You’ve built safety. Not enough growth.”,
observation: “You’ve protected yourself reasonably well, but cash and caution alone will not do the heavy lifting for long-term wealth.”
},
potential_builder: {
name: “The Potential Builder”,
description: “You have enough income to be building serious momentum. Right now, the structure does not match the earning power.”,
opportunity: “You do not need more motivation. You need a system that moves more of your cashflow into assets.”,
headline: “You earn enough to build wealth. You’re just not acting like it yet.”,
observation: “Your income suggests room to build serious capital. Right now, too little of it is actually moving in that direction.”
},
lifestyle_optimizer: {
name: “The Lifestyle Optimizer”,
description: “You’re not doing badly. That’s exactly the trap. Comfortable structures often hide mediocre wealth building.”,
opportunity: “You do not need drama. You need better allocation, more consistency, and less silent leakage.”,
headline: “Your money is working. Just not hard enough.”,
observation: “Your structure is decent. Decent is dangerous when better decisions are this close.”
}
},

// Single source of truth for all behavior concepts.
behaviorConcepts: {
compounding_patience: {
title: “You’re doing the boring part right.”,
text: “Your structure gives compounding a real chance to work. Not exciting. Not sexy. Just effective — which is exactly why most people fail to stick with it.”,
lessonLabel: “Learn why boring wins”
},
risk_illusion: {
title: “Safety can be expensive too.”,
text: “Holding back risk feels responsible. Sometimes it is. But when caution becomes your default setting, it can quietly cost you years of growth.”,
lessonLabel: “Learn the real risk”
},
discipline_gap: {
title: “Intent is not the same as structure.”,
text: “Wanting to build wealth is nice. Structuring your money so it actually happens is what counts. Right now, those two are too far apart.”,
lessonLabel: “Learn what discipline really means”
},
lifestyle_inflation: {
title: “Comfort eats compounding for breakfast.”,
text: “A decent income does not automatically become wealth. If too much cashflow gets absorbed by lifestyle, growth stays slower than it should.”,
lessonLabel: “Learn how lifestyle inflation works”
}
},

// Goal modifiers: subtle tone shifts based on question 5.
goalContext: {
freedom:  { dashboardFocus: “freedom”,  tone: “You said financial freedom. That requires a structure that works while you don’t.” },
wealth:   { dashboardFocus: “wealth”,   tone: “You’re here to build wealth. That starts with knowing where it’s currently leaking.” },
security: { dashboardFocus: “security”, tone: “Security is valid. But real security comes from growth, not just caution.” },
unsure:   { dashboardFocus: “clarity”,  tone: “Not sure yet is an honest answer. Let’s give you the clarity to decide.” }
}
};
