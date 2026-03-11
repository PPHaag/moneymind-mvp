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

  function getFormData() {
    return {
      monthlyNetIncome: document.getElementById("monthlyNetIncome")?.value || 0,
      savings: document.getElementById("savings")?.value || 0,
      investments: document.getElementById("investments")?.value || 0,
      debt: document.getElementById("debt")?.value || 0,
      fixedExpenses: document.getElementById("fixedExpenses")?.value || 0,
      monthlyWealthBuilding: document.getElementById("monthlyWealthBuilding")?.value || 0
    };
  }

  function renderList(container, items) {
    if (!container) return;
    container.innerHTML = "";

    items.forEach((item) => {
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
      shareLinkedIn.onclick = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        window.open(url, "_blank");
      };
    }

    if (shareTwitter) {
      shareTwitter.onclick = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        window.open(url, "_blank");
      };
    }

    if (shareWhatsApp) {
      shareWhatsApp.onclick = () => {
        const url = `https://wa.me/?text=${encodedText}`;
        window.open(url, "_blank");
      };
    }

    if (copyResult) {
      copyResult.onclick = async () => {
        try {
          await navigator.clipboard.writeText(text);
          alert("Result copied");
        } catch (error) {
          alert("Copy failed");
          console.error(error);
        }
      };
    }
  }

  function updateShareText(result) {
    const text = `MoneyMind Roast Result:

${result.headline}

Score: ${result.score}/100
Category: ${result.category}

Try the Roast Tool:
https://moneymind-mvp-five.vercel.app/`;

    if (shareLine) {
      shareLine.textContent = `"${result.headline}"`;
    }

    setupShareButtons(text);
  }

  function renderResult(result) {
    if (scoreValue) scoreValue.textContent = result.score;
    if (scoreLabel) scoreLabel.textContent = result.category;
    if (headline) headline.textContent = result.headline;
    if (nextMoveText) nextMoveText.textContent = result.nextMove;

    renderList(roastBullets, result.roastBullets || []);
    renderList(insightBullets, result.insights || []);
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

      const formData = getFormData();
      const result = window.RoastEngine.calculateRoast(formData);

      renderResult(result);
      showScreen(resultScreen);
    });
  }

  console.log("Roast Tool app.js loaded");
})();
