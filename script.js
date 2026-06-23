// terminal boot sequence
  const lines = [
    {t:'prompt', text:'$ whoami'},
    {t:'out', text:'bharath_allampati — CSE undergrad, Full Stack Java Developer'},
    {t:'prompt', text:'$ cat focus.txt'},
    {t:'out', text:'java backend · databases · full stack development'},
    {t:'prompt', text:'$ status --check'},
    {t:'out', text:'[ok] 3 projects shipped  [ok] 2 certs verified  [ok] open to roles'},
  ];
  const termBody = document.getElementById('termBody');
  let li = 0;

  function typeLine(line, cb){
    const el = document.createElement('div');
    el.className = 'line ' + (line.t === 'prompt' ? 'prompt' : 'out');
    termBody.appendChild(el);
    let i = 0;
    const speed = line.t === 'prompt' ? 32 : 14;
    function step(){
      el.textContent = line.text.slice(0, i);
      i++;
      if(i <= line.text.length){
        setTimeout(step, speed);
      } else {
        cb();
      }
    }
    step();
  }

  function runLines(){
    if(li >= lines.length){
      const cur = document.createElement('span');
      cur.className = 'cursor';
      termBody.appendChild(cur);
      return;
    }
    typeLine(lines[li], () => { li++; setTimeout(runLines, 220); });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    lines.forEach(l => {
      const el = document.createElement('div');
      el.className = 'line ' + (l.t === 'prompt' ? 'prompt' : 'out');
      el.textContent = l.text;
      termBody.appendChild(el);
    });
  } else {
    runLines();
  }

  // scroll trace fill
  const fill = document.getElementById('traceFill');
  function onScroll(){
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    fill.style.height = pct + '%';
  }
  document.addEventListener('scroll', onScroll);
  onScroll();

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));
