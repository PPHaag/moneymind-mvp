// ─── MoneyMind Dashboard — app.js ────────────────────────────────────────────
// Reads from: localStorage key “moneymind_user_data” (single source of truth)
// Written by: roast/app.js after roast completion

// NOTE: Supabase is imported but kept dormant until backend is ready.
// Remove testSupabaseConnection() call or wire it to real data when needed.
import { createClient } from “https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm”;

// ⚠️ Move this key to a Vercel environment variable when going to production.
// In Vercel: Settings → Environment Variables → SUPABASE_ANON_KEY
const supabaseUrl     = “https://hhopspedkbidzrffgqrt.supabase.co”;
const supabaseAnonKey = “eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhob3BzcGVka2JpZHpyZmZncXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzUxODgsImV4cCI6MjA4ODA1MTE4OH0.sUD3cgteOBJ9vpOr5lgXYmauE1P-BtaaqHP_DL4nZBk”;
const supabase        = createClient(supabaseUrl, supabaseAnonKey);

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = “moneymind_user_data”; // Single key — matches roast/app.js

const TOOL_PATHS = {
capitalMap:        “/tools/capital-map/index.html”,
spendingVsBuilding: “/tools/spending-vs-building/index.html”,
leakage:           “/tools/leakage/index.html”,
builder:           “/tools/builder/index.html”,
academy:           “/apps/academy/index.html”,
roast:             “/tools/roast/index.html”
};

const AI_MODEL = “claude-sonnet-4-20250514”;

// ─── Storage ──────────────────────────────────────────────────────────────────

function readUserData() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
const data = raw ? JSON.parse(raw) : {};

```
// Ensure all tool slots exist
data.roast             = data.roast             || { completed: false };
data.capitalMap        = data.capitalMap        || { completed: false, updatedAt: null };
data.spendingVsBuilding = data.spendingVsBuilding || { completed: false, updatedAt: null };
data.leakage           = data.leakage           || { completed: false, updatedAt: null };
data.builder           = data.builder           || { completed: false, updatedAt: null };

return data;
```

} catch (err) {
console.warn(“Could not read user data from localStorage.”, err);
return {};
}
}

function writeUserData(data) {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
} catch (err) {
console.warn(“Could not write user data to localStorage.”, err);
}
}

// ─── Formatting ───────────────────────────────────────────────────────────────

function formatEuro(value) {
return new Intl.NumberFormat(“nl-NL”, {
style: “currency”,
currency: “EUR”,
maximumFractionDigits: 0
}).format(Number(value) || 0);
}

// ─── Dashboard data layer ─────────────────────────────────────────────────────

function getCompletedCount(userData) {
return [
userData.roast?.completed,
userData.capitalMap?.completed,
userData.spendingVsBuilding?.completed,
userData.leakage?.completed,
userData.builder?.completed
].filter(Boolean).length;
}

function getClarityStage(count) {
if (count <= 1) return { level: 12, label: “Awareness stage • Your first financial pattern is visible” };
if (count === 2) return { level: 22, label: “Structure stage • You are moving from signal to understanding” };
if (count === 3) return { level: 34, label: “Control stage • Your financial weak spots are getting clearer” };
if (count === 4) return { level: 48, label: “Builder stage • You are turning clarity into action” };
return                  { level: 60, label: “Momentum stage • Your system is becoming intentional” };
}

