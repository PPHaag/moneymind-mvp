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

function resetAIState() {
  const aiLoading = document.getElementById("aiLoading");
  const aiResult = document.getElementById("aiResult");
  const aiError = document.getElementById("aiError");

  if (aiLoading) aiLoading.style.display = "none";
  if (aiResult) aiResult.style.display = "none";
  if (aiError) aiError.style.display = "none";

  const aiWhatText = document.getElementById("aiWhatText");
  const aiWhyText = document.getElementById("aiWhyText");
  const aiViewText = document.getElementById("aiViewText");
  const aiReflectionText = document.getElementById("aiReflectionText");

  if (aiWhatText) aiWhatText.innerText = "";
  if (aiWhyText) aiWhyText.innerText = "";
  if (aiViewText) aiViewText.innerText = "";
  if (aiReflectionText) aiReflectionText.innerText = "";
}

function calculateCapitalMap() {
  const data = calculateCapitalMapData();

  document.getElementById("directCapitalValue").innerText = formatCurrency(data.directCapital);
  document.getElementById("accessibleCapitalValue").innerText = formatCurrency(data.accessibleCapital);
  document.getElementById("lockedCapitalValue").innerText = formatCurrency(data.lockedCapital);
  document.getElementById("netWorthValue").innerText = formatCurrency(data.netWorth);

  const insightEl = document.getElementById("capitalInsight");
  if (insightEl) {
    insightEl.innerText = getCapitalInsight(data);
  }

  const resultBlock = document.getElementById("resultBlock");
  if (resultBlock) {
    resultBlock.style.display = "block";
    resultBlock.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  resetAIState();
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

  const data = calculateCapitalMapData();

  aiExplainBtn.disabled = true;
  aiExplainBtn.innerText = "Analyzing...";
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

    if (!response.ok) {
      throw new Error(result.error || "AI request failed");
    }

    aiWhatText.innerText = result.what_stands_out || "";
    aiWhyText.innerText = result.why_it_matters || "";
    aiViewText.innerText = result.moneymind_view || "";
    aiReflectionText.innerText = result.reflection || "";

    aiResult.style.display = "grid";
  } catch (error) {
    console.error("AI insight error:", error);
    aiError.style.display = "block";
  } finally {
    aiLoading.style.display = "none";
    aiExplainBtn.disabled = false;
    aiExplainBtn.innerText = "Explain My Results";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById("calculateBtn");
  const aiExplainBtn = document.getElementById("aiExplainBtn");

  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateCapitalMap);
  }

  if (aiExplainBtn) {
    aiExplainBtn.addEventListener("click", fetchAIInsight);
  }
});
