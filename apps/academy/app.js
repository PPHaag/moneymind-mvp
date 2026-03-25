(function () {

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

    if (progressValue) {
      progressValue.textContent = `${completed.length}/${total}`;
    }

    if (progressFill) {
      progressFill.style.width = `${(completed.length / total) * 100}%`;
    }

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

  function openLesson(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) return;

    currentLessonId = lessonId;

    const detailCard = document.getElementById("lessonDetailCard");
    const lessonEyebrow = document.getElementById("lessonEyebrow");
    const lessonTitle = document.getElementById("lessonTitle");
    const lessonConcept = document.getElementById("lessonConcept");
    const lessonWhy = document.getElementById("lessonWhy");
    const lessonExample = document.getElementById("lessonExample");
    const lessonInsight = document.getElementById("lessonInsight");
    const lessonReflection = document.getElementById("lessonReflection");

    if (lessonEyebrow) lessonEyebrow.textContent = lesson.eyebrow;
    if (lessonTitle) lessonTitle.textContent = lesson.title;
    if (lessonConcept) lessonConcept.textContent = lesson.concept;
    if (lessonWhy) lessonWhy.textContent = lesson.why;
    if (lessonExample) lessonExample.textContent = lesson.example;
    if (lessonInsight) lessonInsight.textContent = lesson.insight;
    if (lessonReflection) lessonReflection.textContent = lesson.reflection;

    if (detailCard) {
      detailCard.style.display = "block";
      detailCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function closeLesson() {
    const detailCard = document.getElementById("lessonDetailCard");
    if (detailCard) {
      detailCard.style.display = "none";
    }
    currentLessonId = null;
  }

  function markLessonComplete() {
    if (!currentLessonId) return;

    const state = getAcademyState();
    const completed = Array.isArray(state.completedLessons) ? state.completedLessons : [];

    if (!completed.includes(currentLessonId)) {
      completed.push(currentLessonId);
    }

    setAcademyState({
      ...state,
      completedLessons: completed,
      updatedAt: new Date().toISOString()
    });

    updateProgress();
  }

  function init() {
    const openButtons = document.querySelectorAll(".lesson-open-btn");
    const closeLessonBtn = document.getElementById("closeLessonBtn");
    const markCompleteBtn = document.getElementById("markCompleteBtn");

    openButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        openLesson(btn.dataset.lessonId);
      });
    });

    if (closeLessonBtn) {
      closeLessonBtn.addEventListener("click", closeLesson);
    }

    if (markCompleteBtn) {
      markCompleteBtn.addEventListener("click", markLessonComplete);
    }

    updateProgress();
  }

  document.addEventListener("DOMContentLoaded", init);

})();
