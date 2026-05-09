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
// SPRINT LINES + GPS WIDGETS — sincronizados
// ============================================================
(function initSprints() {
  const CIRC = 276.46;

  const SPRINT_SETS = [
    {
      paths: [
        'M120,190 Q200,160 300,155',
        'M180,260 Q280,240 380,230',
        'M300,300 Q370,260 430,210',
        'M200,130 Q290,120 380,125',
      ],
      dots: [[300,155],[380,230],[430,210],[380,125]],
      sprints: 14, speed: '34.2',
      gps: [
        { val: '9.5',  unit: 'km',   pct: 0.74 },
        { val: '560',  unit: 'm',    pct: 0.58 },
        { val: '30.2', unit: 'km/h', pct: 0.84 },
      ],
    },
    {
      paths: [
        'M80,170 Q180,155 290,160',
        'M100,100 Q210,115 320,120',
        'M360,240 Q280,235 180,240',
        'M380,175 Q300,160 210,165',
      ],
      dots: [[290,160],[320,120],[180,240],[210,165]],
      sprints: 9, speed: '31.8',
      gps: [
        { val: '11.2', unit: 'km',   pct: 0.88 },
        { val: '720',  unit: 'm',    pct: 0.75 },
        { val: '32.1', unit: 'km/h', pct: 0.89 },
      ],
    },
    {
      paths: [
        'M420,160 Q320,155 210,162',
        'M440,245 Q330,238 220,242',
        'M100,130 Q200,118 320,115',
        'M270,300 Q200,265 140,230',
      ],
      dots: [[210,162],[220,242],[320,115],[140,230]],
      sprints: 11, speed: '32.6',
      gps: [
        { val: '8.7',  unit: 'km',   pct: 0.68 },
        { val: '480',  unit: 'm',    pct: 0.50 },
        { val: '28.9', unit: 'km/h', pct: 0.80 },
      ],
    },
    {
      paths: [
        'M70,130 Q190,115 310,108',
        'M80,220 Q200,205 320,200',
        'M160,290 Q260,265 370,245',
        'M390,170 Q300,160 200,158',
      ],
      dots: [[310,108],[320,200],[370,245],[200,158]],
      sprints: 16, speed: '35.7',
      gps: [
        { val: '10.4', unit: 'km',   pct: 0.81 },
        { val: '640',  unit: 'm',    pct: 0.66 },
        { val: '31.5', unit: 'km/h', pct: 0.87 },
      ],
    },
  ];

  function updateGpsWidgets(s) {
    s.gps.forEach((d, i) => {
      const w = document.getElementById('gw-' + i);
      if (!w) return;
      const fill = w.querySelector('.gps-ring-fill');
      const val  = w.querySelector('.gps-val');
      const unit = w.querySelector('.gps-unit');
      val.classList.add('fade');
      setTimeout(() => {
        val.textContent  = d.val;
        unit.textContent = d.unit;
        fill.style.strokeDashoffset = CIRC * (1 - d.pct);
        val.classList.remove('fade');
      }, 260);
    });
  }

  // Set initial GPS ring fills
  SPRINT_SETS[0].gps.forEach((d, i) => {
    const w = document.getElementById('gw-' + i);
    if (!w) return;
    w.querySelector('.gps-ring-fill').style.strokeDashoffset = CIRC * (1 - d.pct);
  });

  // Only use 4 path/dot elements (sp1–sp4), hide sp5/sp6
  const spIds  = ['sp1','sp2','sp3','sp4'];
  const dotIds = ['sp1-dot','sp2-dot','sp3-dot','sp4-dot'];

  // Hide unused lines
  ['sp5','sp6','sp5-dot','sp6-dot'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const sprintsEl = document.getElementById('sprints');
  const speedEl   = document.getElementById('speed');
  let setIdx = 0;

  function getPathLength(el) {
    try { return el.getTotalLength(); } catch(e) { return 200; }
  }

  function drawSet(s) {
    spIds.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('d', s.paths[i]);
      const len = getPathLength(el);
      el.style.transition = 'none';
      el.style.strokeDasharray  = len;
      el.style.strokeDashoffset = len;
      // force reflow then animate draw
      void el.getBoundingClientRect();
      el.style.transition = `stroke-dashoffset ${0.9 + i * 0.15}s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s`;
      el.style.strokeDashoffset = '0';
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

  drawSet(SPRINT_SETS[0]);

  setInterval(() => {
    setIdx = (setIdx + 1) % SPRINT_SETS.length;
    const s = SPRINT_SETS[setIdx];
    drawSet(s);
    updateGpsWidgets(s);
  }, 5000);
})();
