(function(){
  function getNumber(id) {
    const el = document.getElementById(id);
    const value = Number(el?.value || 0);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value);
  }

  function getRoastPayload() {
    try {
      const raw = localStorage.getItem("moneymind_roast_result");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Could not read roast payload.", err);
      return null;
    }
  }

  function getCapitalMapPayload() {
    try {
      const raw = localStorage.getItem("moneymind_capital_map");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Could not read capital map payload.", err);
      return null;
    }
  }

  function getAllocationPayload() {
    try {
      const raw = localStorage.getItem("moneymind_allocation");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Could not read allocation payload.", err);
      return null;
    }
  }

  function futureValue(startCapital, monthlyContribution, annualReturnPct, years) {
    const annualReturn = annualReturnPct / 100;
    const monthlyRate = annualReturn / 12;
    const months = years * 12;

    if (months <= 0) return startCapital;

    const futureStart = startCapital * Math.pow(1 + monthlyRate, months);
    const futureContributions =
      monthlyRate === 0
        ? monthlyContribution * months
        : monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return futureStart + futureContributions;
  }

  function prefillFromJourney() {
    const roastPayload = getRoastPayload();
    const capitalPayload = getCapitalMapPayload();
    const allocationPayload = getAllocationPayload();

    const profileName = roastPayload?.result?.profile?.name || "";
    const profileDescription = roastPayload?.result?.profile?.description || "";

    const yearsTo60 = roastPayload?.answers?.age?.yearsTo60 || 25;

    const capitalFromMap =
      capitalPayload?.data?.netWorth ??
      capitalPayload?.result?.netWorth ??
      0;

    const directCapitalFallback =
      capitalPayload?.data?.directCapital ??
      0;

    const currentCapital = capitalFromMap > 0 ? capitalFromMap : directCapitalFallback;

    const allocationWealth =
      allocationPayload?.data?.wealth ??
      roastPayload?.answers?.invest?.amount ??
      0;

    const currentCapitalInput = document.getElementById("currentCapital");
    const monthlyInvestingInput = document.getElementById("monthlyInvesting");
    const yearsToGoalInput = document.getElementById("yearsToGoal");

    if (currentCapitalInput && Number(currentCapitalInput.value) === 0 && currentCapital > 0) {
      currentCapitalInput.value = Math.round(currentCapital);
    }

    if (monthlyInvestingInput && Number(monthlyInvestingInput.value) === 0 && allocationWealth > 0) {
      monthlyInvestingInput.value = Math.round(allocationWealth);
    }

    if (yearsToGoalInput && Number(yearsToGoalInput.value) === 25 && yearsTo60 > 0) {
      yearsToGoalInput.value = yearsTo60;
    }

    return {
      profileName,
      profileDescription,
      currentCapital,
      monthlyInvesting: allocationWealth,
      yearsTo60
    };
  }

  function renderJourneyImport(prefill) {
    const card = document.getElementById("journeyProfileCard");
    const profileName = document.getElementById("profileName");
    const profileText = document.getElementById("profileText");
    const profileBadge = document.getElementById("profileBadge");
    const journeyCapitalValue = document.getElementById("journeyCapitalValue");
    const journeyInvestValue = document.getElementById("journeyInvestValue");
    const journeyYearsValue = document.getElementById("journeyYearsValue");

    if (!prefill || !prefill.profileName) return;

    if (profileName) profileName.textContent = prefill.profileName;
    if (profileText) profileText.textContent = prefill.profileDescription || "";
    if (profileBadge) profileBadge.textContent = prefill.profileName;
    if (journeyCapitalValue) journeyCapitalValue.textContent = formatCurrency(prefill.currentCapital || 0);
    if (journeyInvestValue) journeyInvestValue.textContent = formatCurrency(prefill.monthlyInvesting || 0);
    if (journeyYearsValue) journeyYearsValue.textContent = `${prefill.yearsTo60 || 0} years`;

    if (card) card.style.display = "block";
  }

  function calculateBuilderData() {
    const currentCapital = getNumber("currentCapital");
    const monthlyInvesting = getNumber("monthlyInvesting");
    const yearsToGoal = getNumber("yearsToGoal");
    const annualReturn = getNumber("annualReturn");

    const optimizedMonthlyInvesting = Math.max(
      monthlyInvesting,
      Math.round(monthlyInvesting * 1.5)
    );

    const currentPath = futureValue(
      currentCapital,
      monthlyInvesting,
      annualReturn,
      yearsToGoal
    );

    const optimizedPath = futureValue(
      currentCapital,
      optimizedMonthlyInvesting,
      annualReturn,
      yearsToGoal
    );

    const delayedYears = Math.max(yearsToGoal - 5, 1);

    const delayedPath = futureValue(
      currentCapital,
      optimizedMonthlyInvesting,
      annualReturn,
      delayedYears
    );

    const difference = optimizedPath - currentPath;
    const delayCost = optimizedPath - delayedPath;

    return {
      currentCapital,
      monthlyInvesting,
      optimizedMonthlyInvesting,
      yearsToGoal,
      annualReturn,
      currentPath,
      optimizedPath,
      delayedPath,
      difference,
      delayCost
    };
  }

  function getBuilderInsight(data) {
    const { monthlyInvesting, difference, delayCost } = data;

    if (monthlyInvesting <= 0) {
      return "Right now, your compounding engine is barely switched on. That keeps your future wealth heavily dependent on starting capital instead of consistent capital formation.";
    }

    if (difference < 50000) {
      return "Your current path already builds some future capital, but the upside from structural improvement remains relatively modest.";
    }

    if (delayCost > difference) {
      return "The time component is hitting harder than the allocation component. Delay is currently more expensive than most people intuitively think.";
    }

    return "Your structure already creates future wealth, but stronger monthly capital formation changes the outcome far more than it feels like in the present.";
  }

  function getFutureShockText(data) {
    const { difference, delayCost, yearsToGoal } = data;

    return `Over the next ${yearsToGoal} years, relatively small structural improvements could change your future wealth by ${formatCurrency(difference)}. Waiting five years could cost roughly ${formatCurrency(delayCost)} in missed compounding power.`;
  }

  function persistBuilderData(data) {
    try {
      localStorage.setItem("moneymind_builder", JSON.stringify({
        updatedAt: new Date().toISOString(),
        data
      }));
    } catch (err) {
      console.warn("Could not save builder data.", err);
    }
  }

  function renderBuilder() {
    const data = calculateBuilderData();

    document.getElementById("currentPathValue").textContent = formatCurrency(Math.round(data.currentPath));
    document.getElementById("optimizedPathValue").textContent = formatCurrency(Math.round(data.optimizedPath));
    document.getElementById("differenceValue").textContent = formatCurrency(Math.round(data.difference));
    document.getElementById("delayCostValue").textContent = formatCurrency(Math.round(data.delayCost));
    document.getElementById("builderInsight").textContent = getBuilderInsight(data);
    document.getElementById("futureShockText").textContent = getFutureShockText(data);

    const resultBlock = document.getElementById("resultBlock");
    if (resultBlock) {
      resultBlock.style.display = "grid";
      resultBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    persistBuilderData({
      currentCapital: data.currentCapital,
      monthlyInvesting: data.monthlyInvesting,
      yearsToGoal: data.yearsToGoal,
      annualReturn: data.annualReturn,
      currentPath: Math.round(data.currentPath),
      optimizedPath: Math.round(data.optimizedPath),
      difference: Math.round(data.difference),
      delayCost: Math.round(data.delayCost)
    });
  }

  function init() {
    const calculateBtn = document.getElementById("calculateBtn");
    const prefill = prefillFromJourney();
    renderJourneyImport(prefill);

    if (calculateBtn) {
      calculateBtn.addEventListener("click", renderBuilder);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
