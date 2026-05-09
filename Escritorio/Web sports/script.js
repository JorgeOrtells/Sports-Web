// ============================================================
// NAVBAR
// ============================================================
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
  });
});

// ============================================================
// SCROLL ANIMATIONS — IntersectionObserver
// ============================================================
const iOpts = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };

// 1. Hero title lines fire immediately on page load
function fireHeroLines() {
  document.querySelectorAll('.hero .line-inner').forEach((el, i) => {
    const delay = Number(el.dataset.delay || i * 80);
    setTimeout(() => el.classList.add('visible'), 100 + delay);
  });
  document.querySelectorAll('.hero .reveal-fade').forEach(el => {
    const delay = Number(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), 200 + delay);
  });
}
window.addEventListener('load', fireHeroLines);

// 2. Section title lines (display-title .line-inner outside hero)
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.line-inner').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
    titleObserver.unobserve(entry.target);
  });
}, iOpts);
document.querySelectorAll('.section .display-title').forEach(el => titleObserver.observe(el));

// 3. Generic reveal-fade elements
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    fadeObserver.unobserve(entry.target);
  });
}, iOpts);
document.querySelectorAll('.section .reveal-fade').forEach(el => fadeObserver.observe(el));

// 4. Service blocks (line draw + fade)
const serviceObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    serviceObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.service-block').forEach(el => serviceObserver.observe(el));

// 5. Team members
const teamObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    teamObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.team-member').forEach(el => teamObserver.observe(el));

// 6. Plans rows — stagger
const plansObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    plansObserver.unobserve(entry.target);
  });
}, iOpts);
document.querySelectorAll('.reveal-fade').forEach(el => plansObserver.observe(el));

// ============================================================
// COUNTER ANIMATION
// ============================================================
let countersStarted = false;
const counters = document.querySelectorAll('.count');

const counterObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || countersStarted) return;
  countersStarted = true;
  counters.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step = 16;
    let current = 0;
    const inc = target / (duration / step);
    const t = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(t);
    }, step);
  });
  counterObserver.disconnect();
}, { threshold: 0.6 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

// ============================================================
// CONTACT FORM
// ============================================================
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Mensaje enviado';
    btn.style.background = '#16a34a';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

// ============================================================
// SPRINT LINES — redibujado cíclico de trayectorias GPS
// ============================================================
(function initSprints() {
  const SPRINT_SETS = [
    // Set 0: Presión derecha
    {
      paths: [
        'M60,200 Q160,160 300,155 T480,130',
        'M70,280 Q200,270 340,240 T500,210',
        'M200,310 Q310,260 400,200 T470,165',
        'M130,170 Q220,140 310,145 T430,120',
        'M100,120 Q230,100 330,110 T460,90',
        'M400,170 Q310,190 200,195 T80,210',
      ],
      dots: [[480,130],[500,210],[470,165],[430,120],[460,90],[80,210]],
      sprints: 14, speed: '34.2',
    },
    // Set 1: Control centrocampo
    {
      paths: [
        'M50,170 Q180,150 280,155 T430,160',
        'M80,90 Q200,110 310,120 T450,115',
        'M90,255 Q220,240 330,235 T460,245',
        'M460,170 Q360,155 260,160 T100,175',
        'M380,80 Q290,95 200,100 T60,115',
        'M350,265 Q260,252 170,258 T50,265',
      ],
      dots: [[430,160],[450,115],[460,245],[100,175],[60,115],[50,265]],
      sprints: 9, speed: '31.8',
    },
    // Set 2: Construcción izquierda
    {
      paths: [
        'M480,160 Q350,155 210,160 T50,175',
        'M490,240 Q370,235 240,245 T60,255',
        'M460,100 Q330,110 200,115 T55,125',
        'M300,310 Q190,270 110,220 T60,175',
        'M380,290 Q270,265 170,240 T70,210',
        'M150,155 Q220,170 320,165 T470,170',
      ],
      dots: [[50,175],[60,255],[55,125],[60,175],[70,210],[470,170]],
      sprints: 7, speed: '29.4',
    },
    // Set 3: Presión alta
    {
      paths: [
        'M55,130 Q190,110 330,100 T490,95',
        'M60,220 Q180,200 310,195 T480,185',
        'M100,305 Q240,275 360,240 T490,220',
        'M160,80 Q270,95 370,90 T490,85',
        'M70,175 Q210,160 340,170 T480,165',
        'M200,285 Q310,260 410,240 T500,235',
      ],
      dots: [[490,95],[480,185],[490,220],[490,85],[480,165],[500,235]],
      sprints: 16, speed: '35.7',
    },
  ];

  const spIds   = ['sp1','sp2','sp3','sp4','sp5','sp6'];
  const dotIds  = ['sp1-dot','sp2-dot','sp3-dot','sp4-dot','sp5-dot','sp6-dot'];
  const sprintsEl = document.getElementById('sprints');
  const speedEl   = document.getElementById('speed');
  let setIdx = 0;

  function applySet(s) {
    spIds.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('d', s.paths[i]);
    });
    dotIds.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('cx', s.dots[i][0]);
      el.setAttribute('cy', s.dots[i][1]);
    });
    if (sprintsEl && speedEl) {
      sprintsEl.style.opacity = '0';
      speedEl.style.opacity   = '0';
      setTimeout(() => {
        sprintsEl.textContent   = s.sprints;
        speedEl.textContent     = s.speed;
        sprintsEl.style.opacity = '1';
        speedEl.style.opacity   = '1';
      }, 300);
    }
  }

  // Redibuja cada 5s: reset animación + nuevo set de paths
  setInterval(() => {
    setIdx = (setIdx + 1) % SPRINT_SETS.length;
    const s = SPRINT_SETS[setIdx];
    spIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.animation = 'none';
      void el.offsetWidth; // reflow
      el.style.animation = '';
    });
    applySet(s);
  }, 5000);
})();
