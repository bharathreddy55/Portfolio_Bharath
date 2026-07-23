// terminal boot sequence
const lines = [
  {t:'prompt', text:'$ whoami'},
  {t:'out', text:'bharath_allampati — CSE undergrad, Full Stack Developer'},
  {t:'prompt', text:'$ cat focus.txt'},
  {t:'out', text:'java backend · databases · api development'},
  {t:'prompt', text:'$ status --check'},
  {t:'out', text:'[ok] 5 projects shipped  [ok] 4 certs/programs completed  [ok] open to roles'},
];

const termBody = document.getElementById('termBody');
const terminal = document.querySelector('.terminal');
let li = 0;
let currentTimeout = null;
let isSkipped = false;

function renderAllInstantly() {
  isSkipped = true;
  if (currentTimeout) clearTimeout(currentTimeout);
  termBody.innerHTML = '';
  lines.forEach(l => {
    const el = document.createElement('div');
    el.className = 'line ' + (l.t === 'prompt' ? 'prompt' : 'out');
    el.textContent = l.text;
    termBody.appendChild(el);
  });
  const cur = document.createElement('span');
  cur.className = 'cursor';
  termBody.appendChild(cur);
}

function typeLine(line, cb){
  if (isSkipped) return;
  const el = document.createElement('div');
  el.className = 'line ' + (line.t === 'prompt' ? 'prompt' : 'out');
  termBody.appendChild(el);
  let i = 0;
  const speed = line.t === 'prompt' ? 12 : 5;
  function step(){
    if (isSkipped) return;
    el.textContent = line.text.slice(0, i);
    i++;
    if(i <= line.text.length){
      currentTimeout = setTimeout(step, speed);
    } else {
      cb();
    }
  }
  step();
}

function runLines(){
  if (isSkipped) return;
  if(li >= lines.length){
    const cur = document.createElement('span');
    cur.className = 'cursor';
    termBody.appendChild(cur);
    return;
  }
  typeLine(lines[li], () => {
    if (isSkipped) return;
    li++;
    currentTimeout = setTimeout(runLines, 60);
  });
}

// Add click-to-skip interactivity
if (terminal) {
  terminal.style.cursor = 'pointer';
  terminal.title = 'Click to skip typing animation';
  terminal.addEventListener('click', () => {
    if (!isSkipped && li < lines.length) {
      renderAllInstantly();
    }
  });
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  renderAllInstantly();
} else {
  runLines();
}

// scroll trace fill
const fill = document.getElementById('traceFill');
function onScroll(){
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  if (fill) fill.style.height = pct + '%';
}
document.addEventListener('scroll', onScroll);
onScroll();

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

// animate skills progress bars on scroll
const skillBars = document.querySelectorAll('.sm-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const bar = e.target;
      const pct = bar.getAttribute('data-pct');
      bar.style.width = pct + '%';
      skillObserver.unobserve(bar);
    }
  });
}, {threshold: 0.1});
skillBars.forEach(bar => skillObserver.observe(bar));

