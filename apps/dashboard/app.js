console.log("MoneyMind dashboard loaded 🚀");

const DEFAULT_BUTTON_TEXT = "Analyze My Situation";
const LOADING_BUTTON_TEXT = "Analyzing...";

const aiButton = document.getElementById("generate-ai-insight-btn");
const aiTitle = document.getElementById("ai-insight-title");
const aiWhatYouSee = document.getElementById("ai-what-you-see");
const aiWhyItMatters = document.getElementById("ai-why-it-matters");
const aiThinkAbout = document.getElementById("ai-think-about");
const aiNextStep = document.getElementById("ai-next-step");
const aiLoading = document.getElementById("ai-loading");

function showLoading() {
  if (aiButton) {
    aiButton.disabled = true;
    aiButton.textContent = LOADING_BUTTON_TEXT;
  }

  if (aiLoading) {
    aiLoading.hidden = false;
  }

  if (aiTitle) {
    aiTitle.textContent = "Analyzing your financial pattern...";
  }

  if (aiWhatYouSee) {
    aiWhatYouSee.textContent =
      "Reviewing the structure behind your current dashboard.";
  }

  if (aiWhyItMatters) {
    aiWhyItMatters.textContent =
      "Looking for the financial pattern that matters most right now.";
  }

  if (aiThinkAbout) {
    aiThinkAbout.textContent =
      "Preparing your MoneyMind insight.";
  }

  if (aiNextStep) {
    aiNextStep.textContent =
      "Determining your next move...";
  }
}

function showResult(result) {
  if (aiLoading) {
    aiLoading.hidden = true;
  }

  if (aiTitle) {
    aiTitle.textContent = result.title || "Your financial pattern";
  }

  if (aiWhatYouSee) {
    aiWhatYouSee.textContent =
      result.whatYouSee ||
      "No insight returned for this section.";
  }

  if (aiWhyItMatters) {
    aiWhyItMatters.textContent =
      result.whyItMatters ||
      "No impact explanation returned.";
  }

  if (aiThinkAbout) {
    aiThinkAbout.textContent =
      result.thinkAbout ||
      "No reflection returned.";
  }

  if (aiNextStep) {
    aiNextStep.textContent =
      result.nextStep ||
      "Bring clarity to your monthly flow before optimizing anything else.";
  }

  if (aiButton) {
    aiButton.disabled = false;
    aiButton.textContent = DEFAULT_BUTTON_TEXT;
  }
}

function showError() {
  if (aiLoading) {
    aiLoading.hidden = true;
  }

  if (aiTitle) {
    aiTitle.textContent = "AI insight unavailable";
  }

  if (aiWhatYouSee) {
    aiWhatYouSee.textContent =
      "We could not generate your insight right now.";
  }

  if (aiWhyItMatters) {
    aiWhyItMatters.textContent =
      "The AI connection may be unavailable or the response was incomplete.";
  }

  if (aiThinkAbout) {
    aiThinkAbout.textContent =
      "Check the API route, environment key, and response format, then try again.";
  }

  if (aiNextStep) {
    aiNextStep.textContent =
      "Unable to determine your next step right now.";
  }

  if (aiButton) {
    aiButton.disabled = false;
    aiButton.textContent = DEFAULT_BUTTON_TEXT;
  }
}

async function fetchAIInsight() {
  const dashboardData = {
    netWorth: 85000,
    directCapital: 25000,
    accessibleCapital: 10000,
    lockedCapital: 50000,
    buildingRatio: 12,
    leakageStatus: "missing",
    capitalMapStatus: "review recommended",
    clarityLevel: 18,
    clarityStage: "Foundation"
  };

  const response = await fetch("/api/ai-insight", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dashboardData)
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

async function handleAIInsightClick() {
  showLoading();

  try {
    const result = await fetchAIInsight();
    showResult(result);
  } catch (error) {
    console.error("AI insight error:", error);
    showError();
  }
}

if (aiButton) {
  aiButton.textContent = DEFAULT_BUTTON_TEXT;
  aiButton.onclick = handleAIInsightClick;
}
