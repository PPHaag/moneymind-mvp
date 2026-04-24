/* ============================================
   ACADEMY — app.js
   MoneyMind | apps/academy/app.js
   ============================================ */

const STORAGE_KEY = 'moneymind_user_data';

const lessons = {
  'assets-liabilities': {
    eyebrow: 'Lesson 1 • Foundations',
    title: 'Assets vs Liabilities',
    concept: 'An asset puts money back into your life over time, either directly or indirectly. A liability mainly takes money out of your life — even if it looks impressive on the outside.',
    why: 'Most people confuse ownership with wealth. But owning something expensive is not the same as owning something that improves your financial position. The distinction changes how you see almost every financial decision.',
    example: 'A car may feel like a sign of progress, but if it loses value, costs money every month, and adds nothing to your future capital, it behaves more like a liability than an asset. A rental property that generates income every month, even after costs, is an asset.',
    insight: 'Wealth is not about how expensive something looks. It is about what something does to your financial future. Before you buy, ask: does this grow my position or shrink it?',
    reflection: 'What in your current life looks like progress on the outside, but quietly slows you down underneath?'
  },
  'income-vs-wealth': {
    eyebrow: 'Lesson 2 • Foundations',
    title: 'Income vs Wealth',
    concept: 'Income is what arrives in your account each month. Wealth is what remains after you have lived your life. They are related — but they are not the same thing, and confusing them is one of the most expensive mistakes people make.',
    why: 'High earners regularly arrive at retirement with little to show for decades of work. Modest earners sometimes build surprising financial independence. The difference is almost never income. It is what was done with it.',
    example: 'A freelancer earning €8,000 per month who spends €7,800 is poorer in every meaningful sense than a salaried employee earning €3,500 who consistently builds €700 per month. After ten years, the math is not even close.',
    insight: 'Income is the raw material. Wealth is the result of what you build with it. MoneyMind measures both — but your building ratio tells you which direction you are actually moving.',
    reflection: 'If your income stopped tomorrow, how long could your current financial structure sustain your life?'
  },
  'lifestyle-inflation': {
    eyebrow: 'Lesson 3 • Behavior',
    title: 'Lifestyle Inflation',
    concept: 'Lifestyle inflation happens when your spending rises automatically as your income rises, leaving you with more comfort but not much more financial progress.',
    why: 'This is one of the biggest reasons people earn more over time and still feel financially stuck. The extra money arrives, but it never turns into capital. Each pay rise gets absorbed before it can compound.',
    example: 'A higher salary leads to a nicer apartment, better restaurants, more subscriptions, newer tech, and more convenience. None of it feels dramatic. But over time, the gap between income and wealth stays disappointingly small — because the lifestyle always fills the available space.',
    insight: 'Earning more does not automatically build wealth. Without structure, a rising income often just funds a rising lifestyle. The fix is simple but uncomfortable: decide in advance what percentage of any increase goes to building, not living.',
    reflection: 'When your income improved in the past, what actually improved most — your future, or your lifestyle?'
  },
  'cost-of-delay': {
    eyebrow: 'Lesson 4 • Wealth',
    title: 'Cost of Delay',
    concept: 'The cost of delay is what you lose by waiting to act. It is not only lost money — it is lost compounding, lost optionality, and lost momentum. Time is the one resource you cannot earn back.',
    why: 'People consistently underestimate how expensive waiting is because the damage feels invisible in the short term. The pain of inaction only becomes clear years later, when the gap between where you are and where you could have been becomes impossible to close quickly.',
    example: 'Starting to invest €300 per month at age 25 versus age 35 does not produce a 10-year difference in outcome. It produces a vastly larger gap — because the earlier years are the ones that compound the longest. Ten years of delay in your 20s can cost you more than twenty years of effort later.',
    insight: 'Delay feels harmless because it is quiet. There is no invoice for waiting. But compounding rewards action early and punishes hesitation silently. The best time to start was earlier. The second best time is now.',
    reflection: 'Where in your financial life are you waiting for a perfect moment that may never come?'
  },
  'first-etf': {
    eyebrow: 'Lesson 5 • Investing',
    title: 'Your First Investment',
    concept: 'An ETF — Exchange Traded Fund — is a basket of assets that trades like a single share. A broad market ETF lets you own a small piece of hundreds or thousands of companies at once, for very low cost. It is the most practical starting point for most investors.',
    why: 'Most people delay investing because they feel they need to know more, pick the right moment, or choose the right stocks. This delay is expensive. An ETF removes most of that complexity: you do not need to pick winners, you simply own the market.',
    example: 'An ETF tracking the MSCI World index gives you exposure to over 1,500 companies across 23 developed countries. If global economies grow over time — which historically they have — so does your investment. You do not need to predict which company wins. You own all of them.',
    insight: 'The first investment does not need to be perfect. It needs to exist. Starting with €100/month in a low-cost global ETF beats waiting for certainty indefinitely. Time in the market consistently outperforms timing the market.',
    reflection: 'What is the one thing that has stopped you from investing so far — and is that reason actually still valid?'
  }
};

