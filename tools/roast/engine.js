(function () {

  // ─── Utilities ───────────────────────────────────────────────────────────────

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

  // ─── Data helpers (single source of truth: data.js) ─────────────────────────

  function getProfiles() {
    return window.ROAST_DATA?.profiles || {};
  }

  function getBehaviorConcepts() {
    return window.ROAST_DATA?.behaviorConcepts || {};
  }

  function getGoalContext(goalValue) {
    const map = window.ROAST_DATA?.goalContext || {};
    return map[goalValue] || map["unsure"];
  }

  // ─── Calculations ─────────────────────────────────────────────────────────────

  function getAnnualReturn(investRate) {
    if (investRate >= 0.2) return 0.07;
    if (investRate >= 0.1) return 0.065;
    return 0.06;
  }

  function futureValue(monthlyContribution, years, annualReturn, startingCapital) {
    const months = safe(years) * 12;
    const r = annualReturn / 12;

    if (months <= 0) return safe(startingCapital);

    const fvStart  = startingCapital * Math.pow(1 + r, months);
    const fvContrib = monthlyContribution * ((Math.pow(1 + r, months) - 1) / r);

    return fvStart + fvContrib;
  }

  // ─── Profile & behavior logic ────────────────────────────────────────────────

  function determineProfileKey(answerData) {
    const income  = safe(answerData?.income?.amount);
    const invest  = safe(answerData?.invest?.amount);
    const savings = safe(answerData?.savings?.amount);

    const investRate  = income > 0 ? invest / income : 0;
    const wealthRatio = income > 0 ? savings / (income * 12) : 0;

    if (investRate >= 0.2 && wealthRatio >= 1) return "future_architect";
    if (investRate >= 0.15)                    return "disciplined_investor";
    if (investRate < 0.05 && wealthRatio >= 1.5) return "security_seeker";
    if (income >= 4000 && investRate < 0.12)   return "potential_builder";

    return "lifestyle_optimizer";
  }

  function determineBehaviorKey(answerData, profileKey) {
    const income     = safe(answerData?.income?.amount);
    const invest     = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (profileKey === "future_architect" || profileKey === "disciplined_investor") {
      return "compounding_patience";
    }
    if (profileKey === "security_seeker") return "risk_illusion";
    if (investRate <= 0.05)               return "discipline_gap";

    return "lifestyle_inflation";
  }

  // ─── Trajectory ──────────────────────────────────────────────────────────────

  function buildTrajectory(answerData) {
    const years          = safe(answerData?.age?.yearsTo60, 20);
    const income         = safe(answerData?.income?.amount);
    const currentMonthly = safe(answerData?.invest?.amount);
    const currentCapital = safe(answerData?.savings?.amount);

    const investRate   = income > 0 ? currentMonthly / income : 0;
    const annualReturn = getAnnualReturn(investRate);

    const currentWealth = futureValue(currentMonthly, years, annualReturn, currentCapital);

    const optimizedMonthly = Math.max(currentMonthly, income * 0.2);
    const optimizedWealth  = futureValue(optimizedMonthly, years, annualReturn, currentCapital);

    return {
      years,
      currentWealth:   Math.round(currentWealth),
      optimizedWealth: Math.round(optimizedWealth),
      wealthDifference: Math.max(0, Math.round(optimizedWealth - currentWealth))
    };
  }

  // ─── Share text ───────────────────────────────────────────────────────────────

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

  // ─── Main analysis ────────────────────────────────────────────────────────────

  function analyzeRoast(answerData) {
    if (!answerData) {
      return buildEmptyResult();
    }

    const incomeAmount = safe(answerData?.income?.amount);
    const investAmount = safe(answerData?.invest?.amount);
    const investRate   = incomeAmount > 0 ? investAmount / incomeAmount : 0;

    const profileKey  = determineProfileKey(answerData);
    const behaviorKey = determineBehaviorKey(answerData, profileKey);
    const goalValue   = answerData?.goal?.value || "unsure";

    // Read from data.js — single source of truth
    const profiles         = getProfiles();
    const behaviorConcepts = getBehaviorConcepts();
    const goalContext      = getGoalContext(goalValue);

    const profile  = profiles[profileKey]         || profiles["lifestyle_optimizer"];
    const behavior = behaviorConcepts[behaviorKey] || behaviorConcepts["lifestyle_inflation"];
    const trajectory = buildTrajectory(answerData);

    const result = {
      headline:      profile.headline,
      observation:   profile.observation,

      incomeText:    formatEuro(incomeAmount),
      investText:    formatEuro(investAmount),
      investRateText: formatPercent(investRate),

      profileKey,
      profile: {
        name:        profile.name,
        description: profile.description,
        opportunity: profile.opportunity
      },

      behaviorKey,
      behavior: {
        title:       behavior.title,
        text:        behavior.text,
        lessonLabel: behavior.lessonLabel
      },

      trajectory,

      goalValue,
      goalContext,

      currentAgeText:   "Estimated wealth by age 60",
      optimizedAgeText: "If you raise investing toward 20%",

      shareText: ""
    };

    result.shareText = buildShareText(result);

    return result;
  }

  function buildEmptyResult() {
    return {
      headline:      "No data available",
      observation:   "We could not analyze your structure.",
      incomeText:    formatEuro(0),
      investText:    formatEuro(0),
      investRateText: "0%",
      profile:       { name: "Unknown", description: "", opportunity: "" },
      behavior:      { title: "—", text: "", lessonLabel: "Learn this concept" },
      trajectory:    { currentWealth: 0, optimizedWealth: 0, wealthDifference: 0 },
      goalValue:     "unsure",
      goalContext:   { dashboardFocus: "clarity", tone: "" },
      currentAgeText:   "Estimated wealth by age 60",
      optimizedAgeText: "If you raise investing toward 20%",
      shareText: ""
    };
  }

  // ─── Exports ──────────────────────────────────────────────────────────────────

  window.RoastEngine = {
    analyzeRoast,
    formatEuro
  };

})();
