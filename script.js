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

// ---------- Interactive Swagger OpenAPI UI Control ----------
const opBlocks = document.querySelectorAll('.op-block');

opBlocks.forEach(block => {
  const header = block.querySelector('.op-header');
  const tryBtn = block.querySelector('.try-btn');
  const execBtn = block.querySelector('.exec-btn');
  const cancelBtn = block.querySelector('.cancel-btn');
  const responseSec = block.querySelector('.response-section');

  // Expand / Collapse Endpoint details
  header.addEventListener('click', (e) => {
    // Don't toggle collapse if clicking action buttons
    if (e.target.closest('.btn-swagger')) return;
    
    // Collapse others first to keep clean Swagger aesthetic
    opBlocks.forEach(otherBlock => {
      if (otherBlock !== block && otherBlock.classList.contains('expanded')) {
        otherBlock.classList.remove('expanded');
      }
    });
    
    block.classList.toggle('expanded');
  });

  // Try It Out button handler
  if (tryBtn) {
    tryBtn.addEventListener('click', () => {
      tryBtn.classList.add('hidden');
      execBtn.classList.remove('hidden');
      cancelBtn.classList.remove('hidden');
    });
  }

  // Cancel button handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      tryBtn.classList.remove('hidden');
      execBtn.classList.add('hidden');
      cancelBtn.classList.add('hidden');
      responseSec.classList.add('hidden');
    });
  }

  // Execute button handler (Simulation)
  if (execBtn) {
    execBtn.addEventListener('click', () => {
      execBtn.textContent = 'Executing...';
      execBtn.disabled = true;
      setTimeout(() => {
        execBtn.textContent = 'Execute';
        execBtn.disabled = false;
        responseSec.classList.remove('hidden');
        // Scroll slightly to reveal response section
        responseSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 450);
    });
  }
});

// Automatically expand the first endpoint to draw interest
if (opBlocks.length > 0) {
  opBlocks[0].classList.add('expanded');
}
