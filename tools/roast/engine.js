(function(){

  function safe(val, fallback = 0){
    return typeof val === "number" && !isNaN(val) ? val : fallback;
  }

  function clamp(num, min, max){
    return Math.min(Math.max(num, min), max);
  }

  function formatEuro(value){
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  function formatPercent(value){
    return `${Math.round((value || 0) * 100)}%`;
  }

  function getAnnualReturnByProfile(answerData){
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (investRate >= 0.2) return 0.07;
    if (investRate >= 0.1) return 0.065;
    return 0.06;
  }

  function futureValue(monthlyContribution, years, annualReturn, startingCapital){
    const months = safe(years) * 12;
    const monthlyRate = annualReturn / 12;

    if (months <= 0) return safe(startingCapital);

    const fvStart = startingCapital * Math.pow(1 + monthlyRate, months);
    const fvContrib = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return fvStart + fvContrib;
  }

  function determineProfile(answerData){
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

  function determineBehaviorConcept(answerData, profileKey){
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (profileKey === "disciplined_investor" || profileKey === "future_architect"){
      return "compounding_patience";
    }

    if (profileKey === "security_seeker"){
      return "risk_illusion";
    }

    if (investRate <= 0.05){
      return "discipline_gap";
    }

    return "lifestyle_inflation";
  }

  function buildHeadline(answerData, profileKey){
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (profileKey === "future_architect"){
      return "Your financial structure reflects serious long-term wealth intent.";
    }

    if (profileKey === "disciplined_investor"){
      return "You are ahead of most people — because your structure actually supports wealth building.";
    }

    if (investRate < 0.08){
      return "Your income suggests strong wealth potential — but your capital formation may be slower than expected.";
    }

    return "You are building something real — but there is still more upside in your financial structure.";
  }

  function buildObservation(answerData){
    const income = safe(answerData?.income?.amount);
    const invest = safe(answerData?.invest?.amount);
    const investRate = income > 0 ? invest / income : 0;

    if (investRate < 0.05){
      return "Right now, only a small part of your monthly cashflow appears to be going toward long-term wealth building.";
    }

    if (investRate < 0.15){
      return "Your structure shows some investment discipline, but not yet the level that typically drives serious wealth.";
    }

    return "Your current structure shows above-average investing discipline. That gives you a real compounding advantage.";
  }

  function buildTrajectory(answerData){
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

  function buildShareText(result){
    return [
      "My MoneyMind Roast",
      "",
      `Profile: ${result.profile?.name || "Unknown"}`,
      `Investment rate: ${result.investRateText}`,
      `Potential wealth gap: ${formatEuro(result.trajectory.wealthDifference)}`,
      `Behavior insight: ${result.behavior?.title || "—"}`
    ].join("\n");
  }

  function analyzeRoast(answerData){

    if (!answerData){
      return {
        headline: "No data available",
        observation: "We could not analyze your structure.",
        investRateText: "0%",
        trajectory: { wealthDifference: 0 }
      };
    }

    const incomeAmount = safe(answerData?.income?.amount);
    const investAmount = safe(answerData?.invest?.amount);
    const investRate = incomeAmount > 0 ? investAmount / incomeAmount : 0;

    const profileKey = determineProfile(answerData);
    const profile = window.ROAST_DATA?.profiles?.[profileKey] || { name: "Unknown" };

    const behaviorKey = determineBehaviorConcept(answerData, profileKey);
    const behavior = window.ROAST_DATA?.behaviorConcepts?.[behaviorKey] || { title: "—" };

    const trajectory = buildTrajectory(answerData);

    const result = {
      headline: buildHeadline(answerData, profileKey),
      observation: buildObservation(answerData),

      incomeText: formatEuro(incomeAmount),
      investText: formatEuro(investAmount),
      investRateText: formatPercent(investRate),

      profileKey,
      profile,

      behaviorKey,
      behavior,

      trajectory,

      currentAgeText: `Estimated wealth by age 60`,
      optimizedAgeText: `If you raise investing toward 20%`,

      shareText: ""
    };

    result.shareText = buildShareText(result);

    // 🔥 CRUCIAL: SAVE PROFILE FOR NEXT TOOLS
    localStorage.setItem("moneymindProfile", JSON.stringify({
      income: incomeAmount,
      invest: investAmount,
      savings: safe(answerData?.savings?.amount),
      investRate,
      trajectory,
      profileKey,
      behaviorKey,
      createdAt: new Date().toISOString()
    }));

    return result;
  }

  window.RoastEngine = {
    analyzeRoast,
    formatEuro
  };

})();
