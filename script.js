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

// ---------- Interactive Layered Architecture Control ----------
const layerData = {
  client: {
    badge: 'Layer 4',
    title: 'Client & UI Layer',
    desc: 'The presentation layer. I construct responsive, interactive web interfaces with modern styling systems, reactive state management, and component-driven architecture.',
    core: ['React.js', 'Vite', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'Bootstrap'],
    flow: 'Dispatches UI action triggers; coordinates component states; requests JSON resources via asynchronous REST API clients.'
  },
  api: {
    badge: 'Layer 3',
    title: 'API & Application Logic',
    desc: 'The logic layer. I design structured backend application services, manage API routing, write business logic controllers, and integrate AI processing pipelines.',
    core: ['Java', 'Spring Boot', 'Spring Framework', 'Node.js', 'Express.js', 'Python', 'REST APIs'],
    flow: 'Validates client request parameters; verifies security JSON Web Tokens (JWTs); executes services; calls the Database layer.'
  },
  db: {
    badge: 'Layer 2',
    title: 'Database & Storage',
    desc: 'The persistence layer. I configure robust relational and non-relational database schemas, optimize queries, manage table indexes, and write secure transactions.',
    core: ['PostgreSQL', 'MySQL', 'MongoDB Atlas', 'Firebase Firestore', 'SQL Querying'],
    flow: 'Safely stores structured records; maps domain entities; resolves queries and transaction requests from Layer 3.'
  },
  infra: {
    badge: 'Layer 1',
    title: 'Infrastructure & Security',
    desc: 'The system operations layer. I set up host resources, control permission roles, isolate secrets, and analyze network packet transmissions for vulnerability assessments.',
    core: ['AWS (S3, EC2, Lambda)', 'IAM Policies', 'Wireshark Packet Analysis', 'Git / GitHub Versioning', 'SIEM & Identity Auditing'],
    flow: 'Hosts container runtime configurations; secures traffic paths; maps access permissions; reports system-level trace logs.'
  }
};

const detailsPanel = document.getElementById('detailsPanel');
const layers = document.querySelectorAll('.arch-layer');

function selectLayer(layerId) {
  if (!detailsPanel) return;
  
  // Clear active class from all layers
  layers.forEach(l => l.classList.remove('active'));
  
  // Find active layer element and add active class
  const activeEl = document.querySelector(`.arch-layer[data-layer="${layerId}"]`);
  if (activeEl) {
    activeEl.classList.add('active');
  }
  
  // Get data
  const data = layerData[layerId];
  if (!data) return;
  
  // Get layer color to dynamically color badges/border
  const layerColor = activeEl ? activeEl.style.getPropertyValue('--layer-color') : 'var(--teal)';
  
  // Render details html
  detailsPanel.innerHTML = `
    <div style="animation: fadeIn 0.3s ease;">
      <h3 style="color: var(--text)">
        <span class="layer-badge" style="border-color: ${layerColor}; color: ${layerColor}">${data.badge}</span>
        ${data.title}
      </h3>
      <p class="desc">${data.desc}</p>
      
      <div class="details-section">
        <div class="section-title">Core Technologies & Frameworks</div>
        <div class="chips-list">
          ${data.core.map(tech => `<span class="chip-item" style="border-color: rgba(255,255,255,0.06);">${tech}</span>`).join('')}
        </div>
      </div>
      
      <div class="details-section">
        <div class="section-title">Data & Communication Flow</div>
        <div class="flow-card" style="border-left-color: ${layerColor}">
          ${data.flow}
        </div>
      </div>
    </div>
  `;
}

// Add event listener to each layer
layers.forEach(layer => {
  layer.addEventListener('click', () => {
    const id = layer.getAttribute('data-layer');
    selectLayer(id);
  });
});

// Initialize with Client layer
if (layers.length > 0) {
  selectLayer('client');
}
