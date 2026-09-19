/* =============================================
   NEON ORANGE CYBERPUNK — script.js
   ============================================= */

// ── CURSOR ───────────────────────────────────
const cursor = document.getElementById('cursor-fx');
let cx = 0, cy2 = 0;
document.addEventListener('mousemove', e => {
  cx = e.clientX; cy2 = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy2 + 'px';
});
document.querySelectorAll('a,button,.proj-card,.skill-pills span,.ach-row,.ct-row').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '24px'; cursor.style.height = '24px';
    cursor.style.borderColor = '#ff8c38';
    cursor.style.boxShadow = '0 0 20px rgba(255,107,0,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '14px'; cursor.style.height = '14px';
    cursor.style.borderColor = '#ff6b00';
    cursor.style.boxShadow = '0 0 10px rgba(255,107,0,0.5)';
  });
});

// ── BACKGROUND CANVAS ────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function initParticles() {
  particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.2 + 0.3,
    o: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.7 ? '#00d4ff' : '#ff6b00'
  }));
}
initParticles();

function drawBg() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x = (p.x + p.vx + W) % W;
    p.y = (p.y + p.vy + H) % H;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color.replace(')', `,${p.o})`).replace('rgb', 'rgba').replace('#ff6b00', `rgba(255,107,0,${p.o})`).replace('#00d4ff', `rgba(0,212,255,${p.o})`);
    ctx.fill();
  });

  // Connect close particles with orange lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,107,0,${0.04 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawBg);
}
drawBg();

// ── NAV ──────────────────────────────────────
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  updateNav();
}, { passive: true });

burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

function updateNav() {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 90) cur = s.id;
  });
  document.querySelectorAll('.nl').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
  });
}

// ── HUD CARD LOADING ─────────────────────────
const hudBar     = document.getElementById('hud-bar');
const hudLoading = document.getElementById('hud-loading');
const msgs = ['LOADING PROFILE...', 'SCANNING DATA...', 'VERIFYING CREDENTIALS...', 'PROFILE LOADED.'];
let pct = 0, mi = 0;
const hudInt = setInterval(() => {
  pct = Math.min(pct + Math.random() * 4 + 1, 100);
  hudBar.style.width = pct + '%';
  if (pct > 30 && mi < 1)  { mi = 1; hudLoading.textContent = msgs[1]; }
  if (pct > 65 && mi < 2)  { mi = 2; hudLoading.textContent = msgs[2]; }
  if (pct >= 100 && mi < 3){ mi = 3; hudLoading.textContent = msgs[3]; hudLoading.style.color = '#22c55e'; clearInterval(hudInt); }
}, 60);

// ── TYPEWRITER ───────────────────────────────
const roles = ['AI & ML ENGINEER', 'FULL-STACK DEV', 'CYBERSEC ENTHUSIAST', 'HACKATHON CHAMPION'];
let ri = 0, ci = 0, del = false;
const tel = document.getElementById('type-el');

function type() {
  const cur = roles[ri];
  if (del) {
    tel.textContent = cur.slice(0, --ci);
    if (!ci) { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 400); return; }
    setTimeout(type, 40);
  } else {
    tel.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
    setTimeout(type, 80);
  }
}
type();

// ── COUNTERS ─────────────────────────────────
let counted = false;
function runCounters() {
  if (counted) return; counted = true;
  document.querySelectorAll('.stat-n').forEach(el => {
    const v = +el.dataset.v;
    const dur = 1400, start = performance.now();
    ;(function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * v);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
}
// Trigger on hero stats visibility
new IntersectionObserver(e => { if (e[0].isIntersecting) runCounters(); }, { threshold: 0.7 })
  .observe(document.querySelector('.hero-stats'));
setTimeout(runCounters, 2000); // fallback

// ── REVEAL ───────────────────────────────────
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.07 + 's';
  revObs.observe(el);
});

// ── PROJECT CARD GLOW ON MOUSE ───────────────
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
    card.style.transform = `translateY(-4px) perspective(800px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// ── DIAGONAL DIVIDER SCAN EFFECT ─────────────
// Orange glow pulse on section headings
const secHls = document.querySelectorAll('.sec-hl');
const glowObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'sec-hl-in 0.6s ease forwards';
    }
  });
}, { threshold: 0.8 });
secHls.forEach(h => glowObs.observe(h));

// ── SCROLL HINT ──────────────────────────────
const scrollHint = document.querySelector('.hero-scroll-hint');
window.addEventListener('scroll', () => {
  if (scrollHint) scrollHint.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });

// ── SMOOTH ANCHORS ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── CONSOLE ──────────────────────────────────
console.log('%c▶ ABHISHEK A PILLAI ◀', 'background:#ff6b00;color:#000;font-size:1.3rem;font-weight:900;padding:10px 24px;font-family:Orbitron,monospace;letter-spacing:4px;');
console.log('%cAI ENGINEER | HACKATHON CHAMPION | FULL-STACK DEV', 'color:#ff6b00;font-family:monospace;font-size:0.9rem;letter-spacing:2px;');
console.log('%cgithub.com/abhishekpillai05', 'color:#00d4ff;font-family:monospace;');