// ---------- INTERACTIVE PAPER AIRPLANE POINTER TRAIL ----------
(function() {
  const canvas = document.getElementById('pointer-trail-canvas');
  if (!canvas || window.matchMedia('(pointer: coarse)').matches) return;

  // Add the custom cursor class to enable cursor: none in CSS
  document.documentElement.classList.add('has-custom-cursor');

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const plane = {
    x: width / 2,     // Nose coordinates
    y: height / 2,
    tailX: width / 2, // Tail coordinates for rotation and trailing calculations
    tailY: height / 2,
    angle: 0,
    targetX: width / 2,
    targetY: height / 2,
    opacity: 0,
    targetOpacity: 0,
    scale: 1,
    targetScale: 1
  };

  const particles = [];
  let hasMoved = false;
  let isHoveringClickable = false;

  // Listen globally to mouse movements
  window.addEventListener('mousemove', (e) => {
    plane.targetX = e.clientX;
    plane.targetY = e.clientY;
    
    if (!hasMoved) {
      plane.x = e.clientX;
      plane.y = e.clientY;
      plane.tailX = e.clientX;
      plane.tailY = e.clientY;
      hasMoved = true;
    }
    
    plane.targetOpacity = 1;
  });

  window.addEventListener('mouseleave', () => {
    plane.targetOpacity = 0;
  });

  // Track hover states for interactive elements to scale the plane cursor
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (target && (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.navlinks a') ||
      target.closest('.proj-link') ||
      target.closest('.btn') ||
      target.classList.contains('btn') ||
      target.classList.contains('terminal') ||
      target.closest('.terminal')
    )) {
      isHoveringClickable = true;
    } else {
      isHoveringClickable = false;
    }
  });

  function spawnParticle(x, y, angle) {
    // Spawn at the back center of the plane (which corresponds to x, y tail position)
    const force = 0.6 + Math.random() * 1.4;
    const pVx = -Math.cos(angle) * force + (Math.random() - 0.5) * 0.5;
    const pVy = -Math.sin(angle) * force + (Math.random() - 0.5) * 0.5;

    particles.push({
      x: x,
      y: y,
      vx: pVx,
      vy: pVy,
      size: 2.0 + Math.random() * 2.0,
      colorType: Math.random() > 0.45 ? 'copper' : 'teal',
      life: 1.0,
      decay: 0.01 + Math.random() * 0.012
    });
  }

  function update() {
    // Fade opacity and scaling transitions
    plane.opacity += (plane.targetOpacity - plane.opacity) * 0.08;
    // Scale increased: base is 1.4, grows to 1.85 on hovering interactive elements
    plane.targetScale = isHoveringClickable ? 1.85 : 1.4;
    plane.scale += (plane.targetScale - plane.scale) * 0.15;

    // Nose locks to target coordinates instantly
    plane.x = plane.targetX;
    plane.y = plane.targetY;

    // Tail lags behind nose
    const dx = plane.x - plane.tailX;
    const dy = plane.y - plane.tailY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0.5) {
      // Easing factor controls tail lag sensitivity
      const ease = 0.22;
      plane.tailX += dx * ease;
      plane.tailY += dy * ease;

      // Update angle pointing from tail to nose
      plane.angle = Math.atan2(dy, dx);

      // Spawn trail particles based on movement (generates a thicker, longer trail)
      if (dist > 2) {
        if (Math.random() < 0.75) spawnParticle(plane.tailX, plane.tailY, plane.angle);
        if (dist > 8 && Math.random() < 0.45) spawnParticle(plane.tailX, plane.tailY, plane.angle);
      }
    }

    // Particle updates
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.972; // friction reduced so they drift further
      p.vy *= 0.972;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw active particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Secondary soft glow circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life * 3, 0, Math.PI * 2);
      if (p.colorType === 'copper') {
        ctx.fillStyle = `rgba(200, 129, 79, ${p.life * 0.12})`;
      } else {
        ctx.fillStyle = `rgba(95, 168, 160, ${p.life * 0.12})`;
      }
      ctx.fill();

      // Main core particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      if (p.colorType === 'copper') {
        ctx.fillStyle = `rgba(230, 180, 140, ${p.life * 0.9})`;
      } else {
        ctx.fillStyle = `rgba(180, 230, 225, ${p.life * 0.9})`;
      }
      ctx.fill();
    }

    // Draw paper airplane if visible
    if (plane.opacity > 0.01) {
      ctx.save();
      // Translate to nose position
      ctx.translate(plane.x, plane.y);
      ctx.rotate(plane.angle);
      ctx.scale(plane.scale, plane.scale);
      ctx.globalAlpha = plane.opacity;

      // 1. Draw Offset Shadow (aligned to shifted coordinates)
      ctx.save();
      ctx.translate(2, 3);
      ctx.fillStyle = 'rgba(11, 14, 17, 0.35)';
      ctx.beginPath();
      ctx.moveTo(0, 0);          // Nose at (0,0)
      ctx.lineTo(-27, -8);       // Top Wing Tip
      ctx.lineTo(-21, -2);       // Left Inner Fold
      ctx.lineTo(-19, 0);        // Center Back Fold
      ctx.lineTo(-21, 2);        // Right Inner Fold
      ctx.lineTo(-27, 8);        // Bottom Wing Tip
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Draw Folded Paper Airplane Faces
      // Top wing face (bright copper)
      ctx.fillStyle = 'rgba(200, 129, 79, 0.95)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-27, -8);
      ctx.lineTo(-21, -2);
      ctx.closePath();
      ctx.fill();

      // Bottom wing face (darker copper)
      ctx.fillStyle = 'rgba(138, 90, 55, 0.95)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-27, 8);
      ctx.lineTo(-21, 2);
      ctx.closePath();
      ctx.fill();

      // Center valley/keel (teal accent)
      ctx.fillStyle = 'rgba(95, 168, 160, 0.95)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-21, -2);
      ctx.lineTo(-19, 0);
      ctx.lineTo(-21, 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
})();
