/* =====================================================
   PREMIUM EXECUTIVE DARK & BRONZE PORTFOLIO — CLIENT SCRIPT
   Bharath Kumar Reddy Allampati — Java Full Stack Developer
   ===================================================== */
'use strict';

const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);
const noAnim = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ─────────────────────────────────────────
   1. LOADER
   ───────────────────────────────────────── */
(function initLoader() {
  const loader = $('loader');
  const fill   = $('lFill');
  const status = $('lStatus');
  if (!loader) return;

  const steps = [
    [15,  'Initialising modules...'],
    [35,  'Syncing database schema...'],
    [58,  'Spawning Three.js canvases...'],
    [78,  'Securing port protocols...'],
    [95,  'Rendering executive overview...'],
    [100, 'Dossier ready!'],
  ];

  let i = 0;
  (function tick() {
    if (i >= steps.length) {
      setTimeout(() => loader.classList.add('out'), 300);
      return;
    }
    const [w, txt] = steps[i++];
    if (fill) fill.style.width = w + '%';
    if (status) status.textContent = txt;
    setTimeout(tick, 180);
  })();
})();

/* ─────────────────────────────────────────
   2. CUSTOM CURSOR
   ───────────────────────────────────────── */
(function initCursor() {
  const dot  = $('curDot');
  const ring = $('curRing');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate3d(-50%, -50%, 0)`;
  });
  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate3d(-50%, -50%, 0)`;
    requestAnimationFrame(animRing);
  })();

  $$('a, button, .proj-glass, .skill-glass, .cert-glass, .cc-card, .glass-photo-card, .gbtn, .dstat, .executive-board').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-big'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-big'));
  });
})();

/* ─────────────────────────────────────────
   3. NAV — scroll + active highlight
   ───────────────────────────────────────── */
(function initNav() {
  const nav  = $('mainNav');
  const prog = $('scrollProg');
  const ham  = $('ham');
  const mob  = $('mobNav');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('solid', window.scrollY > 45);

    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (prog && total) prog.style.transform = `scaleX(${window.scrollY / total})`;

    let cur = '';
    $$('section[id]').forEach(sec => {
      if (sec.getBoundingClientRect().top <= 120) cur = sec.id;
    });
    $$('.nl').forEach(a => a.classList.toggle('active', a.dataset.s === cur));
  });

  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
    });
    $$('.mn-link').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
    }));
  }
})();

/* ─────────────────────────────────────────
   4. REVEAL ON SCROLL
   ───────────────────────────────────────── */
(function initReveal() {
  const els = $$('.fade-up, .fade-left, .fade-right');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = +(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('in'), delay);
      io.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────
   5. EXECUTIVE OVERVIEW BOARD STAGGERED REVEAL
   ───────────────────────────────────────── */
(function initExecBoard() {
  const board = $('execBoard');
  if (!board) return;
  const rows = $$('.reveal-row');

  // Initialize initial states for animations
  rows.forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(12px)';
    row.style.transition = 'opacity 0.65s cubic-bezier(0.25, 1, 0.5, 1), transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
  });

  if (noAnim) {
    rows.forEach(r => {
      r.style.opacity = '1';
      r.style.transform = 'none';
    });
    return;
  }

  // Trigger staggered reveal shortly after loader starts fading
  setTimeout(() => {
    rows.forEach((row, idx) => {
      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, idx * 150);
    });
  }, 1200);
})();

/* ─────────────────────────────────────────
   6. ROLE CYCLER
   ───────────────────────────────────────── */
(function initRoles() {
  const el = $('roleSpin');
  if (!el || noAnim) return;
  const roles = ['Developer.', 'Java Engineer.', 'React Builder.', 'Cloud Deployer.', 'Problem Solver.'];
  let r = 0;
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = roles[r = (r + 1) % roles.length]; el.style.opacity = '1'; }, 280);
  }, 3200);
})();

/* ─────────────────────────────────────────
   7. COUNT-UP NUMBERS
   ───────────────────────────────────────── */
(function initCountUp() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el    = e.target;
      const target = parseFloat(el.dataset.v);
      const dec    = parseInt(el.dataset.d) || 0;
      if (noAnim) { el.textContent = dec ? target.toFixed(dec) : target; return; }
      let cur = 0;
      const steps = 45, inc = target / steps;
      (function tick() {
        cur = Math.min(cur + inc, target);
        el.textContent = dec ? cur.toFixed(dec) : Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
      })();
    });
  }, { threshold: 0.5 });
  $$('.cu').forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────
   8. PROGRESS BAR ENABLER
   ───────────────────────────────────────── */
(function initBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  $$('.sg-fill, .cg-fill').forEach(b => io.observe(b));
})();

/* ─────────────────────────────────────────
   9. PROJECT CARD 3D TILT
   ───────────────────────────────────────── */
