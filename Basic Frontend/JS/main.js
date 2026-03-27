// ======================================================
// NAVBAR
// ======================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 30) {
    navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.5)';
  } else {
    navbar.style.boxShadow = 'none';
  }
}, { passive: true });

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });
}

// ======================================================
// SMOOTH SCROLL (for anchor links)
// ======================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
    }
  });
});

// ======================================================
// SCROLL REVEAL
// ======================================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.transition =
        `opacity 0.6s ease ${entry.target.dataset.delay || '0s'},
         transform 0.6s cubic-bezier(0.16,1,0.3,1) ${entry.target.dataset.delay || '0s'}`;
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.dataset.delay = `${i * 0.07}s`;
  revealObs.observe(el);
});


// ======================================================
// AUTH STATE (ADDED — DO NOT REMOVE ABOVE CODE)
// ======================================================
import { TokenStore } from './api.js';

const token = TokenStore.get();

// If logged in → redirect to dashboard
if (token) {
  window.location.href = 'dashboard.html';
}

// Hide login/signup buttons if logged in
const loginLink = document.querySelector('a[href="login.html"]');
const signupLink = document.querySelector('a[href="signup.html"]');

if (token) {
  if (loginLink) loginLink.style.display = 'none';
  if (signupLink) signupLink.style.display = 'none';
}