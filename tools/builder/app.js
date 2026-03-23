(function () {

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
    }).format(value || 0);
  }

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem("mm_profile") || "{}");
    } catch (err) {
      console.warn("Could not read mm_profile.", err);
      return {};
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
    const profile = getProfile();

    const profileName = profile.profileName || "";
    const profileDescription = profile.profileDescription || "";

    const yearsTo60 = profile.yearsTo60 || 25;

    const currentCapital =
      profile.capitalMap?.directCapital ||
      0;

    const monthlyInvesting =
      profile.monthlyInvesting ||
      profile.allocation?.building ||
      0;

    const currentCapitalInput = document.getElementById("currentCapital");
    const monthlyInvestingInput = document.getElementById("monthlyInvesting");
    const yearsToGoalInput = document.getElementById("yearsToGoal");

    if (currentCapitalInput && Number(currentCapitalInput.value) === 0 && currentCapital > 0) {
      currentCapitalInput.value = Math.round(currentCapital);
    }

    if (monthlyInvestingInput && Number(monthlyInvestingInput.value) === 0 && monthlyInvesting > 0) {
      monthlyInvestingInput.value = Math.round(monthlyInvesting);
    }

    if (yearsToGoalInput && Number(yearsToGoalInput.value) === 25 && yearsTo60 > 0) {
      yearsToGoalInput.value = yearsTo60;
    }

    return {
      profileName,
      profileDescription,
      currentCapital,
      monthlyInvesting,
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

    if (card) {
      card.style.display = "block";
    }
  }

  function calculateBuilderData() {
    const currentCapital = getNumber("currentCapital");
    const monthlyInvesting = getNumber("monthlyInvesting");
    const yearsToGoal = getNumber("yearsToGoal");

    const annualReturn = 7;
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
      return "Right now, your future wealth depends almost entirely on what you already have, not on what you are consistently building.";
    }

    if (difference < 50000) {
      return "Your current path builds something real, but the upside from stronger monthly building is still relatively modest.";
    }

    if (delayCost > difference) {
      return "Time is hurting you more than most people realise. Delay is currently more expensive than suboptimal structure.";
    }

    return "Your current structure can build wealth, but stronger monthly building changes the outcome far more than it feels like in the present.";
  }

  function getFutureShockText(data) {
    const { difference, delayCost, yearsToGoal } = data;

    return `Over the next ${yearsToGoal} years, stronger monthly building could change your future wealth by ${formatCurrency(difference)}. Waiting five years could cost roughly ${formatCurrency(delayCost)} in lost compounding power.`;
  }

  function persistBuilderData(data) {
    try {
      const profile = getProfile();

      localStorage.setItem("mm_profile", JSON.stringify({
        ...profile,
        builder: {
          updatedAt: new Date().toISOString(),
          data
        }
      }));
    } catch (err) {
      console.warn("Could not save builder data.", err);
    }
  }

  function renderBuilder() {
    const data = calculateBuilderData();

    const currentPathValue = document.getElementById("currentPathValue");
    const optimizedPathValue = document.getElementById("optimizedPathValue");
    const differenceValue = document.getElementById("differenceValue");
    const delayCostValue = document.getElementById("delayCostValue");
    const builderInsight = document.getElementById("builderInsight");
    const futureShockText = document.getElementById("futureShockText");
    const resultBlock = document.getElementById("resultBlock");

    if (currentPathValue) {
      currentPathValue.textContent = formatCurrency(Math.round(data.currentPath));
    }

    if (optimizedPathValue) {
      optimizedPathValue.textContent = formatCurrency(Math.round(data.optimizedPath));
    }

    if (differenceValue) {
      differenceValue.textContent = formatCurrency(Math.round(data.difference));
    }

    if (delayCostValue) {
      delayCostValue.textContent = formatCurrency(Math.round(data.delayCost));
    }

    if (builderInsight) {
      builderInsight.textContent = getBuilderInsight(data);
    }

    if (futureShockText) {
      futureShockText.textContent = getFutureShockText(data);
    }

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
