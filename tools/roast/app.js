(function(){
  const questions = window.ROAST_DATA.questions;

  const state = {
    currentQuestionIndex: 0,
    answers: {}
  };

  const screens = {
    intro: document.getElementById("introScreen"),
    question: document.getElementById("questionScreen"),
    loading: document.getElementById("loadingScreen"),
    result: document.getElementById("resultScreen")
  };

  const els = {
    startBtn: document.getElementById("startBtn"),
    backBtn: document.getElementById("backBtn"),
    progressText: document.getElementById("progressText"),
    progressPct: document.getElementById("progressPct"),
    progressFill: document.getElementById("progressFill"),
    questionEyebrow: document.getElementById("questionEyebrow"),
    questionTitle: document.getElementById("questionTitle"),
    questionHint: document.getElementById("questionHint"),
    optionsContainer: document.getElementById("optionsContainer"),

    headlineText: document.getElementById("headlineText"),
    observationText: document.getElementById("observationText"),
    incomeText: document.getElementById("incomeText"),
    investText: document.getElementById("investText"),
    investRateText: document.getElementById("investRateText"),
    profileName: document.getElementById("profileName"),
    profileDescription: document.getElementById("profileDescription"),
    profileOpportunity: document.getElementById("profileOpportunity"),
    currentWealthText: document.getElementById("currentWealthText"),
    optimizedWealthText: document.getElementById("optimizedWealthText"),
    currentAgeText: document.getElementById("currentAgeText"),
    optimizedAgeText: document.getElementById("optimizedAgeText"),
    wealthDifferenceText: document.getElementById("wealthDifferenceText"),
    behaviorTitle: document.getElementById("behaviorTitle"),
    behaviorText: document.getElementById("behaviorText"),
    lessonBtn: document.getElementById("lessonBtn"),
    sharePreview: document.getElementById("sharePreview"),
    copyShareBtn: document.getElementById("copyShareBtn"),
    restartBtn: document.getElementById("restartBtn")
  };

  function showScreen(target){
    Object.values(screens).forEach(screen => screen.classList.remove("active"));
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function startRoast(){
    state.currentQuestionIndex = 0;
    state.answers = {};
    renderQuestion();
    showScreen(screens.question);
  }

  function renderQuestion(){
    const q = questions[state.currentQuestionIndex];
    const index = state.currentQuestionIndex + 1;
    const pct = Math.round((index / questions.length) * 100);

    els.progressText.textContent = `Question ${index} of ${questions.length}`;
    els.progressPct.textContent = `${pct}%`;
    els.progressFill.style.width = `${pct}%`;

    els.questionEyebrow.textContent = q.eyebrow;
    els.questionTitle.textContent = q.title;
    els.questionHint.textContent = q.hint;
    els.optionsContainer.innerHTML = "";

    q.options.forEach(option => {
      const button = document.createElement("button");
      button.className = "option-btn";
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", () => {
        state.answers[q.id] = option;
        nextQuestion();
      });
      els.optionsContainer.appendChild(button);
    });

    els.backBtn.style.visibility = state.currentQuestionIndex === 0 ? "hidden" : "visible";
  }

  function nextQuestion(){
    if (state.currentQuestionIndex < questions.length - 1) {
      state.currentQuestionIndex += 1;
      renderQuestion();
      return;
    }

    runAnalysis();
  }

  function previousQuestion(){
    if (state.currentQuestionIndex === 0) {
      showScreen(screens.intro);
      return;
    }

    state.currentQuestionIndex -= 1;
    renderQuestion();
  }

  function runAnalysis(){
    showScreen(screens.loading);

    setTimeout(() => {
      const result = window.RoastEngine.analyzeRoast(state.answers);
      renderResult(result);
      showScreen(screens.result);
    }, 2200);
  }

  function renderResult(result){
    els.headlineText.textContent = result.headline;
    els.observationText.textContent = result.observation;
    els.incomeText.textContent = result.incomeText;
    els.investText.textContent = result.investText;
    els.investRateText.textContent = result.investRateText;

    els.profileName.textContent = result.profile.name;
    els.profileDescription.textContent = result.profile.description;
    els.profileOpportunity.textContent = result.profile.opportunity;

    els.currentWealthText.textContent = window.RoastEngine.formatEuro(result.trajectory.currentWealth);
    els.optimizedWealthText.textContent = window.RoastEngine.formatEuro(result.trajectory.optimizedWealth);
    els.currentAgeText.textContent = result.currentAgeText;
    els.optimizedAgeText.textContent = result.optimizedAgeText;
    els.wealthDifferenceText.textContent = `+ ${window.RoastEngine.formatEuro(result.trajectory.wealthDifference)}`;

    els.behaviorTitle.textContent = result.behavior.title;
    els.behaviorText.textContent = result.behavior.text;
    els.lessonBtn.textContent = result.behavior.lessonLabel;


    try {
      localStorage.setItem("moneymind_roast_result", JSON.stringify({
        answers: state.answers,
        result
      }));

      localStorage.setItem("mm_profile", JSON.stringify({
      income: state.answers?.income?.amount || 0,
      monthlyInvesting: state.answers?.invest?.amount || 0,
      yearsTo60: state.answers?.age?.yearsTo60 || 25,
      profileName: result?.profile?.name || "",
      profileDescription: result?.profile?.description || "",
      roastUpdatedAt: new Date().toISOString()
    }));

      
    } catch (err) {
      console.warn("Could not save roast result to localStorage.", err);
    }
  }

  async function copyShareText(){
    const text = els.sharePreview.textContent.trim();

    try {
      await navigator.clipboard.writeText(text);
      els.copyShareBtn.textContent = "Copied";
      setTimeout(() => {
        els.copyShareBtn.textContent = "Copy Result";
      }, 1400);
    } catch (err) {
      console.warn("Clipboard copy failed.", err);
      els.copyShareBtn.textContent = "Copy Failed";
      setTimeout(() => {
        els.copyShareBtn.textContent = "Copy Result";
      }, 1400);
    }
  }

  function restartRoast(){
    showScreen(screens.intro);
  }

 function init(){
  if (els.startBtn) {
    els.startBtn.addEventListener("click", startRoast);
  }

  if (els.backBtn) {
    els.backBtn.addEventListener("click", previousQuestion);
  }

  if (els.copyShareBtn) {
    els.copyShareBtn.addEventListener("click", copyShareText);
  }

  if (els.restartBtn) {
    els.restartBtn.addEventListener("click", restartRoast);
  }

  if (els.lessonBtn) {
    els.lessonBtn.addEventListener("click", () => {
      alert("Hook this to your Academy lesson route later. For now: this is your behavioral lesson CTA.");
    });
  }

  const downloadBtn = document.getElementById("downloadShareBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      const card = document.getElementById("shareImageCard");

      if (!card) {
        console.warn("shareImageCard not found.");
        return;
      }

      if (typeof html2canvas === "undefined") {
        console.warn("html2canvas is not loaded.");
        return;
      }

      html2canvas(card, {
        backgroundColor: null,
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement("a");
        link.download = "moneymind-share-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }).catch(function (err) {
        console.warn("Download share card failed.", err);
      });
    });
  }

  showScreen(screens.intro);
}

init();
})();
