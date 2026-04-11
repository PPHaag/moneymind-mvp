(function () {
  const questions = window.ROAST_DATA?.questions || [];

  const DASHBOARD_PATH = "/apps/dashboard/index.html";

  // ─── Single storage key ───────────────────────────────────────────────────────
  // All roast data lives in ONE key: "moneymind_user_data"
  // Dashboard reads from this key only.
  const STORAGE_KEY = "moneymind_user_data";

  const state = {
    currentQuestionIndex: 0,
    answers: {},
    lastResult: null
  };

  const screens = {
    intro:    document.getElementById("introScreen"),
    question: document.getElementById("questionScreen"),
    loading:  document.getElementById("loadingScreen"),
    result:   document.getElementById("resultScreen")
  };

  const els = {
    startBtn:        document.getElementById("startBtn"),
    backBtn:         document.getElementById("backBtn"),
    progressText:    document.getElementById("progressText"),
    progressPct:     document.getElementById("progressPct"),
    progressFill:    document.getElementById("progressFill"),
    questionEyebrow: document.getElementById("questionEyebrow"),
    questionTitle:   document.getElementById("questionTitle"),
    questionHint:    document.getElementById("questionHint"),
    optionsContainer: document.getElementById("optionsContainer"),

    headlineText:    document.getElementById("headlineText"),
    observationText: document.getElementById("observationText"),
    incomeText:      document.getElementById("incomeText"),
    investText:      document.getElementById("investText"),
    investRateText:  document.getElementById("investRateText"),

    profileName:        document.getElementById("profileName"),
    profileDescription: document.getElementById("profileDescription"),
    profileOpportunity: document.getElementById("profileOpportunity"),

    currentWealthText:   document.getElementById("currentWealthText"),
    optimizedWealthText: document.getElementById("optimizedWealthText"),
    currentAgeText:      document.getElementById("currentAgeText"),
    optimizedAgeText:    document.getElementById("optimizedAgeText"),
    wealthDifferenceText: document.getElementById("wealthDifferenceText"),

    behaviorTitle: document.getElementById("behaviorTitle"),
    behaviorText:  document.getElementById("behaviorText"),
    lessonBtn:     document.getElementById("lessonBtn"),

    goDashboardBtn: document.getElementById("goDashboardBtn"),
    restartBtn:     document.getElementById("restartBtn"),

    sharePreview:          document.getElementById("sharePreview"),
    shareImageTitle:       document.getElementById("shareImageTitle"),
    shareImageSupporting:  document.getElementById("shareImageSupporting"),
    shareCurrentWealth:    document.getElementById("shareCurrentWealth"),
    shareOptimizedWealth:  document.getElementById("shareOptimizedWealth"),
    shareWealthDifference: document.getElementById("shareWealthDifference")
  };

  // ─── Screen management ────────────────────────────────────────────────────────

  function showScreen(target) {
    Object.values(screens).forEach((s) => { if (s) s.classList.remove("active"); });
    if (target) target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // ─── Roast flow ───────────────────────────────────────────────────────────────

  function startRoast() {
    state.currentQuestionIndex = 0;
    state.answers = {};
    renderQuestion();
    showScreen(screens.question);
  }

  function restartRoast() {
    state.currentQuestionIndex = 0;
    state.answers = {};
    state.lastResult = null;
    showScreen(screens.intro);
  }

  function renderQuestion() {
    if (!questions.length) {
      console.warn("No roast questions found.");
      return;
    }

    const q = questions[state.currentQuestionIndex];
    if (!q) {
      console.warn("Question not found for index:", state.currentQuestionIndex);
      return;
    }

    const index = state.currentQuestionIndex + 1;
    const pct   = Math.round((index / questions.length) * 100);

    if (els.progressText) els.progressText.textContent = `Question ${index} of ${questions.length}`;
    if (els.progressPct)  els.progressPct.textContent  = `${pct}%`;
    if (els.progressFill) els.progressFill.style.width = `${pct}%`;

    if (els.questionEyebrow) els.questionEyebrow.textContent = q.eyebrow || "MoneyMind Roast";
    if (els.questionTitle)   els.questionTitle.textContent   = q.title   || "";
    if (els.questionHint)    els.questionHint.textContent    = q.hint    || "Choose the option that fits best.";

    if (els.optionsContainer) {
      els.optionsContainer.innerHTML = "";

      (q.options || []).forEach((option) => {
        const btn = document.createElement("button");
        btn.className  = "option-btn";
        btn.type       = "button";
        btn.textContent = option.label || "";

        btn.addEventListener("click", () => {
          state.answers[q.id] = option;
          nextQuestion();
        });

        els.optionsContainer.appendChild(btn);
      });
    }

    if (els.backBtn) {
      els.backBtn.style.visibility = state.currentQuestionIndex === 0 ? "hidden" : "visible";
    }
  }

  function nextQuestion() {
    if (state.currentQuestionIndex < questions.length - 1) {
      state.currentQuestionIndex += 1;
      renderQuestion();
      return;
    }
    runAnalysis();
  }

  function previousQuestion() {
    if (state.currentQuestionIndex === 0) {
      showScreen(screens.intro);
      return;
    }
    state.currentQuestionIndex -= 1;
    renderQuestion();
  }

  function runAnalysis() {
    showScreen(screens.loading);

    setTimeout(() => {
      try {
        const result = window.RoastEngine?.analyzeRoast?.(state.answers);

        if (!result) throw new Error("RoastEngine returned no result.");

        state.lastResult = result;

        const saved = persistResult(result);

        if (!saved) {
          console.warn("Storage failed — dashboard may not receive roast data.");
        }

        renderResult(result);
        showScreen(screens.result);

      } catch (err) {
        console.error("Roast analysis failed:", err);
        alert("Something went wrong while generating your roast. Check the console.");
        showScreen(screens.intro);
      }
    }, 1800);
  }

  // ─── Storage — single key ─────────────────────────────────────────────────────

  function persistResult(result) {
    try {
      // Read existing data so we don't overwrite other tool data
      const existing = readUserData();

      const payload = {
        ...existing,
        roast: {
          completed:    true,
          updatedAt:    new Date().toISOString(),

          // Raw inputs
          answers: {
            age:     state.answers?.age     || null,
            income:  state.answers?.income  || null,
            savings: state.answers?.savings || null,
            invest:  state.answers?.invest  || null,
            goal:    state.answers?.goal    || null
          },

          // Computed outputs
          profileKey:    result.profileKey,
          profileName:   result.profile?.name || "",
          behaviorKey:   result.behaviorKey,
          goalValue:     result.goalValue,
          dashboardFocus: result.goalContext?.dashboardFocus || "clarity",

          headline:      result.headline,
          observation:   result.observation,
          incomeText:    result.incomeText,
          investText:    result.investText,
          investRateText: result.investRateText,

          profile:  result.profile,
          behavior: result.behavior,

          trajectory: {
            currentWealth:   result.trajectory?.currentWealth   || 0,
            optimizedWealth: result.trajectory?.optimizedWealth || 0,
            wealthDifference: result.trajectory?.wealthDifference || 0
          },

          currentAgeText:   result.currentAgeText,
          optimizedAgeText: result.optimizedAgeText
        },

        // Ensure other tool slots exist (dashboard reads these)
        capitalMap:        existing.capitalMap        || { completed: false, updatedAt: null },
        spendingVsBuilding: existing.spendingVsBuilding || { completed: false, updatedAt: null },
        leakage:           existing.leakage           || { completed: false, updatedAt: null },
        builder:           existing.builder           || { completed: false, updatedAt: null }
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;

    } catch (err) {
      console.warn("Could not save roast result to localStorage.", err);
      return false;
    }
  }

  function readUserData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  // ─── Render result ────────────────────────────────────────────────────────────

  function formatEuro(value) {
    if (window.RoastEngine?.formatEuro) return window.RoastEngine.formatEuro(value);

    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function getShareSupportingText(diff) {
    if (diff >= 300000) return "Your current money habits are costing you more than you think.";
    if (diff >= 150000) return "Small financial decisions. Big long-term consequences.";
    if (diff >= 50000)  return "Your current structure still leaves meaningful upside on the table.";
    return "Your financial structure still has hidden upside.";
  }

  function renderResult(result) {
    if (!result) return;

    if (els.headlineText)    els.headlineText.textContent    = result.headline    || "";
    if (els.observationText) els.observationText.textContent = result.observation || "";
    if (els.incomeText)      els.incomeText.textContent      = result.incomeText  || "";
    if (els.investText)      els.investText.textContent      = result.investText  || "";
    if (els.investRateText)  els.investRateText.textContent  = result.investRateText || "";

    if (els.profileName)        els.profileName.textContent        = result.profile?.name        || "";
    if (els.profileDescription) els.profileDescription.textContent = result.profile?.description || "";
    if (els.profileOpportunity) els.profileOpportunity.textContent = result.profile?.opportunity || "";

    const currentWealth   = result.trajectory?.currentWealth   || 0;
    const optimizedWealth = result.trajectory?.optimizedWealth || 0;
    const wealthDiff      = result.trajectory?.wealthDifference || 0;

    const fmtCurrent   = formatEuro(currentWealth);
    const fmtOptimized = formatEuro(optimizedWealth);
    const fmtDiff      = formatEuro(wealthDiff);

    if (els.currentWealthText)   els.currentWealthText.textContent   = fmtCurrent;
    if (els.optimizedWealthText) els.optimizedWealthText.textContent = fmtOptimized;
    if (els.currentAgeText)      els.currentAgeText.textContent      = result.currentAgeText   || "";
    if (els.optimizedAgeText)    els.optimizedAgeText.textContent    = result.optimizedAgeText || "";
    if (els.wealthDifferenceText) els.wealthDifferenceText.textContent = `Same income. ${fmtDiff} difference.`;

    if (els.behaviorTitle) els.behaviorTitle.textContent = result.behavior?.title      || "";
    if (els.behaviorText)  els.behaviorText.textContent  = result.behavior?.text       || "";
    if (els.lessonBtn)     els.lessonBtn.textContent     = result.behavior?.lessonLabel || "Learn this concept (3 min)";

    // Share card
    if (els.shareImageTitle)      els.shareImageTitle.textContent      = `Same income. ${fmtDiff} difference.`;
    if (els.shareImageSupporting) els.shareImageSupporting.textContent = getShareSupportingText(wealthDiff);
    if (els.shareCurrentWealth)   els.shareCurrentWealth.textContent   = fmtCurrent;
    if (els.shareOptimizedWealth) els.shareOptimizedWealth.textContent = fmtOptimized;
    if (els.shareWealthDifference) els.shareWealthDifference.textContent = "Same income. Better decisions.";

    // Goal tone — shown in next-step card if element exists
    const goalToneEl = document.getElementById("goalToneText");
    if (goalToneEl && result.goalContext?.tone) {
      goalToneEl.textContent = result.goalContext.tone;
    }
  }

  // ─── Dashboard navigation — with validation ───────────────────────────────────

  function openDashboard() {
    const data = readUserData();

    if (!data?.roast?.completed) {
      console.warn("Roast not saved correctly — aborting dashboard navigation.");
      alert("Something went wrong saving your results. Please try again.");
      return;
    }

    window.location.href = DASHBOARD_PATH;
  }

  // ─── Share actions ────────────────────────────────────────────────────────────

  function downloadShareCard() {
    const card = document.getElementById("shareImageCard");
    if (!card) { console.warn("shareImageCard not found."); return; }
    if (typeof html2canvas === "undefined") { console.warn("html2canvas not loaded."); return; }

    html2canvas(card, { backgroundColor: null, scale: 2 })
      .then((canvas) => {
        const link    = document.createElement("a");
        link.download = "moneymind-share-card.png";
        link.href     = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((err) => console.warn("Download share card failed.", err));
  }

  function bindShareActions() {
    const shareLinkedInBtn = document.getElementById("shareLinkedInBtn");
    if (shareLinkedInBtn) {
      shareLinkedInBtn.addEventListener("click", () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
      });
    }

    const shareXBtn = document.getElementById("shareXBtn");
    if (shareXBtn) {
      shareXBtn.addEventListener("click", () => {
        const text = encodeURIComponent(els.sharePreview?.innerText?.trim() || "My MoneyMind Roast");
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
      });
    }

    const downloadBtn = document.getElementById("downloadShareBtn");
    if (downloadBtn) downloadBtn.addEventListener("click", downloadShareCard);
  }

  // ─── Init ─────────────────────────────────────────────────────────────────────

  function init() {
    if (els.startBtn)      els.startBtn.addEventListener("click", startRoast);
    if (els.backBtn)       els.backBtn.addEventListener("click", previousQuestion);
    if (els.restartBtn)    els.restartBtn.addEventListener("click", restartRoast);
    if (els.lessonBtn)     els.lessonBtn.addEventListener("click", openDashboard);
    if (els.goDashboardBtn) els.goDashboardBtn.addEventListener("click", openDashboard);

    bindShareActions();
    showScreen(screens.intro);
  }

  init();

})();
