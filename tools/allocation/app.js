document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calcBtn");
  if (!calcBtn) {
    alert("calcBtn not found ❌");
    return;
  }
  calcBtn.addEventListener("click", () => {
    alert("calcBtn click works ✅");
  });

/ ===== Helpers =====
const $ = (id) => document.getElementById(id);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const n = (v) => (Number.isFinite(v) ? v : 0);
const valNum = (el) => n(parseFloat(el?.value || "0"));

const pct = (x) => `${Math.round(x)}%`;
const fmtEUR = (x) =>
  Math.max(0, x).toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

function annuityFV(pmt, annualRate, years) {
  const r = annualRate / 12;
  const m = years * 12;
  if (pmt <= 0) return 0;
  if (r === 0) return pmt * m;
  return pmt * ((Math.pow(1 + r, m) - 1) / r);
}

// ===== Elements =====
const incomeEl = $("income");
const fixedEl = $("fixed");
const wealthEl = $("wealth");

const leak1El = $("leak1");
const leak2El = $("leak2");
const leak3El = $("leak3");

const rSlider = $("rSlider");
const rLabel = $("rLabel");

const calcBtn = $("calcBtn");

const result = $("result");
const silentLeak = $("silentLeak");

const wealthPctEl = $("wealthPct");
const fixedPctEl = $("fixedPct");
const restPctEl = $("restPct");

const impact20El = $("impact20");
const impact10El = $("impact10");
const shiftLineEl = $("shiftLine");

const premiumCard = $("premiumCard");
const trialBtn = $("trialBtn");
const premiumLayer = $("premiumLayer");

const benchText = $("benchText");
const scoreText = $("scoreText");
const targetPctEl = $("targetPct");
const targetOut = $("targetOut");

// ===== Defensive: element check =====
const requiredIds = [
  "income","fixed","wealth","calcBtn","result","silentLeak",
  "wealthPct","fixedPct","restPct","leak1","leak2","leak3",
  "rSlider","rLabel","impact20","impact10","shiftLine",
  "premiumCard","trialBtn","premiumLayer","benchText","scoreText","targetPct","targetOut"
];

const missing = requiredIds.filter(id => !$(id));
if (missing.length) {
  console.error("Missing required element IDs:", missing);
}

// ===== Trial =====
const TRIAL_KEY = "mm_capAlloc_trialStart";
const TRIAL_MS = 7 * 24 * 60 * 60 * 1000;

function isTrialActive() {
  const t = Number(localStorage.getItem(TRIAL_KEY) || "0");
  return t > 0 && Date.now() - t < TRIAL_MS;
}

function startTrial() {
  localStorage.setItem(TRIAL_KEY, String(Date.now()));
}

// ===== State =====
let state = {
  income: 0,
  fixed: 0,
  wealth: 0,
  leak: 0,
  r: 0.06,
};

// ===== Premium logic =====
function profileBenchmark(wealthPct) {
  // MVP simple ranges; later tie to onboarding profile
  if (wealthPct < 10) return { low: 20, high: 30, label: "Builder zone" };
  if (wealthPct < 20) return { low: 22, high: 35, label: "Wealth builder zone" };
  if (wealthPct < 35) return { low: 25, high: 40, label: "Strong builder zone" };
  return { low: 30, high: 45, label: "Strategic zone" };
}

function allocationScore(wealthPct) {
  const score = clamp(wealthPct * 3, 0, 100);
  let band = "Developing";
  if (score < 40) band = "Fragile";
  else if (score < 60) band = "Developing";
  else if (score < 80) band = "Structured";
  else band = "Strategic";
  return { score: Math.round(score), band };
}

