console.log("MoneyMind dashboard loaded 🚀");

const DEFAULT_BUTTON_TEXT = "Analyze My Situation";
const LOADING_BUTTON_TEXT = "Analyzing...";

const aiButton = document.getElementById("generate-ai-insight-btn");
const aiTitle = document.getElementById("ai-insight-title");
const aiWhatYouSee = document.getElementById("ai-what-you-see");
const aiWhyItMatters = document.getElementById("ai-why-it-matters");
const aiThinkAbout = document.getElementById("ai-think-about");
const aiLoading = document.getElementById("ai-loading");

function setAIInsightLoadingState() {
  if (!aiButton || !aiTitle || !aiWhatYouSee || !aiWhyItMatters || !aiThinkAbout) {
    return;
  }

  aiButton.disabled = true;
  aiButton.textContent = LOADING_BUTTON_TEXT;

  if (aiLoading) {
    aiLoading.hidden = false;
  }

  aiTitle.textContent = "Analyzing your financial pattern...";
  aiWhatYouSee.textContent = "Reviewing the structure behind your current dashboard.";
  aiWhyItMatters.textContent = "Looking for the financial pattern that matters most right now.";
  aiThinkAbout.textContent = "Preparing your MoneyMind insight.";
}

function setAIInsightDemoResult() {
  if (!aiTitle || !aiWhatYouSee || !aiWhyItMatters || !aiThinkAbout) {
    return;
  }

  if (aiLoading) {
    aiLoading.hidden = true;
  }

  aiTitle.textContent = "Your financial pattern";

  aiWhatYouSee.textContent =
    "Your wealth base is real, but too much of it is still tied up while your building ratio remains low.";

  aiWhyItMatters.textContent =
    "That reduces flexibility and slows the speed at which income turns into long-term capital.";

  aiThinkAbout.textContent =
    "Are you actively building wealth each month, or mostly maintaining your current position?";
}

function resetAIButton() {
  if (!aiButton) {
    return;
  }

  aiButton.disabled = false;
  aiButton.textContent = DEFAULT_BUTTON_TEXT;
}

function handleAIInsightClick() {
  setAIInsightLoadingState();

  window.setTimeout(() => {
    setAIInsightDemoResult();
    resetAIButton();
  }, 1200);
}

if (aiButton) {
  aiButton.textContent = DEFAULT_BUTTON_TEXT;
  aiButton.addEventListener("click", handleAIInsightClick);
}
