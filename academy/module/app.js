async function loadModules() {
  const phaseTitle = document.getElementById("phaseTitle");
  const moduleGrid = document.getElementById("moduleGrid");

  // Stop meteen als we niet op de module page zitten
  if (!phaseTitle || !moduleGrid) {
    return;
  }

  try {
    const response = await fetch("/academy/modules.json");
    const phases = await response.json();

    if (!phases || phases.length === 0) {
      phaseTitle.innerText = "No phases found";
      moduleGrid.innerHTML = "";
      return;
    }

    const firstPhase = phases[0];

    const firstLessonMap = {
      "money-fundamentals": "net-worth-vs-deployable-capital",
      "banking-system": "what-banks-actually-do",
      "inflation": "what-inflation-really-is",
      "currency-systems": "money-vs-currency",
      "investing-equity-markets": "why-equities-matter",
      "crypto-digital-assets": "what-crypto-actually-is",
      "precious-metals": "why-gold-and-silver-still-matter",
      "fiscal-strategy": "why-tax-matters-for-wealth",
      "wealth-architecture": "what-wealth-architecture-means",
      "wealth-preservation-protection": "why-wealth-preservation-matters"
    };

    phaseTitle.innerText = firstPhase.title;
    moduleGrid.innerHTML = "";

    firstPhase.modules.forEach((module) => {
      const card = document.createElement("a");
      card.className = "mm-module";
      card.href = `/academy/lesson/?id=${firstLessonMap[module.id] || ""}`;

      card.innerHTML = `
        <div class="mm-module-title">${module.title}</div>
        <div class="mm-module-desc">${module.description}</div>
      `;

      moduleGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load modules:", error);

    phaseTitle.innerText = "Failed to load modules";
    moduleGrid.innerHTML = `
      <div class="mm-module">
        <div class="mm-module-title">Something went wrong</div>
        <div class="mm-module-desc">Please check modules.json and try again.</div>
      </div>
    `;
  }
}

loadModules();