function refreshPremiumIfUnlocked() {
  if (!state.income || state.income <= 0) return;

  if (!isTrialActive()) {
    premiumLayer.classList.add("mm-hidden");
    return;
  }

  premiumLayer.classList.remove("mm-hidden");

  const wPct = clamp((state.wealth / state.income) * 100, 0, 100);

  const bench = profileBenchmark(wPct);
  const gap = Math.round(wPct - bench.low);

  benchText.textContent =
    `Typical ${bench.label}: ${bench.low}–${bench.high}% wealth allocation.\n` +
    `You: ${Math.round(wPct)}% (${gap >= 0 ? "+" : ""}${gap}% vs lower bound).`;

  const sc = allocationScore(wPct);
  scoreText.textContent = `Score: ${sc.score}/100 • Status: ${sc.band}`;

  // Target simulator
  const targetPct = clamp(valNum(targetPctEl), 5, 80);
  const targetMonthly = (state.income * targetPct) / 100;
  const fv20 = annuityFV(targetMonthly, state.r, 20);

  targetOut.textContent =
    `At ${Math.round(targetPct)}% allocation → ${fmtEUR(targetMonthly)}/month → ${fmtEUR(fv20)} in 20 years (at ${rSlider.value}%).`;
}

// ===== Core calc =====
function calcCore() {
  state.income = valNum(incomeEl);
  state.fixed = valNum(fixedEl);
  state.wealth = valNum(wealthEl);

  if (state.income <= 0) {
    alert("Enter a monthly net income above 0.");
    return;
  }

  const wealthPct = clamp((state.wealth / state.income) * 100, 0, 100);
  const fixedPct = clamp((state.fixed / state.income) * 100, 0, 100);
  const restPct = clamp(100 - wealthPct - fixedPct, 0, 100);

  wealthPctEl.textContent = pct(wealthPct);
  fixedPctEl.textContent = pct(fixedPct);
  restPctEl.textContent = pct(restPct);

  result.classList.remove("mm-hidden");
  silentLeak.classList.remove("mm-hidden");
  premiumCard.classList.remove("mm-hidden");

  calcLeakImpact();
  refreshPremiumIfUnlocked();
}

// ===== Leak impact =====
function calcLeakImpact() {
  state.leak = valNum(leak1El) + valNum(leak2El) + valNum(leak3El);
  state.r = parseFloat(rSlider.value) / 100;
  rLabel.textContent = rSlider.value;

  const fv20 = annuityFV(state.leak, state.r, 20);
  const fv10 = annuityFV(state.leak, state.r, 10);

  impact20El.textContent = `Redirecting ${fmtEUR(state.leak)}/month → ${fmtEUR(fv20)} in 20 years`;
  impact10El.textContent = `10-year impact: ${fmtEUR(fv10)}`;

  if (state.income > 0) {
    const oldPct = clamp((state.wealth / state.income) * 100, 0, 100);
    const newPct = clamp(((state.wealth + state.leak) / state.income) * 100, 0, 100);
    shiftLineEl.textContent = `Wealth allocation increases from ${pct(oldPct)} to ${pct(newPct)}.`;
  } else {
    shiftLineEl.textContent = `Wealth allocation increases from —% to —%.`;
  }

  refreshPremiumIfUnlocked();
}

// ===== Events =====
calcBtn.addEventListener("click", calcCore);

[incomeEl, fixedEl, wealthEl, leak1El, leak2El, leak3El, rSlider].forEach((el) => {
  el.addEventListener("input", () => {
    // Only live-update after first calculation (when result is visible)
    if (!result.classList.contains("mm-hidden")) {
      // refresh core + update metrics
      state.income = valNum(incomeEl);
      state.fixed = valNum(fixedEl);
      state.wealth = valNum(wealthEl);

      if (state.income > 0) {
        const wealthPct = clamp((state.wealth / state.income) * 100, 0, 100);
        const fixedPct = clamp((state.fixed / state.income) * 100, 0, 100);
        const restPct = clamp(100 - wealthPct - fixedPct, 0, 100);

        wealthPctEl.textContent = pct(wealthPct);
        fixedPctEl.textContent = pct(fixedPct);
        restPctEl.textContent = pct(restPct);
      } else {
        wealthPctEl.textContent = "—%";
        fixedPctEl.textContent = "—%";
        restPctEl.textContent = "—%";
      }

      calcLeakImpact();
    }
  });
});

trialBtn.addEventListener("click", () => {
  startTrial();
  refreshPremiumIfUnlocked();
});

targetPctEl.addEventListener("input", refreshPremiumIfUnlocked);

// Note: If trial is active, premium will appear after user runs first calculation.
