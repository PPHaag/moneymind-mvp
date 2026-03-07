function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function titleToIntro(title) {
  return `This lesson explains the core idea behind "${title}" and why it matters for building real wealth.`;
}

function titleToConcept(title) {
  return `"${title}" is an important concept within the MoneyMind Academy. This lesson introduces the idea in a practical and accessible way.`;
}

function titleToWhy(title) {
  return `Understanding "${title}" helps improve decision quality, long-term thinking and financial clarity.`;
}

function titleToExample(title) {
  return `A real-world financial situation can often be better understood once the principle of "${title}" becomes clear.`;
}

function titleToKeyInsight(title) {
  return `${title} is not just theory. It affects how people build, protect and deploy capital in real life.`;
}

function titleToReflection(title) {
  return `How does "${title}" show up in your own financial situation or decision-making?`;
}

function toolIdToLabel(toolId) {
  const labels = {
    "capital-map": "Capital Map",
    "allocation": "Allocation",
    "leakage": "Wealth Leakage",
    "cost-of-delay": "Cost of Delay",
    "builder": "Wealth Builder"
  };

  return labels[toolId] || "Related Tool";
}

function toolIdToPath(toolId) {
  const paths = {
    "capital-map": "/tools/capital-map/",
    "allocation": "/tools/allocation/",
    "leakage": "/tools/leakage/",
    "cost-of-delay": "/tools/cost-of-delay/",
    "builder": "/tools/builder/"
  };

  return paths[toolId] || "/academy/";
}

function getCompletedLessons() {
  const raw = localStorage.getItem("mm_completed_lessons");
  return raw ? JSON.parse(raw) : [];
}

function saveCompletedLessons(completedLessons) {
  localStorage.setItem("mm_completed_lessons", JSON.stringify(completedLessons));
}

function saveLastLesson(data) {
  localStorage.setItem("mm_last_lesson", JSON.stringify(data));
}

function updateLessonStatus(lessonId) {
  const completedLessons = getCompletedLessons();
  const statusText = document.getElementById("lessonStatusText");
  const completeBtn = document.getElementById("completeLessonBtn");

  if (!statusText || !completeBtn) return;

  if (completedLessons.includes(lessonId)) {
    statusText.innerText = "This lesson has been completed.";
    completeBtn.innerText = "Lesson Completed";
    completeBtn.disabled = true;
  } else {
    statusText.innerText = "This lesson is not completed yet.";
    completeBtn.innerText = "Mark Lesson as Complete";
    completeBtn.disabled = false;
  }
}

async function loadLesson() {
  try {
    const lessonId = getLessonIdFromUrl();

    const lessonResponse = await fetch("/academy/lessons.json");
    const lessons = await lessonResponse.json();

    const moduleResponse = await fetch("/academy/modules.json");
    const phases = await moduleResponse.json();

    const lesson = lessons.find((item) => item.id === lessonId);

    if (!lesson) {
      document.getElementById("lessonTitle").innerText = "Lesson not found";
      return;
    }

    let moduleTitle = "Module";
    let phaseTitle = "Phase";

    phases.forEach((phase) => {
      phase.modules.forEach((module) => {
        if (module.id === lesson.moduleId) {
          moduleTitle = module.title;
          phaseTitle = phase.title;
        }
      });
    });

    const relatedTool =
      lesson.toolLinks && lesson.toolLinks.length > 0
        ? lesson.toolLinks[0]
        : "capital-map";

    document.getElementById("phasePill").innerText = phaseTitle;
    document.getElementById("modulePill").innerText = moduleTitle;
    document.getElementById("durationPill").innerText = `${lesson.durationMin} min read`;

    document.getElementById("lessonTitle").innerText = lesson.title;
    document.getElementById("lessonIntro").innerText = titleToIntro(lesson.title);
    document.getElementById("conceptText").innerText = titleToConcept(lesson.title);
    document.getElementById("whyText").innerText = titleToWhy(lesson.title);
    document.getElementById("exampleText").innerText = titleToExample(lesson.title);
    document.getElementById("keyInsightText").innerText = titleToKeyInsight(lesson.title);
    document.getElementById("reflectionText").innerText = titleToReflection(lesson.title);

    document.getElementById("toolText").innerText =
      `This lesson connects directly to ${toolIdToLabel(relatedTool)}. Use the tool to apply the concept in practice.`;

    document.getElementById("toolLink").href = toolIdToPath(relatedTool);
    document.getElementById("toolLink").innerText = `Open ${toolIdToLabel(relatedTool)}`;

    saveLastLesson({
      id: lesson.id,
      title: lesson.title,
      moduleId: lesson.moduleId,
      moduleTitle,
      phaseTitle,
      durationMin: lesson.durationMin
    });

    updateLessonStatus(lesson.id);

    const completeBtn = document.getElementById("completeLessonBtn");
    if (completeBtn) {
      completeBtn.onclick = function () {
        const completedLessons = getCompletedLessons();

        if (!completedLessons.includes(lesson.id)) {
          completedLessons.push(lesson.id);
          saveCompletedLessons(completedLessons);
        }

        updateLessonStatus(lesson.id);
      };
    }
  } catch (error) {
    console.error("Failed to load lesson:", error);
    document.getElementById("lessonTitle").innerText = "Something went wrong";
  }
}

loadLesson();
