const STORAGE_KEY = 'moneymind_user_data';
const DASHBOARD_PATH = '/apps/dashboard/';

function readUserData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
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

function fmt(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

function fmtPct(value) {
  return Math.round((value || 0) * 100) + '%';
}

function getVal(id) {
  return Number(document.getElementById(id)?.value || 0);
}

function getHeadline(monthly, ratio) {
  if (monthly <= 0)    return 'No obvious leakage here. Good.';
  if (ratio >= 0.2)    return 'A serious part of your income is leaking away.';
  if (ratio >= 0.1)    return 'More leakage here than you probably feel month to month.';
  if (monthly >= 250)  return 'Small monthly leakage is adding up faster than it looks.';
  return 'Your leakage is not catastrophic — but it is slowing you down.';
}

function getInsight(monthly, ratio, building) {
  if (monthly <= 0) return 'Nothing major stands out. That does not mean spending is perfect, but there is no clear leakage pattern here.';
  if (building > 0 && monthly >= building) return 'Your leakage is at least as large as what you are building. Part of your future is being cancelled out in real time.';
  if (ratio >= 0.2) return 'A large part of your income is disappearing into spending that does not clearly improve your life or long-term position.';
  if (ratio >= 0.1) return 'This is the kind of leakage that feels harmless month to month but becomes expensive over a year.';
  return 'Not dramatic, but this leakage is still competing with your future capital every single month.';
}

function render() {
  const subscriptions = getVal('subscriptions');
  const impulse       = getVal('impulse');
  const convenience   = getVal('convenience');
  const misc          = getVal('misc');

  const monthly  = subscriptions + impulse + convenience + misc;
  const annual   = monthly * 12;

  const userData = readUserData();
  const income   = Number(userData.spendingVsBuilding?.income   || userData.roast?.answers?.income?.value  || 0);
  const building = Number(userData.spendingVsBuilding?.building || 0);
  const ratio    = income > 0 ? monthly / income : 0;

  // Update UI
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('headlineText',       getHeadline(monthly, ratio));
  set('monthlyLeakageValue', fmt(monthly));
  set('annualLeakageValue',  fmt(annual));
  set('leakageRatioValue',   fmtPct(ratio));
  set('insightText',         getInsight(monthly, ratio, building));

  // Breakdown sorted by value
  const items = [
    { title: 'Subscriptions',         note: 'Invisible because they feel small and automatic.',       value: subscriptions },
    { title: 'Impulse spending',       note: 'Feels minor until it stacks up.',                        value: impulse },
    { title: 'Convenience spending',   note: 'Comfort is expensive when it becomes a habit.',          value: convenience },
    { title: 'Hidden / forgotten',     note: 'The category that usually hurts more than expected.',    value: misc }
  ].sort((a, b) => b.value - a.value);

  const list = document.getElementById('breakdownList');
  if (list) {
    list.innerHTML = items.map(item => `
      <div class="mm-breakdownItem">
        <div class="mm-breakdownLeft">
          <div class="mm-breakdownTitle">${item.title}</div>
          <div class="mm-breakdownNote">${item.note}</div>
        </div>
        <div class="mm-breakdownValue">${fmt(item.value)}</div>
      </div>
    `).join('');
  }

  const resultBlock = document.getElementById('resultBlock');
  if (resultBlock) {
    resultBlock.style.display = 'grid';
    resultBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Save to moneymind_user_data
  const existing = readUserData();
  existing.leakage = {
    completed:     true,
    completedAt:   new Date().toISOString(),
    subscriptions,
    impulse,
    convenience,
    misc,
    monthlyLeakage: monthly,
    annualLeakage:  annual,
    leakageRatio:   ratio
  };
  writeUserData(existing);
}

function prefill() {
  const data = readUserData().leakage;
  if (!data) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  set('subscriptions', data.subscriptions);
  set('impulse',       data.impulse);
  set('convenience',   data.convenience);
  set('misc',          data.misc);
}

function init() {
  prefill();

  const btn = document.getElementById('calculateBtn');
  if (btn) btn.addEventListener('click', render);

  const dashBtn = document.getElementById('goDashboardBtn');
  if (dashBtn) dashBtn.addEventListener('click', () => { window.location.href = DASHBOARD_PATH; });
}

document.addEventListener('DOMContentLoaded', init);
