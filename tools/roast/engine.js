(function(){
  function clamp(num, min, max){
    return Math.min(Math.max(num, min), max);
  }

  function formatEuro(value){
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatPercent(value){
    return `${Math.round(value * 100)}%`;
  }

  function getAnnualReturnByProfile(answerData){
    const income = answerData.income.amount;
    const invest = answerData.invest.amount;
    const investRate = income > 0 ? invest / income : 0;

    if (investRate >= 0.2) return 0.07;
    if (investRate >= 0.1) return 0.065;
    return 0.06;
  }

  function futureValue(monthlyContribution, years, annualReturn, startingCapital){
    const months = years * 12;
    const monthlyRate = annualReturn / 12;

    if (months <= 0) {
      return startingCapital;
    }

    const fvStart = startingCapital * Math.pow(1 + monthlyRate, months);
    const fvContrib = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return fvStart + fvContrib;
  }

  function determineProfile(answerData){
    const income = answerData.income.amount;
    const invest = answerData.invest.amount;
    const savings = answerData.savings.amount;
    const investRate = income > 0 ? invest / income : 0;
    const wealthRatio = income > 0 ? savings / (income * 12) : 0;

    if (investRate >= 0.2 && wealthRatio >= 1) {
      return "future_architect";
    }

    if (investRate >= 0.15) {
      return "disciplined_investor";
    }

    if (investRate < 0.05 && wealthRatio >= 1.5) {
      return "security_seeker";
    }

    if (income >= 4000 && investRate < 0.12) {
      return "potential_builder";
    }

    return "lifestyle_optimizer";
  }

  function determineBehaviorConcept(answerData, profileKey){
    const income = answerData.income.amount;
    const invest = answerData.invest.amount;
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

  function buildHeadline(answerData, profileKey){
    const income = answerData.income.amount;
    const invest = answerData.invest.amount;
    const investRate = income > 0 ? invest / income : 0;

    if (profileKey === "future_architect") {
      return "Your financial structure reflects serious long-term wealth intent.";
    }

    if (profileKey === "disciplined_investor") {
      return "You are ahead of most people — because your structure actually supports wealth building.";
    }

    if (investRate < 0.08) {
      return "Your income suggests strong wealth potential — but your capital formation may be slower than expected.";
    }

    return "You are building something real — but there is still more upside in your financial structure.";
  }

  function buildObservation(answerData){
    const income = answerData.income.amount;
    const invest = answerData.invest.amount;
    const investRate = income > 0 ? invest / income : 0;

    if (investRate < 0.05) {
      return "Right now, only a small part of your monthly cashflow appears to be going toward long-term wealth building. That usually feels harmless in the present and expensive in the future.";
    }

    if (investRate < 0.15) {
      return "Your structure shows some investment discipline, but not yet the kind of capital allocation that tends to create serious long-term wealth.";
    }

    return "Your current structure shows above-average investing discipline. That gives you a real compounding advantage over time.";
  }

  function buildTrajectory(answerData){
    const years = answerData.age.yearsTo60;
    const currentMonthly = answerData.invest.amount;
    const currentCapital = answerData.savings.amount;
    const annualReturn = getAnnualReturnByProfile(answerData);
    const currentWealth = futureValue(currentMonthly, years, annualReturn, currentCapital);

    const optimizedRate = 0.2;
    const optimizedMonthly = Math.max(currentMonthly, answerData.income.amount * optimizedRate);
    const optimizedWealth = futureValue(optimizedMonthly, years, annualReturn, currentCapital);

    return {
      years,
      currentWealth: Math.round(currentWealth),
      optimizedWealth: Math.round(optimizedWealth),
      wealthDifference: Math.round(optimizedWealth - currentWealth)
    };
  }

  function buildShareText(result){
    return [
      "My MoneyMind Roast",
      "",
      `Profile: ${result.profile.name}`,
      `Investment rate: ${result.investRateText}`,
      `Potential wealth gap: ${formatEuro(result.trajectory.wealthDifference)}`,
      `Behavior insight: ${result.behavior.title}`
    ].join("\n");
  }

  function analyzeRoast(answerData){
    const incomeAmount = answerData.income.amount;
    const investAmount = answerData.invest.amount;
    const investRate = incomeAmount > 0 ? investAmount / incomeAmount : 0;

    const profileKey = determineProfile(answerData);
    const profile = window.ROAST_DATA.profiles[profileKey];

    const behaviorKey = determineBehaviorConcept(answerData, profileKey);
    const behavior = window.ROAST_DATA.behaviorConcepts[behaviorKey];

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
    return result;
  }

  window.RoastEngine = {
    analyzeRoast,
    formatEuro
  };
})();
