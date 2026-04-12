function futureValue(monthly, rate, months){
  if(rate === 0) return monthly * months
  return monthly * ((Math.pow(1 + rate, months) - 1) / rate)
}

function calculate(){

  const monthly = Number(document.getElementById("monthly").value)
  const annualReturn = Number(document.getElementById("return").value) / 100
  const startAge = Number(document.getElementById("startAge").value)
  const delayAge = Number(document.getElementById("delayAge").value)
  const targetAge = Number(document.getElementById("targetAge").value)

  const monthlyRate = annualReturn / 12

  const monthsNow = (targetAge - startAge) * 12
  const monthsLater = (targetAge - delayAge) * 12

  const nowValue = futureValue(monthly, monthlyRate, monthsNow)
  const laterValue = futureValue(monthly, monthlyRate, monthsLater)

  const delay = nowValue - laterValue

  document.getElementById("resultBlock").style.display = "block"

  document.getElementById("startNowValue").innerText =
    "€" + Math.round(nowValue).toLocaleString()

  document.getElementById("startLaterValue").innerText =
    "€" + Math.round(laterValue).toLocaleString()

  document.getElementById("delayImpact").innerText =
    "Waiting could cost you €" +
    Math.round(delay).toLocaleString() +
    " in future wealth."
}

document
  .getElementById("calculateBtn")
  .addEventListener("click", calculate)
