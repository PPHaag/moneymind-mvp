console.log("MoneyMind dashboard loaded 🚀");

const DEFAULT_BUTTON_TEXT = "Analyze My Situation";
const LOADING_BUTTON_TEXT = "Analyzing...";

const aiButton = document.getElementById("generate-ai-insight-btn");
const aiTitle = document.getElementById("ai-insight-title");
const aiWhatYouSee = document.getElementById("ai-what-you-see");
const aiWhyItMatters = document.getElementById("ai-why-it-matters");
const aiThinkAbout = document.getElementById("ai-think-about");
const aiLoading = document.getElementById("ai-loading");

function showLoading() {
  console.log("showLoading fired");

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
    aiWhatYouSee.textContent = "Reviewing the structure behind your current dashboard.";
  }

  if (aiWhyItMatters) {
    aiWhyItMatters.textContent = "Looking for the financial pattern that matters most right now.";
  }

  if (aiThinkAbout) {
    aiThinkAbout.textContent = "Preparing your MoneyMind insight.";
  }
}

function showDemoResult() {
  console.log("showDemoResult fired");

  if (aiLoading) {
    aiLoading.hidden = true;
  }

  if (aiTitle) {
    aiTitle.textContent = "Your financial pattern";
  }

  if (aiWhatYouSee) {
    aiWhatYouSee.textContent =
      "Your wealth base is real, but too much of it is still tied up while your building ratio remains low.";
  }

  if (aiWhyItMatters) {
    aiWhyItMatters.textContent =
      "That reduces flexibility and slows the speed at which income turns into long-term capital.";
  }

  if (aiThinkAbout) {
    aiThinkAbout.textContent =
      "Are you actively building wealth each month, or mostly maintaining your current position?";
  }

  if (aiButton) {
    aiButton.disabled = false;
    aiButton.textContent = DEFAULT_BUTTON_TEXT;
  }
}

function handleAIInsightClick() {
  showLoading();

  setTimeout(showDemoResult, 1200);
}

if (aiButton) {
  aiButton.textContent = DEFAULT_BUTTON_TEXT;
  aiButton.onclick = handleAIInsightClick;
}
