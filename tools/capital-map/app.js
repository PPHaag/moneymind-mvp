function formatCurrency(value) {
  return "€" + Math.round(value).toLocaleString("nl-NL");
}

function calculateCapitalMap() {
  const cash = Number(document.getElementById("cash").value) || 0;
  const investments = Number(document.getElementById("investments").value) || 0;
  const crypto = Number(document.getElementById("crypto").value) || 0;

  const metals = Number(document.getElementById("metals").value) || 0;
  const homeEquity = Number(document.getElementById("homeEquity").value) || 0;
  const equity = Number(document.getElementById("equity").value) || 0;

  const pension = Number(document.getElementById("pension").value) || 0;

  const otherAssets = Number(document.getElementById("otherAssets").value) || 0;
  const debt = Number(document.getElementById("debt").value) || 0;

  const directCapital = cash + investments + crypto;
  const accessibleCapital = metals + homeEquity + equity + otherAssets;
  const lockedCapital = pension;

  const totalAssets = directCapital + accessibleCapital + lockedCapital;
  const netWorth = totalAssets - debt;
  const deployableCapital = directCapital - debt;

  document.getElementById("directCapitalValue").innerText = formatCurrency(directCapital);
  document.getElementById("accessibleCapitalValue").innerText = formatCurrency(accessibleCapital);
  document.getElementById("lockedCapitalValue").innerText = formatCurrency(lockedCapital);

  if (netWorth < 0) {
    document.getElementById("netWorthValue").innerText =
      "-€" + Math.round(Math.abs(netWorth)).toLocaleString("nl-NL");
  } else {
    document.getElementById("netWorthValue").innerText =
      formatCurrency(netWorth);
  }

  let insight = "";

  if (deployableCapital <= 0) {
    insight = "Your deployable capital is currently zero or negative. Debt is eating your flexibility.";
  } else if (deployableCapital < 5000) {
    insight = "Most of your capital is locked. You own value, but you cannot move much of it.";
  } else if (deployableCapital < 25000) {
    insight = "You have some deployable capital, but much of your wealth still sits outside direct reach.";
  } else {
    insight = "You have meaningful deployable capital. That gives you room to build with intent.";
  }

  const insightEl = document.getElementById("capitalInsight");
  if (insightEl) {
    insightEl.innerText = insight;
  }

  const resultBlock = document.getElementById("resultBlock");
  resultBlock.style.display = "block";

  resultBlock.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

document.getElementById("calculateBtn").addEventListener("click", calculateCapitalMap);
