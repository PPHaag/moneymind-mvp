(function () {
  function renderRoastImport(prefill) {
    const roastProfileCard = document.getElementById("roastProfileCard");
    const profileName = document.getElementById("profileName");
    const profileText = document.getElementById("profileText");
    const profileBadge = document.getElementById("profileBadge");

    const roastIncomeValue = document.getElementById("roastIncomeValue");
    const roastInvestValue = document.getElementById("roastInvestValue");
    const roastProfileValue = document.getElementById("roastProfileValue");

    if (!prefill || !prefill.profileName) return;

    if (profileName) profileName.textContent = prefill.profileName;
    if (profileText) profileText.textContent = prefill.profileDescription || "";
    if (profileBadge) profileBadge.textContent = prefill.profileName;

    if (roastIncomeValue) {
      roastIncomeValue.textContent =
        window.CapitalMapEngine.formatCurrency(prefill.incomeAmount || 0);
    }

    if (roastInvestValue) {
      roastInvestValue.textContent =
        window.CapitalMapEngine.formatCurrency(prefill.investAmount || 0);
    }

    if (roastProfileValue) {
      roastProfileValue.textContent = prefill.profileName;
    }

    if (roastProfileCard) {
      roastProfileCard.style.display = "block";
    }
  }

  function renderCapitalMap() {
    const data = window.CapitalMapEngine.calculateCapitalMapData();

    try {
      const profile = JSON.parse(localStorage.getItem("mm_profile") || "{}");

      localStorage.setItem("mm_profile", JSON.stringify({
        ...profile,
        capitalMap: data,
        capitalMapUpdatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.warn("Could not save capital map", err);
    }

    const directCapitalValue = document.getElementById("directCapitalValue");
    const lockedCapitalValue = document.getElementById("lockedCapitalValue");
    const deployableCapitalValue = document.getElementById("deployableCapitalValue");
    const netWorthValue = document.getElementById("netWorthValue");
    const capitalInsight = document.getElementById("capitalInsight");
    const resultBlock = document.getElementById("resultBlock");

    const nextStepText = document.getElementById("nextStepText");
    const nextStepLink = document.getElementById("nextStepLink");

    if (directCapitalValue) {
      directCapitalValue.textContent =
        window.CapitalMapEngine.formatCurrency(data.directCapital);
    }

    if (lockedCapitalValue) {
      lockedCapitalValue.textContent =
        window.CapitalMapEngine.formatCurrency(data.lockedCapital);
    }

    if (deployableCapitalValue) {
      deployableCapitalValue.textContent =
        window.CapitalMapEngine.formatCurrency(data.deployableCapital);
    }

    if (netWorthValue) {
      netWorthValue.textContent =
        window.CapitalMapEngine.formatCurrency(data.netWorth);
    }

    if (capitalInsight) {
      capitalInsight.textContent =
        window.CapitalMapEngine.getCapitalInsight(data);
    }

    const nextStep = window.CapitalMapEngine.getNextStep(data);

    if (nextStepText) {
      nextStepText.textContent = nextStep.text;
    }

    if (nextStepLink) {
      nextStepLink.textContent = nextStep.label;
      nextStepLink.setAttribute("href", nextStep.href);
    }

    if (resultBlock) {
      resultBlock.style.display = "grid";
      resultBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function init() {
    const calculateBtn = document.getElementById("calculateBtn");
    const prefill = window.CapitalMapEngine.prefillFromRoast();

    renderRoastImport(prefill);

    if (calculateBtn) {
      calculateBtn.addEventListener("click", renderCapitalMap);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