function getNextStep(userData) {
if (!userData.capitalMap?.completed) return {
key: “capitalMap”, path: TOOL_PATHS.capitalMap,
title: “Map your capital structure”,
description: “Before optimizing anything else, understand what is directly usable, accessible, and locked.”,
miniLabel: “Priority”, miniValue: “Capital clarity”,
footer: “Start here first. You need structure before optimization.”
};

if (!userData.spendingVsBuilding?.completed) return {
key: “spendingVsBuilding”, path: TOOL_PATHS.spendingVsBuilding,
title: “Check your Spending vs Building ratio”,
description: “The next weak point is whether your income is actually converting into long-term capital.”,
miniLabel: “Priority”, miniValue: “Income conversion”,
footer: “This tells you whether your monthly flow is building wealth or just funding life.”
};

if (!userData.leakage?.completed) return {
key: “leakage”, path: TOOL_PATHS.leakage,
title: “Run your Leakage Check”,
description: “Some spending is fine. Some spending quietly blocks future wealth. You need to know the difference.”,
miniLabel: “Priority”, miniValue: “Leakage review”,
footer: “Do this after your monthly flow is visible.”
};

if (!userData.builder?.completed) return {
key: “builder”, path: TOOL_PATHS.builder,
title: “Build your first wealth plan”,
description: “You have enough signal now. Time to turn clarity into a direction you can actually build on.”,
miniLabel: “Priority”, miniValue: “Wealth direction”,
footer: “Move from diagnosis into design.”
};

return {
key: “builder”, path: TOOL_PATHS.builder,
title: “Refine your wealth plan”,
description: “Your core tools are completed. The next step is improving consistency and tightening your system.”,
miniLabel: “Status”, miniValue: “Core path done”,
footer: “You are no longer guessing. Now improve the quality of your decisions.”
};
}

