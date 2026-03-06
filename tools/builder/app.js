function mmShowError(msg) {
  const box = document.getElementById("mmErrorBox");
  if (!box) { alert(msg); return; }
  box.style.display = "block";
  box.textContent = "MoneyMind error:\n" + msg;
}

window.addEventListener("error", (e) => {
  mmShowError(e.error?.stack || e.message);
});

document.addEventListener("DOMContentLoaded", () => {

  // ===== MoneyMind Wealth Builder Engine (MVP v1) - Full JS Replacement =====

// ---------- Helpers ----------
const HUB_URL = "https://codepen.io/PPHaagie/full/yyaBgxr";
function $(id) {
  return document.getElementById(id);
}

function toNumber(id) {
  const el = $(id);
  const v = Number(el?.value);
  return Number.isFinite(v) ? v : 0;
}

function monthlyRateFromAnnualPercent(pct) {
  const r = pct / 100;
  return Math.pow(1 + r, 1 / 12) - 1;
}

function formatEUR(amount) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatEURCompact(amount) {
  // €100K / €1M style (nl-NL uses "K" and "mln" sometimes; still compact & readable)
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  }).format(amount);
}

function inflationAdjust(value, annualInflationPct, years) {
  if (!annualInflationPct || annualInflationPct === 0) return value;
  const infl = annualInflationPct / 100;
  return value / Math.pow(1 + infl, years);
}

function monthToYears(m) {
  return m / 12;
}

// ---------- Core simulation (monthly) ----------
function simulatePath({ initial, monthly, months, monthlyReturn, monthlyFee }) {
  let balance = Math.max(0, initial);
  let contributed = Math.max(0, initial);
  const series = [balance]; // month 0

  for (let m = 1; m <= months; m++) {
    // contribute at start of month
    balance += monthly;
    contributed += monthly;

    // growth
    balance *= (1 + monthlyReturn);

    // fee drag on assets
    balance *= (1 - monthlyFee);

    series.push(balance);
  }

  return { end: balance, contributed, series };
}

function findMonthWhenCrossing(series, target) {
  if (target <= 0) return 0;
  for (let i = 0; i < series.length; i++) {
    if (series[i] >= target) return i;
  }
  return null; // not reached
}

const MILESTONES = [100000, 250000, 500000, 1000000];

