const STORAGE_KEY = 'moneymind_user_data';

const TOOL_PATHS = {
  capitalMap: '/tools/capital-map/index.html',
  spendingVsBuilding: '/tools/spending-vs-building/index.html',
  leakage: '/tools/leakage/index.html',
  builder: '/tools/builder/index.html',
  roast: '/tools/roast/index.html',
  weeklyCheckin: '/planning/moneymind-weekly.html'
};

// ── PRO GATE CONFIG ──────────────────────────────────────────
const PRO_FEATURES = {
  aiInsight:     { label: 'AI Insight',       description: 'Get a personalized AI analysis of your full financial picture.' },
  builder:       { label: 'Builder Tool',     description: 'Build and refine your personal wealth plan with guided steps.' },
  weeklyCheckin: { label: 'Weekly Check-in',  description: 'Track your progress week by week and spot patterns over time.' },
  academyFull:   { label: 'Full Academy',     description: 'Unlock all modules, deep dives and advanced financial frameworks.' }
};

// ── PLAN STATE ───────────────────────────────────────────────
let userPlan = 'free';

// ── PLAN FETCHING ────────────────────────────────────────────
async function getPlan() {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'get-plan' })
    });
    if (!response.ok) return 'free';
    const data = await response.json();
    return data.plan || 'free';
  } catch (err) {
    console.warn('Could not fetch plan, defaulting to free.', err);
    return 'free';
  }
}

// ── PRO MODAL ────────────────────────────────────────────────
function showProModal(featureKey) {
  const feature = PRO_FEATURES[featureKey] || { label: 'This feature', description: 'This is a Pro feature.' };

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
      <div class="modal-lock">&#128274;</div>
      <div class="modal-badge">Pro feature</div>
      <h2>${feature.label}</h2>
      <p>${feature.description}</p>
      <p class="modal-soon">Upgrade coming soon &mdash; stay tuned.</p>
    </div>
  `;

  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#pro-modal-close').addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}

// ── GATE CHECK ───────────────────────────────────────────────
function checkGate(featureKey) {
  if (userPlan === 'pro') return true;
  showProModal(featureKey);
  return false;
}

// ── PLAN BADGE ───────────────────────────────────────────────
function renderPlanBadge() {
  const topbarRight = document.querySelector('.topbar-right');
  if (!topbarRight) return;
  const existing = document.getElementById('plan-badge');
  if (existing) existing.remove();
  const badge = document.createElement('span');
  badge.id = 'plan-badge';
  badge.textContent = userPlan === 'pro' ? 'Pro' : 'Free';
  badge.style.cssText = `
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 999px;
    background: ${userPlan === 'pro' ? '#111' : '#f0f0f0'};
    color: ${userPlan === 'pro' ? '#fff' : '#999'};
    margin-left: 10px; vertical-align: middle;
  `;
  topbarRight.appendChild(badge);
}

// ── PRO GATES ────────────────────────────────────────────────
function renderProGates() {
  if (userPlan === 'pro') return;

  document.querySelectorAll('a[href*="builder"]').forEach(link => {
    if (link.id === 'next-btn') return;
    link.addEventListener('click', (e) => { e.preventDefault(); showProModal('builder'); });
    link.style.opacity = '0.6';
    link.style.cursor = 'pointer';
  });

  document.querySelectorAll('a[href*="moneymind-weekly"]').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); showProModal('weeklyCheckin'); });
    link.style.opacity = '0.6';
    link.style.cursor = 'pointer';
  });
}

// ── DATA HELPERS ─────────────────────────────────────────────

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
    path: TOOL_PATHS.capitalMap,
    gated: false
  };
  if (!userData.spendingVsBuilding?.completed) return {
    title: 'Check your Spending vs Building ratio',
    desc: 'The next weak point is whether your income is actually converting into long-term capital.',
    path: TOOL_PATHS.spendingVsBuilding,
    gated: false
  };
  if (!userData.leakage?.completed) return {
    title: 'Run your Leakage Check',
    desc: 'Some spending is fine. Some spending quietly blocks future wealth. You need to know the difference.',
    path: TOOL_PATHS.leakage,
    gated: false
  };
  return {
    title: 'Refine your wealth plan',
    desc: 'Your core tools are done. The next step is improving consistency and tightening your system.',
    path: TOOL_PATHS.builder,
    gated: true
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

// ── RENDER FUNCTIONS ─────────────────────────────────────────

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

  if (!btnEl) return;

  if (next.gated && userPlan !== 'pro') {
    btnEl.textContent = 'Open tool';
    btnEl.style.cursor = 'pointer';
    btnEl.setAttribute('href', '#');
    btnEl.addEventListener('click', (e) => {
      e.preventDefault();
      showProModal('builder');
    });
  } else {
    btnEl.textContent = 'Open tool';
    btnEl.style.cursor = 'pointer';
    btnEl.setAttribute('href', next.path);
  }
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

// ── AI INSIGHT ───────────────────────────────────────────────

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
  } catch (e) { return ''; }
}

function scrollToAICard() {
  const card = document.querySelector('.ai-card');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  scrollToAICard();

  const fallbackTimer = setTimeout(() => {
    if (currentAIState === 'loading') {
      const saved = readUserData();
      if (saved.ai?.lastInsight) {
        renderAIResult(saved.ai.lastInsight, true);
        scrollToAICard();
      } else {
        setAIState('placeholder');
        showAIError('The analysis is taking too long. Please try again.');
      }
    }
  }, 20000);

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
    scrollToAICard();

    const updated = readUserData();
    updated.ai = { lastInsight: result, lastUpdated: new Date().toISOString() };
    writeUserData(updated);

  } catch (err) {
    clearTimeout(fallbackTimer);
    console.error('AI insight error:', err);

    const saved = readUserData();
    if (saved.ai?.lastInsight) {
      renderAIResult(saved.ai.lastInsight, true);
      scrollToAICard();
    } else {
      setAIState('placeholder');
      showAIError('Could not load AI insight. Check your connection and try again.');
    }
  }
}

// ── INIT ─────────────────────────────────────────────────────
async function init() {
  // getPlan faalt nooit meer de rest
  try {
    userPlan = await getPlan();
  } catch (err) {
    console.warn('getPlan failed, using free.', err);
    userPlan = 'free';
  }

  const userData = readUserData();

  renderHeader(userData);
  renderSnapshot(userData);
  renderNextMove(userData);
  renderToolStatus(userData);
  renderPlanBadge();
  renderProGates();

  if (userPlan === 'pro' && userData.ai?.lastInsight) {
    renderAIResult(userData.ai.lastInsight, true);
  } else {
    setAIState('placeholder');
  }

  const aiBtn = document.getElementById('generate-ai-insight-btn');
  if (aiBtn) {
    aiBtn.textContent = 'Analyze My Situation';
    if (userPlan !== 'pro') {
      aiBtn.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        showProModal('aiInsight');
      }, true);
    } else {
      aiBtn.addEventListener('click', handleAIClick);
    }
  }

  const regenBtn = document.getElementById('regenerate-btn');
  if (regenBtn) {
    if (userPlan !== 'pro') {
      regenBtn.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        showProModal('aiInsight');
      }, true);
    } else {
      regenBtn.addEventListener('click', handleAIClick);
    }
  }
}

init();
