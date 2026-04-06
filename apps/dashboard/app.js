import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://hhopspedkbidzrffgqrt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhob3BzcGVka2JpZHpyZmZncXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzUxODgsImV4cCI6MjA4ODA1MTE4OH0.sUD3cgteOBJ9vpOr5lgXYmauE1P-BtaaqHP_DL4nZBk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("MoneyMind dashboard loaded 🚀");

const DEFAULT_BUTTON_TEXT = "Analyze My Situation";
const LOADING_BUTTON_TEXT = "Analyzing...";

const TOOL_PATHS = {
  capitalMap: "/tools/capital-map/index.html",
  spendingVsBuilding: "/tools/spending-vs-building/index.html",
  leakage: "/tools/leakage/index.html",
  builder: "/tools/builder/index.html",
  academy: "/apps/academy/index.html",
  roast: "/tools/roast/index.html"
};

const STORAGE_KEYS = {
  userData: "userData",
  roastResult: "moneymind_roast_result"
};

const els = {
  // Market pulse
  btcEurValue: document.getElementById("btc-eur-value"),
  eurUsdValue: document.getElementById("eur-usd-value"),

  // Hero
  heroTitle: document.querySelector(".hero h2"),
  heroText: document.querySelector(".hero p"),

  // Wealth snapshot
  netWorthBig: document.querySelector(".big-number"),
  netWorthSub: document.querySelector(".big-number + .sub"),
  snapshotMiniLabels: document.querySelectorAll(".snapshot-grid .mini-label"),
  snapshotMiniValues: document.querySelectorAll(".snapshot-grid .mini-value"),
  snapshotInsightBox: document.querySelector(".grid.grid-2 .card:first-child .insight-box"),

  // Next move card
  nextMoveSub: document.querySelector(".grid.grid-2 .card:nth-child(2) .sub"),
  nextMoveMiniLabel: document.querySelector(".grid.grid-2 .card:nth-child(2) .mini-label"),
  nextMoveMiniValue: document.querySelector(".grid.grid-2 .card:nth-child(2) .mini-value"),
  nextMoveButton: document.querySelector(".grid.grid-2 .card:nth-child(2) .button"),
  nextMoveFooter: document.querySelector(".grid.grid-2 .card:nth-child(2) .sub.mt-8"),

  // Attention block
  attentionTitles: document.querySelectorAll(".attention-list .attention-title"),
  attentionSubs: document.querySelectorAll(".attention-list .sub"),

  // Academy block
  academyOpenBtn: document.querySelector('a[href="/apps/academy/index.html"]'),

  // AI block
  aiButton: document.getElementById("generate-ai-insight-btn"),
  aiTitle: document.getElementById("ai-insight-title"),
  aiWhatYouSee: document.getElementById("ai-what-you-see"),
  aiWhyItMatters: document.getElementById("ai-why-it-matters"),
  aiThinkAbout: document.getElementById("ai-think-about"),
  aiNextStep: document.getElementById("ai-next-step"),
  aiLoading: document.getElementById("ai-loading"),
  aiNextStepButton: document.querySelector("#ai-insight-card .button.secondary"),

  // Maintenance
  maintenanceRows: document.querySelectorAll(".maintenance-row"),

  // Progress
  progressLevel: document.querySelector(".progress-level"),
  progressSub: document.querySelector(".progress-level + .sub"),
  progressInsightBox: document.querySelector(".footer-grid .card:last-child .insight-box")
};

function readJsonStorage(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Could not parse localStorage key: ${key}`, error);
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not write localStorage key: ${key}`, error);
  }
}

