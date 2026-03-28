console.log("MoneyMind dashboard loaded 🚀");
console.log("MoneyMind dashboard loaded 🚀");

const aiButton = document.getElementById("generate-ai-insight-btn");
const aiTitle = document.getElementById("ai-insight-title");
const aiWhatYouSee = document.getElementById("ai-what-you-see");
const aiWhyItMatters = document.getElementById("ai-why-it-matters");
const aiThinkAbout = document.getElementById("ai-think-about");

function setAIInsightLoadingState() {
  aiButton.disabled = true;
  aiButton.textContent = "Analyzing...";

  aiTitle.textContent = "Analyzing your financial pattern...";
  aiWhatYouSee.textContent = "Reviewing the structure behind your current dashboard.";
  aiWhyItMatters.textContent = "Looking for the financial pattern that matters most right now.";
  aiThinkAbout.textContent = "Preparing your MoneyMind insight.";
}

function setAIInsightDemoResult() {
  aiTitle.textContent = "Your financial pattern";

  aiWhatYouSee.textContent =
    "Your wealth base is real, but too much of it is still tied up while your building ratio remains low.";

  aiWhyItMatters.textContent =
    "That reduces flexibility and slows the speed at which income turns into long-term capital.";

  aiThinkAbout.textContent =
    "Are you actively building wealth each month, or mostly maintaining your current position?";
}

const DEFAULT_BUTTON_TEXT = "Show Me What's Really Going On";

function resetAIButton() {
  aiButton.disabled = false;
  aiButton.textContent = DEFAULT_BUTTON_TEXT;
}

function handleAIInsightClick() {
  setAIInsightLoadingState();

  setTimeout(() => {
    setAIInsightDemoResult();
    resetAIButton();
  }, 1200);
}

if (aiButton) {
  aiButton.addEventListener("click", handleAIInsightClick);
}