(function initTilt() {
  if (noAnim) return;
  $$('.proj-glass').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.width / 2, cy = r.height / 2;
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
      const rx = ((e.clientY - r.top  - cy) / cy) * -4.0;
      const ry = ((e.clientX - r.left - cx) / cx) *  4.0;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.005)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ─────────────────────────────────────────
   10. PHOTO 3D TILT
   ───────────────────────────────────────── */
(function initPhotoTilt() {
  if (noAnim) return;
  const card = document.querySelector('.glass-photo-card');
  if (!card) return;
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -8;
    const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  8;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
})();

/* ─────────────────────────────────────────
   11. SMOOTH SCROLL
   ───────────────────────────────────────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); }
  });
});

/* ─────────────────────────────────────────
   12. BACKGROUND CANVAS PARTICLES (Warm Bronze Embers)
   ───────────────────────────────────────── */
(function initBgCanvas() {
  const canvas = $('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.1 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = -(Math.random() * 0.3 + 0.08);
      this.alpha = Math.random() * 0.3 + 0.05;
      this.color = Math.random() > 0.6 ? '#dfba89' : '#c5a880'; // Gold or Bronze
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) {
        this.reset(false);
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const count = Math.min(Math.floor(W * H / 20000), 55);
  for(let i=0; i<count; i++) particles.push(new Particle());

  function anim() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(anim);
  }
  if (!noAnim) anim();
})();

/* ─────────────────────────────────────────
   13. THREE.JS — BRONZE GLOBE (Hero)
   ───────────────────────────────────────── */
(function initGlobe() {
  const canvas = $('globeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(440, 440);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 2.9;

  // Outer wireframe — bronze/transparent
  const wGeo = new THREE.SphereGeometry(1.0, 28, 28);
  const wMat = new THREE.MeshBasicMaterial({ color: 0xc5a880, wireframe: true, transparent: true, opacity: 0.04 });
  const wSphere = new THREE.Mesh(wGeo, wMat);
  scene.add(wSphere);

  // Latitude rings — bronze and gold shades
  const ringColors = [0xc5a880, 0xdfba89, 0xa88f6c, 0xdfc5a3];
  for (let lat = -75; lat <= 75; lat += 25) {
    const r  = Math.cos((lat * Math.PI) / 180);
    const y  = Math.sin((lat * Math.PI) / 180);
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    const mat = new THREE.LineBasicMaterial({ color: ringColors[Math.floor(Math.random() * ringColors.length)], transparent: true, opacity: 0.16 });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }

  // Longitude arcs
  for (let lon = 0; lon < 360; lon += 45) {
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const phi   = (i / 72) * Math.PI * 2;
      const theta = (lon * Math.PI) / 180;
      pts.push(new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)));
    }
    const mat = new THREE.LineBasicMaterial({ color: 0xc5a880, transparent: true, opacity: 0.06 });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }

  // Tech nodes — Fibonacci sphere distribution
  const techs = ['Java','React','PostgreSQL','AWS','Python','Next.js','Spring','Docker','Git','SIEM','IAM','MySQL','Lambda','S3','DSA','OOP'];
  const nodeColors = [0xc5a880, 0xdfba89, 0xa88f6c, 0xdfc5a3];

  const group = new THREE.Group();
  scene.add(group);

  techs.forEach((_, i) => {
    const phi   = Math.acos(-1 + (2 * i) / techs.length);
    const theta = Math.sqrt(techs.length * Math.PI) * phi;
    const col   = nodeColors[i % nodeColors.length];

    const geo  = new THREE.SphereGeometry(0.03, 8, 8);
    const mat  = new THREE.MeshBasicMaterial({ color: col });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.setFromSphericalCoords(1.0, phi, theta);
    group.add(mesh);

    // Halo ring around each node
    const hGeo = new THREE.RingGeometry(0.048, 0.058, 8);
    const hMat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const halo = new THREE.Mesh(hGeo, hMat);
    halo.position.copy(mesh.position);
    halo.lookAt(0, 0, 0);
    group.add(halo);
  });

  // Orbiting ring (gold)
  const oGeo = new THREE.RingGeometry(1.20, 1.22, 60);
  const oMat = new THREE.MeshBasicMaterial({ color: 0xdfba89, side: THREE.DoubleSide, transparent: true, opacity: 0.12 });
  const orbit = new THREE.Mesh(oGeo, oMat);
  orbit.rotation.x = Math.PI / 2.7;
  group.add(orbit);

  // Outer orbit ring (bronze)
  const o2Geo = new THREE.RingGeometry(1.28, 1.30, 60);
  const o2Mat = new THREE.MeshBasicMaterial({ color: 0xc5a880, side: THREE.DoubleSide, transparent: true, opacity: 0.09 });
  const orbit2 = new THREE.Mesh(o2Geo, o2Mat);
  orbit2.rotation.x = Math.PI / 2.1;
  orbit2.rotation.z = Math.PI / 8;
  group.add(orbit2);

  let globeVisible = true;
  if (typeof IntersectionObserver !== 'undefined') {
    const globeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        globeVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    globeObserver.observe(canvas);
  }

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    if (!globeVisible) return;
    t += 0.005;
    group.rotation.y += 0.003;
    group.rotation.x  = Math.sin(t * 0.2) * 0.08;
    wSphere.rotation.y -= 0.0012;
    orbit.rotation.z  += 0.005;
    orbit2.rotation.z -= 0.0035;
    renderer.render(scene, camera);
  })();
})();

