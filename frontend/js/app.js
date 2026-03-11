/* ================================================
   HOSTEL FOOD FEEDBACK SYSTEM — app.js
   Shared utilities, auth helpers, mock data
================================================ */

// ── CONFIG ──
const COLLEGE_DOMAIN = 'rajalakshmi.edu.in';
const API_BASE       = 'http://localhost:8080/api';

// ── AUTH ──
const Auth = {
  save(token, user) {
    localStorage.setItem('hff_token', token);
    localStorage.setItem('hff_user', JSON.stringify(user));
  },
  token()    { return localStorage.getItem('hff_token'); },
  user()     { const u = localStorage.getItem('hff_user'); return u ? JSON.parse(u) : null; },
  loggedIn() { return !!this.token(); },
  isAdmin()  { const u = this.user(); return u && u.role === 'ADMIN'; },
  logout()   {
    localStorage.removeItem('hff_token');
    localStorage.removeItem('hff_user');
    window.location.href = getRoot() + 'index.html';
  }
};

// ── PATH HELPER ──
function getRoot() {
  const p = window.location.pathname;
  return p.includes('/pages/') ? '../' : '';
}

// ── EMAIL VALIDATION ──
// Only accepts username@rajalakshmi.edu.in
function isValidEmail(email) {
  const e = email.toLowerCase().trim();
  return e.endsWith('@' + COLLEGE_DOMAIN) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// ── TOAST ──
function toast(msg, type = 'success', dur = 3500) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = `toast-item ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.cssText = 'opacity:0;transform:translateX(30px);transition:all .3s'; setTimeout(() => t.remove(), 310); }, dur);
}

// ── INLINE ALERT ──
function showAlert(containerId, msg, type = 'success') {
  const el = document.getElementById(containerId);
  if (!el) return;
  const icons = { success: '✅', danger: '❌', info: 'ℹ️', warning: '⚠️' };
  el.innerHTML = `<div class="alert alert-${type}">${icons[type] || 'ℹ️'} ${msg}</div>`;
}
function clearAlert(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '';
}

// ── CURRENT MEAL ──
function currentMeal() {
  const now  = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins >= 390  && mins <= 510)  return 'BREAKFAST';
  if (mins >= 690  && mins <= 810)  return 'LUNCH';
  if (mins >= 990  && mins <= 1050) return 'SNACKS';
  if (mins >= 1170 && mins <= 1230) return 'DINNER';
  return null;
}

// ── GREETING ──
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
}

// ── FORMAT DATE/TIME ──
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateTime(d) {
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function todayStr() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

// ── FEEDBACK WINDOW CHECK ──
// Window: 5:00 AM today → 5:00 AM next day
function isFeedbackOpen() {
  const now   = new Date();
  const open  = new Date(now); open.setHours(5, 0, 0, 0);
  const close = new Date(open); close.setDate(close.getDate() + 1);
  return now >= open && now < close;
}
function feedbackRemainingMs() {
  const now   = new Date();
  const close = new Date(now);
  close.setDate(close.getDate() + (now.getHours() >= 5 ? 1 : 0));
  close.setHours(5, 0, 0, 0);
  return Math.max(0, close - now);
}

// ── COUNTDOWN TIMER ──
function startCountdown(elementId) {
  function tick() {
    const el = document.getElementById(elementId);
    if (!el) return;
    const ms  = feedbackRemainingMs();
    if (ms <= 0) { el.textContent = 'Closed'; return; }
    const h   = Math.floor(ms / 3600000);
    const m   = Math.floor((ms % 3600000) / 60000);
    const s   = Math.floor((ms % 60000) / 1000);
    el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ── NAVBAR SCROLL + HAMBURGER ──
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

  const ham = document.querySelector('.hamburger');
  const mob = document.querySelector('.mob-menu');
  if (ham && mob) ham.addEventListener('click', () => mob.classList.toggle('open'));
});

// ── MOCK DATA ──
const MOCK = {
  student: {
    name: 'Arjun Kumar',
    email: 'arjun.kumar@' + COLLEGE_DOMAIN,
    registerNo: 'RA2111003010234',
    hostelBlock: 'Block B',
    room: '204',
    role: 'STUDENT'
  },
  admin: {
    name: 'Admin',
    email: 'admin@' + COLLEGE_DOMAIN,
    role: 'ADMIN'
  },
  announcements: [
    {
      id: 1,
      title: 'Special Biryani Dinner Tonight!',
      message: 'Dinner tonight will be special chicken biryani with raita and gulab jamun dessert. All students are welcome.',
      postedAt: new Date(Date.now() - 3 * 3600000).toISOString()
    },
    {
      id: 2,
      title: 'Mess Timing Change — Saturday',
      message: 'Lunch timing this Saturday will be 12:00 PM to 2:00 PM due to the Annual Cultural Fest.',
      postedAt: new Date(Date.now() - 9 * 3600000).toISOString()
    }
  ],
  menu: {
    BREAKFAST: ['Idli & Sambar', 'Coconut Chutney', 'Medu Vada', 'Tea / Coffee'],
    LUNCH:     ['Steamed Rice', 'Dal Tadka', 'Sambar', 'Rasam', 'Papad', 'Curd'],
    SNACKS:    ['Bread & Butter', 'Assorted Biscuits', 'Tea / Coffee'],
    DINNER:    ['Chapati', 'Dal Fry', 'Steamed Rice', 'Rasam', 'Curd & Pickle']
  },
  voteOptions: {
    BREAKFAST: ['Idli & Sambar', 'Masala Dosa', 'Ven Pongal', 'Poori Bhaji'],
    LUNCH:     ['Rice + Sambar', 'Chapati + Sabzi', 'Lemon Rice', 'Curd Rice'],
    SNACKS:    ['Medhu Bonda', 'Mirchi Bajji', 'Bread + Jam', 'Chana Sundal'],
    DINNER:    ['Chapati + Dal', 'Rice + Rasam', 'Veg Biryani', 'Gobi Fried Rice']
  },
  feedbackStats: {
    BREAKFAST: { avg: 4.2, count: 87 },
    LUNCH:     { avg: 3.8, count: 92 },
    SNACKS:    { avg: 3.5, count: 64 },
    DINNER:    { avg: 4.5, count: 88 }
  }
};