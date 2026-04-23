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

function formatEuro(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function getVal(id) {
  return Number(document.getElementById(id).value) || 0;
}

function updateSummary() {
  const total = getVal('direct') + getVal('accessible') + getVal('locked');
  const summary = document.getElementById('summary');
  const totalEl = document.getElementById('total-value');

  if (total > 0) {
    summary.hidden = false;
    totalEl.textContent = formatEuro(total);
  } else {
    summary.hidden = true;
  }
}

function save() {
  const direct      = getVal('direct');
  const accessible  = getVal('accessible');
  const locked      = getVal('locked');
  const total       = direct + accessible + locked;

  const existing = readUserData();

  existing.capitalMap = {
    completed:          true,
    updatedAt:          new Date().toISOString(),
    directCapital:      direct,
    accessibleCapital:  accessible,
    lockedCapital:      locked,
    totalCapital:       total
  };

  writeUserData(existing);
  window.location.href = DASHBOARD_PATH;
}

function init() {
  // Pre-fill if data exists
  const data = readUserData();
  if (data.capitalMap?.completed) {
    document.getElementById('direct').value      = data.capitalMap.directCapital     || '';
    document.getElementById('accessible').value  = data.capitalMap.accessibleCapital || '';
    document.getElementById('locked').value      = data.capitalMap.lockedCapital     || '';
    updateSummary();
  }

  // Live total
  ['direct', 'accessible', 'locked'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateSummary);
  });

  // Save
  document.getElementById('save-btn').addEventListener('click', save);
}

init();
