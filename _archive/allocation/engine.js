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

  function formatPercent(value) {
    return `${Math.round(value)}%`;
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

  function calculateAllocationData() {
    const income = getNumber("income");
    const fixed = getNumber("fixed");
    const wealth = getNumber("wealth");

    const flex = Math.max(income - fixed - wealth, 0);

    const wealthPct = income > 0 ? (wealth / income) * 100 : 0;
    const fixedPct = income > 0 ? (fixed / income) * 100 : 0;
    const flexPct = income > 0 ? (flex / income) * 100 : 0;

    return {
      income,
      fixed,
      wealth,
      flex,
      wealthPct,
      fixedPct,
      flexPct
    };
  }

  function getAllocationInsight(data) {
    const { wealthPct, fixedPct } = data;

    if (wealthPct <= 5) {
      return "Very little of your monthly cashflow currently builds long-term capital.";
    }

    if (wealthPct <= 15) {
      return "Some capital building exists, but the structure still leans heavily toward present consumption.";
    }

    if (wealthPct <= 30) {
      return "A meaningful share of your monthly cashflow supports long-term wealth creation.";
    }

    if (fixedPct >= 60) {
      return "Your wealth-building effort is strong, but your structural cost load remains relatively heavy.";
    }

    return "Your monthly allocation structure strongly supports long-term capital formation.";
  }

  function prefillFromJourney() {
    const roastPayload = getRoastPayload();
    if (!roastPayload?.answers) return null;

    const { answers, result } = roastPayload;

    const incomeAmount = answers?.income?.amount || 0;
    const investAmount = answers?.invest?.amount || 0;

    const incomeEl = document.getElementById("income");
    const wealthEl = document.getElementById("wealth");
    const fixedEl = document.getElementById("fixed");

    if (incomeEl && Number(incomeEl.value) === 0) {
      incomeEl.value = incomeAmount;
    }

    if (wealthEl && Number(wealthEl.value) === 0) {
      wealthEl.value = investAmount;
    }

    if (fixedEl && Number(fixedEl.value) === 0 && incomeAmount > 0) {
      const estimatedFixed = Math.round(incomeAmount * 0.5);
      fixedEl.value = estimatedFixed;
    }

    return {
      incomeAmount,
      investAmount,
      profileName: result?.profile?.name || "",
      profileDescription: result?.profile?.description || ""
    };
  }

  window.AllocationEngine = {
    formatCurrency,
    formatPercent,
    calculateAllocationData,
    getAllocationInsight,
    prefillFromJourney
  };
})();