// ---------- Canvas chart (bulletproof) ----------
function drawChart({ withFee, noFee, milestones }) {
  const canvas = $("chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  // Fallback sizes so it never becomes 0-width/0-height
  const cssW = Math.max(360, Math.floor(rect.width));
  const cssH = Math.max(220, Math.floor(rect.height || 220));

  const dpr = window.devicePixelRatio || 1;

  // Set actual pixel buffer size
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);

  // Reset transform and scale once
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  // Clear in CSS pixels
  ctx.clearRect(0, 0, cssW, cssH);

  const w = cssW;
  const h = cssH;

  // ✅ Fix: more room on the left + smaller font for labels
  const padding = { left: 88, right: 16, top: 14, bottom: 32 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  // Guard
  const maxLen = Math.max(withFee.length, noFee.length);
  if (maxLen < 2) return;

  // Determine maxY
  const maxSeries = Math.max(
    ...withFee,
    ...noFee,
    ...milestones.map(m => m * 1.02)
  );

  const minY = 0;
  const maxY = Math.max(1, maxSeries);
  const maxX = maxLen - 1;

  function xScale(i) {
    return padding.left + (i / maxX) * plotW;
  }

  function yScale(v) {
    const t = (v - minY) / (maxY - minY || 1);
    return padding.top + (1 - t) * plotH;
  }

  // Background grid (Y)
  const yTicks = 4;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(233,238,252,0.08)";
  ctx.fillStyle = "rgba(233,238,252,0.62)";
  ctx.font = "10px ui-sans-serif, system-ui"; // ✅ smaller labels
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let t = 0; t <= yTicks; t++) {
    const val = (maxY / yTicks) * t;
    const y = yScale(val);

    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    // Y-axis labels (compact)
    ctx.fillText(formatEURCompact(val), padding.left - 10, y);
  }

  // X-axis baseline
  ctx.strokeStyle = "rgba(233,238,252,0.18)";
  ctx.beginPath();
  ctx.moveTo(padding.left, h - padding.bottom);
  ctx.lineTo(w - padding.right, h - padding.bottom);
  ctx.stroke();

  // X-axis labels (years)
  ctx.fillStyle = "rgba(233,238,252,0.55)";
  ctx.font = "11px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const step = Math.max(12, Math.floor(maxX / 6)); // about 6 labels
  for (let i = 0; i <= maxX; i += step) {
    const x = xScale(i);
    const years = Math.round(i / 12);
    ctx.fillText(`${years}y`, x, h - padding.bottom + 6);
  }

  // Milestone lines
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(132,255,199,0.18)";
  milestones.forEach(m => {
    const y = yScale(m);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Draw series lines
  function drawLine(data, strokeStyle) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = xScale(i);
      const y = yScale(data[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Without fee (blue-ish) and with fee (green-ish)
  drawLine(noFee, "rgba(122,162,255,0.95)");
  drawLine(withFee, "rgba(132,255,199,0.95)");

  // Legend
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  // "Zonder fee"
  ctx.fillStyle = "rgba(122,162,255,0.95)";
  ctx.fillRect(padding.left, padding.top + 2, 14, 3);
  ctx.fillStyle = "rgba(233,238,252,0.82)";
  ctx.fillText("Zonder fee", padding.left + 20, padding.top + 4);

  // "Met fee"
  ctx.fillStyle = "rgba(132,255,199,0.95)";
  ctx.fillRect(padding.left + 110, padding.top + 2, 14, 3);
  ctx.fillStyle = "rgba(233,238,252,0.82)";
  ctx.fillText("Met fee", padding.left + 130, padding.top + 4);
}

// ---------- Calculation ----------
function calculate() {
  // Inputs
  const initial = Math.max(0, toNumber("initial"));
  const monthly = Math.max(0, toNumber("monthly"));
  const years = Math.max(1, Math.floor(toNumber("years")));
  const returnRate = toNumber("returnRate");
  const feeRate = Math.max(0, toNumber("feeRate"));
  const inflationRate = Math.max(0, toNumber("inflationRate"));

  const wealthGoal = Math.max(0, toNumber("wealthGoal"));
  const incomeGoal = Math.max(0, toNumber("incomeGoal"));
  const yieldRate = Math.max(0, toNumber("yieldRate"));

  const months = years * 12;

  const monthlyReturn = monthlyRateFromAnnualPercent(returnRate);
  const monthlyFee = monthlyRateFromAnnualPercent(feeRate);

  // Paths
  const noFee = simulatePath({ initial, monthly, months, monthlyReturn, monthlyFee: 0 });
  const withFee = simulatePath({ initial, monthly, months, monthlyReturn, monthlyFee });

  // End values + inflation adjusted
  const endWithFeeReal = inflationAdjust(withFee.end, inflationRate, years);
  const endNoFeeReal = inflationAdjust(noFee.end, inflationRate, years);

  // Update end boxes
  $("endWithFee").textContent = formatEUR(withFee.end);
  $("endNoFee").textContent = formatEUR(noFee.end);

  $("endWithFeeReal").textContent =
    inflationRate > 0 ? `Koopkracht vandaag: ${formatEUR(endWithFeeReal)}` : "Koopkracht vandaag: — (inflatie = 0)";
  $("endNoFeeReal").textContent =
    inflationRate > 0 ? `Koopkracht vandaag: ${formatEUR(endNoFeeReal)}` : "Koopkracht vandaag: — (inflatie = 0)";

  // Wealth goal ETA (use with-fee path)
  if (wealthGoal === 0) {
    $("yearsToWealth").textContent = "—";
    $("wealthGoalNote").textContent = "Geen vermogensdoel ingevuld.";
  } else {
    const mWealth = findMonthWhenCrossing(withFee.series, wealthGoal);
    if (mWealth === null) {
      $("yearsToWealth").textContent = "Niet gehaald";
      $("wealthGoalNote").textContent = `Binnen ${years} jaar kom je uit op ${formatEUR(withFee.end)}.`;
    } else {
      const y = monthToYears(mWealth);
      $("yearsToWealth").textContent = `${y.toFixed(1)} jaar`;
      $("wealthGoalNote").textContent = `Doel: ${formatEUR(wealthGoal)} • bereikt rond maand ${mWealth}.`;
    }
  }

  // Financial freedom (income goal -> required capital based on yield %)
  if (incomeGoal === 0) {
    $("yearsToFreedom").textContent = "—";
    $("freedomNote").textContent = "Geen income doel ingevuld.";
  } else if (yieldRate <= 0) {
    $("yearsToFreedom").textContent = "—";
    $("freedomNote").textContent = "Yield moet > 0% zijn.";
  } else {
    const requiredCapital = (incomeGoal * 12) / (yieldRate / 100);
    const mFreedom = findMonthWhenCrossing(withFee.series, requiredCapital);

    if (mFreedom === null) {
      $("yearsToFreedom").textContent = "Niet gehaald";
      $("freedomNote").textContent =
        `Benodigd: ${formatEUR(requiredCapital)} (bij ${yieldRate}% yield). Eind: ${formatEUR(withFee.end)}.`;
    } else {
      const y = monthToYears(mFreedom);
      const now = new Date();
      const freedomDate = new Date(now.getFullYear(), now.getMonth() + mFreedom, 1);
      const monthNames = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

      $("yearsToFreedom").textContent = `${y.toFixed(1)} jaar`;
      $("freedomNote").textContent =
        `Benodigd: ${formatEUR(requiredCapital)} • vrijheid rond ~${monthNames[freedomDate.getMonth()]} ${freedomDate.getFullYear()} (bij ${yieldRate}% yield).`;
    }
  }

  // Next milestone based on withFee end
  let next = null;
  for (const m of MILESTONES) {
    if (withFee.end < m) { next = m; break; }
  }
  $("milestoneNext").textContent = next ? `Volgende milestone: ${formatEUR(next)}` : "Volgende milestone: €1M+ (lekker bezig)";

  // Draw chart
  drawChart({
    withFee: withFee.series,
    noFee: noFee.series,
    milestones: MILESTONES
  });
}

// ---------- Reset ----------
function resetForm() {
  $("initial").value = 10000;
  $("monthly").value = 500;
  $("years").value = 30;
  $("returnRate").value = 7;
  $("feeRate").value = 0.6;
  $("inflationRate").value = 0;
  $("wealthGoal").value = 500000;
  $("incomeGoal").value = 2000;
  $("yieldRate").value = 4;

  // Clear UI quickly (optional)
  $("endWithFee").textContent = "—";
  $("endNoFee").textContent = "—";
  $("endWithFeeReal").textContent = "—";
  $("endNoFeeReal").textContent = "—";
  $("yearsToWealth").textContent = "—";
  $("wealthGoalNote").textContent = "—";
  $("yearsToFreedom").textContent = "—";
  $("freedomNote").textContent = "—";
  $("milestoneNext").textContent = "Volgende milestone: —";

  calculate();
}

// ---------- Wire up ----------
$("calculateBtn")?.addEventListener("click", calculate);
$("resetBtn")?.addEventListener("click", resetForm);

// Redraw on resize (chart needs new dimensions)
window.addEventListener("resize", () => calculate());

// Run once on load
calculate();
const backBtn = document.getElementById("backToHub");
if(backBtn){
  backBtn.addEventListener("click", () => {
    location.href = HUB_URL;
  });
}


});
