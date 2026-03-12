(function () {
  function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function randomItem(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function uniquePush(arr, value) {
    if (value && !arr.includes(value)) {
      arr.push(value);
    }
  }

  function getData() {
    return window.ROAST_DATA || {};
  }

  function getCategoryLabel(categoryKey) {
    const categories = getData().categories || [];
    const found = categories.find((item) => item.key === categoryKey);
    return found ? found.label : "Structural Leakage";
  }

  function getHeadline(categoryKey) {
    const data = getData();
    const headlines = data.headlines || {};

    const defaults = {
      financial_chaos: [
        "Your money structure is less a system, more a monthly survival experiment."
      ],
      structural_leakage: [
        "Your income works full-time. Unfortunately not for you."
      ],
      income_without_direction: [
        "Nice income. Shame about the capital discipline."
      ],
      sleeping_capital: [
        "Your money is safe, comfortable, and doing absolutely nothing heroic."
      ],
      fragile_builder: [
        "You are building something, but one bad month could still bully the whole system."
      ],
      wealth_builder: [
        "Finally. Evidence of adult financial behavior."
      ]
    };

    return randomItem(headlines[categoryKey] || defaults[categoryKey] || defaults.structural_leakage);
  }

  function getShareLine(categoryKey, headline) {
    const data = getData();
    const shareLines = data.shareLines || {};

    const defaults = {
      financial_chaos: [
        "Your finances are currently running on hope, timing, and vibes."
      ],
      structural_leakage: [
        "Your cashflow has movement, but very little direction."
      ],
      income_without_direction: [
        "Good income. Weak routing."
      ],
      sleeping_capital: [
        "Your capital is safe, but not exactly ambitious."
      ],
      fragile_builder: [
        "You are building, but the structure still needs thicker walls."
      ],
      wealth_builder: [
        "Your structure shows actual financial intent."
      ]
    };

    return randomItem(shareLines[categoryKey] || defaults[categoryKey] || [headline]) || headline;
  }

  function getRoastLine(trigger) {
    const data = getData();
    const roastBullets = data.roastBullets || {};

    const defaults = {
      low_wealth_allocation: [
        "Too little of your monthly cashflow reaches wealth-building.",
        "Your future gets whatever is left over.",
        "You are underfunding your own long-term upside."
      ],
      high_fixed_cost_load: [
        "Your fixed costs are eating flexibility before your future gets a vote.",
        "Too much of your monthly structure is already spoken for.",
        "Your money has bills. Your goals get leftovers."
      ],
      no_investing: [
        "Inflation appreciates your passivity more than you do.",
        "You currently have no invested capital working for your future.",
        "Right now compounding is not in the chat."
      ],
      high_debt_pressure: [
        "Debt is taking up too much space in your financial architecture.",
        "Debt pressure is limiting optionality before growth even starts.",
        "Too much of this structure is carrying old weight."
      ],
      low_buffer: [
        "Your safety buffer is thin enough to make one unexpected invoice feel personal.",
        "Your margin for error is smaller than your confidence.",
        "One decent financial hit could shake this whole setup."
      ],
      sleeping_capital: [
        "A meaningful chunk of your money is sitting still instead of compounding.",
        "Your capital is protected, but not particularly productive.",
        "Too much of your capital prefers comfort over contribution."
      ],
      good_structure: [
        "Your allocation shows that you are actually directing money on purpose.",
        "There is visible strategy in how your cashflow is being handled."
      ],
      decent_buffer: [
        "You have at least some defensive structure instead of pure optimism.",
        "There is a visible safety layer in the system."
      ]
    };

    return randomItem(roastBullets[trigger] || defaults[trigger] || []);
  }

  function getFallbackRoastLines() {
    const data = getData();
    return data.fallbackRoasts || [
      "Your financial structure still has room to become more intentional.",
      "Money likes direction. Drift is expensive.",
      "A decent income is not the same as a strong system.",
      "Cashflow without structure is just motion.",
      "Your money needs a plan more than it needs hope."
    ];
  }

  function getNextMove(triggers) {
    const data = getData();
    const nextMoves = data.nextMoves || {};

    const defaults = {
      low_wealth_allocation: [
        "Increase the percentage of your monthly income going to wealth building before optimizing anything else."
      ],
      high_fixed_cost_load: [
        "Reduce structural monthly outflow first. A heavy system kills optionality."
      ],
      no_investing: [
        "Start putting part of your capital to work. Even a simple long-term structure beats hesitation."
      ],
      high_debt_pressure: [
        "Stabilize debt pressure before pretending you are in optimization mode."
      ],
      low_buffer: [
        "Build a stronger cash buffer so your financial system stops being one setback away from drama."
      ],
      sleeping_capital: [
        "Move part of your idle capital into a structure that can actually grow over time."
      ],
      balanced: [
        "Keep strengthening allocation discipline. Good systems become powerful through consistency."
      ]
    };

    if (triggers.includes("low_wealth_allocation")) {
      return randomItem(nextMoves.low_wealth_allocation || defaults.low_wealth_allocation);
    }
    if (triggers.includes("high_fixed_cost_load")) {
      return randomItem(nextMoves.high_fixed_cost_load || defaults.high_fixed_cost_load);
    }
    if (triggers.includes("high_debt_pressure")) {
      return randomItem(nextMoves.high_debt_pressure || defaults.high_debt_pressure);
    }
    if (triggers.includes("low_buffer")) {
      return randomItem(nextMoves.low_buffer || defaults.low_buffer);
    }
    if (triggers.includes("sleeping_capital")) {
      return randomItem(nextMoves.sleeping_capital || defaults.sleeping_capital);
    }
    if (triggers.includes("no_investing")) {
      return randomItem(nextMoves.no_investing || defaults.no_investing);
    }

    return randomItem(nextMoves.balanced || defaults.balanced);
  }

  function getAcademyTags(triggers) {
    const data = getData();
    const academyMap = data.academyTags || {};
    const tags = [];

    triggers.forEach((trigger) => {
      const triggerTags = academyMap[trigger] || [];
      triggerTags.forEach((tag) => uniquePush(tags, tag));
    });

    return tags;
  }

  function buildRoastBullets(triggers, score) {
    const result = [];

    triggers.forEach((trigger) => {
      uniquePush(result, getRoastLine(trigger));
    });

    if (score >= 75) {
      uniquePush(result, getRoastLine("good_structure"));
      uniquePush(result, getRoastLine("decent_buffer"));
    }

    const fallback = getFallbackRoastLines();

    while (result.length < 3) {
      uniquePush(result, randomItem(fallback));
      if (fallback.length === 0) break;
      if (result.length >= fallback.length && result.length < 3) {
        uniquePush(result, "Your money structure still has room to become more intentional.");
        uniquePush(result, "Money likes direction. Drift is expensive.");
        uniquePush(result, "A decent income is not the same as a strong system.");
      }
    }

    return result.slice(0, 3);
  }

  function buildInsights(metrics, triggers, monthlyNetIncome, savings, investments, debt, fixedExpenses, monthlyWealthBuilding) {
    const insights = [];

    if (triggers.includes("low_wealth_allocation")) {
      uniquePush(
        insights,
        `Only ${metrics.wealthAllocationPct.toFixed(1)}% of your income goes to wealth building.`
      );
    } else {
      uniquePush(
        insights,
        `You are directing ${metrics.wealthAllocationPct.toFixed(1)}% of your monthly income toward wealth building.`
      );
    }

    if (triggers.includes("high_fixed_cost_load")) {
      uniquePush(
        insights,
        `${metrics.fixedCostPct.toFixed(1)}% of your income disappears into fixed costs.`
      );
    } else {
      uniquePush(
        insights,
        `Your fixed costs absorb ${metrics.fixedCostPct.toFixed(1)}% of your monthly income.`
      );
    }

    if (investments <= 0) {
      uniquePush(
        insights,
        "You currently have no invested capital working for your future."
      );
    } else if (savings > investments * 2 && investments > 0) {
      uniquePush(
        insights,
        "A large share of your capital is sitting in cash instead of compounding."
      );
    } else {
      uniquePush(
        insights,
        "You already have capital working instead of leaving everything idle."
      );
    }

    if (insights.length < 3 && triggers.includes("low_buffer")) {
      uniquePush(
        insights,
        `Your buffer covers about ${metrics.bufferMonths.toFixed(1)} months of fixed costs.`
      );
    }

    if (insights.length < 3 && triggers.includes("high_debt_pressure")) {
      uniquePush(
        insights,
        "Debt pressure is limiting your financial flexibility."
      );
    }

    if (insights.length < 3) {
      uniquePush(
        insights,
        `Your current structure combines €${monthlyNetIncome.toFixed(0)} monthly net income with €${monthlyWealthBuilding.toFixed(0)} going toward wealth building.`
      );
    }

    return insights.slice(0, 3);
  }

  function calculateRoast(input) {
    const monthlyNetIncome = toNumber(input.monthlyNetIncome);
    const savings = toNumber(input.savings);
    const investments = toNumber(input.investments);
    const debt = toNumber(input.debt);
    const fixedExpenses = toNumber(input.fixedExpenses);
    const monthlyWealthBuilding = toNumber(input.monthlyWealthBuilding);

    const wealthAllocationPct = monthlyNetIncome > 0
      ? (monthlyWealthBuilding / monthlyNetIncome) * 100
      : 0;

    const fixedCostPct = monthlyNetIncome > 0
      ? (fixedExpenses / monthlyNetIncome) * 100
      : 100;

    const bufferMonths = fixedExpenses > 0
      ? (savings / fixedExpenses)
      : 0;

    const investableCapital = savings + investments;

    let score = 50;
    const triggers = [];

    if (wealthAllocationPct < 5) {
      score -= 25;
      uniquePush(triggers, "low_wealth_allocation");
    } else if (wealthAllocationPct < 10) {
      score -= 15;
      uniquePush(triggers, "low_wealth_allocation");
    } else if (wealthAllocationPct >= 20) {
      score += 15;
    } else if (wealthAllocationPct >= 15) {
      score += 10;
    }

    if (fixedCostPct > 80) {
      score -= 20;
      uniquePush(triggers, "high_fixed_cost_load");
    } else if (fixedCostPct > 65) {
      score -= 10;
      uniquePush(triggers, "high_fixed_cost_load");
    } else if (fixedCostPct < 50) {
      score += 10;
    }

    if (investments <= 0) {
      score -= 12;
      uniquePush(triggers, "no_investing");
    } else if (investments >= savings) {
      score += 10;
    }

    if (debt > monthlyNetIncome * 12 && monthlyNetIncome > 0) {
      score -= 15;
      uniquePush(triggers, "high_debt_pressure");
    } else if (debt > monthlyNetIncome * 6 && monthlyNetIncome > 0) {
      score -= 8;
      uniquePush(triggers, "high_debt_pressure");
    }

    if (bufferMonths < 2) {
      score -= 15;
      uniquePush(triggers, "low_buffer");
    } else if (bufferMonths < 4) {
      score -= 5;
      uniquePush(triggers, "low_buffer");
    } else if (bufferMonths >= 6) {
      score += 10;
    }

    if (savings > investments * 2 && investments > 0) {
      score -= 7;
      uniquePush(triggers, "sleeping_capital");
    } else if (savings > 0 && investments === 0 && investableCapital > monthlyNetIncome * 3) {
      score -= 10;
      uniquePush(triggers, "sleeping_capital");
    }

    score = clamp(Math.round(score), 0, 100);

    let categoryKey = "structural_leakage";

    if (score < 25) {
      categoryKey = "financial_chaos";
    } else if (score < 45) {
      categoryKey = "structural_leakage";
    } else if (score < 60) {
      categoryKey = "income_without_direction";
    } else if (score < 70 && triggers.includes("sleeping_capital")) {
      categoryKey = "sleeping_capital";
    } else if (score < 80) {
      categoryKey = "fragile_builder";
    } else {
      categoryKey = "wealth_builder";
    }

    const metrics = {
      wealthAllocationPct,
      fixedCostPct,
      bufferMonths,
      investableCapital
    };

    const headline = getHeadline(categoryKey);
    const shareLine = getShareLine(categoryKey, headline);
    const roastBullets = buildRoastBullets(triggers, score);
    const insights = buildInsights(
      metrics,
      triggers,
      monthlyNetIncome,
      savings,
      investments,
      debt,
      fixedExpenses,
      monthlyWealthBuilding
    );
    const nextMove = getNextMove(triggers);
    const academyTags = getAcademyTags(triggers);

    return {
      score,
      category: getCategoryLabel(categoryKey),
      categoryKey,
      headline,
      shareLine,
      roastBullets,
      insights,
      nextMove,
      academyTags,
      triggers,
      metrics
    };
  }

  window.RoastEngine = {
    calculateRoast
  };
})();
