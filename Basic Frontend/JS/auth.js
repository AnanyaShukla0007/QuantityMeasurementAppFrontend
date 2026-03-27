import { AuthApi, TokenStore } from './api.js';

// ================= LOGIN =================
const loginForm = document.getElementById('loginForm');

if (loginForm) {

  if (TokenStore.get()) {
    window.location.href = 'dashboard.html';
  }

  const uEl = document.getElementById('username');
  const pEl = document.getElementById('password');
  const remEl = document.getElementById('remember');

  // Load remembered username
  const savedUser = localStorage.getItem('qm_remember_user');
  if (savedUser && uEl) uEl.value = savedUser;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const u = uEl.value.trim();
    const p = pEl.value;

    if (!u || !p) return;

    try {
      await AuthApi.login(u, p);

      if (remEl?.checked) {
        localStorage.setItem('qm_remember_user', u);
      } else {
        localStorage.removeItem('qm_remember_user');
      }

      window.location.href = 'dashboard.html';

    } catch (err) {
      alert(err.message);
    }
  });
}

// ================= SIGNUP =================
const signupForm = document.getElementById('signupForm');

if (signupForm) {

  if (TokenStore.get()) {
    window.location.href = 'dashboard.html';
  }

  const uEl = document.getElementById('su-username');
  const pEl = document.getElementById('su-password');
  const cEl = document.getElementById('su-confirm');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const u = uEl.value.trim();
    const p = pEl.value;
    const c = cEl.value;

    if (!u || !p || p !== c) return;

    try {
      await AuthApi.register(u, p);
      window.location.href = 'login.html';
    } catch (err) {
      alert(err.message);
    }
  });
}