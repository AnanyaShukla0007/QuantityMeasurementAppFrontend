import { QuantityApi, TokenStore } from './api.js';

// AUTH GUARD
if (!TokenStore.get()) {
  window.location.href = 'login.html';
}

// LOGOUT
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  TokenStore.clear();
  window.location.href = 'login.html';
});

// CONVERT
window.runConvert = async function () {
  const val = parseFloat(document.getElementById('val').value);
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;

  const resultEl = document.getElementById('result');

  if (isNaN(val)) {
    resultEl.textContent = 'Invalid input';
    return;
  }

  resultEl.textContent = 'Loading...';

  try {
    const data = await QuantityApi.convert(val, from, to);
    resultEl.textContent = data.formattedResult;

    loadHistory();

  } catch (err) {
    resultEl.textContent = err.message;
  }
};

// HISTORY
async function loadHistory() {
  const el = document.getElementById('history');

  try {
    const data = await QuantityApi.getHistory();

    if (!data.length) {
      el.innerHTML = 'No history';
      return;
    }

    el.innerHTML = data.map(x => `
      <div>${x.operationType} → ${x.resultValue} ${x.resultUnit}</div>
    `).join('');

  } catch (err) {
    el.textContent = err.message;
  }
}

loadHistory();