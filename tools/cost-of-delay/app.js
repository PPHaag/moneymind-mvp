function futureValue(monthly, rate, months) {
  if (rate === 0) return monthly * months;
  return monthly * ((Math.pow(1 + rate, months) - 1) / rate);
}

function formatCurrency(value) {
  return "€" + Math.round(value).toLocaleString("nl-NL");
}

function calculate() {
  const monthly = Number(document.getElementById("monthly").value);
  const annualReturn = Number(document.getElementById("return").value) / 100;
  const startAge = Number(document.getElementById("startAge").value);
  const delayAge = Number(document.getElementById("delayAge").value);
  const targetAge = Number(document.getElementById("targetAge").value);

  const monthlyRate = annualReturn / 12;
  const monthsNow = (targetAge - startAge) * 12;
  const monthsLater = (targetAge - delayAge) * 12;

  const nowValue = futureValue(monthly, monthlyRate, monthsNow);
  const laterValue = futureValue(monthly, monthlyRate, monthsLater);
  const delay = nowValue - laterValue;

  document.getElementById("results").style.display = "block";
  document.getElementById("insight").style.display = "block";
  document.getElementById("next").style.display = "block";

  document.getElementById("nowResult").innerText = formatCurrency(nowValue);
  document.getElementById("laterResult").innerText = formatCurrency(laterValue);
  document.getElementById("delayCost").innerText =
    "Waiting could cost you " + formatCurrency(delay) + " in future wealth.";
}
