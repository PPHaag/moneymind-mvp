const STORAGE_KEY = 'moneymind_user_data';

const TOOL_PATHS = {
  capitalMap: '/tools/capital-map/index.html',
  spendingVsBuilding: '/tools/spending-vs-building/index.html',
  leakage: '/tools/leakage/index.html',
  builder: '/tools/builder/index.html',
  roast: '/tools/roast/index.html'
};

function readUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data.roast = data.roast || { completed: false };
    data.capitalMap = data.capitalMap || { completed: false };
    data.spendingVsBuilding = data.spendingVsBuilding || { completed: false };
    data.leakage = data.leakage || { completed: false };
    data.builder = data.builder || { completed: false };
    return data;
  } catch (err) {
    console.warn('Could not read user data.', err);
    return {};
  }
}

function writeUserData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not write user data.', err);
  }
}

function formatEuro(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getNextStep(userData) {
  if (!userData.capitalMap?.completed) return {
    title: 'Map your capital structure',
    desc: 'Before optimizing anything else, understand what is directly usable, accessible, and locked.',
    path: TOOL_PATHS.capitalMap
  };
  if (!userData.spendingVsBuilding?.completed) return {
    title: 'Check your Spending vs Building ratio',
    desc: 'The next weak point is whether your income is actually converting into long-term capital.',
    path: TOOL_PATHS.spendingVsBuilding
  };
  if (!userData.leakage?.completed) return {
    title: 'Run your Leakage Check',
    desc: 'Some spending is fine. Some spending quietly blocks future wealth. You need to know the difference.',
    path: TOOL_PATHS.leakage
  };
  return {
    title: 'Refine your wealth plan',
    desc: 'Your core tools are done. The next step is improving consistency and tightening your system.',
    path: TOOL_PATHS.builder
  };
}

function getTagClass(completed, isNext) {
  if (completed) return 'tag-ok';
  if (isNext) return 'tag-warn';
  return 'tag-bad';
}

function getTagLabel(completed, isNext) {
  if (completed) return 'Completed';
  if (isNext) return 'Up next';
  return 'Not started';
}

function renderHeader(userData) {
  const headline = document.getElementById('dash-headline');
  const sub = document.getElementById('dash-sub');
  if (!headline || !sub) return;

  if (!userData.roast?.completed) {
    headline.textContent = 'Start with your Financial Roast.';
    sub.textContent = 'Complete the Roast first to unlock your dashboard.';
    return;
  }

  headline.textContent = userData.roast.headline || 'Your first pattern is visible.';
  sub.textContent = userData.roast.observation || 'Here is where you stand and what to focus on next.';
}

function renderSnapshot(userData) {
  if (!userData.capitalMap?.completed) {
    setText('snap-direct', '-');
    setText('snap-accessible', '-');
    setText('snap-locked', '-');
    return;
  }
  setText('snap-direct', formatEuro(userData.capitalMap.directCapital || 0));
  setText('snap-accessible', formatEuro(userData.capitalMap.accessibleCapital || 0));
  setText('snap-locked', formatEuro(userData.capitalMap.lockedCapital || 0));
}

function renderNextMove(userData) {
  const next = getNextStep(userData);
  const titleEl = document.getElementById('next-title');
  const descEl = document.getElementById('next-desc');
  const btnEl = document.getElementById('next-btn');

  if (titleEl) titleEl.textContent = next.title;
  if (descEl) descEl.textContent = next.desc;
  if (btnEl) btnEl.setAttribute('href', next.path);
}

function renderToolStatus(userData) {
  const capitalDone = !!userData.capitalMap?.completed;
  const spendingDone = !!userData.spendingVsBuilding?.completed;
  const leakageDone = !!userData.leakage?.completed;

  const setTag = (id, done, isNext) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = getTagLabel(done, isNext);
    el.className = 'tool-tag ' + getTagClass(done, isNext);
  };

  setTag('tag-roast', !!userData.roast?.completed, false);
  setTag('tag-capital', capitalDone, !capitalDone);
  setTag('tag-spending', spendingDone, capitalDone && !spendingDone);
  setTag('tag-leakage', leakageDone, spendingDone && !leakageDone);
}

// ── AI INSIGHT ──────────────────────────────────────────────

let currentAIState = 'placeholder';

