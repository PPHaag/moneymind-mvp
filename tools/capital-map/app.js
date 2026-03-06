function formatEUR(num){
  return "€ " + num.toLocaleString("nl-NL");
}

document.getElementById("calcBtn").onclick = () => {

  const cash = Number(document.getElementById("cash").value) || 0;
  const investments = Number(document.getElementById("investments").value) || 0;
  const crypto = Number(document.getElementById("crypto").value) || 0;
  const metals = Number(document.getElementById("metals").value) || 0;
  const equity = Number(document.getElementById("equity").value) || 0;
  const pension = Number(document.getElementById("pension").value) || 0;
  const otherAssets = Number(document.getElementById("otherAssets").value) || 0;
  const debt = Number(document.getElementById("debt").value) || 0;

  const directCapital =
    cash +
    investments +
    crypto +
    metals;

  const accessibleCapital =
    equity;

  const lockedCapital =
    pension +
    otherAssets;

  const totalNetWorth =
    directCapital +
    accessibleCapital +
    lockedCapital -
    debt;

  document.getElementById("totalNetWorth").textContent = formatEUR(totalNetWorth);
  document.getElementById("directCapital").textContent = formatEUR(directCapital);
  document.getElementById("accessibleCapital").textContent = formatEUR(accessibleCapital);
  document.getElementById("lockedCapital").textContent = formatEUR(lockedCapital);

  let deployablePercent = 0;

  if(totalNetWorth > 0){
    deployablePercent = Math.round((directCapital / totalNetWorth) * 100);
  }

  document.getElementById("insightText").textContent =
    "Approximately " +
    deployablePercent +
    "% of your wealth is directly deployable capital.";

  document.getElementById("resultCard").style.display = "block";

};

document.getElementById("resetBtn").onclick = () => {

  const inputs = document.querySelectorAll("input");

  inputs.forEach(i => {
    i.value = "";
  });

  document.getElementById("resultCard").style.display = "none";

};
