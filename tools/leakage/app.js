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

  function toNumber(id) {
  const el = document.getElementById(id);
  const v = Number(el.value);
  return Number.isFinite(v) ? v : 0;
}

function formatEUR(amount) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(amount);
}

function monthlyRateFromAnnualPercent(pct) {
  const r = pct / 100;
  return Math.pow(1 + r, 1 / 12) - 1;
}

function simulate({ initial, monthly, months, monthlyReturn, monthlyFee }) {
  let balance = initial;
  let contributed = initial;

  for (let m = 0; m < months; m++) {
    // bijdrage aan begin van de maand (simpel & consistent)
    balance += monthly;
    contributed += monthly;

    // groei
    balance *= (1 + monthlyReturn);

    // fee (op de assets)
    balance *= (1 - monthlyFee);
  }

  return { balance, contributed };
}

function inflationAdjust(value, annualInflationPct, years) {
  if (!annualInflationPct || annualInflationPct === 0) return value;
  const infl = annualInflationPct / 100;
  return value / Math.pow(1 + infl, years);
}

function calculate() {
  const initial = Math.max(0, toNumber("initial"));
  const monthly = Math.max(0, toNumber("monthly"));
  const years = Math.max(1, Math.floor(toNumber("years")));
  const returnRate = toNumber("returnRate");
  const feeRate = Math.max(0, toNumber("feeRate"));
  const inflationRate = Math.max(0, toNumber("inflationRate"));

  const months = years * 12;

  const monthlyReturn = monthlyRateFromAnnualPercent(returnRate);
  const monthlyFee = monthlyRateFromAnnualPercent(feeRate);

  // Zonder fee
  const noFee = simulate({
    initial,
    monthly,
    months,
    monthlyReturn,
    monthlyFee: 0
  });

  // Met fee
  const withFee = simulate({
    initial,
    monthly,
    months,
    monthlyReturn,
    monthlyFee
  });

  const noFeeAdj = inflationAdjust(noFee.balance, inflationRate, years);
  const withFeeAdj = inflationAdjust(withFee.balance, inflationRate, years);

  const leakage = Math.max(0, noFeeAdj - withFeeAdj);
  const leakagePct = noFeeAdj > 0 ? (leakage / noFeeAdj) * 100 : 0;

  document.getElementById("noFeeValue").textContent = formatEUR(noFeeAdj);
  document.getElementById("withFeeValue").textContent = formatEUR(withFeeAdj);
  document.getElementById("leakageValue").textContent = formatEUR(leakage);
  document.getElementById("leakagePct").textContent =
    `Dat is ~${leakagePct.toFixed(1)}% van je eindvermogen (na inflatiecorrectie indien ingevuld).`;

  document.getElementById("contributedValue").textContent = formatEUR(withFee.contributed);
}

function resetForm() {
  document.getElementById("initial").value = 10000;
  document.getElementById("monthly").value = 500;
  document.getElementById("years").value = 20;
  document.getElementById("returnRate").value = 7;
  document.getElementById("feeRate").value = 1;
  document.getElementById("inflationRate").value = 0;

  document.getElementById("noFeeValue").textContent = "—";
  document.getElementById("withFeeValue").textContent = "—";
  document.getElementById("leakageValue").textContent = "—";
  document.getElementById("leakagePct").textContent = "—";
  document.getElementById("contributedValue").textContent = "—";
}

document.getElementById("calculateBtn").addEventListener("click", calculate);
document.getElementById("resetBtn").addEventListener("click", resetForm);

// Run once on load (zodat je meteen iets ziet)
calculate();
const HUB_URL = "https://codepen.io/PPHaagie/full/yyaBgxr";
const backBtn = document.getElementById("backToHub");
if(backBtn) backBtn.addEventListener("click", () => location.href = HUB_URL);


});

