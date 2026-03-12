(function () {
  function toNumber(value) {
    var num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function pickRandom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function ensureArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getCategoryLabel(categoryKey) {
    var categories = ensureArray(window.ROAST_DATA && window.ROAST_DATA.categories);
    var found = categories.find(function (c) {
      return c.key === categoryKey;
    });
    return found ? found.label : "Structural Leakage";
  }

  function getRandomFromMap(map, key, fallback) {
    if (!map || !map[key]) return fallback || "";
    return pickRandom(ensureArray(map[key])) || fallback || "";
  }

  function getUniqueTags(triggers) {
    var tags = [];
    var academyTags = (window.ROAST_DATA && window.ROAST_DATA.academyTags) || {};

    triggers.forEach(function (trigger) {
      ensureArray(academyTags[trigger]).forEach(function (tag) {
        if (!tags.includes(tag)) tags.push(tag);
      });
    });

    return tags;
  }

}
function buildRoastBullets(triggers, score) {

  var roastBullets = (window.ROAST_DATA && window.ROAST_DATA.roastBullets) || {};
  var fallback = (window.ROAST_DATA && window.ROAST_DATA.fallbackRoasts) || [];

  var result = [];

  triggers.forEach(function(trigger){

    if (roastBullets[trigger]){

      var options = roastBullets[trigger];
      var line = options[Math.floor(Math.random() * options.length)];

      if(line && !result.includes(line)){
        result.push(line);
      }

    }

  });

  // als er weinig triggers zijn -> fallback toevoegen

  while(result.length < 3){

    var extra = fallback[Math.floor(Math.random() * fallback.length)];

    if(extra && !result.includes(extra)){
      result.push(extra);
    }

  }

  return result.slice(0,3);

}

  function getNextMove(triggers) {
    var nextMoves = (window.ROAST_DATA && window.ROAST_DATA.nextMoves) || {};

    if (triggers.includes("low_wealth_allocation")) {
      return getRandomFromMap(nextMoves, "low_wealth_allocation", "Increase the percentage of your monthly income going to wealth building.");
    }

    if (triggers.includes("high_fixed_cost_load")) {
      return getRandomFromMap(nextMoves, "high_fixed_cost_load", "Reduce structural monthly costs first.");
    }

    if (triggers.includes("high_debt_pressure")) {
      return getRandomFromMap(nextMoves, "high_debt_pressure", "Lower debt pressure before optimizing the rest.");
    }

    if (triggers.includes("low_buffer")) {
      return getRandomFromMap(nextMoves, "low_buffer", "Strengthen your cash buffer first.");
    }

    if (triggers.includes("sleeping_capital")) {
      return getRandomFromMap(nextMoves, "sleeping_capital", "Put part of your idle capital to work.");
    }

    if (triggers.includes("no_investing")) {
      return getRandomFromMap(nextMoves, "no_investing", "Start putting part of your money to work.");
    }

    return getRandomFromMap(nextMoves, "balanced", "Keep strengthening allocation discipline.");
  }

  function calculateRoast(input) {
    var monthlyNetIncome = toNumber(input.monthlyNetIncome);
    var savings = toNumber(input.savings);
    var investments = toNumber(input.investments);
    var debt = toNumber(input.debt);
    var fixedExpenses = toNumber(input.fixedExpenses);
    var monthlyWealthBuilding = toNumber(input.monthlyWealthBuilding);

    var wealthAllocationPct = monthlyNetIncome > 0 ? (monthlyWealthBuilding / monthlyNetIncome) * 100 : 0;
    var fixedCostPct = monthlyNetIncome > 0 ? (fixedExpenses / monthlyNetIncome) * 100 : 100;
    var bufferMonths = fixedExpenses > 0 ? savings / fixedExpenses : 0;
    var investableCapital = savings + investments;

    var score = 50;
    var triggers = [];
    var insights = [];

    if (wealthAllocationPct < 5) {
      score -= 25;
      triggers.push("low_wealth_allocation");
      insights.push("Only " + wealthAllocationPct.toFixed(1) + "% of your income goes to wealth building.");
    } else if (wealthAllocationPct < 10) {
      score -= 15;
      triggers.push("low_wealth_allocation");
      insights.push("Your wealth allocation is only " + wealthAllocationPct.toFixed(1) + "% of monthly income.");
    } else if (wealthAllocationPct >= 20) {
      score += 15;
      insights.push("A strong " + wealthAllocationPct.toFixed(1) + "% of your income goes toward building wealth.");
    } else if (wealthAllocationPct >= 15) {
      score += 10;
      insights.push("Your wealth allocation is solid at " + wealthAllocationPct.toFixed(1) + "%.");
    } else {
      insights.push("You are directing " + wealthAllocationPct.toFixed(1) + "% of income toward wealth building.");
    }

    if (fixedCostPct > 80) {
      score -= 20;
      triggers.push("high_fixed_cost_load");
      insights.push(fixedCostPct.toFixed(1) + "% of your income disappears into fixed costs.");
    } else if (fixedCostPct > 65) {
      score -= 10;
      triggers.push("high_fixed_cost_load");
      insights.push("Your fixed cost load is heavy at " + fixedCostPct.toFixed(1) + "% of income.");
    } else if (fixedCostPct < 50) {
      score += 10;
      insights.push("Your fixed cost structure leaves more room than most at " + fixedCostPct.toFixed(1) + "% of income.");
    } else {
      insights.push("Your fixed costs absorb " + fixedCostPct.toFixed(1) + "% of your income each month.");
    }

    if (investments <= 0) {
      score -= 12;
      triggers.push("no_investing");
      insights.push("You currently have no invested capital working for your future.");
    } else if (investments >= savings) {
      score += 10;
      insights.push("You already have capital working instead of leaving everything idle.");
    } else {
      insights.push("You have at least started putting capital to work.");
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
      insights.push("Your cash buffer covers only about " + bufferMonths.toFixed(1) + " months of fixed costs.");
    } else if (bufferMonths < 4) {
      score -= 5;
      triggers.push("low_buffer");
      insights.push("Your financial buffer is still modest at roughly " + bufferMonths.toFixed(1) + " months.");
    } else if (bufferMonths >= 6) {
      score += 10;
      insights.push("Your savings cover roughly " + bufferMonths.toFixed(1) + " months of fixed costs.");
    } else {
      insights.push("Your buffer covers around " + bufferMonths.toFixed(1) + " months of fixed costs.");
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

    var categoryKey = "structural_leakage";

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

    var headlines = (window.ROAST_DATA && window.ROAST_DATA.headlines) || {};
    var shareLines = (window.ROAST_DATA && window.ROAST_DATA.shareLines) || {};

    var headline = getRandomFromMap(headlines, categoryKey, "Your money structure needs more intention.");
    var shareLine = getRandomFromMap(shareLines, categoryKey, headline);

    return {
      score: score,
      category: getCategoryLabel(categoryKey),
      categoryKey: categoryKey,
      headline: headline,
      shareLine: shareLine,
      roastBullets: buildRoastBullets(triggers, score),
      insights: insights.slice(0, 3),
      nextMove: getNextMove(triggers),
      academyTags: getUniqueTags(triggers),
      triggers: triggers,
      metrics: {
        wealthAllocationPct: wealthAllocationPct,
        fixedCostPct: fixedCostPct,
        bufferMonths: bufferMonths,
        investableCapital: investableCapital
      }
    };
  }

  window.RoastEngine = {
    calculateRoast: calculateRoast
  };
})();