function setAIState(state) {
  currentAIState = state;
  const placeholder = document.getElementById('ai-placeholder');
  const loading = document.getElementById('ai-loading');
  const result = document.getElementById('ai-result');
  const dot = document.getElementById('ai-dot');
  const btn = document.getElementById('generate-ai-insight-btn');

  if (state === 'placeholder') {
    if (placeholder) placeholder.hidden = false;
    if (loading) loading.hidden = true;
    if (result) result.hidden = true;
    if (dot) dot.classList.remove('active');
    if (btn) btn.disabled = false;
  } else if (state === 'loading') {
    if (placeholder) placeholder.hidden = true;
    if (loading) loading.hidden = false;
    if (result) result.hidden = true;
    if (dot) dot.classList.remove('active');
    if (btn) btn.disabled = true;
  } else if (state === 'result') {
    if (placeholder) placeholder.hidden = true;
    if (loading) loading.hidden = true;
    if (result) result.hidden = false;
    if (dot) dot.classList.add('active');
    if (btn) btn.disabled = false;
  }
}

function formatInsightDate(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleString('nl-NL', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return '';
  }
}

function renderAIResult(result, fromCache) {
  setText('ai-insight-title', result.title || 'Your financial pattern');
  setText('ai-what-you-see', result.whatYouSee || result.whatyousee || '-');
  setText('ai-why-it-matters', result.whyItMatters || result.whyitmatters || '-');
  setText('ai-think-about', result.thinkAbout || result.thinkabout || '-');
  setText('ai-next-step', result.nextStep || result.nextstep || '-');

  const cacheLabel = document.getElementById('ai-cache-label');
  if (cacheLabel) {
    if (fromCache) {
      const userData = readUserData();
      const date = formatInsightDate(userData.ai?.lastUpdated);
      cacheLabel.textContent = date ? 'Last analyzed: ' + date : 'Previous insight';
      cacheLabel.hidden = false;
    } else {
      cacheLabel.hidden = true;
    }
  }

  setAIState('result');
}

function buildDashboardData(userData) {
  const roast = userData.roast || {};
  return {
    roastCompleted: !!roast.completed,
    headline: roast.headline || '',
    observation: roast.observation || '',
    profileName: roast.profile?.name || '',
    behaviorTitle: roast.behavior?.title || '',
    currentWealth: Number(roast.trajectory?.currentWealth || 0),
    capitalMap: userData.capitalMap || {},
    spendingVsBuilding: userData.spendingVsBuilding || {},
    leakage: userData.leakage || {}
  };
}

function showAIError(message) {
  const el = document.getElementById('ai-error-msg');
  if (el) {
    el.textContent = message;
    el.hidden = false;
    setTimeout(() => { el.hidden = true; }, 5000);
  }
}

async function handleAIClick() {
  const userData = readUserData();
  const data = buildDashboardData(userData);

  setAIState('loading');

  // Timeout after 15 seconds — fall back gracefully
  const fallbackTimer = setTimeout(() => {
    if (currentAIState === 'loading') {
      const saved = readUserData();
      if (saved.ai?.lastInsight) {
        renderAIResult(saved.ai.lastInsight, true);
      } else {
        setAIState('placeholder');
        showAIError('The analysis is taking too long. Please try again.');
      }
    }
  }, 15000);

  try {
    const response = await fetch('/api/ai-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    clearTimeout(fallbackTimer);

    if (!response.ok) throw new Error('API status ' + response.status);

    const result = await response.json();
    console.log('AI result received:', result);
    renderAIResult(result, false);

    const updated = readUserData();
    updated.ai = { lastInsight: result, lastUpdated: new Date().toISOString() };
    writeUserData(updated);

  } catch (err) {
    clearTimeout(fallbackTimer);
    console.error('AI insight error:', err);

    // If we have a cached result, show it instead of failing hard
    const saved = readUserData();
    if (saved.ai?.lastInsight) {
      renderAIResult(saved.ai.lastInsight, true);
    } else {
      setAIState('placeholder');
      showAIError('Could not load AI insight. Check your connection and try again.');
    }
  }
}

function init() {
  const userData = readUserData();

  renderHeader(userData);
  renderSnapshot(userData);
  renderNextMove(userData);
  renderToolStatus(userData);

  // Show cached insight on load if available — clearly labeled as cached
  if (userData.ai?.lastInsight) {
    renderAIResult(userData.ai.lastInsight, true);
  } else {
    setAIState('placeholder');
  }

  const aiBtn = document.getElementById('generate-ai-insight-btn');
  if (aiBtn) aiBtn.addEventListener('click', handleAIClick);

  const regenBtn = document.getElementById('regenerate-btn');
  if (regenBtn) regenBtn.addEventListener('click', handleAIClick);
}

init();
