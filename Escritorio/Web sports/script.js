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
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const data = {
      name:     form.name.value,
      email:    form.email.value,
      interest: form.interest.value,
      message:  form.message.value,
    };

    try {
      const res = await fetch('https://formspree.io/f/mwvoglow', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        btn.textContent = '✓ Solicitud enviada';
        btn.style.background = '#16a34a';
        form.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Error — inténtalo de nuevo';
      btn.style.background = '#dc2626';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }
  });
}

// ============================================================
// SPRINT LINES + GPS WIDGETS — sincronizados
// ============================================================
(function initSprints() {
  const CIRC = 276.46;

  // 3 rutas por set (una por trayectoria)
  const SPRINT_SETS = [
    {
      paths: [
        'M120,190 Q200,160 300,155',
        'M180,260 Q280,240 380,230',
        'M300,300 Q370,260 430,210',
      ],
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
      ],
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
      ],
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
      ],
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

  SPRINT_SETS[0].gps.forEach((d, i) => {
    const w = document.getElementById('gw-' + i);
    if (!w) return;
    w.querySelector('.gps-ring-fill').style.strokeDashoffset = CIRC * (1 - d.pct);
  });

  // --- Configuración de trayectorias ---
  const NS      = 'http://www.w3.org/2000/svg';
  const group   = document.getElementById('sprint-lines');
  // Vaciar paths estáticos del HTML
  while (group.firstChild) group.removeChild(group.firstChild);

  const COLORS      = ['#FF5722', '#FF9800', '#FFCA28'];
  const WIDTHS      = [2.2, 2.0, 1.8];
  const DURATIONS   = [2.5, 3.3, 4.1];   // velocidades distintas
  const BASE_DELAYS = [0,   1.5, 3.0];    // arranques escalonados

  // 3 capas por trayectoria: cabeza, cola media, cola lejana
  // lagFactor: fracción del ciclo que esta capa va detrás de la cabeza
  const LAYERS = [
    { trail: 32,  opacity: 0.92, wMul: 1.00, lagFactor: 0.00 },
    { trail: 75,  opacity: 0.28, wMul: 0.70, lagFactor: 0.16 },
    { trail: 130, opacity: 0.09, wMul: 0.50, lagFactor: 0.38 },
  ];

  // Keyframes dinámicos (un @keyframes por trayectoria con el toVal exacto)
  const kfEl = document.createElement('style');
  document.head.appendChild(kfEl);

  function upsertKeyframe(name, toVal) {
    const sheet = kfEl.sheet;
    for (let i = 0; i < sheet.cssRules.length; i++) {
      if (sheet.cssRules[i].name === name) { sheet.deleteRule(i); break; }
    }
    sheet.insertRule(
      `@keyframes ${name}{from{stroke-dashoffset:0}to{stroke-dashoffset:${toVal}}}`, 0
    );
  }

  // Crear 3 trayectorias × 3 capas = 9 paths en el DOM
  const trajectories = COLORS.map((color, ti) =>
    LAYERS.map(({ trail, opacity, wMul }) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', color);
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-width', (WIDTHS[ti] * wMul).toFixed(1));
      p.setAttribute('opacity', opacity);
      group.appendChild(p);
      return p;
    })
  );

  function getLen(el) { try { return el.getTotalLength(); } catch(e) { return 220; } }

  const sprintsEl = document.getElementById('sprints');
  const speedEl   = document.getElementById('speed');
  let setIdx = 0;

  function drawSet(s) {
    trajectories.forEach((traj, ti) => {
      const dur  = DURATIONS[ti];
      const base = BASE_DELAYS[ti];

      traj.forEach(el => el.setAttribute('d', s.paths[ti]));
      const len   = getLen(traj[0]);
      const toVal = -(len + 40);
      const kf    = `trail-t${ti}`;
      upsertKeyframe(kf, toVal);

      // Para cada capa: retraso positivo respecto a la cabeza → la cola va detrás
      traj.forEach(el => { el.style.animation = 'none'; });
      void traj[0].getBoundingClientRect();
      traj.forEach((el, li) => {
        el.style.strokeDasharray = `${LAYERS[li].trail} 9999`;
        const delay = base - dur / 2 + LAYERS[li].lagFactor * dur;
        el.style.animation = `${kf} ${dur}s linear ${delay}s infinite`;
      });
    });

    if (sprintsEl && speedEl) {
      sprintsEl.style.opacity = '0';
      speedEl.style.opacity   = '0';
      setTimeout(() => {
        sprintsEl.textContent = s.sprints;
        speedEl.textContent   = s.speed;
        sprintsEl.style.opacity = '1';
        speedEl.style.opacity   = '1';
      }, 300);
    }
  }

  drawSet(SPRINT_SETS[0]);

  setInterval(() => {
    setIdx = (setIdx + 1) % SPRINT_SETS.length;
    drawSet(SPRINT_SETS[setIdx]);
    updateGpsWidgets(SPRINT_SETS[setIdx]);
  }, 5000);
})();

// ============================================================
// PITCH LINES — draw-on animation
// ============================================================
(function initPitchLines() {
  function elemLen(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'path') { try { return el.getTotalLength(); } catch(e) {} }
    if (tag === 'line') {
      const dx = parseFloat(el.getAttribute('x2')) - parseFloat(el.getAttribute('x1'));
      const dy = parseFloat(el.getAttribute('y2')) - parseFloat(el.getAttribute('y1'));
      return Math.sqrt(dx * dx + dy * dy);
    }
    if (tag === 'rect') return 2 * (parseFloat(el.getAttribute('width')) + parseFloat(el.getAttribute('height')));
    if (tag === 'circle') return 2 * Math.PI * parseFloat(el.getAttribute('r'));
    return 200;
  }

  const g = document.getElementById('pitch-lines-g');
  if (!g) return;

  const els = Array.from(g.children).filter(el => el.getAttribute('stroke') !== 'none');

  els.forEach(el => {
    const len = elemLen(el);
    el.style.strokeDasharray  = len;
    el.style.strokeDashoffset = len;
  });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    els.forEach((el, i) => {
      el.style.transition = `stroke-dashoffset ${0.7 + i * 0.08}s ease ${i * 0.07}s`;
      el.style.strokeDashoffset = '0';
    });
  }));
})();
