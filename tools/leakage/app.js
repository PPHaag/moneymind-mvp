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

  function prefillFromJourney() {
    const roastPayload = getRoastPayload();
    if (!roastPayload?.answers) return null;

    const { answers, result } = roastPayload;

    const incomeAmount = answers?.income?.amount || 0;
    const investAmount = answers?.invest?.amount || 0;

    const incomeEl = document.getElementById("income");
    const wealthEl = document.getElementById("wealth");

    if (incomeEl && Number(incomeEl.value) === 0) {
      incomeEl.value = incomeAmount;
    }

    if (wealthEl && Number(wealthEl.value) === 0) {
      wealthEl.value = investAmount;
    }

    return {
      incomeAmount,
      investAmount,
      profileName: result?.profile?.name || "",
      profileDescription: result?.profile?.description || ""
    };
  }

  function renderJourneyImport(prefill) {
    const journeyProfileCard = document.getElementById("journeyProfileCard");
    const profileName = document.getElementById("profileName");
    const profileText = document.getElementById("profileText");
    const profileBadge = document.getElementById("profileBadge");
    const journeyIncomeValue = document.getElementById("journeyIncomeValue");
    const journeyInvestValue = document.getElementById("journeyInvestValue");
    const journeyProfileValue = document.getElementById("journeyProfileValue");

    if (!prefill || !prefill.profileName) return;

    if (profileName) profileName.textContent = prefill.profileName;
    if (profileText) profileText.textContent = prefill.profileDescription || "";
    if (profileBadge) profileBadge.textContent = prefill.profileName;
    if (journeyIncomeValue) journeyIncomeValue.textContent = formatCurrency(prefill.incomeAmount || 0);
    if (journeyInvestValue) journeyInvestValue.textContent = formatCurrency(prefill.investAmount || 0);
    if (journeyProfileValue) journeyProfileValue.textContent = prefill.profileName;

    if (journeyProfileCard) journeyProfileCard.style.display = "block";
  }

  function calculateLeakageData() {
    const income = getNumber("income");
    const wealth = getNumber("wealth");
    const lifestyle = getNumber("lifestyle");
    const subscriptions = getNumber("subscriptions");

    const monthlyLeakage = lifestyle + subscriptions;
    const annualLeakage = monthlyLeakage * 12;
    const leakagePct = income > 0 ? (monthlyLeakage / income) * 100 : 0;

    return {
      income,
      wealth,
      lifestyle,
      subscriptions,
      monthlyLeakage,
      annualLeakage,
      leakagePct
    };
  }

  function getLeakageInsight(data) {
    const { leakagePct, wealth, monthlyLeakage } = data;

    if (monthlyLeakage === 0) {
      return "Your structure shows almost no visible leakage. Either you are extremely disciplined or suspiciously optimistic.";
    }

    if (leakagePct <= 10) {
      return "Your leakage appears relatively controlled. Most of your income still has room to support your financial progress.";
    }

    if (leakagePct <= 20) {
      return "A noticeable part of your monthly cashflow leaks into spending that does not strengthen long-term wealth.";
    }

    if (wealth > 0 && monthlyLeakage > wealth) {
      return "You are building wealth, but your leakage currently exceeds the capital you add each month. That slows progress more than it seems.";
    }

    return "A large share of your monthly income disappears before it can support real capital formation.";
  }

  function resetAIBlocks() {
    const leakageSignalText = document.getElementById("leakageSignalText");
    const behaviorSignalText = document.getElementById("behaviorSignalText");
    const aiWhatText = document.getElementById("aiWhatText");
    const aiWhyText = document.getElementById("aiWhyText");
    const aiViewText = document.getElementById("aiViewText");
    const aiReflectionText = document.getElementById("aiReflectionText");

    const aiLoading = document.getElementById("aiLoading");
    const aiResult = document.getElementById("aiResult");
    const aiError = document.getElementById("aiError");

    if (leakageSignalText) leakageSignalText.textContent = "";
    if (behaviorSignalText) behaviorSignalText.textContent = "";
    if (aiWhatText) aiWhatText.textContent = "";
    if (aiWhyText) aiWhyText.textContent = "";
    if (aiViewText) aiViewText.textContent = "";
    if (aiReflectionText) aiReflectionText.textContent = "";

    if (aiResult) aiResult.style.display = "none";
    if (aiError) aiError.style.display = "none";
    if (aiLoading) aiLoading.style.display = "none";
  }

  function renderLeakage() {
    const data = calculateLeakageData();

    document.getElementById("leakagePctValue").textContent = formatPercent(data.leakagePct);
    document.getElementById("monthlyLeakageValue").textContent = formatCurrency(data.monthlyLeakage);
    document.getElementById("annualLeakageValue").textContent = formatCurrency(data.annualLeakage);
    document.getElementById("wealthEuroValue").textContent = formatCurrency(data.wealth);
    document.getElementById("leakageInsight").textContent = getLeakageInsight(data);

    const resultBlock = document.getElementById("resultBlock");
    if (resultBlock) {
      resultBlock.style.display = "grid";
      resultBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    resetAIBlocks();
  }

  async function fetchAIInsight() {
    const aiExplainBtn = document.getElementById("aiExplainBtn");
    const aiLoading = document.getElementById("aiLoading");
    const aiResult = document.getElementById("aiResult");
    const aiError = document.getElementById("aiError");

    const leakageSignalText = document.getElementById("leakageSignalText");
    const behaviorSignalText = document.getElementById("behaviorSignalText");
    const aiWhatText = document.getElementById("aiWhatText");
    const aiWhyText = document.getElementById("aiWhyText");
    const aiViewText = document.getElementById("aiViewText");
    const aiReflectionText = document.getElementById("aiReflectionText");

    if (!aiExplainBtn || !aiLoading || !aiResult || !aiError || !leakageSignalText || !behaviorSignalText || !aiWhatText || !aiWhyText || !aiViewText || !aiReflectionText) {
      console.error("AI UI elements not found.");
      return;
    }

    const data = calculateLeakageData();

    aiExplainBtn.disabled = true;
    aiExplainBtn.textContent = "Analyzing...";
    aiLoading.style.display = "block";
    aiResult.style.display = "none";
    aiError.style.display = "none";

    try {
      const response = await fetch("/api/ai-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tool: "wealth-leakage",
          data
        })
      });

      const result = await response.json();
      console.log("LEAKAGE PAYLOAD:", {
  tool: "wealth-leakage",
  data
});

      if (!response.ok) {
        throw new Error(result.details || result.error || "AI request failed");
      }

      leakageSignalText.textContent = result.leakage_signal || "";
      behaviorSignalText.textContent = result.behavior_signal || "";
      aiWhatText.textContent = result.what_stands_out || "No section returned.";
      aiWhyText.textContent = result.why_it_matters || "No section returned.";
      aiViewText.textContent = result.moneymind_view || "No section returned.";
      aiReflectionText.textContent = result.reflection || "No section returned.";

      aiResult.style.display = "grid";
    } catch (error) {
      console.error("AI insight error:", error);
      aiError.style.display = "block";
    } finally {
      aiLoading.style.display = "none";
      aiExplainBtn.disabled = false;
      aiExplainBtn.textContent = "Explain My Leakage";
    }
  }

  function init() {
    const calculateBtn = document.getElementById("calculateBtn");
    const aiExplainBtn = document.getElementById("aiExplainBtn");

    const prefill = prefillFromJourney();
    renderJourneyImport(prefill);

    if (calculateBtn) {
      calculateBtn.addEventListener("click", renderLeakage);
    }

    if (aiExplainBtn) {
      aiExplainBtn.addEventListener("click", fetchAIInsight);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
