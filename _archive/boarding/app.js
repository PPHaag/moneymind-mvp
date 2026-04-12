function mmShowError(msg) {
  const box = document.getElementById("mmErrorBox");
  if (!box) {
    alert(msg);
    return;
  }
  box.style.display = "block";
  box.textContent = "MoneyMind error:\n" + msg;
}

window.addEventListener("error", (e) => {
  mmShowError(e.error?.stack || e.message);
});

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "moneymindProfile";

  const STEPS = [
    {
      id: "stage",
      title: "Where are you today?",
      desc: "Choose the stage that best describes your current financial situation.",
      type: "single",
      options: [
        { value: "starter", title: "Starter", desc: "I want to begin and build a strong foundation." },
        { value: "builder", title: "Builder", desc: "I am actively building wealth and want growth." },
        { value: "optimizer", title: "Optimizer", desc: "I want to structure, protect, and optimize." }
      ]
    },
    {
      id: "goals",
      title: "What do you want to achieve?",
      desc: "You can select multiple goals.",
      type: "multi",
      options: [
        { value: "growth", title: "Build wealth", desc: "Focus on long-term capital growth." },
        { value: "passive_income", title: "Passive income", desc: "Build cashflow from assets." },
        { value: "financial_freedom", title: "Financial freedom", desc: "Create more freedom and reduce salary dependence." },
        { value: "protect_capital", title: "Protect capital", desc: "Preserve purchasing power and reduce downside." },
        { value: "multi_streams", title: "Multiple income streams", desc: "Diversify income across sources." }
      ],
      extra: {
        id: "primaryGoal",
        title: "Primary goal",
        desc: "Choose the one goal that matters most right now.",
        type: "single"
      }
    },
    {
      id: "horizon",
      title: "What is your time horizon?",
      desc: "How long are you willing to let your strategy compound?",
      type: "single",
      options: [
        { value: "lt5", title: "< 5 years", desc: "Shorter path, quicker outcome needed." },
        { value: "5to15", title: "5–15 years", desc: "A balance between growth and flexibility." },
        { value: "15plus", title: "15+ years", desc: "Long-term compounding mindset." }
      ]
    },
    {
      id: "risk",
      title: "How comfortable are you with risk?",
      desc: "Not what sounds impressive — what you can actually stick with.",
      type: "single",
      options: [
        { value: "conservative", title: "Conservative", desc: "Stability matters more than growth." },
        { value: "balanced", title: "Balanced", desc: "Steady growth with manageable risk." },
        { value: "aggressive", title: "Aggressive", desc: "Higher risk for potentially higher upside." }
      ]
    },
    {
      id: "incomeSources",
      title: "Which income sources do you currently have?",
      desc: "Select the income streams that already exist. Multiple choices are possible.",
      type: "multi",
      options: [
        { value: "salary", title: "Salary", desc: "Employment / fixed job income." },
        { value: "business", title: "Business", desc: "Profit from your own company or activity." },
        { value: "dividend", title: "Dividend", desc: "Cashflow from stocks or ETFs." },
        { value: "rent", title: "Rent", desc: "Income from property." },
        { value: "interest", title: "Interest", desc: "Deposits, bonds, savings." },
        { value: "staking_yield", title: "Staking / Yield", desc: "Income from yield mechanisms." },
        { value: "royalties", title: "Royalties", desc: "Licensing, IP, music, publishing, etc." }
      ]
    },
    {
      id: "assetExposure",
      title: "Which assets do you already have or want exposure to?",
      desc: "Asset exposure is not the same as income. Multiple choices are possible.",
      type: "multi",
      options: [
        { value: "stocks", title: "Stocks", desc: "Individual equities." },
        { value: "etfs", title: "ETFs", desc: "Broad diversified exposure." },
        { value: "realestate", title: "Real estate", desc: "Direct or indirect property exposure." },
        { value: "crypto", title: "Crypto", desc: "Digital asset exposure." },
        { value: "metals", title: "Precious metals", desc: "Gold / silver as hedge or reserve." },
        { value: "private", title: "Private investments", desc: "PE, VC, or private deals." },
        { value: "cash", title: "Cash", desc: "Liquidity and buffer." }
      ]
    }
  ];

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

  const elSteps = document.getElementById("steps");
  const elStepLabel = document.getElementById("stepLabel");
  const elStepTotal = document.getElementById("stepTotal");
  const elProgressFill = document.getElementById("progressFill");
  const elBackBtn = document.getElementById("backBtn");
  const elNextBtn = document.getElementById("nextBtn");
  const elNote = document.getElementById("note");

  function setNote(stepId) {
    if (!elNote) return;

    if (stepId === "goals") {
      elNote.textContent = "You can choose multiple goals, but MoneyMind also needs one clear priority.";
    } else if (stepId === "incomeSources") {
      elNote.textContent = "These are actual cashflow sources. Crypto belongs under assets, not income.";
    } else if (stepId === "assetExposure") {
      elNote.textContent = "This helps MoneyMind connect your current structure to future allocation and learning paths.";
    } else {
      elNote.textContent = "Choose what is true, not what sounds impressive. Consistency beats bravado.";
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

    if (step.extra && !state.primaryGoal) {
      return false;
    }

    return true;
  }

  function renderStep(index) {
    currentStep = index;
    const step = STEPS[index];

    if (elStepLabel) elStepLabel.textContent = `Step ${index + 1}`;
    if (elStepTotal) elStepTotal.textContent = `${STEPS.length}`;
    if (elProgressFill) elProgressFill.style.width = `${((index + 1) / STEPS.length) * 100}%`;

    if (elBackBtn) elBackBtn.disabled = index === 0;
    if (elNextBtn) elNextBtn.textContent = index === STEPS.length - 1 ? "Finish" : "Continue";

    setNote(step.id);

    if (!elSteps) return;
    elSteps.innerHTML = "";

    const stepEl = document.createElement("div");
    stepEl.className = "step active";
    stepEl.innerHTML = `
      <h2>${step.title}</h2>
      <p>${step.desc}</p>
      <div class="choiceGrid" id="grid_main"></div>
      ${
        step.extra
          ? `
        <div class="smallRow">
          <span class="pill">${step.extra.title}: ${step.extra.desc}</span>
        </div>
        <div class="choiceGrid" id="grid_extra"></div>
      `
          : ""
      }
    `;

    elSteps.appendChild(stepEl);

    const gridMain = stepEl.querySelector("#grid_main");

    step.options.forEach((opt) => {
      const c = document.createElement("div");
      c.className = "choice";
      c.innerHTML = `<div class="t">${opt.title}</div><div class="d">${opt.desc}</div>`;

      if (isSelected(step.id, opt.value)) c.classList.add("selected");

      c.addEventListener("click", () => {
        toggleSelect(step.id, opt.value, step.type);

        if (step.id === "goals") {
          if (!state.primaryGoal && state.goals.length > 0) {
            state.primaryGoal = state.goals[0];
          }

          if (state.primaryGoal && !state.goals.includes(state.primaryGoal)) {
            state.primaryGoal = state.goals[0] || null;
          }
        }

        renderStep(currentStep);
      });

      gridMain.appendChild(c);
    });

    if (step.extra) {
      const gridExtra = stepEl.querySelector("#grid_extra");

      step.options.forEach((opt) => {
        const c = document.createElement("div");
        c.className = "choice";
        c.innerHTML = `<div class="t">${opt.title}</div><div class="d">Set this as your main priority</div>`;

        if (isSelected("primaryGoal", opt.value)) c.classList.add("selected");

        c.addEventListener("click", () => {
          if (!state.goals.includes(opt.value)) {
            state.goals.push(opt.value);
          }
          state.primaryGoal = opt.value;
          renderStep(currentStep);
        });

        gridExtra.appendChild(c);
      });
    }
  }

  function humanGoal(val) {
    const map = {
      growth: "Build wealth",
      passive_income: "Passive income",
      financial_freedom: "Financial freedom",
      protect_capital: "Protect capital",
      multi_streams: "Multiple income streams"
    };
    return map[val] || "—";
  }

  function deriveProfile(profile) {
    const stage = profile.stage;
    const primary = profile.primaryGoal || profile.goals[0] || null;

    let profileType = "Balanced Builder";

    if (stage === "starter") profileType = "Foundation Starter";
    if (stage === "optimizer") profileType = "Strategic Optimizer";

    if (primary === "passive_income") {
      profileType = stage === "optimizer" ? "Income Architect" : "Income Builder";
    }
    if (primary === "growth") {
      profileType = stage === "starter" ? "Growth Starter" : "Growth Builder";
    }
    if (primary === "financial_freedom") {
      profileType = "Freedom Planner";
    }
    if (primary === "protect_capital") {
      profileType = "Wealth Protector";
    }
    if (primary === "multi_streams") {
      profileType = "Income Stack Builder";
    }

    let nextStep = "Continue to Capital Map";
    let nextStepNote = "First understand your capital structure before optimizing anything else.";

    if (primary === "passive_income" || primary === "financial_freedom") {
      nextStep = "Continue to Capital Map";
      nextStepNote = "You first need structural clarity before designing an income strategy.";
    } else if (primary === "protect_capital") {
      nextStep = "Continue to Capital Map";
      nextStepNote = "Protection starts with understanding what is liquid, accessible, and locked.";
    }

    return { profileType, nextStep, nextStepNote };
  }

  function finishWizard() {
    const step = STEPS[currentStep];

    if (!validateStep(step)) {
      alert("Please make a selection before continuing.");
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

    const wizardCard = document.getElementById("wizardCard");
    const resultCard = document.getElementById("resultCard");
    const profileType = document.getElementById("profileType");
    const primaryFocus = document.getElementById("primaryFocus");
    const nextStep = document.getElementById("nextStep");
    const nextStepNote = document.getElementById("nextStepNote");
    const saveStatus = document.getElementById("saveStatus");
    const profileJson = document.getElementById("profileJson");
    const restartBtn = document.getElementById("restartBtn");
    const goCapitalMapBtn = document.getElementById("goCapitalMapBtn");

    if (wizardCard) wizardCard.style.display = "none";
    if (resultCard) resultCard.style.display = "block";

    if (profileType) profileType.textContent = derived.profileType;
    if (primaryFocus) primaryFocus.textContent = humanGoal(profile.primaryGoal);
    if (nextStep) nextStep.textContent = derived.nextStep;
    if (nextStepNote) nextStepNote.textContent = derived.nextStepNote;
    if (saveStatus) saveStatus.textContent = "Saved ✅";
    if (profileJson) profileJson.textContent = JSON.stringify(profile, null, 2);

    if (restartBtn) {
      restartBtn.onclick = () => window.location.reload();
    }

    if (goCapitalMapBtn) {
      goCapitalMapBtn.onclick = () => {
        window.location.href = "/tools/capital-map/";
      };
    }
  }

  function next() {
    const step = STEPS[currentStep];

    if (!validateStep(step)) {
      alert("Please make a selection before continuing.");
      return;
    }

    if (currentStep === STEPS.length - 1) {
      finishWizard();
      return;
    }

    renderStep(currentStep + 1);
  }

  function back() {
    if (currentStep > 0) {
      renderStep(currentStep - 1);
    }
  }

  function loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      alert("No saved profile found in this browser.");
      return;
    }

    try {
      const p = JSON.parse(raw);
      state.stage = p.stage || null;
      state.goals = Array.isArray(p.goals) ? p.goals : [];
      state.primaryGoal = p.primaryGoal || null;
      state.horizon = p.horizon || null;
      state.risk = p.risk || null;
      state.incomeSources = Array.isArray(p.incomeSources) ? p.incomeSources : [];
      state.assetExposure = Array.isArray(p.assetExposure) ? p.assetExposure : [];

      alert("Profile loaded ✅");
      renderStep(0);
    } catch (e) {
      alert("A saved profile was found, but it could not be read.");
    }
  }

  if (elNextBtn) elNextBtn.addEventListener("click", next);
  if (elBackBtn) elBackBtn.addEventListener("click", back);

  const loadBtn = document.getElementById("loadBtn");
  if (loadBtn) loadBtn.addEventListener("click", loadProfile);

  renderStep(0);
});
