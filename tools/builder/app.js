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
    const journeyCapitalValue = document.getElementById("journeyCapital
