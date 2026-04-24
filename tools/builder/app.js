/* ============================================
   BUILDER — app.js
   MoneyMind | tools/builder/app.js
   ============================================ */

const STORAGE_KEY = 'moneymind_user_data';
const DASHBOARD_PATH = '/apps/dashboard/';

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

function fmt(n) {
  return '\u20AC' + Math.round(n).toLocaleString('nl-NL');
}

// --- DATA EXTRACTION ---------------------------------------------------

function extractData() {
  const d = readUserData();
  const cm   = d.capitalMap        || {};
  const svb  = d.spendingVsBuilding || {};
  const leak = d.leakage            || {};
  const roast = d.roast             || {};

  const liquid   = cm.liquid   || 0;
  const invested = cm.invested || 0;
  const locked   = cm.locked   || 0;
  const debt     = cm.debt     || 0;
  const income   = svb.income  || 0;

  return {
    liquid, invested, locked, debt,
    totalAssets: liquid + invested + locked,
    netWorth:    liquid + invested + locked - debt,
    capitalComplete: !!cm.completed,

    income,
    fixed:        svb.fixed        || 0,
    lifestyle:    svb.lifestyle    || 0,
    building:     svb.building     || 0,
    buildingRatio: svb.buildingRatio || 0,
    spendingComplete: !!svb.completed,

    monthlyLeakage: leak.monthlyLeakage || 0,
    annualLeakage:  leak.annualLeakage  || 0,
    leakageRatio:   leak.leakageRatio   || 0,
    leakageComplete: !!leak.completed,

    profile: roast.profile || null,
    goal:    roast.goal    || null
  };
}

// --- PRIORITY ENGINE ---------------------------------------------------
// Rules determine which priorities apply, ranked by severity.

function buildPriorities(d) {
  const priorities = [];
  const monthsBuffer = d.income > 0 ? d.liquid / d.income : 0;

  // 1. No emergency buffer
  if (monthsBuffer < 3) {
    const needed = Math.max(0, (3 - monthsBuffer) * d.income);
    priorities.push({
      weight: 100,
      title: 'Build your emergency buffer',
      desc: `You have ${monthsBuffer.toFixed(1)} months of liquid cover. You need at least 3. That gap is ${fmt(needed)} — close this before anything else.`
    });
  }

  // 2. High leakage ratio
  if (d.leakageRatio > 15 && d.monthlyLeakage > 0) {
    priorities.push({
      weight: 90,
      title: 'Plug the leakage',
      desc: `${d.leakageRatio.toFixed(0)}% of your income disappears into low-value spend — ${fmt(d.monthlyLeakage)}/month, ${fmt(d.annualLeakage)}/year. Recover even half and you have a real building budget.`
    });
  }

  // 3. Building ratio too low
  if (d.buildingRatio < 15 && d.income > 0) {
    priorities.push({
      weight: 85,
      title: 'Increase your building ratio',
      desc: `Only ${d.buildingRatio.toFixed(0)}% of income goes toward building wealth. Target is 20%+. At your income that means adding ${fmt(d.income * 0.20 - d.building)}/month more.`
    });
  }

  // 4. High debt relative to assets
  if (d.debt > 0 && d.totalAssets > 0 && (d.debt / d.totalAssets) > 0.4) {
    priorities.push({
      weight: 80,
      title: 'Reduce your debt load',
      desc: `Your debt-to-assets ratio is ${((d.debt / d.totalAssets) * 100).toFixed(0)}%. That limits your options and costs you compounding. A structured paydown plan will unlock capacity.`
    });
  }

  // 5. Idle cash above buffer
  if (d.invested === 0 && d.liquid > d.income * 3) {
    priorities.push({
      weight: 70,
      title: 'Put idle cash to work',
      desc: `You have liquidity but nothing deployed. Cash above your 3-month buffer (${fmt(d.liquid - d.income * 3)} excess) is losing value every month. Time to allocate.`
    });
  }

  // 6. Solid foundation — optimise
  if (d.buildingRatio >= 20 && monthsBuffer >= 3) {
    priorities.push({
      weight: 60,
      title: 'Optimise your investment allocation',
      desc: `Your foundation is solid. The next lever is making your invested capital work harder. Review allocation, diversification, and return potential.`
    });
  }

  priorities.sort((a, b) => b.weight - a.weight);
  return priorities.slice(0, 5);
}

// --- MONTHLY PLAN ------------------------------------------------------

function buildMonthlyPlan(d) {
  if (d.income === 0) return [];

  const monthsBuffer   = d.income > 0 ? d.liquid / d.income : 0;
  const leakageTarget  = Math.max(0, d.monthlyLeakage * 0.5);
  const buildingTarget = Math.max(d.building, d.income * 0.20);
  const bufferContrib  = monthsBuffer < 3
    ? Math.min(d.income * 0.10, (3 - monthsBuffer) * d.income / 6)
    : 0;

  return [
    { label: 'Monthly income',           amount:  d.income,       color: 'good'   },
    { label: 'Fixed costs',              amount: -d.fixed,        color: 'danger' },
    { label: 'Lifestyle spending',       amount: -d.lifestyle,    color: null     },
    { label: 'Leakage to cut (target)',  amount: -leakageTarget,  color: 'warn'   },
    bufferContrib > 0
      ? { label: 'Buffer building',        amount:  bufferContrib,  color: 'good' }
      : null,
    { label: 'Wealth building target',   amount:  buildingTarget, color: 'good'   },
  ].filter(r => r && r.amount !== 0);
}

