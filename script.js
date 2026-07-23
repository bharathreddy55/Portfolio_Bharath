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

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const plane = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    angle: 0,
    targetX: width / 2,
    targetY: height / 2,
    opacity: 0,
    targetOpacity: 0
  };

  const particles = [];
  let hasMoved = false;
  let idleTime = 0;

  window.addEventListener('mousemove', (e) => {
    plane.targetX = e.clientX;
    plane.targetY = e.clientY;
    if (!hasMoved) {
      plane.x = e.clientX;
      plane.y = e.clientY;
      hasMoved = true;
    }
    plane.targetOpacity = 1;
    idleTime = 0;
  });

  window.addEventListener('mouseleave', () => {
    plane.targetOpacity = 0;
  });

  function spawnParticle(x, y, angle) {
    // Spawn at the back center of the plane
    const tailX = x - Math.cos(angle) * 12;
    const tailY = y - Math.sin(angle) * 12;

    const force = 0.4 + Math.random() * 1.0;
    const pVx = -Math.cos(angle) * force + (Math.random() - 0.5) * 0.6;
    const pVy = -Math.sin(angle) * force + (Math.random() - 0.5) * 0.6;

    particles.push({
      x: tailX,
      y: tailY,
      vx: pVx,
      vy: pVy,
      size: 2 + Math.random() * 2,
      colorType: Math.random() > 0.4 ? 'copper' : 'teal',
      life: 1.0,
      decay: 0.02 + Math.random() * 0.02
    });
  }

  function update() {
    // Fade opacity
    plane.opacity += (plane.targetOpacity - plane.opacity) * 0.08;

    // Position updates
    const dx = plane.targetX - plane.x;
    const dy = plane.targetY - plane.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 6) {
      idleTime = 0;
      const ax = dx / dist;
      const ay = dy / dist;

      // Adjust acceleration based on distance for a organic steering feeling
      const accel = dist < 120 ? 0.35 : 0.6;
      plane.vx += ax * accel;
      plane.vy += ay * accel;

      // Damping
      const friction = dist < 60 ? 0.84 : 0.91;
      plane.vx *= friction;
      plane.vy *= friction;

      // Limit speed
      const speed = Math.sqrt(plane.vx * plane.vx + plane.vy * plane.vy);
      const maxSpeed = 10;
      if (speed > maxSpeed) {
        plane.vx = (plane.vx / speed) * maxSpeed;
        plane.vy = (plane.vy / speed) * maxSpeed;
      }

      plane.x += plane.vx;
      plane.y += plane.vy;

      // Smooth heading steering angle rotation
      const targetAngle = Math.atan2(plane.vy, plane.vx);
      let diff = targetAngle - plane.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      plane.angle += diff * 0.14;

      // Spawn trail particles based on movement
      if (speed > 1.2 && Math.random() < 0.5) {
        spawnParticle(plane.x, plane.y, plane.angle);
      }
    } else {
      plane.vx *= 0.8;
      plane.vy *= 0.8;
      plane.x += plane.vx;
      plane.y += plane.vy;
      
      idleTime++;
      if (idleTime > 120) {
        plane.targetOpacity = 0;
      }
    }

    // Particle lifecycle
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
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
        ctx.fillStyle = `rgba(200, 129, 79, ${p.life * 0.15})`;
      } else {
        ctx.fillStyle = `rgba(95, 168, 160, ${p.life * 0.15})`;
      }
      ctx.fill();

      // Main core particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      if (p.colorType === 'copper') {
        ctx.fillStyle = `rgba(230, 180, 140, ${p.life * 0.95})`;
      } else {
        ctx.fillStyle = `rgba(180, 230, 225, ${p.life * 0.95})`;
      }
      ctx.fill();
    }

    // Draw paper airplane if visible
    if (plane.opacity > 0.01) {
      ctx.save();
      ctx.translate(plane.x, plane.y);
      ctx.rotate(plane.angle);
      ctx.globalAlpha = plane.opacity;

      // 1. Draw Offset Shadow
      ctx.save();
      ctx.translate(4, 6);
      ctx.fillStyle = 'rgba(11, 14, 17, 0.3)';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-12, -8);
      ctx.lineTo(-6, -2);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-6, 2);
      ctx.lineTo(-12, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Draw Folded Paper Airplane Faces
      // Top wing face (bright copper)
      ctx.fillStyle = 'rgba(200, 129, 79, 0.95)';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-12, -8);
      ctx.lineTo(-6, -2);
      ctx.closePath();
      ctx.fill();

      // Bottom wing face (darker copper)
      ctx.fillStyle = 'rgba(138, 90, 55, 0.95)';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-12, 8);
      ctx.lineTo(-6, 2);
      ctx.closePath();
      ctx.fill();

      // Center valley/keel (teal accent)
      ctx.fillStyle = 'rgba(95, 168, 160, 0.95)';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-6, -2);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-6, 2);
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
