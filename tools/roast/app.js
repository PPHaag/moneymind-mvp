(function () {
  const introScreen = document.getElementById("introScreen");
  const formScreen = document.getElementById("formScreen");
  const resultScreen = document.getElementById("resultScreen");

  const startRoastBtn = document.getElementById("startRoastBtn");
  const backToIntroBtn = document.getElementById("backToIntroBtn");
  const restartBtn = document.getElementById("restartBtn");
  const roastForm = document.getElementById("roastForm");

  const scoreValue = document.getElementById("scoreValue");
  const scoreLabel = document.getElementById("scoreLabel");
  const headline = document.getElementById("headline");
  const roastBullets = document.getElementById("roastBullets");
  const insightBullets = document.getElementById("insightBullets");
  const nextMoveText = document.getElementById("nextMoveText");

  function showScreen(screen) {
    [introScreen, formScreen, resultScreen].forEach(section => {
      section.classList.remove("active");
    });
    screen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getFormData() {
    return {
      monthlyNetIncome: document.getElementById("monthlyNetIncome").value,
      savings: document.getElementById("savings").value,
      investments: document.getElementById("investments").value,
      debt: document.getElementById("debt").value,
      fixedExpenses: document.getElementById("fixedExpenses").value,
      monthlyWealthBuilding: document.getElementById("monthlyWealthBuilding").value
    };
  }

  function renderList(container, items) {
    container.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function renderResult(result) {
    scoreValue.textContent = result.score;
    scoreLabel.textContent = result.category;
    headline.textContent = result.headline;
    nextMoveText.textContent = result.nextMove;

    renderList(roastBullets, result.roastBullets);
    renderList(insightBullets, result.insights);
  }

  startRoastBtn.addEventListener("click", function () {
    showScreen(formScreen);
  });

  backToIntroBtn.addEventListener("click", function () {
    showScreen(introScreen);
  });

  restartBtn.addEventListener("click", function () {
    roastForm.reset();
    showScreen(introScreen);
  });

  roastForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = getFormData();
    const result = window.RoastEngine.calculateRoast(formData);

    renderResult(result);
    showScreen(resultScreen);
  });
})();
const shareLine = document.getElementById("shareLine");

function updateShareText(result){

  const text =
`MoneyMind Roast Result:

${result.headline}

Score: ${result.score}/100

Try the Roast Tool:
https://moneymind-mvp-five.vercel.app/`;

  shareLine.textContent = `"${result.headline}"`;

  setupShareButtons(text);

}


function setupShareButtons(text){

  const encoded = encodeURIComponent(text);

  document.getElementById("shareLinkedIn").onclick = () => {

    const url =
`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://moneymind-mvp-five.vercel.app/")}`;

    window.open(url,"_blank");

  };

  document.getElementById("shareTwitter").onclick = () => {

    const url =
`https://twitter.com/intent/tweet?text=${encoded}`;

    window.open(url,"_blank");

  };

  document.getElementById("shareWhatsApp").onclick = () => {

    const url =
`https://wa.me/?text=${encoded}`;

    window.open(url,"_blank");

  };

  document.getElementById("copyResult").onclick = () => {

    navigator.clipboard.writeText(text);

    alert("Result copied");

  };

}
