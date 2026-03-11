(function () {
  function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function pickRandom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pushUnique(target, value) {
    if (value && !target.includes(value)) {
      target.push(value);
    }
  }

  function pickFromGroup(group, key) {
    if (!group || !group[key]) return "";
    return pickRandom(group[key]);
  }

  function calculateRoast(input) {
    const monthlyNetIncome = toNumber(input.monthlyNetIncome);
    const savings = toNumber(input.savings);
    const investments = toNumber(input.investments);
    const debt = toNumber(input.debt);
    const fixedExpenses = toNumber(input.fixedExpenses);
    const monthlyWealthBuilding = toNumber(input.monthlyWealthBuilding);

    const wealthAllocationPct =
      monthlyNetIncome > 0 ? (monthlyWealthBuilding / monthlyNetIncome) * 100 : 0;

    const fixedCostPct =
      monthlyNetIncome > 0 ? (fixedExpenses / monthlyNetIncome) * 100 : 100;

    const bufferMonths =
      fixedExpenses > 0 ? savings / fixedExpenses : 0;

    const investableCapital = savings + investments;

    let score = 50;
    const triggers = [];
    const insights = [];

    // Wealth allocation
    if (wealthAllocationPct < 5) {
      score -= 25;
      pushUnique(triggers, "low_wealth_allocation");
      pushUnique(
        insights,
        `Only ${wealthAllocationPct.toFixed(1)}% of your income goes to wealth building.`
      );
    } else if (wealthAllocationPct < 10) {
      score -= 15;
      pushUnique(triggers, "low_wealth_allocation");
      pushUnique(
        insights,
        `Your wealth allocation is only ${wealthAllocationPct.toFixed(1)}% of monthly income.`
      );
    } else if (wealthAllocationPct >= 20) {
      score += 15;
      pushUnique(
        insights,
        `A strong ${wealthAllocationPct.toFixed(1)}% of your income goes toward building wealth.`
      );
    } else if (wealthAllocationPct >= 15) {
      score += 10;
      pushUnique(
        insights,
        `Your wealth allocation is solid at ${wealthAllocationPct.toFixed(1)}%.`
      );
    } else {
      pushUnique(
        insights,
        `You are directing ${wealthAllocationPct.toFixed(1)}% of income toward wealth building.`
      );
    }

    // Fixed cost load
    if (fixedCostPct > 80) {
      score -= 20;
      pushUnique(triggers, "high_fixed_cost_load");
      pushUnique(
        insights,
        `${fixedCostPct.toFixed(1)}% of your income disappears into fixed costs.`
      );
    } else if (fixedCostPct > 65) {
      score -= 10;
      pushUnique(triggers, "high_fixed_cost_load");
      pushUnique(
        insights,
        `Your fixed cost load is heavy at ${fixedCostPct.toFixed(1)}% of income.`
      );
    } else if (fixedCostPct < 50) {
      score += 10;
      pushUnique(
        insights,
        `Your fixed cost structure leaves more room than most at ${fixedCostPct.toFixed(1)}% of income.`
      );
    } else {
      pushUnique(
        insights,
        `Your fixed costs absorb ${fixedCostPct.toFixed(1)}% of your income each month.`
      );
    }

    // Investing
    if (investments <= 0) {
      score -= 12;
      pushUnique(triggers, "no_investing");
      pushUnique(
        insights,
        "You currently have no invested capital working for your future."
      );
    } else if (investments > 0 && investments >= savings) {
      score += 10;
      pushUnique(
        insights,
        "You already have capital working instead of leaving everything idle."
      );
    } else {
      pushUnique(
        insights,
        "You have at least started putting capital to work."
      );
    }

    // Debt pressure
    if (debt > monthlyNetIncome * 12) {
      score -= 15;
      pushUnique(triggers, "high_debt_pressure");
      pushUnique(
        insights,
        "Debt pressure is large relative to your annual income."
      );
    } else if (debt > monthlyNetIncome * 6) {
      score -= 8;
      pushUnique(triggers, "high_debt_pressure");
      pushUnique(
        insights,
        "Debt is material enough to limit your financial flexibility."
      );
    }

    // Buffer
    if (bufferMonths < 2) {
      score -= 15;
      pushUnique(triggers, "low_buffer");
      pushUnique(
        insights,
        `Your cash buffer covers only about ${bufferMonths.toFixed(1)} months of fixed costs.`
      );
    } else if (bufferMonths < 4) {
      score -= 5;
      pushUnique(triggers, "low_buffer");
      pushUnique(
        insights,
        `Your financial buffer is still modest at roughly ${bufferMonths.toFixed(1)} months.`
      );
    } else if (bufferMonths >= 6) {
      score += 10;
      pushUnique(
        insights,
        `Your savings cover roughly ${bufferMonths.toFixed(1)} months of fixed costs.`
      );
    } else {
      pushUnique(
        insights,
        `Your buffer covers around ${bufferMonths.toFixed(1)} months of fixed costs.`
      );
    }

    // Sleeping capital
    if (savings > investments * 2 && investments > 0) {
      score -= 7;
      pushUnique(triggers, "sleeping_capital");
      pushUnique(
        insights,
        "A large share of your capital is sitting in cash instead of compounding."
      );
    } else if (
      savings > 0 &&
      investments === 0 &&
      investableCapital > monthlyNetIncome * 3
    ) {
      score -= 10;
      pushUnique(triggers, "sleeping_capital");
      pushUnique(
        insights,
        "You have meaningful capital, but almost none of it is structurally working for you."
      );
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

    const category =
      window.ROAST_DATA.categories.find((c) => c.key === categoryKey) || null;

    const headline = pickFromGroup(window.ROAST_DATA.headlines, categoryKey);
    const shareLine = pickFromGroup(window.ROAST_DATA.shareLines, categoryKey);

    const roastBullets = [];

    triggers.forEach((trigger) => {
      const line = pickFromGroup(window.ROAST_DATA.roastBullets, trigger);
      pushUnique(roastBullets, line);
    });

    if (score >= 75) {
      pushUnique(
        roastBullets,
        pickFromGroup(window.ROAST_DATA.roastBullets, "good_structure")
      );
      pushUnique(
        roastBullets,
        pickFromGroup(window.ROAST_DATA.roastBullets, "decent_buffer")
      );
    }

    while (roastBullets.length < 3) {
      pushUnique(roastBullets, pickRandom(window.ROAST_DATA.fallbackRoasts));
    }

    let nextMove = pickRandom(window.ROAST_DATA.nextMoves.balanced);

    if (triggers.includes("low_wealth_allocation")) {
      nextMove = pickRandom(window.ROAST_DATA.nextMoves.low_wealth_allocation);
    } else if (triggers.includes("high_fixed_cost_load")) {
      nextMove = pickRandom(window.ROAST_DATA.nextMoves.high_fixed_cost_load);
    } else if (triggers.includes("high_debt_pressure")) {
      nextMove = pickRandom(window.ROAST_DATA.nextMoves.high_debt_pressure);
    } else if (triggers.includes("low_buffer")) {
      nextMove = pickRandom(window.ROAST_DATA.nextMoves.low_buffer);
    } else if (triggers.includes("sleeping_capital")) {
      nextMove = pickRandom(window.ROAST_DATA.nextMoves.sleeping_capital);
    } else if (triggers.includes("no_investing")) {
      nextMove = pickRandom(window.ROAST_DATA.nextMoves.no_investing);
    }

    const academyTags = [
      ...new Set(
        triggers.flatMap((trigger) => window.ROAST_DATA.academyTags[trigger] || [])
      )
    ];

    return {
      score,
      category: category ? category.label : "Structural Leakage",
      categoryKey,
      headline,
      shareLine: shareLine || headline,
      roastBullets: roastBullets.slice(0, 3),
      insights: insights.slice(0, 3),
      nextMove,
      academyTags,
      triggers,
      metrics: {
        wealthAllocationPct,
        fixedCostPct,
        bufferMonths,
        investableCapital
      }
    };
  }

  window.RoastEngine = {
    calculateRoast
  };
})();
