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


// ==========================================
// INTERACTIVE PHYSICS SKILLS GRAPH (CANVAS)
// ==========================================
const skillsCanvas = document.getElementById('skillsCanvas');
const physicsDetailsPanel = document.getElementById('physicsDetailsPanel');

if (skillsCanvas && physicsDetailsPanel) {
  const ctx = skillsCanvas.getContext('2d');
  
  // Node layout configurations
  const nodes = [
    // Languages
    { id: 0, label: 'Java', radius: 36, x: 180, y: 150, category: 'Core Language', color: '#C8814F', desc: 'Object-oriented, strongly typed programming language. Serves as my foundational pillar for backend platform services, structural design patterns, and multithreaded workflows.', flow: 'Powers core service nodes; compiles to JVM bytecodes; executes REST handlers.', selected: true },
    { id: 1, label: 'SQL', radius: 28, x: 130, y: 70, category: 'Core Language', color: '#C8814F', desc: 'Structured Query Language. Used to design relational database schemas, write efficient complex joins, index queries for high performance, and handle transaction isolates.', flow: 'Fetches persistent records; executes structural database schemas.', selected: false },
    { id: 2, label: 'Node.js', radius: 32, x: 420, y: 150, category: 'Core Language', color: '#C8814F', desc: 'An asynchronous event-driven JavaScript runtime environment. Used to implement non-blocking backends, real-time WebSocket communication rooms, and microservice APIs.', flow: 'Hosts collaborative syncing channels; parses streaming server loops.', selected: false },
    { id: 3, label: 'Python', radius: 28, x: 260, y: 60, category: 'Core Language', color: '#C8814F', desc: 'High-level programming language. Applied to build custom helper utilities, mathematical data models, image processing filters (OpenCV), and machine learning testing.', flow: 'Manages block-wise image transformations and OpenCV math matrices.', selected: false },
    { id: 4, label: 'JavaScript', radius: 30, x: 460, y: 250, category: 'Core Language', color: '#5FA8A0', desc: 'Dynamic frontend and scripting language. Powers client side routing, state updates, responsive DOM tracking, and network fetch requests.', flow: 'Fires event handlers; maps responses to frontend interface state structures.', selected: false },
    
    // Frameworks & Services
    { id: 5, label: 'Spring Boot', radius: 34, x: 110, y: 240, category: 'Framework & API', color: '#a78bfa', desc: 'Java framework for enterprise applications. Handles dependency injections, CORS configs, REST request mappings, and structural database integrations.', flow: 'Launches local application ports; filters API router requests.', selected: false },
    { id: 6, label: 'Express', radius: 28, x: 330, y: 230, category: 'Framework & API', color: '#a78bfa', desc: 'Minimalist web framework for Node.js. Used to build RESTful API routing pipelines, custom authentication middleware layers, and request parsers.', flow: 'Processes web request inputs; handles security credential policies.', selected: false },
    { id: 7, label: 'React.js', radius: 32, x: 530, y: 320, category: 'Frontend Engine', color: '#5FA8A0', desc: 'Component-based client library. Controls interactive virtual DOM render cycles, component states, and asynchronous server communications.', flow: 'Renders dynamic web interfaces; holds layout rendering parameters.', selected: false },
    { id: 8, label: 'Vite', radius: 26, x: 590, y: 230, category: 'Frontend Engine', color: '#5FA8A0', desc: 'Rapid frontend bundling framework. Drives local build servers, manages hot-module replacements, and bundles assets for deployment.', flow: 'Compiles ES modules; optimizes production client assets.', selected: false },
    { id: 9, label: 'Tailwind', radius: 26, x: 590, y: 370, category: 'Frontend Engine', color: '#5FA8A0', desc: 'Utility-first styling utility. Employs responsive grids and glassmorphic designs with optimal paint performance and zero stylesheet bloat.', flow: 'Generates responsive canvas styling properties and display variables.', selected: false },
    
    // Databases
    { id: 10, label: 'Postgres', radius: 30, x: 80, y: 320, category: 'Database Storage', color: '#a78bfa', desc: 'Advanced open-source relational database. Supports robust table relationships, custom triggers, JSON indices, and transaction atomicity.', flow: 'Stores structural customer databases; runs ACID queries.', selected: false },
    { id: 11, label: 'MongoDB', radius: 30, x: 270, y: 310, category: 'Database Storage', color: '#a78bfa', desc: 'Document database designed for high scalability. Manages user record models, metadata sync indexes, and handles dynamic JSON document trees.', flow: 'Saves platform user documents; handles dynamic queries through Mongoose.', selected: false },
    { id: 12, label: 'Firebase', radius: 28, x: 410, y: 360, category: 'Database Storage', color: '#a78bfa', desc: 'Realtime cloud database platform. Supports instant document synchronizations, dynamic state replication, and fast auth checks.', flow: 'Synchronizes test performance scores; acts as mock-exam data storage.', selected: false },
    
    // Cloud & Security
    { id: 13, label: 'AWS Cloud', radius: 32, x: 190, y: 360, category: 'Cloud Infrastructure', color: '#5fa8a0', desc: 'Global cloud infrastructure. Utilized to host application compute servers (EC2), secure object storage (S3), and scalable serverless compute execution (Lambda).', flow: 'Maintains platform compute runtimes; stores media assets.', selected: false },
    { id: 14, label: 'IAM Security', radius: 28, x: 280, y: 380, category: 'Cloud Infrastructure', color: '#5fa8a0', desc: 'AWS Identity & Access Management. Sets security roles, controls access keys, and prevents credential exposure across cloud services.', flow: 'Authenticates cloud resource interactions; sets access control limits.', selected: false },
    { id: 15, label: 'Wireshark', radius: 28, x: 340, y: 40, category: 'Network Security', color: '#5fa8a0', desc: 'Packet trace analyzer. Used to capture live ethernet frames, verify secure socket layers (SSL), and inspect data transmission protocols.', flow: 'Analyzes packet streams; flags networking handshakes.', selected: false }
  ];

  // Initialize node velocities to prevent NaN operations on undefined values
  nodes.forEach(n => {
    n.vx = 0;
    n.vy = 0;
  });

  const links = [
    { source: 0, target: 1 }, // Java -> SQL
    { source: 0, target: 5 }, // Java -> Spring Boot
    { source: 0, target: 3 }, // Java -> Python
    { source: 1, target: 10 }, // SQL -> Postgres
    { source: 2, target: 4 }, // Node.js -> JS
    { source: 2, target: 6 }, // Node.js -> Express
    { source: 2, target: 11 }, // Node.js -> Mongo
    { source: 4, target: 7 }, // JS -> React
    { source: 7, target: 8 }, // React -> Vite
    { source: 7, target: 9 }, // React -> Tailwind
    { source: 7, target: 12 }, // React -> Firebase
    { source: 5, target: 10 }, // Spring Boot -> Postgres
    { source: 5, target: 13 }, // Spring Boot -> AWS
    { source: 13, target: 14 }, // AWS -> IAM
    { source: 0, target: 15 }  // Java -> Wireshark
  ];

  let draggedNode = null;
  let hoveredNode = null;
  let mouseX = 0;
  let mouseY = 0;
  let isDragging = false;

  // Set canvas size dynamically to fit container
  function resizeCanvas() {
    const wrapper = skillsCanvas.parentElement;
    if (wrapper) {
      skillsCanvas.width = wrapper.clientWidth;
      skillsCanvas.height = wrapper.clientWidth < 600 ? 360 : 420;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Expose selectNodeById globally so detail chips work clickably
  window.selectNodeById = function(id) {
    const node = nodes.find(n => n.id === id);
    if (node) {
      nodes.forEach(n => n.selected = false);
      node.selected = true;
      renderDetailsPanel(node);
      
      // Give a tiny impulse bounce on click
      node.vx += (Math.random() - 0.5) * 15;
      node.vy += (Math.random() - 0.5) * 15;
    }
  };

  // Render details panel
  function renderDetailsPanel(node) {
    // Find connected elements
    const connected = links
      .filter(l => l.source === node.id || l.target === node.id)
      .map(l => {
        const otherId = l.source === node.id ? l.target : l.source;
        return nodes.find(n => n.id === otherId);
      })
      .filter(Boolean);

    physicsDetailsPanel.innerHTML = `
      <div style="animation: fadeIn 0.3s ease;">
        <h3>
          <span class="layer-badge" style="border-color: ${node.color}; color: ${node.color}">${node.category}</span>
          ${node.label}
        </h3>
        <p class="desc">${node.desc}</p>
        
        <div class="details-section">
          <div class="section-title">Data / Logic Flow Context</div>
          <div class="flow-card" style="border-left: 3px solid ${node.color};">
            ${node.flow}
          </div>
        </div>
        
        <div class="details-section">
          <div class="section-title">Connected Stack Relationships</div>
          <div class="chips-list">
            ${connected.map(n => `<span class="chip-item" style="border-color: ${n.color}; cursor: pointer;" onclick="selectNodeById(${n.id})">${n.label}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Set default initial details
  const initialNode = nodes.find(n => n.selected) || nodes[0];
  renderDetailsPanel(initialNode);

  // Physics Simulation Loop
  function tick() {
    const w = skillsCanvas.width;
    const h = skillsCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // 1. Centering forces (gravity pulling nodes to middle)
    nodes.forEach(n => {
      n.vx += (cx - n.x) * 0.003;
      n.vy += (cy - n.y) * 0.003;
    });

    // 2. Node repulsion forces (stops overlap, distributes nodes)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const na = nodes[i];
        const nb = nodes[j];
        const dx = nb.x - na.x;
        const dy = nb.y - na.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = na.radius + nb.radius + 35; // optimal node spacing

        if (dist < minDist) {
          const force = (minDist - dist) * 0.05;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          if (na !== draggedNode) {
            na.vx -= fx;
            na.vy -= fy;
          }
          if (nb !== draggedNode) {
            nb.vx += fx;
            nb.vy += fy;
          }
        }
      }
    }

    // 3. Link spring tension forces (keeps connections close)
    links.forEach(l => {
      const na = nodes[l.source];
      const nb = nodes[l.target];
      const dx = nb.x - na.x;
      const dy = nb.y - na.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const restLen = 95; // resting wire distance
      const k = 0.015; // spring strength
      const force = (dist - restLen) * k;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (na !== draggedNode) {
        na.vx += fx;
        na.vy += fy;
      }
      if (nb !== draggedNode) {
        nb.vx -= fx;
        nb.vy -= fy;
      }
    });

    // 4. Update coordinates & apply damping friction
    nodes.forEach(n => {
      if (n === draggedNode) {
        n.x = mouseX;
        n.y = mouseY;
        n.vx = 0;
        n.vy = 0;
      } else {
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.82; // drag damping
        n.vy *= 0.82;

        // Keep inside canvas bounds
        if (n.x < n.radius) { n.x = n.radius; n.vx = 0; }
        if (n.x > w - n.radius) { n.x = w - n.radius; n.vx = 0; }
        if (n.y < n.radius) { n.y = n.radius; n.vy = 0; }
        if (n.y > h - n.radius) { n.y = h - n.radius; n.vy = 0; }
      }
    });

    // ==================
    // CANVAS RENDERING
    // ==================
    ctx.clearRect(0, 0, w, h);

    // Get active selected node (either clicked/selected or hovered)
    const activeNode = hoveredNode || nodes.find(n => n.selected);

    // Draw Links
    links.forEach(l => {
      const na = nodes[l.source];
      const nb = nodes[l.target];

      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);

      // Highlight links connected to active node
      if (activeNode && (l.source === activeNode.id || l.target === activeNode.id)) {
        ctx.strokeStyle = activeNode.color;
        ctx.lineWidth = 1.8;
      } else {
        ctx.strokeStyle = 'rgba(38, 46, 55, 0.45)';
        ctx.lineWidth = 0.85;
      }
      ctx.stroke();
    });

    // Draw Nodes
    nodes.forEach(n => {
      ctx.save();
      
      // Node selection glow
      ctx.shadowColor = n.color;
      ctx.shadowBlur = n.selected ? 16 : (hoveredNode === n ? 12 : 5);

      // Node background radial gradient
      const grad = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, n.radius);
      grad.addColorStop(0, n.color + '33'); // 20% opacity color
      grad.addColorStop(1, '#12171D');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();

      // Node border
      ctx.strokeStyle = n.color;
      ctx.lineWidth = n.selected ? 2.5 : 1.25;
      ctx.stroke();
      
      ctx.restore();

      // Node text label
      ctx.fillStyle = '#E9E6E0';
      ctx.font = n.radius > 32 ? '600 12px "Space Grotesk", sans-serif' : '500 11px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
    });

    requestAnimationFrame(tick);
  }

  // Event coordination
  function updateMouseCoordinates(e) {
    const rect = skillsCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseX = (clientX - rect.left) * (skillsCanvas.width / rect.width);
    mouseY = (clientY - rect.top) * (skillsCanvas.height / rect.height);
  }

  function checkHover() {
    let found = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = mouseX - n.x;
      const dy = mouseY - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < n.radius) {
        found = n;
        break;
      }
    }
    hoveredNode = found;
    skillsCanvas.style.cursor = found ? 'grab' : 'default';
  }

  // Event listeners
  skillsCanvas.addEventListener('mousemove', (e) => {
    updateMouseCoordinates(e);
    if (!isDragging) {
      checkHover();
    }
  });

  skillsCanvas.addEventListener('mousedown', (e) => {
    updateMouseCoordinates(e);
    checkHover();
    if (hoveredNode) {
      draggedNode = hoveredNode;
      isDragging = true;
      skillsCanvas.style.cursor = 'grabbing';
      
      // Select the node on click
      nodes.forEach(n => n.selected = false);
      draggedNode.selected = true;
      renderDetailsPanel(draggedNode);
    }
  });

  window.addEventListener('mouseup', () => {
    draggedNode = null;
    isDragging = false;
    skillsCanvas.style.cursor = hoveredNode ? 'grab' : 'default';
  });

  skillsCanvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
  });

  // Mobile Touch Support
  skillsCanvas.addEventListener('touchmove', (e) => {
    updateMouseCoordinates(e);
    if (isDragging) {
      e.preventDefault(); // prevent scroll bounce
    } else {
      checkHover();
    }
  }, { passive: false });

  skillsCanvas.addEventListener('touchstart', (e) => {
    updateMouseCoordinates(e);
    checkHover();
    if (hoveredNode) {
      draggedNode = hoveredNode;
      isDragging = true;
      
      nodes.forEach(n => n.selected = false);
      draggedNode.selected = true;
      renderDetailsPanel(draggedNode);
      e.preventDefault();
    }
  }, { passive: false });

  skillsCanvas.addEventListener('touchend', () => {
    draggedNode = null;
    isDragging = false;
  });

  // Start loop
  requestAnimationFrame(tick);
}
