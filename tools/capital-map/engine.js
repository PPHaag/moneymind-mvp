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

  function calculateCapitalMapData() {
    const cash = getNumber("cash");
    const investments = getNumber("investments");
    const crypto = getNumber("crypto");
    const metals = getNumber("metals");
    const homeEquity = getNumber("homeEquity");
    const equity = getNumber("equity");
    const pension = getNumber("pension");
    const otherAssets = getNumber("otherAssets");
    const debt = getNumber("debt");

    const directCapital = cash + investments + crypto;
    const accessibleCapital = metals + homeEquity + equity + otherAssets;
    const lockedCapital = pension;
    const totalAssets = directCapital + accessibleCapital + lockedCapital;
    const netWorth = totalAssets - debt;
    const deployableCapital = directCapital - debt;

    return {
      cash,
      investments,
      crypto,
      metals,
      homeEquity,
      equity,
      pension,
      otherAssets,
      debt,
      directCapital,
      accessibleCapital,
      lockedCapital,
      totalAssets,
      netWorth,
      deployableCapital
    };
  }

  function getCapitalInsight(data) {
    const {
      netWorth,
      deployableCapital,
      directCapital,
      accessibleCapital,
      lockedCapital
    } = data;

    if (netWorth <= 0) {
      return "Your capital structure is still under pressure. Before optimization comes stability.";
    }

    if (deployableCapital <= 0) {
      return "Debt is currently eating your flexibility. Net worth may exist on paper, but usable capital is under pressure.";
    }

    if (lockedCapital > directCapital + accessibleCapital) {
      return "A large share of your wealth is locked. Long-term strength is building, but flexibility is limited.";
    }

    if (accessibleCapital > directCapital && accessibleCapital > lockedCapital) {
      return "Your structure leans toward accessible wealth, but not all of it is instantly deployable.";
    }

    if (deployableCapital < 5000) {
      return "You own value, but not much of it is ready to move. That limits speed when opportunity appears.";
    }

    if (deployableCapital < 25000) {
      return "You have some deployable capital, but much of your wealth still sits outside direct reach.";
    }

    return "You have meaningful deployable capital. That gives you room to act with intent instead of reacting late.";
  }

  function prefillFromRoast() {
    const roastPayload = getRoastPayload();
    if (!roastPayload?.answers) return null;

    const { answers, result } = roastPayload;

    const incomeAmount = answers?.income?.amount || 0;
    const savingsAmount = answers?.savings?.amount || 0;
    const investAmount = answers?.invest?.amount || 0;

    const cashEl = document.getElementById("cash");
    const investmentsEl = document.getElementById("investments");
    const cryptoEl = document.getElementById("crypto");

    if (cashEl && Number(cashEl.value) === 0) {
      cashEl.value = Math.round(savingsAmount * 0.35);
    }

    if (investmentsEl && Number(investmentsEl.value) === 0) {
      investmentsEl.value = Math.round(savingsAmount * 0.55);
    }

    if (cryptoEl && Number(cryptoEl.value) === 0) {
      cryptoEl.value = Math.round(savingsAmount * 0.10);
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
    prefillFromRoast
  };
})();
