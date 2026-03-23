(function () {

  function getNumber(id) {
    const el = document.getElementById(id);
    const value = Number(el?.value || 0);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function formatPercent(val) {
    return `${Math.round(val * 100)}%`;
  }

  function prefillFromProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem("mm_profile") || "{}");

      const incomeInput = document.getElementById("income");
      const buildingInput = document.getElementById("building");

      if (profile.income && incomeInput && Number(incomeInput.value) === 0) {
        incomeInput.value = profile.income;
      }

      if (profile.monthlyInvesting && buildingInput && Number(buildingInput.value) === 0) {
        buildingInput.value = profile.monthlyInvesting;
      }
    } catch (err) {
      console.warn("Prefill failed", err);
    }
  }

  function calculate() {
    const income = getNumber("income");
    const spending = getNumber("spending");
    const building = getNumber("building");

    if (income <= 0) return null;

    const spendingRatio = spending / income;
    const buildingRatio = building / income;

    return {
      income,
      spending,
      building,
      spendingRatio,
      buildingRatio
    };
  }

  function getHeadline(r) {
    if (r.buildingRatio >= 0.2) {
      return "You are building real financial momentum.";
    }

    if (r.buildingRatio >= 0.1) {
      return "You are building — but slower than you probably could.";
    }

    if (r.buildingRatio > 0) {
      return "You are earning, but barely converting it into wealth.";
    }

    return "Right now, your income is not building anything.";
  }

  function getInsight(r) {
    if (r.buildingRatio >= 0.2) {
      return "A meaningful part of your income is working for your future. That puts you ahead of most people.";
    }

    if (r.buildingRatio >= 0.1) {
      return "You have a base, but a large part of your income still disappears into spending.";
    }

    if (r.buildingRatio > 0) {
      return "Most of your income currently goes toward spending, not building long-term capital.";
    }

    return "Your entire income is currently consumed. Nothing is being converted into future wealth.";
  }

  function render() {
    const data = calculate();
    if (!data) return;

    const spendingPct = document.getElementById("spendingPct");
    const buildingPct = document.getElementById("buildingPct");
    const headlineText = document.getElementById("headlineText");
    const insightText = document.getElementById("insightText");
    const resultBlock = document.getElementById("resultBlock");

    if (spendingPct) {
      spendingPct.textContent = formatPercent(data.spendingRatio);
    }

    if (buildingPct) {
      buildingPct.textContent = formatPercent(data.buildingRatio);
    }

    if (headlineText) {
      headlineText.textContent = getHeadline(data);
    }

    if (insightText) {
      insightText.textContent = getInsight(data);
    }

    if (resultBlock) {
      resultBlock.style.display = "grid";
      resultBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    try {
      const profile = JSON.parse(localStorage.getItem("mm_profile") || "{}");

      localStorage.setItem("mm_profile", JSON.stringify({
        ...profile,
        allocation: data,
        allocationUpdatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.warn("Could not save allocation data", err);
    }
  }

  function init() {
    prefillFromProfile();

    const btn = document.getElementById("calculateBtn");
    if (btn) {
      btn.addEventListener("click", render);
    }
  }

  document.addEventListener("DOMContentLoaded", init);

})();