function formatEuro(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getUserData() {
  const userData = readJsonStorage(STORAGE_KEYS.userData, {});
  const roastFallback = readJsonStorage(STORAGE_KEYS.roastResult, null);

  if (!userData.roast && roastFallback) {
    userData.roast = roastFallback;
  }

  userData.capitalMap = userData.capitalMap || { completed: false, updatedAt: null };
  userData.allocation = userData.allocation || { completed: false, updatedAt: null };
  userData.spendingVsBuilding =
    userData.spendingVsBuilding || { completed: false, updatedAt: null };
  userData.leakage = userData.leakage || { completed: false, updatedAt: null };
  userData.builder = userData.builder || { completed: false, updatedAt: null };

  return userData;
}

function getCompletedCoreToolsCount(userData) {
  const flags = [
    !!userData.roast?.completed,
    !!userData.capitalMap?.completed,
    !!userData.spendingVsBuilding?.completed,
    !!userData.leakage?.completed,
    !!userData.builder?.completed
  ];

  return flags.filter(Boolean).length;
}

function getClarityStage(count) {
  if (count <= 1) {
    return {
      level: 12,
      label: "Awareness stage • Your first financial pattern is visible"
    };
  }

  if (count === 2) {
    return {
      level: 22,
      label: "Structure stage • You are moving from signal to understanding"
    };
  }

  if (count === 3) {
    return {
      level: 34,
      label: "Control stage • Your financial weak spots are getting clearer"
    };
  }

  if (count === 4) {
    return {
      level: 48,
      label: "Builder stage • You are turning clarity into action"
    };
  }

  return {
    level: 60,
    label: "Momentum stage • Your system is becoming intentional"
  };
}

function getNextStepMeta(userData) {
  if (!userData.capitalMap?.completed) {
    return {
      key: "capitalMap",
      path: TOOL_PATHS.capitalMap,
      title: "Map your capital structure",
      description:
        "Before optimizing anything else, understand what is directly usable, accessible, and locked.",
      miniLabel: "Priority",
      miniValue: "Capital clarity",
      footer: "Start here first. You need structure before optimization."
    };
  }

  if (!userData.spendingVsBuilding?.completed) {
    return {
      key: "spendingVsBuilding",
      path: TOOL_PATHS.spendingVsBuilding,
      title: "Check your Spending vs Building ratio",
      description:
        "The next weak point is whether your income is actually converting into long-term capital.",
      miniLabel: "Priority",
      miniValue: "Income conversion",
      footer: "This tells you whether your monthly flow is building wealth or just funding life."
    };
  }

  if (!userData.leakage?.completed) {
    return {
      key: "leakage",
      path: TOOL_PATHS.leakage,
      title: "Run your Leakage Check",
      description:
        "Some spending is fine. Some spending quietly blocks future wealth. You need to know the difference.",
      miniLabel: "Priority",
      miniValue: "Leakage review",
      footer: "Do this after your monthly flow is visible."
    };
  }

  if (!userData.builder?.completed) {
    return {
      key: "builder",
      path: TOOL_PATHS.builder,
      title: "Build your first wealth plan",
      description:
        "You have enough signal now. It is time to turn clarity into a direction you can actually build on.",
      miniLabel: "Priority",
      miniValue: "Wealth direction",
      footer: "Now move from diagnosis into design."
    };
  }

  return {
    key: "builder",
    path: TOOL_PATHS.builder,
    title: "Refine your wealth plan",
    description:
      "Your core tools are completed. The next step is improving consistency and tightening your system.",
    miniLabel: "Status",
    miniValue: "Core path done",
    footer: "You are no longer guessing. Now improve the quality of your decisions."
  };
}

function buildDashboardData(userData) {
  const roast = userData.roast || {};
  const nextStep = getNextStepMeta(userData);
  const completedCoreTools = getCompletedCoreToolsCount(userData);
  const clarity = getClarityStage(completedCoreTools);

  const currentWealth = Number(roast.trajectory?.currentWealth || 0);
  const optimizedWealth = Number(roast.trajectory?.optimizedWealth || 0);
  const wealthDifference = Number(roast.trajectory?.wealthDifference || 0);

  const estimatedNetWorth = currentWealth > 0 ? currentWealth : 0;

  return {
    roastCompleted: !!roast.completed,
    roastHeadline: roast.headline || "",
    roastObservation: roast.observation || "",
    profileName: roast.profile?.name || "",
    behaviorTitle: roast.behavior?.title || "",
    behaviorText: roast.behavior?.text || "",
    incomeText: roast.incomeText || "Unknown",
    investText: roast.investText || "Unknown",
    investRateText: roast.investRateText || "Unknown",
    currentWealth,
    optimizedWealth,
    wealthDifference,
    estimatedNetWorth,
    completedCoreTools,
    clarity,
    nextStep,
    statuses: {
      roast: roast.completed ? "Completed" : "Missing",
      capitalMap: userData.capitalMap.completed ? "Completed" : "Recommended next",
      spendingVsBuilding: userData.spendingVsBuilding.completed ? "Completed" : "Not started",
      leakage: userData.leakage.completed ? "Completed" : "Not started",
      builder: userData.builder.completed ? "Completed" : "Not started"
    }
  };
}

function getStatusClass(label) {
  if (label === "Completed") return "ok";
  if (label === "Recommended next") return "warn";
  return "bad";
}

function updateHero(data) {
  if (!els.heroTitle || !els.heroText) return;

  if (!data.roastCompleted) {
    els.heroTitle.textContent = "Start with your Financial Roast.";
    els.heroText.textContent =
      "Your dashboard becomes useful after your first MoneyMind signal. Start with the Roast to unlock direction.";
    return;
  }

  els.heroTitle.textContent =
    "Your first financial pattern is visible. What you do next matters.";

  els.heroText.textContent =
    data.roastObservation ||
    "The Roast exposed your first weak spots. This dashboard helps turn that signal into action.";
}

function updateWealthSnapshot(data, userData) {
  if (!els.netWorthBig || !els.snapshotInsightBox) return;

  if (!userData.capitalMap?.completed) {
    els.netWorthBig.textContent = "Not mapped yet";
    if (els.netWorthSub) {
      els.netWorthSub.textContent = "Capital structure";
    }

    const values = Array.from(els.snapshotMiniValues);
    if (values[0]) values[0].textContent = "Unknown";
    if (values[1]) values[1].textContent = "Unknown";
    if (values[2]) values[2].textContent = "Unknown";

    els.snapshotInsightBox.textContent =
      "You have not mapped your capital structure yet. Before optimizing returns, first understand what is directly usable, what is accessible, and what is locked.";

    return;
  }

  const directCapital = Number(userData.capitalMap?.directCapital || 0);
  const accessibleCapital = Number(userData.capitalMap?.accessibleCapital || 0);
  const lockedCapital = Number(userData.capitalMap?.lockedCapital || 0);
  const netWorth = directCapital + accessibleCapital + lockedCapital;

  els.netWorthBig.textContent = formatEuro(netWorth);
  if (els.netWorthSub) {
    els.netWorthSub.textContent = "Net worth";
  }

  const values = Array.from(els.snapshotMiniValues);
  if (values[0]) values[0].textContent = formatEuro(directCapital);
  if (values[1]) values[1].textContent = formatEuro(accessibleCapital);
  if (values[2]) values[2].textContent = formatEuro(lockedCapital);

  els.snapshotInsightBox.textContent =
    lockedCapital > directCapital
      ? "You have wealth, but too much of it is still tied up. That limits flexibility, speed, and room to act when opportunities show up."
      : "Your capital structure is starting to improve. The next question is whether your monthly behavior is strengthening it.";
}

function updateNextMove(data) {
  if (!els.nextMoveButton) return;

  const next = data.nextStep;

  const nextMoveHeading = document.querySelector(".grid.grid-2 .card:nth-child(2) h3");
  if (nextMoveHeading) nextMoveHeading.textContent = next.title;

  if (els.nextMoveSub) {
    els.nextMoveSub.textContent = next.description;
  }

  if (els.nextMoveMiniLabel) {
    els.nextMoveMiniLabel.textContent = next.miniLabel;
  }

  if (els.nextMoveMiniValue) {
    els.nextMoveMiniValue.textContent = next.miniValue;
  }

  els.nextMoveButton.textContent = next.title;
  els.nextMoveButton.setAttribute("href", next.path);

  if (els.nextMoveFooter) {
    els.nextMoveFooter.textContent = next.footer;
  }

  if (els.aiNextStepButton) {
    els.aiNextStepButton.textContent = "Go to Next Step";
    els.aiNextStepButton.setAttribute("href", next.path);
  }
}

function updateAttentionBlock(data, userData) {
  const titleEls = Array.from(document.querySelectorAll(".attention-item .attention-title"));
  const subEls = Array.from(document.querySelectorAll(".attention-item .sub"));

  if (titleEls.length < 3 || subEls.length < 3) return;

  const items = [];

  if (!userData.capitalMap?.completed) {
    items.push({
      title: "Your capital structure is still unknown.",
      sub: "You may be making decisions without knowing what is actually usable, accessible, or locked."
    });
  } else {
    items.push({
      title: "Your capital structure is now visible.",
      sub: "The next question is whether your monthly behavior is reinforcing that structure or weakening it."
    });
  }

  if (!userData.spendingVsBuilding?.completed) {
    items.push({
      title: "Income is not yet linked to enough capital building.",
      sub: "Earning is one thing. Converting income into assets is where progress really starts."
    });
  } else {
    items.push({
      title: "Your monthly flow is now more visible.",
      sub: "The next weak spot is whether hidden leakage is slowing your wealth formation."
    });
  }

  if (!userData.leakage?.completed) {
    items.push({
      title: "Leakage still needs a proper check.",
      sub: "Not all spending is a problem. But some of it may still be disappearing without creating future value."
    });
  } else {
    items.push({
      title: "Leakage has been reviewed.",
      sub: "That gives you a cleaner base to build with more intention."
    });
  }

  items.slice(0, 3).forEach((item, index) => {
    titleEls[index].textContent = item.title;
    subEls[index].textContent = item.sub;
  });
}

function updateAcademyBlock(data) {
  const academyTitles = Array.from(
    document.querySelectorAll(".grid.grid-2.mt-16 .card:nth-child(2) .attention-title")
  );
  const academySubs = Array.from(
    document.querySelectorAll(".grid.grid-2.mt-16 .card:nth-child(2) .sub")
  );
  const academyMeta = Array.from(
    document.querySelectorAll(".grid.grid-2.mt-16 .card:nth-child(2) .lesson-meta")
  );

  if (academyTitles.length < 3 || academySubs.length < 3 || academyMeta.length < 3) return;

  academyTitles[0].textContent = "Assets vs Liabilities";
  academySubs[0].textContent =
    "Why some things look like progress — while quietly slowing your real wealth formation.";
  academyMeta[0].textContent = "3 min lesson";

  academyTitles[1].textContent = "Cost of Delay";
  academySubs[1].textContent =
    "What waiting is really costing you in time, growth, and future options.";
  academyMeta[1].textContent = "4 min lesson";

  academyTitles[2].textContent = "Lifestyle Inflation";
  academySubs[2].textContent =
    "Why earning more often feels like progress without improving your financial structure very much.";
  academyMeta[2].textContent = "3 min lesson";

  if (els.academyOpenBtn) {
    els.academyOpenBtn.setAttribute("href", TOOL_PATHS.academy);
  }
}

function updateMaintenance(data) {
  if (!els.maintenanceRows.length) return;

  const map = [
    ["Roast", data.statuses.roast],
    ["Capital Map", data.statuses.capitalMap],
    ["Spending vs Building", data.statuses.spendingVsBuilding],
    ["Leakage", data.statuses.leakage]
  ];

  els.maintenanceRows.forEach((row, index) => {
    const config = map[index];
    if (!config) return;

    const [label, status] = config;
    const spans = row.querySelectorAll("span");
    if (spans[0]) spans[0].textContent = label;
    if (spans[1]) {
      spans[1].textContent = status;
      spans[1].className = `tag ${getStatusClass(status)}`;
    }
  });
}

function updateProgress(data) {
  if (els.progressLevel) {
    els.progressLevel.textContent = String(data.clarity.level);
  }

  if (els.progressSub) {
    els.progressSub.textContent = data.clarity.label;
  }

  if (els.progressInsightBox) {
    els.progressInsightBox.textContent =
      data.completedCoreTools <= 1
        ? "You are no longer guessing. The next step is turning your first signal into financial structure."
        : data.completedCoreTools === 2
        ? "You are building real clarity now. Keep removing friction and weak spots one by one."
        : "Your financial system is becoming more intentional. The next step is consistency and better decisions over time.";
  }
}

function showLoading() {
  if (els.aiButton) {
    els.aiButton.disabled = true;
    els.aiButton.textContent = LOADING_BUTTON_TEXT;
  }

  if (els.aiLoading) {
    els.aiLoading.hidden = false;
  }

  if (els.aiTitle) {
    els.aiTitle.textContent = "Analyzing your financial pattern...";
  }

  if (els.aiWhatYouSee) {
    els.aiWhatYouSee.textContent = "Reviewing the structure behind your current dashboard.";
  }

  if (els.aiWhyItMatters) {
    els.aiWhyItMatters.textContent =
      "Looking for the financial pattern that matters most right now.";
  }

  if (els.aiThinkAbout) {
    els.aiThinkAbout.textContent = "Preparing your MoneyMind insight.";
  }

  if (els.aiNextStep) {
    els.aiNextStep.textContent = "Determining your next move...";
  }
}

function showResult(result) {
  if (els.aiLoading) {
    els.aiLoading.hidden = true;
  }

  if (els.aiTitle) {
    els.aiTitle.textContent = result.title || "Your financial pattern";
  }

  if (els.aiWhatYouSee) {
    els.aiWhatYouSee.textContent =
      result.whatYouSee || "No insight returned for this section.";
  }

  if (els.aiWhyItMatters) {
    els.aiWhyItMatters.textContent =
      result.whyItMatters || "No impact explanation returned.";
  }

  if (els.aiThinkAbout) {
    els.aiThinkAbout.textContent =
      result.thinkAbout || "No reflection returned.";
  }

  if (els.aiNextStep) {
    els.aiNextStep.textContent =
      result.nextStep ||
      "Bring clarity to your monthly flow before optimizing anything else.";
  }

  if (els.aiButton) {
    els.aiButton.disabled = false;
    els.aiButton.textContent = DEFAULT_BUTTON_TEXT;
  }
}

function showError() {
  if (els.aiLoading) {
    els.aiLoading.hidden = true;
  }

  if (els.aiTitle) {
    els.aiTitle.textContent = "AI insight unavailable";
  }

  if (els.aiWhatYouSee) {
    els.aiWhatYouSee.textContent =
      "We could not generate your insight right now.";
  }

  if (els.aiWhyItMatters) {
    els.aiWhyItMatters.textContent =
      "The AI connection may be unavailable or the response was incomplete.";
  }

  if (els.aiThinkAbout) {
    els.aiThinkAbout.textContent =
      "Check the API route, environment key, and response format, then try again.";
  }

  if (els.aiNextStep) {
    els.aiNextStep.textContent =
      "Unable to determine your next step right now.";
  }

  if (els.aiButton) {
    els.aiButton.disabled = false;
    els.aiButton.textContent = DEFAULT_BUTTON_TEXT;
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

    if (els.btcEurValue) {
      els.btcEurValue.textContent =
        typeof btcEur === "number"
          ? `€${btcEur.toLocaleString("nl-NL")}`
          : "Unavailable";
    }

    if (els.eurUsdValue) {
      if (typeof btcEur === "number" && typeof btcUsd === "number" && btcEur !== 0) {
        const eurUsd = btcUsd / btcEur;
        els.eurUsdValue.textContent = eurUsd.toFixed(4);
      } else {
        els.eurUsdValue.textContent = "Unavailable";
      }
    }
  } catch (error) {
    console.error("Market pulse error:", error);

    if (els.btcEurValue) {
      els.btcEurValue.textContent = "Unavailable";
    }

    if (els.eurUsdValue) {
      els.eurUsdValue.textContent = "Unavailable";
    }
  }
}

async function fetchAIInsight(dashboardData) {
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
  const userData = getUserData();
  const dashboardData = buildDashboardData(userData);

  showLoading();

  try {
    const result = await fetchAIInsight({
      roastCompleted: dashboardData.roastCompleted,
      roastHeadline: dashboardData.roastHeadline,
      roastObservation: dashboardData.roastObservation,
      profileName: dashboardData.profileName,
      behaviorTitle: dashboardData.behaviorTitle,
      behaviorText: dashboardData.behaviorText,
      incomeText: dashboardData.incomeText,
      investText: dashboardData.investText,
      investRateText: dashboardData.investRateText,
      currentWealth: dashboardData.currentWealth,
      optimizedWealth: dashboardData.optimizedWealth,
      wealthDifference: dashboardData.wealthDifference,
      completedCoreTools: dashboardData.completedCoreTools,
      clarityLevel: dashboardData.clarity.level,
      clarityStage: dashboardData.clarity.label,
      nextStepTitle: dashboardData.nextStep.title,
      nextStepKey: dashboardData.nextStep.key
    });

    showResult(result);

    const existingUserData = getUserData();
    existingUserData.ai = {
      lastInsight: result,
      lastUpdated: new Date().toISOString()
    };
    writeJsonStorage(STORAGE_KEYS.userData, existingUserData);
  } catch (error) {
    console.error("AI insight error:", error);
    showError();
  }
}

function renderDashboard() {
  const userData = getUserData();
  const dashboardData = buildDashboardData(userData);

  updateHero(dashboardData);
  updateWealthSnapshot(dashboardData, userData);
  updateNextMove(dashboardData);
  updateAttentionBlock(dashboardData, userData);
  updateAcademyBlock(dashboardData);
  updateMaintenance(dashboardData);
  updateProgress(dashboardData);

  if (els.aiButton) {
    els.aiButton.textContent = DEFAULT_BUTTON_TEXT;
    els.aiButton.onclick = handleAIInsightClick;
  }

  if (!dashboardData.roastCompleted) {
    const nextMoveHeading = document.querySelector(".grid.grid-2 .card:nth-child(2) h3");
    if (nextMoveHeading) nextMoveHeading.textContent = "Start your Financial Roast";

    if (els.nextMoveSub) {
      els.nextMoveSub.textContent =
        "Your dashboard becomes useful after your first MoneyMind signal. Start with the Roast to unlock direction.";
    }

    if (els.nextMoveMiniLabel) {
      els.nextMoveMiniLabel.textContent = "Status";
    }

    if (els.nextMoveMiniValue) {
      els.nextMoveMiniValue.textContent = "Not started";
    }

    if (els.nextMoveButton) {
      els.nextMoveButton.textContent = "Start Roast";
      els.nextMoveButton.setAttribute("href", TOOL_PATHS.roast);
    }

    if (els.nextMoveFooter) {
      els.nextMoveFooter.textContent =
        "The Roast is the entry point. Everything else becomes smarter after that.";
    }
  }
}

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("tool_runs").select("*").limit(3);

    if (error) {
      console.error("Supabase connection error:", error);
      return;
    }

    console.log("Supabase tool_runs test data:", data);
  } catch (error) {
    console.error("Unexpected Supabase connection error:", error);
  }
}

renderDashboard();
fetchMarketPulse();
testSupabaseConnection();
