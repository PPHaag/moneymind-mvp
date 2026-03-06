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

  document.getElementById("directCapitalValue").innerText = formatCurrency(directCapital);
  document.getElementById("accessibleCapitalValue").innerText = formatCurrency(accessibleCapital);
  document.getElementById("lockedCapitalValue").innerText = formatCurrency(lockedCapital);
  document.getElementById("netWorthValue").innerText = formatCurrency(netWorth);

  document.getElementById("resultBlock").style.display = "block";
}

document.getElementById("calculateBtn").addEventListener("click", calculateCapitalMap);
