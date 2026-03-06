function mmShowError(msg) {
  const box = document.getElementById("mmErrorBox");
  if (!box) { alert(msg); return; }
  box.style.display = "block";
  box.textContent = "MoneyMind error:\n" + msg;
}

window.addEventListener("error", (e) => {
  mmShowError(e.error?.stack || e.message);
});

document.addEventListener("DOMContentLoaded", () => {

// ===== MoneyMind Boarding Wizard (Clean MVP v1) =====
// - Multi-step wizard
// - Multi select goals + pick primary goal
// - Stores profile in localStorage as a single object
// - Links out to tools
(function(){
  const raw = localStorage.getItem("moneymindProfile");
  if(!raw) return;
  try{
    const p = JSON.parse(raw);
    const t = p?.derived?.profileType;
    const badge = document.getElementById("mmProfileBadge");
    if (t && badge){
      badge.textContent = "Profile: " + t;
      badge.style.display = "inline-block";
    }
  }catch(e){}
})();
const LINKS = {
  wealthBuilder: "https://codepen.io/PPHaagie/full/VYjoRBb",
  leakage: "https://codepen.io/PPHaagie/full/wBWVOoy"
};

const STORAGE_KEY = "moneymindProfile";

const CONFIG = {
  milestones: ["Stap 1", "Stap 2", "Stap 3", "Stap 4", "Stap 5", "Stap 6"]
};

const STEPS = [
  {
    id: "stage",
    title: "Waar sta je nu?",
    desc: "Kies de fase die het beste bij je past.",
    type: "single",
    options: [
      { value: "starter", title: "Starter", desc: "Ik wil beginnen en basis bouwen." },
      { value: "builder", title: "Builder", desc: "Ik bouw vermogen op en wil groei." },
      { value: "optimizer", title: "Optimizer", desc: "Ik wil structureren, beschermen, optimaliseren." }
    ]
  },
  {
    id: "goals",
    title: "Wat wil je bereiken?",
    desc: "Je mag meerdere doelen kiezen.",
    type: "multi",
    options: [
      { value: "growth", title: "Vermogen opbouwen", desc: "Focus op lange termijn groei." },
      { value: "passive_income", title: "Passive income", desc: "Cashflow uit assets opbouwen." },
      { value: "financial_freedom", title: "Financiële vrijheid", desc: "Keuzes maken zonder salarisdruk." },
      { value: "protect_capital", title: "Kapitaal beschermen", desc: "Downside beperken, koopkracht beschermen." },
      { value: "multi_streams", title: "Meerdere income streams", desc: "Inkomen spreiden over bronnen." }
    ],
    extra: {
      id: "primaryGoal",
      title: "Hoofddoel",
      desc: "Kies 1 doel dat nu de hoogste prioriteit heeft.",
      type: "single"
    }
  },
  {
    id: "horizon",
    title: "Wat is je tijdshorizon?",
    desc: "Hoe lang wil/kun je dit laten compounden?",
    type: "single",
    options: [
      { value: "lt5", title: "< 5 jaar", desc: "Korter traject, sneller resultaat nodig." },
      { value: "5to15", title: "5–15 jaar", desc: "Balans tussen groei en flexibiliteit." },
      { value: "15plus", title: "15+ jaar", desc: "Maximale compounding, lang adem." }
    ]
  },
  {
    id: "risk",
    title: "Hoe comfortabel ben je met risico?",
    desc: "Niet wat je stoer vindt, maar wat je écht volhoudt.",
    type: "single",
    options: [
      { value: "conservative", title: "Conservatief", desc: "Stabiliteit boven groei." },
      { value: "balanced", title: "Balanced", desc: "Rustig groeien met beheersbaar risico." },
      { value: "aggressive", title: "Agressief", desc: "Hoger risico voor potentieel hogere groei." }
    ]
  },
  {
    id: "incomeSources",
    title: "Welke inkomstenbronnen heb je nu?",
    desc: "Selecteer wat nu al binnenkomt (cashflow). Meerdere keuzes mogelijk.",
    type: "multi",
    options: [
      { value: "salary", title: "Salaris", desc: "Loondienst / vaste baan." },
      { value: "business", title: "Onderneming", desc: "Winst uit bedrijf / eigen zaak." },
      { value: "dividend", title: "Dividend", desc: "Cashflow uit aandelen/ETF’s." },
      { value: "rent", title: "Huur", desc: "Vastgoed-inkomsten." },
      { value: "interest", title: "Rente", desc: "Deposito’s, obligaties, sparen." },
      { value: "staking_yield", title: "Staking / Yield", desc: "Income uit yield-mechanismen." },
      { value: "royalties", title: "Royalties", desc: "Licenties, IP, muziek, etc." }
    ]
  },
  {
    id: "assetExposure",
    title: "Welke assets heb je (of wil je) exposure naar?",
    desc: "Asset exposure is geen income. Meerdere keuzes mogelijk.",
    type: "multi",
    options: [
      { value: "stocks", title: "Aandelen", desc: "Individuele aandelen." },
      { value: "etfs", title: "ETF’s", desc: "Breed gespreid, passief." },
      { value: "realestate", title: "Vastgoed", desc: "Direct of indirect." },
      { value: "crypto", title: "Crypto", desc: "Asset exposure, niet automatisch income." },
      { value: "metals", title: "Edelmetalen", desc: "Goud/zilver als hedge." },
      { value: "private", title: "Private investments", desc: "PE, VC, private deals." },
      { value: "cash", title: "Cash", desc: "Liquiditeit / buffer." }
    ]
  }
];

// --- State ---
const state = {
  stage: null,
  goals: [],
  primaryGoal: null,
  horizon: null,
  risk: null,
  incomeSources: [],
  assetExposure: []
};

let currentStep = 0;

// --- DOM helpers ---
const elSteps = document.getElementById("steps");
const elStepLabel = document.getElementById("stepLabel");
const elStepTotal = document.getElementById("stepTotal");
const elProgressFill = document.getElementById("progressFill");
const elBackBtn = document.getElementById("backBtn");
const elNextBtn = document.getElementById("nextBtn");
const elNote = document.getElementById("note");

function setNote(stepId) {
  if (stepId === "goals") {
    elNote.textContent = "Je kiest meerdere doelen + 1 hoofddoel. MoneyMind gebruikt dit om tools te personaliseren.";
  } else if (stepId === "incomeSources") {
    elNote.textContent = "Dit zijn echte inkomensbronnen (cashflow). Crypto is geen income source; dat komt bij assets.";
  } else if (stepId === "assetExposure") {
    elNote.textContent = "Asset exposure helpt later bij allocatie en educatie. Geen advies, wel richting.";
  } else {
    elNote.textContent = "Tip: kies wat je écht volhoudt. Consistentie wint van bravoure.";
  }
}

function isSelected(key, value) {
  const cur = state[key];
  return Array.isArray(cur) ? cur.includes(value) : cur === value;
}

function toggleSelect(key, value, type) {
  if (type === "single") {
    state[key] = value;
    return;
  }
  // multi
  const arr = state[key];
  const i = arr.indexOf(value);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(value);
}

function validateStep(step) {
  const v = state[step.id];
  if (step.type === "single") {
    if (!v) return false;
  } else {
    if (!Array.isArray(v) || v.length === 0) return false;
  }
  if (step.extra) {
    if (!state.primaryGoal) return false;
  }
  return true;
}

// --- Rendering ---
function renderStep(index) {
  currentStep = index;
  const step = STEPS[index];

  elStepLabel.textContent = `Stap ${index + 1}`;
  elStepTotal.textContent = `${STEPS.length}`;
  elProgressFill.style.width = `${((index + 1) / STEPS.length) * 100}%`;

  elBackBtn.disabled = index === 0;
  elNextBtn.textContent = (index === STEPS.length - 1) ? "Afronden" : "Volgende";
  setNote(step.id);

  elSteps.innerHTML = "";

  const stepEl = document.createElement("div");
  stepEl.className = "step active";
  stepEl.innerHTML = `
    <h2>${step.title}</h2>
    <p>${step.desc}</p>
    <div class="choiceGrid" id="grid_main"></div>
    ${step.extra ? `
      <div class="smallRow">
        <span class="pill">${step.extra.title}: ${step.extra.desc}</span>
      </div>
      <div class="choiceGrid" id="grid_extra"></div>
    ` : ""}
  `;
  elSteps.appendChild(stepEl);

  // main options
  const gridMain = stepEl.querySelector("#grid_main");
  step.options.forEach(opt => {
    const c = document.createElement("div");
    c.className = "choice";
    c.innerHTML = `<div class="t">${opt.title}</div><div class="d">${opt.desc}</div>`;
    if (isSelected(step.id, opt.value)) c.classList.add("selected");
    c.addEventListener("click", () => {
      toggleSelect(step.id, opt.value, step.type);

      // goals special: maintain primaryGoal
      if (step.id === "goals") {
        if (!state.primaryGoal && state.goals.length > 0) state.primaryGoal = state.goals[0];
        if (state.primaryGoal && !state.goals.includes(state.primaryGoal)) {
          state.primaryGoal = state.goals[0] || null;
        }
      }

      renderStep(currentStep);
    });
    gridMain.appendChild(c);
  });

  // extra (primary goal)
  if (step.extra) {
    const gridExtra = stepEl.querySelector("#grid_extra");
    step.options.forEach(opt => {
      const c = document.createElement("div");
      c.className = "choice";
      c.innerHTML = `<div class="t">${opt.title}</div><div class="d">Zet dit als hoofddoel</div>`;
      if (isSelected("primaryGoal", opt.value)) c.classList.add("selected");
      c.addEventListener("click", () => {
        // only allow primaryGoal to be one of selected goals
        if (!state.goals.includes(opt.value)) {
          // auto-select it in goals if not selected
          state.goals.push(opt.value);
        }
        state.primaryGoal = opt.value;
        renderStep(currentStep);
      });
      gridExtra.appendChild(c);
    });
  }
}

// --- Profile output (derived) ---
function humanGoal(val) {
  const map = {
    growth: "Vermogen opbouwen",
    passive_income: "Passive income",
    financial_freedom: "Financiële vrijheid",
    protect_capital: "Kapitaal beschermen",
    multi_streams: "Meerdere income streams"
  };
  return map[val] || "—";
}

function deriveProfile(profile) {
  const stage = profile.stage;
  const primary = profile.primaryGoal || profile.goals[0] || null;

  let profileType = "Balanced Builder";
  if (stage === "starter") profileType = "Foundation Starter";
  if (stage === "optimizer") profileType = "Strategic Optimizer";

  if (primary === "passive_income") profileType = (stage === "optimizer") ? "Income Architect" : "Income Builder";
  if (primary === "growth") profileType = (stage === "starter") ? "Growth Starter" : "Growth Builder";
  if (primary === "financial_freedom") profileType = "Freedom Planner";
  if (primary === "protect_capital") profileType = "Wealth Protector";
  if (primary === "multi_streams") profileType = "Income Stack Builder";

  let nextStep = "Start met de Wealth Builder Engine";
  let nextStepNote = "Bouw je pad, check milestones, en maak je doel concreet.";

  if (primary === "passive_income" || primary === "financial_freedom") {
    nextStep = "Gebruik de Wealth Builder Engine (income goal)";
    nextStepNote = "Zet je maandelijkse income-doel en yield aanname; bekijk 'years to freedom'.";
  } else if (primary === "protect_capital") {
    nextStep = "Begin met Wealth Leakage Check";
    nextStepNote = "Minimaliseer fees/lekken; daarna pas agressiever groeien.";
  }

  return { profileType, nextStep, nextStepNote };
}

function finishWizard() {
  const step = STEPS[currentStep];
  if (!validateStep(step)) {
    alert("Maak eerst een keuze voordat je doorgaat 🙂");
    return;
  }

  const baseProfile = {
    createdAt: new Date().toISOString(),
    stage: state.stage,
    goals: [...state.goals],
    primaryGoal: state.primaryGoal,
    horizon: state.horizon,
    risk: state.risk,
    incomeSources: [...state.incomeSources],
    assetExposure: [...state.assetExposure]
  };

  const derived = deriveProfile(baseProfile);
  const profile = { ...baseProfile, derived };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

  // show results
  document.getElementById("wizardCard").style.display = "none";
  const resultCard = document.getElementById("resultCard");
  resultCard.style.display = "block";

  document.getElementById("profileType").textContent = derived.profileType;
  document.getElementById("primaryFocus").textContent = humanGoal(profile.primaryGoal);
  document.getElementById("nextStep").textContent = derived.nextStep;
  document.getElementById("nextStepNote").textContent = derived.nextStepNote;
  document.getElementById("saveStatus").textContent = "Opgeslagen ✅";

  const json = JSON.stringify(profile, null, 2);
  document.getElementById("profileJson").textContent = json;

  document.getElementById("copyProfileBtn").onclick = async () => {
    await navigator.clipboard.writeText(json);
    alert("Profiel JSON gekopieerd ✅");
  };

  document.getElementById("restartBtn").onclick = () => location.reload();

  document.getElementById("goWealthBuilderBtn").onclick = () => window.open(LINKS.wealthBuilder, "_blank");
  document.getElementById("goLeakageBtn").onclick = () => window.open(LINKS.leakage, "_blank");
}

function next() {
  const step = STEPS[currentStep];
  if (!validateStep(step)) {
    alert("Maak eerst een keuze voordat je doorgaat 🙂");
    return;
  }
  if (currentStep === STEPS.length - 1) {
    finishWizard();
    return;
  }
  renderStep(currentStep + 1);
}

function back() {
  if (currentStep > 0) renderStep(currentStep - 1);
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return alert("Geen opgeslagen profiel gevonden in je browser.");
  try {
    const p = JSON.parse(raw);
    state.stage = p.stage || null;
    state.goals = Array.isArray(p.goals) ? p.goals : [];
    state.primaryGoal = p.primaryGoal || null;
    state.horizon = p.horizon || null;
    state.risk = p.risk || null;
    state.incomeSources = Array.isArray(p.incomeSources) ? p.incomeSources : [];
    state.assetExposure = Array.isArray(p.assetExposure) ? p.assetExposure : [];
    alert("Profiel geladen ✅");
    renderStep(0);
  } catch (e) {
    alert("Profiel gevonden maar kon niet worden gelezen.");
  }
}

// Wire up
document.getElementById("nextBtn").addEventListener("click", next);
document.getElementById("backBtn").addEventListener("click", back);
document.getElementById("loadBtn").addEventListener("click", loadProfile);

// init
renderStep(0);
const HUB_URL = "https://codepen.io/PPHaagie/full/yyaBgxr";
const backBtn = document.getElementById("backToHub");
if(backBtn) backBtn.addEventListener("click", () => location.href = HUB_URL);



});