function buildDashboardData(userData) {
const roast   = userData.roast || {};
const count   = getCompletedCount(userData);
const clarity = getClarityStage(count);
const next    = getNextStep(userData);

return {
roastCompleted:   !!roast.completed,
headline:         roast.headline      || “”,
observation:      roast.observation   || “”,
profileName:      roast.profile?.name || “”,
behaviorTitle:    roast.behavior?.title || “”,
behaviorText:     roast.behavior?.text  || “”,
incomeText:       roast.incomeText     || “Unknown”,
investText:       roast.investText     || “Unknown”,
investRateText:   roast.investRateText || “Unknown”,
dashboardFocus:   roast.dashboardFocus || “clarity”,
currentWealth:    Number(roast.trajectory?.currentWealth    || 0),
optimizedWealth:  Number(roast.trajectory?.optimizedWealth  || 0),
wealthDifference: Number(roast.trajectory?.wealthDifference || 0),
completedCount:   count,
clarity,
nextStep: next,
statuses: {
roast:             roast.completed                    ? “Completed” : “Missing”,
capitalMap:        userData.capitalMap?.completed      ? “Completed” : “Recommended next”,
spendingVsBuilding: userData.spendingVsBuilding?.completed ? “Completed” : “Not started”,
leakage:           userData.leakage?.completed         ? “Completed” : “Not started”,
builder:           userData.builder?.completed         ? “Completed” : “Not started”
}
};
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────
// IDs are preferred over fragile nth-child selectors.
// Where IDs don’t exist yet, we use stable semantic selectors.

function setText(id, text) {
const el = document.getElementById(id);
if (el) el.textContent = text;
}

function setHref(id, href) {
const el = document.getElementById(id);
if (el) el.setAttribute(“href”, href);
}

function getStatusClass(label) {
if (label === “Completed”)        return “ok”;
if (label === “Recommended next”) return “warn”;
return “bad”;
}

// ─── Render functions ─────────────────────────────────────────────────────────

function renderHero(data) {
const titleEl = document.querySelector(”.hero h2”);
const textEl  = document.querySelector(”.hero p”);
if (!titleEl || !textEl) return;

if (!data.roastCompleted) {
titleEl.textContent = “Start with your Financial Roast.”;
textEl.textContent  = “Your dashboard becomes useful after your first MoneyMind signal. Start with the Roast to unlock direction.”;
return;
}

titleEl.textContent = “Your first financial pattern is visible. What you do next matters.”;
textEl.textContent  = data.observation || “The Roast exposed your first weak spots. This dashboard helps turn that signal into action.”;
}

function renderWealthSnapshot(userData) {
const netWorthEl    = document.querySelector(”.big-number”);
const netWorthSubEl = document.querySelector(”.big-number + .sub”);
const insightBoxEl  = document.querySelector(”.grid.grid-2 .card:first-child .insight-box”);
const miniValues    = Array.from(document.querySelectorAll(”.snapshot-grid .mini-value”));

if (!netWorthEl) return;

if (!userData.capitalMap?.completed) {
netWorthEl.textContent           = “Not mapped yet”;
if (netWorthSubEl) netWorthSubEl.textContent = “Capital structure”;
if (miniValues[0]) miniValues[0].textContent = “Unknown”;
if (miniValues[1]) miniValues[1].textContent = “Unknown”;
if (miniValues[2]) miniValues[2].textContent = “Unknown”;
if (insightBoxEl)  insightBoxEl.textContent  = “Map your capital structure first. Before optimizing returns, understand what is usable, accessible, and locked.”;
return;
}

const direct     = Number(userData.capitalMap.directCapital     || 0);
const accessible = Number(userData.capitalMap.accessibleCapital || 0);
const locked     = Number(userData.capitalMap.lockedCapital     || 0);
const net        = direct + accessible + locked;

netWorthEl.textContent           = formatEuro(net);
if (netWorthSubEl) netWorthSubEl.textContent = “Net worth”;
if (miniValues[0]) miniValues[0].textContent = formatEuro(direct);
if (miniValues[1]) miniValues[1].textContent = formatEuro(accessible);
if (miniValues[2]) miniValues[2].textContent = formatEuro(locked);
if (insightBoxEl) {
insightBoxEl.textContent = locked > direct
? “Too much of your wealth is still tied up. That limits flexibility and speed when opportunities show up.”
: “Your capital structure is improving. The next question is whether your monthly behavior is reinforcing it.”;
}
}

function renderNextMove(data) {
const next       = data.nextStep;
const card       = document.querySelector(”.grid.grid-2 .card:nth-child(2)”);
if (!card) return;

const headingEl  = card.querySelector(“h3”);
const subEl      = card.querySelector(”.sub”);
const miniLabel  = card.querySelector(”.mini-label”);
const miniValue  = card.querySelector(”.mini-value”);
const btn        = card.querySelector(”.button”);
const footerEl   = card.querySelector(”.sub.mt-8”);

if (!data.roastCompleted) {
if (headingEl) headingEl.textContent = “Start your Financial Roast”;
if (subEl)     subEl.textContent     = “Your dashboard becomes useful after your first MoneyMind signal.”;
if (miniLabel) miniLabel.textContent = “Status”;
if (miniValue) miniValue.textContent = “Not started”;
if (btn)       { btn.textContent = “Start Roast”; btn.setAttribute(“href”, TOOL_PATHS.roast); }
if (footerEl)  footerEl.textContent  = “The Roast is the entry point. Everything else becomes smarter after that.”;
return;
}

if (headingEl) headingEl.textContent = next.title;
if (subEl)     subEl.textContent     = next.description;
if (miniLabel) miniLabel.textContent = next.miniLabel;
if (miniValue) miniValue.textContent = next.miniValue;
if (btn)       { btn.textContent = next.title; btn.setAttribute(“href”, next.path); }
if (footerEl)  footerEl.textContent  = next.footer;

// Sync AI next step button
const aiNextBtn = document.querySelector(”#ai-insight-card .button.secondary”);
if (aiNextBtn) { aiNextBtn.textContent = “Go to Next Step”; aiNextBtn.setAttribute(“href”, next.path); }
}

function renderAttention(userData) {
const items = [
!userData.capitalMap?.completed
? { title: “Your capital structure is still unknown.”, sub: “You may be making decisions without knowing what is usable, accessible, or locked.” }
: { title: “Your capital structure is now visible.”, sub: “The next question is whether your monthly behavior is reinforcing it.” },

```
!userData.spendingVsBuilding?.completed
  ? { title: "Income is not yet linked to enough capital building.", sub: "Earning is one thing. Converting income into assets is where progress really starts." }
  : { title: "Your monthly flow is now more visible.", sub: "The next weak spot is whether hidden leakage is slowing your wealth formation." },

!userData.leakage?.completed
  ? { title: "Leakage still needs a proper check.", sub: "Not all spending is a problem. But some of it may still be disappearing without future value." }
  : { title: "Leakage has been reviewed.", sub: "That gives you a cleaner base to build with more intention." }
```

];

const titleEls = Array.from(document.querySelectorAll(”.attention-list .attention-title”));
const subEls   = Array.from(document.querySelectorAll(”.attention-list .sub”));

items.forEach((item, i) => {
if (titleEls[i]) titleEls[i].textContent = item.title;
if (subEls[i])   subEls[i].textContent   = item.sub;
});
}

function renderMaintenance(data) {
const rows = Array.from(document.querySelectorAll(”.maintenance-row”));
const map  = [
[“Roast”,               data.statuses.roast],
[“Capital Map”,         data.statuses.capitalMap],
[“Spending vs Building”, data.statuses.spendingVsBuilding],
[“Leakage”,             data.statuses.leakage]
];

rows.forEach((row, i) => {
const config = map[i];
if (!config) return;
const spans = row.querySelectorAll(“span”);
if (spans[0]) spans[0].textContent = config[0];
if (spans[1]) { spans[1].textContent = config[1]; spans[1].className = `tag ${getStatusClass(config[1])}`; }
});
}

function renderProgress(data) {
const levelEl   = document.querySelector(”.progress-level”);
const subEl     = document.querySelector(”.progress-level + .sub”);
const insightEl = document.querySelector(”.footer-grid .card:last-child .insight-box”);

if (levelEl)   levelEl.textContent = String(data.clarity.level);
if (subEl)     subEl.textContent   = data.clarity.label;
if (insightEl) {
insightEl.textContent = data.completedCount <= 1
? “You are no longer guessing. The next step is turning your first signal into financial structure.”
: data.completedCount === 2
? “You are building real clarity now. Keep removing friction and weak spots one by one.”
: “Your financial system is becoming more intentional. The next step is consistency and better decisions over time.”;
}
}

// ─── Market Pulse ─────────────────────────────────────────────────────────────

async function fetchMarketPulse() {
const btcEl = document.getElementById(“btc-eur-value”);
const fxEl  = document.getElementById(“eur-usd-value”);

try {
const res  = await fetch(“https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur,usd”);
if (!res.ok) throw new Error(`Status ${res.status}`);
const data = await res.json();

```
const btcEur = data?.bitcoin?.eur;
const btcUsd = data?.bitcoin?.usd;

if (btcEl) btcEl.textContent = typeof btcEur === "number" ? `€${btcEur.toLocaleString("nl-NL")}` : "Unavailable";
if (fxEl && typeof btcEur === "number" && typeof btcUsd === "number" && btcEur !== 0) {
  fxEl.textContent = (btcUsd / btcEur).toFixed(4);
} else if (fxEl) {
  fxEl.textContent = "Unavailable";
}
```

} catch (err) {
console.warn(“Market pulse fetch failed:”, err);
if (btcEl) btcEl.textContent = “Unavailable”;
if (fxEl)  fxEl.textContent  = “Unavailable”;
}
}

// ─── AI Insight — direct Anthropic API call ───────────────────────────────────
// No backend route needed. Calls Anthropic directly from the browser.

function buildAIPrompt(data) {
const roast = data.roastCompleted
? `Profile: ${data.profileName}. Headline: "${data.headline}". Behavior: ${data.behaviorTitle}. Income: ${data.incomeText}. Investing: ${data.investText} (${data.investRateText}). Current wealth trajectory: ${formatEuro(data.currentWealth)}. Optimized: ${formatEuro(data.optimizedWealth)}. Difference: ${formatEuro(data.wealthDifference)}.`
: “No Roast completed yet.”;

return `You are a financial clarity engine for MoneyMind. Your job is to interpret this user’s financial situation clearly and honestly — no hype, no fake urgency, no advice.

User data:

- Roast: ${roast}
- Tools completed: ${data.completedCount} of 5
- Clarity level: ${data.clarity.level} (${data.clarity.label})
- Next recommended step: ${data.nextStep.title}
- Dashboard focus: ${data.dashboardFocus}

Respond ONLY with a JSON object. No preamble, no markdown, no backticks. Exact structure:
{
“title”: “short pattern title (max 8 words)”,
“whatYouSee”: “1-2 sentences describing what the numbers show”,
“whyItMatters”: “1-2 sentences on why this pattern matters for wealth building”,
“thinkAbout”: “1 honest reflection question or observation”,
“nextStep”: “1 concrete sentence on what to do next”
}`;
}

function setAIState(state) {
const btn       = document.getElementById(“generate-ai-insight-btn”);
const loadingEl = document.getElementById(“ai-loading”);
const titleEl   = document.getElementById(“ai-insight-title”);

const states = {
idle: {
btnText: “Analyze My Situation”, btnDisabled: false,
loading: true, title: null
},
loading: {
btnText: “Analyzing…”, btnDisabled: true,
loading: false, title: “Analyzing your financial pattern…”
},
error: {
btnText: “Analyze My Situation”, btnDisabled: false,
loading: true, title: “AI insight unavailable”
}
};

const s = states[state] || states.idle;
if (btn)       { btn.textContent = s.btnText; btn.disabled = s.btnDisabled; }
if (loadingEl) loadingEl.hidden = s.loading;
if (titleEl && s.title) titleEl.textContent = s.title;
}

function renderAIResult(result) {
setAIState(“idle”);

setText(“ai-insight-title”, result.title        || “Your financial pattern”);
setText(“ai-what-you-see”,  result.whatYouSee   || “No insight returned.”);
setText(“ai-why-it-matters”, result.whyItMatters || “No impact explanation returned.”);
setText(“ai-think-about”,   result.thinkAbout   || “No reflection returned.”);
setText(“ai-next-step”,     result.nextStep      || “Bring clarity to your monthly flow first.”);
}

function renderAIError() {
setAIState(“error”);
setText(“ai-what-you-see”,   “We could not generate your insight right now.”);
setText(“ai-why-it-matters”, “The AI connection may be unavailable. Try again in a moment.”);
setText(“ai-think-about”,    “Check your connection and try again.”);
setText(“ai-next-step”,      “Unable to determine your next step right now.”);
}

async function handleAIClick() {
const userData = readUserData();
const data     = buildDashboardData(userData);

setAIState(“loading”);

try {
const response = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({
model:      AI_MODEL,
max_tokens: 1000,
messages:   [{ role: “user”, content: buildAIPrompt(data) }]
})
});

```
if (!response.ok) throw new Error(`Anthropic API status ${response.status}`);

const json   = await response.json();
const raw    = json.content?.map(b => b.text || "").join("") || "";
const clean  = raw.replace(/```json|```/g, "").trim();
const result = JSON.parse(clean);

renderAIResult(result);

// Persist AI insight
const updatedData = readUserData();
updatedData.ai = { lastInsight: result, lastUpdated: new Date().toISOString() };
writeUserData(updatedData);
```

} catch (err) {
console.error(“AI insight error:”, err);
renderAIError();
}
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
const userData = readUserData();
const data     = buildDashboardData(userData);

renderHero(data);
renderWealthSnapshot(userData);
renderNextMove(data);
renderAttention(userData);
renderMaintenance(data);
renderProgress(data);

const aiBtn = document.getElementById(“generate-ai-insight-btn”);
if (aiBtn) aiBtn.addEventListener(“click”, handleAIClick);

fetchMarketPulse();

// Supabase: dormant until backend is wired up.
// Uncomment when you have real data to read/write:
// testSupabaseConnection();
}

init();
