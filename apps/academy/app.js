(function () {

  // ── PRO GATE CONFIG ────────────────────────────────────────
  const PRO_LESSONS = ['lifestyle-inflation', 'cost-of-delay'];

  const lessons = {
    "assets-liabilities": {
      eyebrow: "Lesson 1 • Foundations",
      title: "Assets vs Liabilities",
      concept: "An asset puts money back into your life over time, either directly or indirectly. A liability mainly takes money out of your life, even if it looks impressive on the outside.",
      why: "Most people confuse ownership with wealth. But owning something expensive is not the same as owning something that improves your financial position.",
      example: "A car may feel like a sign of progress, but if it loses value, costs money every month, and adds nothing to your future capital, it behaves more like a liability than an asset.",
      insight: "Wealth is not about how expensive something looks. It is about what something does to your financial future.",
      reflection: "What in your current life looks like progress on the outside, but quietly slows you down underneath?"
    },
    "lifestyle-inflation": {
      eyebrow: "Lesson 2 • Behavior",
      title: "Lifestyle Inflation",
      concept: "Lifestyle inflation happens when your spending rises automatically as your income rises, leaving you with more comfort but not much more financial progress.",
      why: "This is one of the biggest reasons people earn more over time and still feel financially stuck. The extra money arrives, but it never turns into capital.",
      example: "A higher salary leads to nicer restaurants, better hotels, more subscriptions, and more convenience. None of it feels dramatic. But over time, the gap between income and wealth stays disappointingly small.",
      insight: "Earning more does not automatically build wealth. Without structure, a rising income often just funds a rising lifestyle.",
      reflection: "When your income improved in the past, what actually improved most: your future, or your lifestyle?"
    },
    "cost-of-delay": {
      eyebrow: "Lesson 3 • Wealth",
      title: "Cost of Delay",
      concept: "The cost of delay is what you lose by waiting to act. It is not only lost money. It is lost compounding, lost optionality, and lost momentum.",
      why: "People usually underestimate how expensive waiting is because the damage feels invisible in the short term. But time is one of the few things you can never earn back.",
      example: "Starting five years later may not feel dramatic today, but over a long time horizon it can create a surprisingly large gap in future wealth — even if the monthly difference feels manageable.",
      insight: "Delay feels harmless because it is quiet. That is exactly why it becomes expensive.",
      reflection: "Where in your financial life are you waiting for a perfect moment that may never come?"
    }
  };

  let currentLessonId = null;
  let userPlan = 'free';

  // ── PLAN FETCHING ──────────────────────────────────────────
  async function getPlan() {
    try {
      const response = await fetch('/api/auth.js?action=get-plan', {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) return 'free';
      const data = await response.json();
      return data.plan || 'free';
    } catch (err) {
      console.warn('Could not fetch plan, defaulting to free.', err);
      return 'free';
    }
  }

  // ── PRO MODAL ──────────────────────────────────────────────
  function showProModal() {
    const existing = document.getElementById('pro-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'pro-modal-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 24px; animation: mmFadeIn 0.18s ease;
    `;

    overlay.innerHTML = `
      <style>
        @keyframes mmFadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        #pro-modal-box { background: #fff; border-radius: 16px; padding: 36px 32px 28px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.18); }
        #pro-modal-box .modal-lock { font-size: 2.4rem; margin-bottom: 12px; }
        #pro-modal-box h2 { font-size: 1.25rem; font-weight: 700; margin: 0 0 10px; color: #111; }
        #pro-modal-box p { font-size: 0.95rem; color: #555; margin: 0 0 24px; line-height: 1.5; }
        #pro-modal-box .modal-badge { display: inline-block; background: #f0f0f0; color: #888; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 999px; padding: 4px 14px; margin-bottom: 20px; }
        #pro-modal-box .modal-soon { font-size: 0.88rem; color: #aaa; margin: 0; }
        #pro-modal-close { position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #999; line-height: 1; }
      </style>
      <div id="pro-modal-box" style="position:relative;">
        <button id="pro-modal-close" aria-label="Close">&times;</button>
        <div class="modal-lock">🔒</div>
        <div class="modal-badge">Pro feature</div>
        <h2>Full Academy</h2>
        <p>Unlock all lessons, deep dives and advanced financial frameworks.</p>
        <p class="modal-soon">Upgrade coming soon — stay tuned.</p>
      </div>
    `;

    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('#pro-modal-close').addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  // ── ACADEMY STATE ──────────────────────────────────────────
  function getAcademyState() {
    try {
      return JSON.parse(localStorage.getItem("mm_academy") || "{}");
    } catch (err) {
      console.warn("Could not read academy state.", err);
      return {};
    }
  }

  function setAcademyState(state) {
    try {
      localStorage.setItem("mm_academy", JSON.stringify(state));
    } catch (err) {
      console.warn("Could not save academy state.", err);
    }
  }

  function getCompletedLessons() {
    const state = getAcademyState();
    return Array.isArray(state.completedLessons) ? state.completedLessons : [];
  }

  function updateProgress() {
    const completed = getCompletedLessons();
    const total = Object.keys(lessons).length;
    const progressValue = document.getElementById("academyProgressValue");
    const progressFill = document.getElementById("academyProgressFill");

    if (progressValue) progressValue.textContent = `${completed.length}/${total}`;
    if (progressFill) progressFill.style.width = `${(completed.length / total) * 100}%`;

    Object.keys(lessons).forEach((lessonId) => {
      const tag = document.getElementById(`status-${lessonId}`);
      if (!tag) return;

      if (completed.includes(lessonId)) {
        tag.textContent = "Completed";
        tag.classList.add("completed");
      } else {
        tag.textContent = "Start";
        tag.classList.remove("completed");
      }
    });
  }

  // ── LESSON OPEN/CLOSE ──────────────────────────────────────
  function openLesson(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) return;

    currentLessonId = lessonId;

    const detailCard = document.getElementById("lessonDetailCard");
    document.getElementById("lessonEyebrow").textContent = lesson.eyebrow;
    document.getElementById("lessonTitle").textContent = lesson.title;
    document.getElementById("lessonConcept").textContent = lesson.concept;
    document.getElementById("lessonWhy").textContent = lesson.why;
    document.getElementById("lessonExample").textContent = lesson.example;
    document.getElementById("lessonInsight").textContent = lesson.insight;
    document.getElementById("lessonReflection").textContent = lesson.reflection;

    if (detailCard) {
      detailCard.style.display = "block";
      detailCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closeLesson() {
    const detailCard = document.getElementById("lessonDetailCard");
    if (detailCard) detailCard.style.display = "none";
    currentLessonId = null;
  }

  function markLessonComplete() {
    if (!currentLessonId) return;

    const state = getAcademyState();
    const completed = Array.isArray(state.completedLessons) ? state.completedLessons : [];

    if (!completed.includes(currentLessonId)) completed.push(currentLessonId);

    setAcademyState({ ...state, completedLessons: completed, updatedAt: new Date().toISOString() });
    updateProgress();
  }

  // ── RENDER PRO GATES ───────────────────────────────────────
  function renderProGates() {
    if (userPlan === 'pro') return;

    PRO_LESSONS.forEach(lessonId => {
      // Gate the open button
      const btn = document.querySelector(`.lesson-open-btn[data-lesson-id="${lessonId}"]`);
      if (btn) {
        btn.textContent = '🔒 Open Lesson';
        btn.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          showProModal();
        }, true);
      }

      // Dim the lesson card visually
      const card = document.querySelector(`.mm-lessonCard[data-lesson-id="${lessonId}"]`);
      if (card) {
        card.style.opacity = '0.6';
      }

      // Update status tag
      const tag = document.getElementById(`status-${lessonId}`);
      if (tag) {
        tag.textContent = 'Pro';
        tag.style.cssText = 'background:#f0f0f0; color:#aaa; font-size:0.72rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; padding:3px 10px; border-radius:999px;';
      }
    });
  }

  // ── INIT ───────────────────────────────────────────────────
  async function init() {
    userPlan = await getPlan();

    // Attach open buttons — pro gates will intercept via capture
    document.querySelectorAll(".lesson-open-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openLesson(btn.dataset.lessonId);
      });
    });

    const closeLessonBtn = document.getElementById("closeLessonBtn");
    if (closeLessonBtn) closeLessonBtn.addEventListener("click", closeLesson);

    const markCompleteBtn = document.getElementById("markCompleteBtn");
    if (markCompleteBtn) markCompleteBtn.addEventListener("click", markLessonComplete);

    updateProgress();
    renderProGates(); // after plan is known
  }

  document.addEventListener("DOMContentLoaded", init);

})();
