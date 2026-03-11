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
  const shareLine = document.getElementById("shareLine");
  const roastBullets = document.getElementById("roastBullets");
  const insightBullets = document.getElementById("insightBullets");
  const nextMoveText = document.getElementById("nextMoveText");

  const shareLinkedIn = document.getElementById("shareLinkedIn");
  const shareTwitter = document.getElementById("shareTwitter");
  const shareWhatsApp = document.getElementById("shareWhatsApp");
  const copyResult = document.getElementById("copyResult");

  function showScreen(screen) {
    [introScreen, formScreen, resultScreen].forEach((section) => {
      if (section) section.classList.remove("active");
    });

    if (screen) screen.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : 0;
  }

  function getFormData() {
    return {
      monthlyNetIncome: getFieldValue("monthlyNetIncome"),
      savings: getFieldValue("savings"),
      investments: getFieldValue("investments"),
      debt: getFieldValue("debt"),
      fixedExpenses: getFieldValue("fixedExpenses"),
      monthlyWealthBuilding: getFieldValue("monthlyWealthBuilding")
    };
  }

  function renderList(container, items) {
    if (!container) return;
    container.innerHTML = "";

    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function setupShareButtons(text) {
    const appUrl = "https://moneymind-mvp-five.vercel.app/";
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(appUrl);

    if (shareLinkedIn) {
      shareLinkedIn.onclick = function () {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        window.open(url, "_blank");
      };
    }

    if (shareTwitter) {
      shareTwitter.onclick = function () {
        const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        window.open(url, "_blank");
      };
    }

    if (shareWhatsApp) {
      shareWhatsApp.onclick = function () {
        const url = `https://wa.me/?text=${encodedText}`;
        window.open(url, "_blank");
      };
    }

    if (copyResult) {
      copyResult.onclick = async function () {
        try {
          await navigator.clipboard.writeText(text);
          alert("Result copied");
        } catch (error) {
          console.error("Copy failed:", error);
          alert("Copy failed");
        }
      };
    }
  }

  function updateShareText(result) {
    const verdict = result.shareLine || result.headline;

    const text = `MoneyMind Roast Result:

${verdict}

Score: ${result.score}/100
Category: ${result.category}

Try the Roast Tool:
https://moneymind-mvp-five.vercel.app/`;

    if (shareLine) {
      shareLine.textContent = `"${verdict}"`;
    }

    setupShareButtons(text);
  }

  function renderResult(result) {
    if (scoreValue) scoreValue.textContent = result.score;
    if (scoreLabel) scoreLabel.textContent = result.category;
    if (headline) headline.textContent = result.headline;
    if (nextMoveText) nextMoveText.textContent = result.nextMove;

    renderList(roastBullets, result.roastBullets);
    renderList(insightBullets, result.insights);

    updateShareText(result);
  }

  if (startRoastBtn) {
    startRoastBtn.addEventListener("click", function () {
      showScreen(formScreen);
    });
  }

  if (backToIntroBtn) {
    backToIntroBtn.addEventListener("click", function () {
      showScreen(introScreen);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", function () {
      if (roastForm) roastForm.reset();
      showScreen(introScreen);
    });
  }

  if (roastForm) {
    roastForm.addEventListener("submit", function (event) {
      event.preventDefault();

      try {
        const formData = getFormData();
        const result = window.RoastEngine.calculateRoast(formData);

        renderResult(result);
        showScreen(resultScreen);
      } catch (error) {
        console.error("Roast generation failed:", error);
        alert("Something went wrong while generating your roast.");
      }
    });
  }

  console.log("Roast Tool app.js loaded");
})();