const TOTAL_LESSONS = Object.keys(lessons).length;

// --- STORAGE -----------------------------------------------------------

function readUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

function writeUserData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch(e) {}
}

function getCompletedLessons() {
  const d = readUserData();
  return Array.isArray(d.academy?.completedLessons) ? d.academy.completedLessons : [];
}

function saveLessonComplete(lessonId) {
  const d = readUserData();
  const academy = d.academy || {};
  const completed = Array.isArray(academy.completedLessons) ? academy.completedLessons : [];
  if (!completed.includes(lessonId)) completed.push(lessonId);
  d.academy = {
    ...academy,
    completedLessons: completed,
    updatedAt: new Date().toISOString()
  };
  writeUserData(d);
}

// --- UI ----------------------------------------------------------------

let currentLessonId = null;

function updateProgress() {
  const completed = getCompletedLessons();

  const valEl = document.getElementById('academyProgressValue');
  const fillEl = document.getElementById('academyProgressFill');
  if (valEl) valEl.textContent = `${completed.length}/${TOTAL_LESSONS}`;
  if (fillEl) fillEl.style.width = `${(completed.length / TOTAL_LESSONS) * 100}%`;

  Object.keys(lessons).forEach(id => {
    const tag = document.getElementById(`status-${id}`);
    if (!tag) return;
    if (completed.includes(id)) {
      tag.textContent = 'Completed';
      tag.classList.add('completed');
    } else {
      tag.textContent = 'Start';
      tag.classList.remove('completed');
    }
  });
}

function openLesson(lessonId) {
  const lesson = lessons[lessonId];
  if (!lesson) return;
  currentLessonId = lessonId;

  document.getElementById('lessonEyebrow').textContent    = lesson.eyebrow;
  document.getElementById('lessonTitle').textContent      = lesson.title;
  document.getElementById('lessonConcept').textContent    = lesson.concept;
  document.getElementById('lessonWhy').textContent        = lesson.why;
  document.getElementById('lessonExample').textContent    = lesson.example;
  document.getElementById('lessonInsight').textContent    = lesson.insight;
  document.getElementById('lessonReflection').textContent = lesson.reflection;

  const card = document.getElementById('lessonDetailCard');
  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeLesson() {
  document.getElementById('lessonDetailCard').style.display = 'none';
  currentLessonId = null;
}

function markComplete() {
  if (!currentLessonId) return;
  saveLessonComplete(currentLessonId);
  updateProgress();
  document.getElementById('markCompleteBtn').textContent = 'Completed ✓';
  document.getElementById('markCompleteBtn').disabled = true;
}

// --- INIT --------------------------------------------------------------

function init() {
  document.querySelectorAll('.lesson-open-btn').forEach(btn => {
    btn.addEventListener('click', () => openLesson(btn.dataset.lessonId));
  });

  document.getElementById('closeLessonBtn').addEventListener('click', closeLesson);
  document.getElementById('markCompleteBtn').addEventListener('click', markComplete);

  updateProgress();
}

document.addEventListener('DOMContentLoaded', init);
