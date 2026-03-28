import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://hhopspedkbidzrffgqrt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhob3BzcGVka2JpZHpyZmZncXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzUxODgsImV4cCI6MjA4ODA1MTE4OH0.sUD3cgteOBJ9vpOr5lgXYmauE1P-BtaaqHP_DL4nZBk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("MoneyMind dashboard loaded 🚀");

const DEFAULT_BUTTON_TEXT = "Analyze My Situation";
const LOADING_BUTTON_TEXT = "Analyzing...";

const btcEurValue = document.getElementById("btc-eur-value");
const eurUsdValue = document.getElementById("eur-usd-value");
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

async function fetchMarketPulse() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur,usd"
    );

    if (!response.ok) {
      throw new Error(`Market API failed with status ${response.status}`);
    }

    const data = await response.json();

    const btcEur = data?.bitcoin?.eur;
    const btcUsd = data?.bitcoin?.usd;

    if (btcEurValue) {
      btcEurValue.textContent =
        typeof btcEur === "number"
          ? `€${btcEur.toLocaleString("nl-NL")}`
          : "Unavailable";
    }

    if (eurUsdValue) {
      if (typeof btcEur === "number" && typeof btcUsd === "number" && btcEur !== 0) {
        const eurUsd = btcUsd / btcEur;
        eurUsdValue.textContent = eurUsd.toFixed(4);
      } else {
        eurUsdValue.textContent = "Unavailable";
      }
    }
  } catch (error) {
    console.error("Market pulse error:", error);

    if (btcEurValue) {
      btcEurValue.textContent = "Unavailable";
    }

    if (eurUsdValue) {
      eurUsdValue.textContent = "Unavailable";
    }
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
fetchMarketPulse();
async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("tool_runs")
    .select("*")
    .limit(3);

  if (error) {
    console.error("Supabase connection error:", error);
    return;
  }

  console.log("Supabase tool_runs test data:", data);
}

testSupabaseConnection();
