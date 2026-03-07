async function loadModules() {
  try {
    const response = await fetch("../modules.json");
    const phases = await response.json();

    const phaseTitle = document.getElementById("phaseTitle");
    const moduleGrid = document.getElementById("moduleGrid");

    if (!phases || phases.length === 0) {
      phaseTitle.innerText = "No phases found";
      moduleGrid.innerHTML = "";
      return;
    }

    // MVP: start with the first phase
    const firstPhase = phases[0];

    phaseTitle.innerText = firstPhase.title;
    moduleGrid.innerHTML = "";

    firstPhase.modules.forEach((module) => {
      const card = document.createElement("a");
      card.className = "mm-module";
      card.href = `../lesson/?module=${module.id}`;

      card.innerHTML = `
        <div class="mm-module-title">${module.title}</div>
        <div class="mm-module-desc">${module.description}</div>
      `;

      moduleGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load modules:", error);

    document.getElementById("phaseTitle").innerText = "Failed to load modules";
    document.getElementById("moduleGrid").innerHTML = `
      <div class="mm-module">
        <div class="mm-module-title">Something went wrong</div>
        <div class="mm-module-desc">Please check modules.json and try again.</div>
      </div>
    `;
  }
}

loadModules();