/* ─────────────────────────────────────────
   14. THREE.JS — BRONZE SKILL SPHERE (Skills)
   ───────────────────────────────────────── */
(function initSkillSphere() {
  const canvas = $('skillSphere');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(360, 360);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 3.1;

  const group = new THREE.Group();
  scene.add(group);

  const skills = ['Java','React','Next.js','PostgreSQL','AWS','Python','Spring','Docker','Git','SIEM','IAM','MySQL','Lambda','S3','DSA','OOP','OS','Networks'];
  const palette = ['#c5a880', '#dfba89', '#7da9d9', '#8dbd96', '#ffffff', '#b8956c'];

  function createTextSprite(text, colorHex) {
    const fontCanvas = document.createElement('canvas');
    fontCanvas.width = 256;
    fontCanvas.height = 64;
    const ctx = fontCanvas.getContext('2d');
    ctx.font = 'Bold 24px "Outfit", "Sora", sans-serif';
    ctx.fillStyle = colorHex || '#dfba89';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = colorHex || '#dfba89';
    ctx.shadowBlur = 8;
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(fontCanvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.65, 0.16, 1);
    return sprite;
  }

  skills.forEach((s, i) => {
    const phi   = Math.acos(-1 + (2 * i) / skills.length);
    const theta = Math.sqrt(skills.length * Math.PI) * phi;
    const colHex = palette[i % palette.length];
    const col   = new THREE.Color(colHex);
    const r     = 1.0 + (Math.random() * 0.08);

    const geo  = new THREE.SphereGeometry(0.038 + Math.random() * 0.012, 8, 8);
    const mat  = new THREE.MeshBasicMaterial({ color: col });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.setFromSphericalCoords(r, phi, theta);
    group.add(mesh);

    // Text Sprite Label
    const sprite = createTextSprite(s, colHex);
    sprite.position.setFromSphericalCoords(r * 1.22, phi, theta);
    group.add(sprite);

    // Connector line from center
    const pts = [new THREE.Vector3(0,0,0), mesh.position.clone()];
    const lm  = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.08 });
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm));
  });

  // Central core (gold aura)
  const coreGeo = new THREE.SphereGeometry(0.18, 20, 20);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xdfba89, transparent: true, opacity: 0.6 });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  // Inner glass wireframe
  const iwGeo = new THREE.SphereGeometry(1.06, 16, 16);
  const iwMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.04 });
  group.add(new THREE.Mesh(iwGeo, iwMat));

  // Drag interaction with momentum inertia
  let drag = false, px = 0, py = 0, velX = 0, velY = 0;
  canvas.addEventListener('mousedown',  e => { drag=true; px=e.clientX; py=e.clientY; });
  window.addEventListener('mouseup',    () => { drag=false; });
  window.addEventListener('mousemove',  e => {
    if (!drag) return;
    velX = e.clientX - px; velY = e.clientY - py;
    px = e.clientX; py = e.clientY;
    group.rotation.y += velX * 0.008;
    group.rotation.x += velY * 0.008;
  });
  canvas.addEventListener('touchstart', e => { drag=true; px=e.touches[0].clientX; py=e.touches[0].clientY; });
  canvas.addEventListener('touchend',   () => { drag=false; });
  canvas.addEventListener('touchmove',  e => {
    if (!drag) return;
    velX = e.touches[0].clientX - px; velY = e.touches[0].clientY - py;
    px = e.touches[0].clientX; py = e.touches[0].clientY;
    group.rotation.y += velX * 0.010;
    group.rotation.x += velY * 0.010;
  });

  let sphereVisible = true;
  if (typeof IntersectionObserver !== 'undefined') {
    const sphereObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        sphereVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    sphereObserver.observe(canvas);
  }

  let tStep = 0;
  (function animate() {
    requestAnimationFrame(animate);
    if (!sphereVisible) return;
    tStep += 0.025;
    coreMat.opacity = 0.5 + Math.sin(tStep) * 0.15;
    if (!drag) {
      group.rotation.y += velX * 0.006 + 0.0035;
      group.rotation.x += velY * 0.006 + 0.0006;
      velX *= 0.94;
      velY *= 0.94;
    }
    renderer.render(scene, camera);
  })();
})();

/* ─────────────────────────────────────────
   15. MAGNETIC BUTTONS
   ───────────────────────────────────────── */
(function initMagnetic() {
  if (noAnim) return;
  $$('.gbtn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12 - 1.5}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ─────────────────────────────────────────
   16. KEYBOARD & ACCESSIBILITY
   ───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const h = $('ham'), m = $('mobNav');
    if (h && m) { h.classList.remove('open'); m.classList.remove('open'); }
  }
});
