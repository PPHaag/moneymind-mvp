(function () {
  function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function pickRandom(arr) {
    if (!arr || !arr.length) return "";
    return arr[Math.floor(Math.random() * arr.length)];
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
      ? savings / fixedExpenses
      : 0;

    const investableCapital = savings + investments;

    let score = 50;
    const triggers = [];
    const insights = [];

    if (wealthAllocationPct < 5) {
      score -= 25;
      triggers.push("low_wealth_allocation");
      insights.push(`Only ${wealthAllocationPct.toFixed(1)}% of your income goes to wealth building.`);
    } else if (wealthAllocationPct < 10) {
      score -= 15;
      triggers.push("low_wealth_allocation");
      insights.push(`Your wealth allocation is only ${wealthAllocationPct.toFixed(1)}% of monthly income.`);
    } else if (wealthAllocationPct >= 20) {
      score += 15;
      insights.push(`A strong ${wealthAllocationPct.toFixed(1)}% of your income goes toward building wealth.`);
    } else if (wealthAllocationPct >= 15) {
      score += 10;
      insights.push(`Your wealth allocation is solid at ${wealthAllocationPct.toFixed(1)}%.`);
    }

    if (fixedCostPct > 80) {
      score -= 20;
      triggers.push("high_fixed_cost_load");
      insights.push(`${fixedCostPct.toFixed(1)}% of your income disappears into fixed costs.`);
    } else if (fixedCostPct > 65) {
      score -= 10;
      triggers.push("high_fixed_cost_load");
      insights.push(`Your fixed cost load is heavy at ${fixedCostPct.toFixed(1)}% of income.`);
    } else if (fixedCostPct < 50) {
      score += 10;
      insights.push(`Your fixed cost structure leaves more room than most at ${fixedCostPct.toFixed(1)}% of income.`);
    }

    if (investments <= 0) {
      score -= 12;
      triggers.push("no_investing");
      insights.push("You currently have no invested capital working for your future.");
    } else if (investments > 0 && investments >= savings) {
      score += 10;
      insights.push("You already have capital working instead of leaving everything idle.");
    }

    if (debt > monthlyNetIncome * 12) {
      score -= 15;
      triggers.push("high_debt_pressure");
      insights.push("Debt pressure is large relative to your annual income.");
    } else if (debt > monthlyNetIncome * 6) {
      score -= 8;
      triggers.push("high_debt_pressure");
      insights.push("Debt is material enough to limit your financial flexibility.");
    }

    if (bufferMonths < 2) {
      score -= 15;
      triggers.push("low_buffer");
      insights.push(`Your cash buffer covers only about ${bufferMonths.toFixed(1)} months of fixed costs.`);
    } else if (bufferMonths < 4) {
      score -= 5;
      triggers.push("low_buffer");
      insights.push(`Your financial buffer is still modest at roughly ${bufferMonths.toFixed(1)} months.`);
    } else if (bufferMonths >= 6) {
      score += 10;
      insights.push(`Your savings cover roughly ${bufferMonths.toFixed(1)} months of fixed costs.`);
    }

    if (savings > investments * 2 && investments > 0) {
      score -= 7;
      triggers.push("sleeping_capital");
      insights.push("A large share of your capital is sitting in cash instead of compounding.");
    } else if (savings > 0 && investments === 0 && investableCapital > monthlyNetIncome * 3) {
      score -= 10;
      triggers.push("sleeping_capital");
      insights.push("You have meaningful capital, but almost none of it is structurally working for you.");
    }

    score = clamp(Math.round(score), 0, 100);

    let categoryKey = "structural_leakage";
    if (score < 25) categoryKey = "financial_chaos";
    else if (score < 45) categoryKey = "structural_leakage";
    else if (score < 60) categoryKey = "income_without_direction";
    else if (score < 70 && triggers.includes("sleeping_capital")) categoryKey = "sleeping_capital";
    else if (score < 80) categoryKey = "fragile_builder";
    else categoryKey = "wealth_builder";

    const category = window.ROAST_DATA.categories.find(c => c.key === categoryKey);
    const headline = pickRandom(window.ROAST_DATA.headlines[categoryKey]);

    const roastBullets = [];
    const added = new Set();

    triggers.forEach(trigger => {
      const line = window.ROAST_DATA.roastBullets[trigger];
      if (line && !added.has(line)) {
        roastBullets.push(line);
        added.add(line);
      }
    });

    if (score >= 75) {
      ["good_structure", "decent_buffer"].forEach(trigger => {
        const line = window.ROAST_DATA.roastBullets[trigger];
        if (line && !added.has(line)) {
          roastBullets.push(line);
          added.add(line);
        }
      });
    }

    while (roastBullets.length < 3) {
      const fallback = [
        "Your financial structure still has room to become more intentional.",
        "Money likes direction. Drift is expensive.",
        "A decent income is not the same as a strong system."
      ][roastBullets.length];
      roastBullets.push(fallback);
    }

    let nextMove = window.ROAST_DATA.nextMoves.balanced;
    if (triggers.includes("low_wealth_allocation")) nextMove = window.ROAST_DATA.nextMoves.low_wealth_allocation;
    else if (triggers.includes("high_fixed_cost_load")) nextMove = window.ROAST_DATA.nextMoves.high_fixed_cost_load;
    else if (triggers.includes("high_debt_pressure")) nextMove = window.ROAST_DATA.nextMoves.high_debt_pressure;
    else if (triggers.includes("low_buffer")) nextMove = window.ROAST_DATA.nextMoves.low_buffer;
    else if (triggers.includes("sleeping_capital")) nextMove = window.ROAST_DATA.nextMoves.sleeping_capital;
    else if (triggers.includes("no_investing")) nextMove = window.ROAST_DATA.nextMoves.no_investing;

    const academyTags = [...new Set(
      triggers.flatMap(trigger => window.ROAST_DATA.academyTags[trigger] || [])
    )];

    return {
      score,
      category: category ? category.label : "Structural Leakage",
      headline,
      roastBullets: roastBullets.slice(0, 3),
      insights: insights.slice(0, 3),
      nextMove,
      academyTags,
      metrics: {
        wealthAllocationPct,
        fixedCostPct,
        bufferMonths
      }
    };
  }

  window.RoastEngine = {
    calculateRoast
  };
})();
