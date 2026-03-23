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

  function getRoastPayload() {
    try {
      const raw = localStorage.getItem("moneymind_roast_result");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Could not read roast payload.", err);
      return null;
    }
  }

  function calculateCapitalMapData() {
    const cash = getNumber("cash");
    const investments = getNumber("investments");
    const lockedCapital = getNumber("lockedCapital");
    const debt = getNumber("debt");

    const directCapital = cash + investments;
    const totalAssets = directCapital + lockedCapital;
    const netWorth = totalAssets - debt;
    const deployableCapital = Math.max(0, directCapital - debt);

    return {
      cash,
      investments,
      lockedCapital,
      debt,
      directCapital,
      totalAssets,
      netWorth,
      deployableCapital
    };
  }

  function getCapitalInsight(data) {
    const { netWorth, deployableCapital, directCapital, lockedCapital, debt } = data;

    if (netWorth <= 0) {
      return "Your structure is under pressure. Before optimization comes stability.";
    }

    if (directCapital <= 0) {
      return "You may own value on paper, but very little of it is directly usable right now.";
    }

    if (debt > directCapital) {
      return "Debt is putting pressure on flexibility. Your capital exists, but too little of it is ready to move.";
    }

    if (lockedCapital > directCapital * 2) {
      return "A large part of your capital is locked. Long-term value may be building, but flexibility is limited.";
    }

    if (deployableCapital < 5000) {
      return "You have some capital, but not much of it is truly deployable yet. That limits speed and optionality.";
    }

    if (deployableCapital < 25000) {
      return "You have usable capital, but not a huge margin for strategic moves. Structure matters from here.";
    }

    return "You have meaningful deployable capital. That gives you room to act with intent instead of reacting late.";
  }

function getNextStep(data) {
  const { deployableCapital, directCapital, debt } = data;

  if (directCapital <= 0 || deployableCapital <= 0) {
    return {
      text: "Before optimizing anything, first understand how much of your capital is actually usable.",
      label: "Open Spending vs Building",
      href: "../spending-vs-building/"
    };
  }

  if (debt > 0 && debt >= directCapital * 0.5) {
    return {
      text: "Your next step is not complexity. It is understanding what your monthly income actually does.",
      label: "Open Spending vs Building",
      href: "../spending-vs-building/"
    };
  }

  return {
    text: "You have deployable capital. Now the question becomes whether your income is building more capital or just funding lifestyle.",
    label: "Open Spending vs Building",
    href: "../spending-vs-building/"
  };
}
  function prefillFromRoast() {
    const roastPayload = getRoastPayload();
    if (!roastPayload?.answers) return null;

    const { answers, result } = roastPayload;

    const incomeAmount = Number(answers?.income?.amount || 0);
    const investAmount = Number(answers?.invest?.amount || 0);

    let savingsAmount = Number(answers?.savings?.amount || 0);

    if (savingsAmount > 0 && savingsAmount < 1000) {
      savingsAmount = savingsAmount * 1000;
    }

    const cashEl = document.getElementById("cash");
    const investmentsEl = document.getElementById("investments");

    if (cashEl && Number(cashEl.value) === 0) {
      cashEl.value = Math.round(savingsAmount * 0.5);
    }

    if (investmentsEl && Number(investmentsEl.value) === 0) {
      investmentsEl.value = Math.round(savingsAmount * 0.5);
    }

    return {
      incomeAmount,
      investAmount,
      profileName: result?.profile?.name || "",
      profileDescription: result?.profile?.description || ""
    };
  }

  window.CapitalMapEngine = {
    getNumber,
    formatCurrency,
    getRoastPayload,
    calculateCapitalMapData,
    getCapitalInsight,
    getNextStep,
    prefillFromRoast
  };
})();
