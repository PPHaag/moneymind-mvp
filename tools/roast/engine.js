(function () {

  function safe(val, fallback = 0) {
    return typeof val === "number" && !isNaN(val) ? val : fallback;
  }

  function formatEuro(value) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  function formatPercent(value) {
    return `${Math.round((value || 0) * 100)}%`;
  }

  function getAnnualReturnByProfile(answerData) {
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (investRate >= 0.2) return 0.07;
    if (investRate >= 0.1) return 0.065;
    return 0.06;
  }

  function futureValue(monthlyContribution, years, annualReturn, startingCapital) {
    const months = safe(years) * 12;
    const monthlyRate = annualReturn / 12;

    if (months <= 0) return safe(startingCapital);

    const fvStart = startingCapital * Math.pow(1 + monthlyRate, months);
    const fvContrib = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return fvStart + fvContrib;
  }

  function determineProfile(answerData) {
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const savings = safe(answerData?.savings?.amount);

    const investRate = income > 0 ? invest / income : 0;
    const wealthRatio = income > 0 ? savings / (income * 12) : 0;

    if (investRate >= 0.2 && wealthRatio >= 1) return "future_architect";
    if (investRate >= 0.15) return "disciplined_investor";
    if (investRate < 0.05 && wealthRatio >= 1.5) return "security_seeker";
    if (income >= 4000 && investRate < 0.12) return "potential_builder";

    return "lifestyle_optimizer";
  }

  function determineBehaviorConcept(answerData, profileKey) {
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (profileKey === "disciplined_investor" || profileKey === "future_architect") {
      return "compounding_patience";
    }

    if (profileKey === "security_seeker") {
      return "risk_illusion";
    }

    if (investRate <= 0.05) {
      return "discipline_gap";
    }

    return "lifestyle_inflation";
  }

  function buildHeadline(answerData, profileKey) {
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (profileKey === "future_architect") {
      return "You’re doing a lot right. That still doesn’t mean you’re optimized.";
    }

    if (profileKey === "disciplined_investor") {
      return "You’re doing better than most. You’re still leaving money on the table.";
    }

    if (profileKey === "security_seeker") {
      return "You’ve built safety. Not enough growth.";
    }

    if (profileKey === "potential_builder") {
      return "You earn enough to build wealth. You’re just not acting like it yet.";
    }

    if (investRate < 0.08) {
      return "Your income has potential. Your current structure does not.";
    }

    return "Your money is working. Just not hard enough.";
  }

  function buildObservation(answerData, profileKey) {
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (profileKey === "future_architect") {
      return "Your base is strong. Good. But once you reach this level, inefficiency becomes expensive.";
    }

    if (profileKey === "disciplined_investor") {
      return "You’ve built a stronger base than most people. But once the basics are in place, small allocation mistakes start costing real money.";
    }

    if (profileKey === "security_seeker") {
      return "You’ve protected yourself reasonably well, but cash and caution alone will not do the heavy lifting for long-term wealth.";
    }

    if (profileKey === "potential_builder") {
      return "Your income suggests room to build serious capital. Right now, too little of it is actually moving in that direction.";
    }

    if (investRate < 0.05) {
      return "Right now, too little of your monthly cashflow is going toward long-term wealth building. That is not strategy. That is drift.";
    }

    if (investRate < 0.15) {
      return "You are doing something, which is already better than excuses. But it is not yet enough to create serious momentum.";
    }

    return "Your structure is decent. Decent is dangerous when better decisions are this close.";
  }

  function buildProfile(profileKey) {
    const profiles = {
      future_architect: {
        name: "The Future Architect",
        description: "You’re already doing the hard part: building with intent. Now the risk is not laziness. It’s hidden inefficiency.",
        opportunity: "You do not need a reset. You need sharper allocation, tighter structure, and less money sitting in the wrong place."
      },
      disciplined_investor: {
        name: "The Disciplined Investor",
        description: "You’re doing the hard part already: consistency. Now stop wasting the advantage by settling for good enough.",
        opportunity: "The next step is not working harder. It’s making more of what already comes in."
      },
      security_seeker: {
        name: "The Security Seeker",
        description: "You’ve built a cushion, which is smart. But too much safety can quietly turn into underperformance.",
        opportunity: "You do not need more comfort. You need more of your capital pointed at actual growth."
      },
      potential_builder: {
        name: "The Potential Builder",
        description: "You have enough income to be building serious momentum. Right now, the structure does not match the earning power.",
        opportunity: "You do not need more motivation. You need a system that moves more of your cashflow into assets."
      },
      lifestyle_optimizer: {
        name: "The Lifestyle Optimizer",
        description: "You’re not doing badly. That’s exactly the trap. Comfortable structures often hide mediocre wealth building.",
        opportunity: "You do not need drama. You need better allocation, more consistency, and less silent leakage."
      }
    };

    return profiles[profileKey] || {
      name: "The Financial Work In Progress",
      description: "There is something to build here. But the structure still needs work.",
      opportunity: "Start by tightening the basics before pretending strategy is the issue."
    };
  }

  function buildBehavior(behaviorKey, profileKey) {
    const map = {
      compounding_patience: {
        title: "You’re doing the boring part right.",
        text: "Your structure gives compounding a real chance to work. Not exciting. Not sexy. Just effective — which is exactly why most people fail to stick with it.",
        lessonLabel: "Learn why boring wins"
      },
      risk_illusion: {
        title: "Safety can be expensive too.",
        text: "Holding back risk feels responsible. Sometimes it is. But when caution becomes your default setting, it can quietly cost you years of growth.",
        lessonLabel: "Learn the real risk"
      },
      discipline_gap: {
        title: "Intent is not the same as structure.",
        text: "Wanting to build wealth is nice. Structuring your money so it actually happens is what counts. Right now, those two are too far apart.",
        lessonLabel: "Learn what discipline really means"
      },
      lifestyle_inflation: {
        title: "Comfort eats compounding for breakfast.",
        text: "A decent income does not automatically become wealth. If too much cashflow gets absorbed by lifestyle, growth stays slower than it should.",
        lessonLabel: "Learn how lifestyle inflation works"
      }
    };

    if (profileKey === "future_architect") {
      return {
        title: "Strong structure still needs pressure.",
        text: "The basics are there. Good. But once the foundation is solid, the real gains come from precision. That is where strong builders separate from almost-strong ones.",
        lessonLabel: "Learn where precision pays"
      };
    }

    return map[behaviorKey] || {
      title: "Your behavior matters more than your intentions.",
      text: "Financial outcomes usually follow structure, not good intentions.",
      lessonLabel: "Learn this concept"
    };
  }

  function buildTrajectory(answerData) {
    const years = safe(answerData?.age?.yearsTo60, 20);
    const income = safe(answerData?.income?.amount);
    const currentMonthly = safe(answerData?.invest?.amount);
    const currentCapital = safe(answerData?.savings?.amount);

    const annualReturn = getAnnualReturnByProfile(answerData);

    const currentWealth = futureValue(currentMonthly, years, annualReturn, currentCapital);

    const optimizedRate = 0.2;
    const optimizedMonthly = Math.max(currentMonthly, income * optimizedRate);

    const optimizedWealth = futureValue(optimizedMonthly, years, annualReturn, currentCapital);

    return {
      years,
      currentWealth: Math.round(currentWealth),
      optimizedWealth: Math.round(optimizedWealth),
      wealthDifference: Math.max(0, Math.round(optimizedWealth - currentWealth))
    };
  }

  function buildShareText(result) {
    return [
      "My MoneyMind Roast",
      "",
      `Profile: ${result.profile?.name || "Unknown"}`,
      `Investment rate: ${result.investRateText}`,
      `Same income. ${formatEuro(result.trajectory?.wealthDifference || 0)} difference.`,
      `Behavior insight: ${result.behavior?.title || "—"}`
    ].join("\n");
  }

  function analyzeRoast(answerData) {
    if (!answerData) {
      return {
        headline: "No data available",
        observation: "We could not analyze your structure.",
        incomeText: formatEuro(0),
        investText: formatEuro(0),
        investRateText: "0%",
        profile: {
          name: "Unknown",
          description: "",
          opportunity: ""
        },
        behavior: {
          title: "—",
          text: "",
          lessonLabel: "Learn this concept"
        },
        trajectory: {
          currentWealth: 0,
          optimizedWealth: 0,
          wealthDifference: 0
        },
        currentAgeText: "Estimated wealth by age 60",
        optimizedAgeText: "If you raise investing toward 20%",
        shareText: ""
      };
    }

    const incomeAmount = safe(answerData?.income?.amount);
    const investAmount = safe(answerData?.invest?.amount);
    const investRate = incomeAmount > 0 ? investAmount / incomeAmount : 0;

    const profileKey = determineProfile(answerData);
    const behaviorKey = determineBehaviorConcept(answerData, profileKey);

    const profile = buildProfile(profileKey);
    const behavior = buildBehavior(behaviorKey, profileKey);
    const trajectory = buildTrajectory(answerData);

    const result = {
      headline: buildHeadline(answerData, profileKey),
      observation: buildObservation(answerData, profileKey),

      incomeText: formatEuro(incomeAmount),
      investText: formatEuro(investAmount),
      investRateText: formatPercent(investRate),

      profileKey,
      profile,

      behaviorKey,
      behavior,

      trajectory,

      currentAgeText: "Estimated wealth by age 60",
      optimizedAgeText: "If you raise investing toward 20%",

      shareText: ""
    };

    result.shareText = buildShareText(result);

    try {
      localStorage.setItem(
        "moneymindProfile",
        JSON.stringify({
          income: incomeAmount,
          invest: investAmount,
          savings: safe(answerData?.savings?.amount),
          investRate,
          trajectory,
          profileKey,
          behaviorKey,
          createdAt: new Date().toISOString()
        })
      );
    } catch (err) {
      console.warn("Could not save moneymindProfile.", err);
    }

    return result;
  }

  window.RoastEngine = {
    analyzeRoast,
    formatEuro
  };

})();
