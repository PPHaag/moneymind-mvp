(function(){

  function prefillAllocationFromProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem("mm_profile") || "{}");

      const incomeField = document.getElementById("income");
      const wealthField = document.getElementById("wealth");

      if (incomeField && profile.income) {
        incomeField.value = profile.income;
      }

      if (wealthField && profile.monthlyInvesting) {
        wealthField.value = profile.monthlyInvesting;
      }

    } catch (err) {
      console.warn("Prefill failed", err);
    }
  }

  function resetAIBlocks() {
    const structureSignalText = document.getElementById("structureSignalText");
    const cashflowSignalText = document.getElementById("cashflowSignalText");
    const aiWhatText = document.getElementById("aiWhatText");
    const aiWhyText = document.getElementById("aiWhyText");
    const aiViewText = document.getElementById("aiViewText");
    const aiReflectionText = document.getElementById("aiReflectionText");

    const aiLoading = document.getElementById("aiLoading");
    const aiResult = document.getElementById("aiResult");
    const aiError = document.getElementById("aiError");

    if (structureSignalText) structureSignalText.textContent = "";
    if (cashflowSignalText) cashflowSignalText.textContent = "";
    if (aiWhatText) aiWhatText.textContent = "";
    if (aiWhyText) aiWhyText.textContent = "";
    if (aiViewText) aiViewText.textContent = "";
    if (aiReflectionText) aiReflectionText.textContent = "";

    if (aiResult) aiResult.style.display = "none";
    if (aiError) aiError.style.display = "none";
    if (aiLoading) aiLoading.style.display = "none";
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
    if (journeyIncomeValue) journeyIncomeValue.textContent = window.AllocationEngine.formatCurrency(prefill.incomeAmount || 0);
    if (journeyInvestValue) journeyInvestValue.textContent = window.AllocationEngine.formatCurrency(prefill.investAmount || 0);
    if (journeyProfileValue) journeyProfileValue.textContent = prefill.profileName;

    if (journeyProfileCard) journeyProfileCard.style.display = "block";
  }

  function renderAllocation() {
    const data = window.AllocationEngine.calculateAllocationData();

    document.getElementById("wealthPctValue").textContent =
      window.AllocationEngine.formatPercent(data.wealthPct);

    document.getElementById("fixedPctValue").textContent =
      window.AllocationEngine.formatPercent(data.fixedPct);

    document.getElementById("flexPctValue").textContent =
      window.AllocationEngine.formatPercent(data.flexPct);

    document.getElementById("wealthEuroValue").textContent =
      window.AllocationEngine.formatCurrency(data.wealth);

    document.getElementById("allocationInsight").textContent =
      window.AllocationEngine.getAllocationInsight(data);

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

    const structureSignalText = document.getElementById("structureSignalText");
    const cashflowSignalText = document.getElementById("cashflowSignalText");
    const aiWhatText = document.getElementById("aiWhatText");
    const aiWhyText = document.getElementById("aiWhyText");
    const aiViewText = document.getElementById("aiViewText");
    const aiReflectionText = document.getElementById("aiReflectionText");

    const data = window.AllocationEngine.calculateAllocationData();

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
          tool: "allocation-reality-check",
          data
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || "AI request failed");
      }

      structureSignalText.textContent = result.structure_signal || "";
      cashflowSignalText.textContent = result.liquidity_signal || "";
      aiWhatText.textContent = result.what_stands_out || "";
      aiWhyText.textContent = result.why_it_matters || "";
      aiViewText.textContent = result.moneymind_view || "";
      aiReflectionText.textContent = result.reflection || "";

      aiResult.style.display = "grid";

    } catch (error) {

      console.error("AI insight error:", error);
      aiError.style.display = "block";

    } finally {

      aiLoading.style.display = "none";
      aiExplainBtn.disabled = false;
      aiExplainBtn.textContent = "Explain My Allocation";

    }
  }

  function init() {

    const calculateBtn = document.getElementById("calculateBtn");
    const aiExplainBtn = document.getElementById("aiExplainBtn");

    const prefill = window.AllocationEngine.prefillFromJourney();

    renderJourneyImport(prefill);

    // AUTOFILL FROM ROAST
    prefillAllocationFromProfile();

    if (calculateBtn) {
      calculateBtn.addEventListener("click", renderAllocation);
    }

    if (aiExplainBtn) {
      aiExplainBtn.addEventListener("click", fetchAIInsight);
    }

  }

  document.addEventListener("DOMContentLoaded", init);

})();