// --- AI PLAN GENERATOR ------------------------------------------------

async function generateAIPlan(d, priorities) {
  const priorityText = priorities
    .map((p, i) => `${i + 1}. ${p.title}: ${p.desc}`)
    .join('\n');

  const prompt = `You are a sharp, direct financial coach — not a cheerleader, not a therapist. You give honest, specific, actionable advice.

Here is the user's financial snapshot:
- Monthly income: ${fmt(d.income)}
- Fixed costs: ${fmt(d.fixed)} (${d.income > 0 ? ((d.fixed/d.income)*100).toFixed(0) : 0}% of income)
- Lifestyle spending: ${fmt(d.lifestyle)}
- Currently building: ${fmt(d.building)}/month (${d.buildingRatio.toFixed(0)}% of income)
- Liquid assets: ${fmt(d.liquid)} (${d.income > 0 ? (d.liquid/d.income).toFixed(1) : 0} months cover)
- Invested capital: ${fmt(d.invested)}
- Debt: ${fmt(d.debt)}
- Monthly leakage: ${fmt(d.monthlyLeakage)} (${d.leakageRatio.toFixed(0)}% of income)
- Financial goal: ${d.goal || 'Not specified'}
- Profile: ${d.profile || 'Not specified'}

Top priorities identified by the system:
${priorityText}

Write a 90-day action plan in 4-6 short, punchy paragraphs. Be specific — use the actual numbers. Do not use bullet points. Do not be generic. Do not say "great job" or use empty praise. Start directly with the most important action. Use plain language. End with one concrete monthly habit that will have the most impact.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');
  return text || 'Unable to generate plan. Please try again.';
}

// --- RENDER FUNCTIONS --------------------------------------------------

function renderSnapshot(d) {
  const monthsBuffer = d.income > 0 ? (d.liquid / d.income) : 0;
  const items = [
    { label: 'Income',       value: fmt(d.income),                                             color: '' },
    { label: 'Building',     value: fmt(d.building) + '/mo',                                   color: d.buildingRatio >= 20 ? 'good' : d.buildingRatio >= 10 ? '' : 'danger' },
    { label: 'Leakage',      value: fmt(d.monthlyLeakage) + '/mo',                             color: d.leakageRatio > 20 ? 'danger' : d.leakageRatio > 10 ? 'warn' : 'good' },
    { label: 'Net worth',    value: fmt(d.netWorth),                                            color: d.netWorth > 0 ? 'good' : 'danger' },
    { label: 'Liquid buffer',value: monthsBuffer.toFixed(1) + ' mo',                           color: monthsBuffer >= 3 ? 'good' : 'warn' },
  ];

  document.getElementById('snapshotGrid').innerHTML = items.map(it => `
    <div class="snapshot-item">
      <div class="snapshot-label">${it.label}</div>
      <div class="snapshot-value ${it.color}">${it.value}</div>
    </div>
  `).join('');
}

function renderPriorities(priorities) {
  document.getElementById('priorityList').innerHTML = priorities.map((p, i) => `
    <div class="priority-item">
      <div class="priority-rank rank-${i+1}">${i+1}</div>
      <div class="priority-body">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    </div>
  `).join('');
}

function renderMonthlyPlan(rows) {
  document.getElementById('monthlyGrid').innerHTML = rows.map(r => `
    <div class="monthly-row">
      <span class="monthly-label">${r.label}</span>
      <span class="monthly-amount ${r.color || ''}">${r.amount > 0 ? fmt(r.amount) : '-' + fmt(Math.abs(r.amount))}</span>
    </div>
  `).join('');
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = '';
}

// --- INIT --------------------------------------------------------------

async function init() {
  const d = extractData();
  const hasData = d.capitalComplete || d.spendingComplete || d.leakageComplete;

  if (!hasData) {
    show('noDataCard');
    return;
  }

  renderSnapshot(d);
  show('summaryCard');

  const priorities = buildPriorities(d);
  renderPriorities(priorities);
  show('priorityCard');

  const monthlyRows = buildMonthlyPlan(d);
  renderMonthlyPlan(monthlyRows);

  show('generateCard');

  document.getElementById('generateBtn').addEventListener('click', async () => {
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.textContent = 'Generating...';

    const aiOutput = document.getElementById('aiOutput');
    aiOutput.textContent = 'Analysing your numbers...';
    aiOutput.className = 'ai-output loading';
    show('planCard');

    try {
      const text = await generateAIPlan(d, priorities);
      aiOutput.textContent = text;
      aiOutput.className = 'ai-output';
    } catch(e) {
      aiOutput.textContent = 'Something went wrong generating the plan. Check your connection and try again.';
      aiOutput.className = 'ai-output';
      btn.disabled = false;
      btn.textContent = 'Try Again';
      return;
    }

    show('monthlyCard');
    show('doneCard');

    const existing = readUserData();
    existing.builder = {
      completed:   true,
      completedAt: new Date().toISOString(),
      priorities:  priorities.map(p => p.title)
    };
    writeUserData(existing);

    btn.textContent = 'Plan Generated';
  });
}

document.addEventListener('DOMContentLoaded', init);
