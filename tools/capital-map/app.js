(function(){
  function resetAIBlocks() {
    const aiLoading = document.getElementById("aiLoading");
    const aiResult = document.getElementById("aiResult");
    const aiError = document.getElementById("aiError");

    const aiWhatText = document.getElementById("aiWhatText");
    const aiWhyText = document.getElementById("aiWhyText");
    const aiViewText = document.getElementById("aiViewText");
    const aiReflectionText = document.getElementById("aiReflectionText");

    if (aiWhatText) aiWhatText.textContent = "";
    if (aiWhyText) aiWhyText.textContent = "";
    if (aiViewText) aiViewText.textContent = "";
    if (aiReflectionText) aiReflectionText.textContent = "";

    if (aiResult) aiResult.style.display = "none";
    if (aiError) aiError.style.display = "none";
    if (aiLoading) aiLoading.style.display = "none";
  }

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
    if (roastIncomeValue) roastIncomeValue.textContent = window.CapitalMapEngine.formatCurrency(prefill.incomeAmount || 0);
    if (roastInvestValue) roastInvestValue.textContent = window.CapitalMapEngine.formatCurrency(prefill.investAmount || 0);
    if (roastProfileValue) roastProfileValue.textContent = prefill.profileName;

    if (roastProfileCard) roastProfileCard.style.display = "block";
  }

  function renderCapitalMap() {
    const data = window.CapitalMapEngine.calculateCapitalMapData();

    document.getElementById("directCapitalValue").textContent =
      window.CapitalMapEngine.formatCurrency(data.directCapital);

    document.getElementById("accessibleCapitalValue").textContent =
      window.CapitalMapEngine.formatCurrency(data.accessibleCapital);

    document.getElementById("lockedCapitalValue").textContent =
      window.CapitalMapEngine.formatCurrency(data.lockedCapital);

    document.getElementById("netWorthValue").textContent =
      window.CapitalMapEngine.formatCurrency(data.netWorth);

    document.getElementById("capitalInsight").textContent =
      window.CapitalMapEngine.getCapitalInsight(data);

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

    const aiWhatText = document.getElementById("aiWhatText");
    const aiWhyText = document.getElementById("aiWhyText");
    const aiViewText = document.getElementById("aiViewText");
    const aiReflectionText = document.getElementById("aiReflectionText");

    if (!aiExplainBtn || !aiLoading || !aiResult || !aiError || !aiWhatText || !aiWhyText || !aiViewText || !aiReflectionText) {
      console.error("AI UI elements not found.");
      return;
    }

    const data = window.CapitalMapEngine.calculateCapitalMapData();

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
          tool: "capital-map",
          data
        })
      });

      const result = await response.json();
      console.log("AI RESULT FRONTEND:", result);

      if (!response.ok) {
        throw new Error(result.details || result.error || "AI request failed");
      }

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
      aiExplainBtn.textContent = "Explain My Results";
    }
  }

  function init() {
    const calculateBtn = document.getElementById("calculateBtn");
    const aiExplainBtn = document.getElementById("aiExplainBtn");

    const prefill = window.CapitalMapEngine.prefillFromRoast();
    renderRoastImport(prefill);

    if (calculateBtn) {
      calculateBtn.addEventListener("click", renderCapitalMap);
    }

    if (aiExplainBtn) {
      aiExplainBtn.addEventListener("click", fetchAIInsight);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
