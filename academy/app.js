function loadContinueLearning() {
  const raw = localStorage.getItem("mm_last_lesson");

  if (!raw) return;

  const lastLesson = JSON.parse(raw);

  const currentPhaseValue = document.getElementById("currentPhaseValue");
  const nextLessonValue = document.getElementById("nextLessonValue");
  const continueLearningBtn = document.getElementById("continueLearningBtn");

  if (currentPhaseValue) {
    currentPhaseValue.innerText = lastLesson.phaseTitle || "Financial Foundations";
  }

  if (nextLessonValue) {
    nextLessonValue.innerText = lastLesson.title || "Continue your learning";
  }

  if (continueLearningBtn && lastLesson.id) {
    continueLearningBtn.href = `/academy/lesson/?id=${lastLesson.id}`;
  }
}

loadContinueLearning();
