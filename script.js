/* ══════════════════════════════════════════════════
   CALC X — Premium Calculator Script
   Features: 3D Intro, Multi-lang, Auto-Currency, Solar
══════════════════════════════════════════════════ */
'use strict';

const globalHistory = [];
let isDark = true;

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initParticles();
  initCursorGlow();
  initNavigation();
  initTheme();
  initLanguage();
  initHistory();
  initStandard();
  initScientific();
  initCurrency();
  initUnit();
  initBMI();
  initTip();
  initAge();
  initLoan();
  initSolar();
  initKeyboard();
  initSidebarScrollHint();
  init3DTilt();
  initFloatingOrb();
});

/* ── 3D INTRO CONTROLLER ───────────────────── */
function initIntro() {
  const intro = document.getElementById('intro');
  const fill = document.getElementById('introFill');
  const pct = document.getElementById('introPct');
  const skipBtn = document.getElementById('introSkip');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let progress = 0;
  let finished = false;
  const duration = reduceMotion ? 600 : 2400;
  const start = performance.now();

  function closeIntro() {
    if (finished) return;
    finished = true;
    intro.classList.add('hide');
    setTimeout(() => intro.remove(), 750);
  }

  function tick(now) {
    if (finished) return;
    const elapsed = now - start;
    progress = Math.min(100, (elapsed / duration) * 100);
    fill.style.width = progress + '%';
    pct.textContent = Math.round(progress) + '%';
    if (progress >= 100) {
      setTimeout(closeIntro, 250);
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  skipBtn.addEventListener('click', closeIntro);
  intro.addEventListener('click', (e) => { if (e.target === intro) closeIntro(); });
}

/* ── PARTICLES & CURSOR ─────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, pts;
  function resize() {
    W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight;
    pts = Array.from({length: 60}, () => ({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, r: Math.random()*1.5+.5, a: Math.random() }));
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    const isDarkTheme = !document.documentElement.dataset.theme;
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0) p.x=W; if (p.x>W) p.x=0; if (p.y<0) p.y=H; if (p.y>H) p.y=0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = isDarkTheme ? `rgba(0,212,255,${p.a*0.5})` : `rgba(0,100,200,${p.a*0.25})`;
      ctx.fill();
    });
    pts.forEach((a,i) => {
      pts.slice(i+1).forEach(b => {
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          const alpha = (1-d/100)*0.12;
          ctx.strokeStyle = isDarkTheme ? `rgba(0,212,255,${alpha})` : `rgba(0,100,200,${alpha*0.5})`;
          ctx.lineWidth = .5; ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize); resize(); draw();

  // Lightweight duplicate for intro screen
  const introCanvas = document.getElementById('intro-particles');
  if (introCanvas) {
    const ictx = introCanvas.getContext('2d');
    let iW, iH, ipts;
    function iresize(){ iW=introCanvas.width=window.innerWidth; iH=introCanvas.height=window.innerHeight; ipts=Array.from({length:40},()=>({x:Math.random()*iW,y:Math.random()*iH,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.4+.4,a:Math.random()})); }
    function idraw(){
      if (!document.body.contains(introCanvas)) return;
      ictx.clearRect(0,0,iW,iH);
      ipts.forEach(p=>{ p.x+=p.vx;p.y+=p.vy; if(p.x<0)p.x=iW; if(p.x>iW)p.x=0; if(p.y<0)p.y=iH; if(p.y>iH)p.y=0; ictx.beginPath(); ictx.arc(p.x,p.y,p.r,0,Math.PI*2); ictx.fillStyle=`rgba(0,212,255,${p.a*0.4})`; ictx.fill(); });
      requestAnimationFrame(idraw);
    }
    window.addEventListener('resize', iresize); iresize(); idraw();
  }
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  let mx=0, my=0, cx=0, cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function animate(){ cx += (mx-cx)*.08; cy += (my-cy)*.08; glow.style.left = cx+'px'; glow.style.top = cy+'px'; requestAnimationFrame(animate); })();
}

/* ── NAVIGATION (all panels reachable directly) ─── */
function initNavigation() {
  function switchPanel(name) {
    document.querySelectorAll('.nav-item,.bnav-item').forEach(b=> b.classList.toggle('active', b.dataset.panel===name));
    document.querySelectorAll('.panel').forEach(p=> p.classList.toggle('active', p.id==='panel-'+name));
    document.querySelector('.main-content').scrollTo({top:0,behavior:'smooth'});
  }
  document.querySelectorAll('.nav-item,.bnav-item').forEach(btn => btn.addEventListener('click', ()=> switchPanel(btn.dataset.panel)));
}

/* ── THEME ─────────────────────────────────── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('calc-theme');
  if (savedTheme === 'light') {
    isDark = false;
    document.documentElement.setAttribute('data-theme','light');
    icon.textContent = '◐';
  }
  btn.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) { document.documentElement.removeAttribute('data-theme'); icon.textContent = '◑'; }
    else { document.documentElement.setAttribute('data-theme','light'); icon.textContent = '◐'; }
    localStorage.setItem('calc-theme', isDark ? 'dark' : 'light');
    toast(isDark ? 'Dark mode' : 'Light mode');
  });
}

/* ── LANGUAGE SWITCHER ─────────────────────── */
function initLanguage() {
  const footer = document.querySelector('.sidebar-footer');
  const langBtn = document.createElement('button');
  langBtn.className = 'theme-toggle';
  langBtn.id = 'langToggle';
  langBtn.title = 'Language';
  langBtn.innerHTML = '<span id="langIcon">EN</span>';
  footer.insertBefore(langBtn, footer.firstChild);

  const i18nMap = {
    '.nav-item[data-panel="standard"] .nav-label': 'nav-standard',
    '.nav-item[data-panel="scientific"] .nav-label': 'nav-scientific',
    '.nav-item[data-panel="currency"] .nav-label': 'nav-currency',
    '.nav-item[data-panel="unit"] .nav-label': 'nav-unit',
    '.nav-item[data-panel="bmi"] .nav-label': 'nav-bmi',
    '.nav-item[data-panel="tip"] .nav-label': 'nav-tip',
    '.nav-item[data-panel="age"] .nav-label': 'nav-age',
    '.nav-item[data-panel="loan"] .nav-label': 'nav-loan',
    '.nav-item[data-panel="solar"] .nav-label': 'nav-solar',
    '#panel-standard .panel-title': 'title-standard',
    '#panel-scientific .panel-title': 'title-scientific',
    '#panel-currency .panel-title': 'title-currency',
    '#panel-unit .panel-title': 'title-unit',
    '#panel-bmi .panel-title': 'title-bmi',
    '#panel-tip .panel-title': 'title-tip',
    '#panel-age .panel-title': 'title-age',
    '#panel-loan .panel-title': 'title-loan',
    '#panel-solar .panel-title': 'title-solar',
    '#std-clear-hist': 'clear-history',
    '#fx-refresh': 'refresh-rates',
    '#bmi-calc-btn': 'bmi-calc',
    '#age-calc-btn': 'age-calc',
    '#loan-calc-btn': 'loan-calc',
    '.drawer-header h2': 'history-title',
    '#drawer-clear-all': 'clear-all',
    '.drawer-empty': 'no-history'
  };
  for (const [sel, key] of Object.entries(i18nMap)) {
    document.querySelectorAll(sel).forEach(el => el.setAttribute('data-i18n', key));
  }

  const i18n = {
    en: {
      'nav-standard': 'Standard', 'nav-scientific': 'Scientific', 'nav-currency': 'Currency',
      'nav-unit': 'Units', 'nav-bmi': 'BMI', 'nav-tip': 'Tip', 'nav-age': 'Age', 'nav-loan': 'Loan/EMI', 'nav-solar': 'Solar',
      'title-standard': 'Calculator', 'title-scientific': 'Scientific', 'title-currency': 'Currency',
      'title-unit': 'Unit Converter', 'title-bmi': 'BMI Calculator', 'title-tip': 'Tip Calculator',
      'title-age': 'Age Calculator', 'title-loan': 'Loan / EMI', 'title-solar': 'Solar Calculator',
      'clear-history': 'Clear History', 'refresh-rates': '↻ Live Rates',
      'bmi-calc': 'Calculate BMI', 'age-calc': 'Calculate Age', 'loan-calc': 'Calculate EMI',
      'history-title': 'History', 'clear-all': 'Clear All', 'no-history': 'No calculations yet.'
    },
    ur: {
      'nav-standard': 'معیاری', 'nav-scientific': 'سائنسی', 'nav-currency': 'کرنسی',
      'nav-unit': 'یونٹس', 'nav-bmi': 'بی ایم آئی', 'nav-tip': 'ٹپ', 'nav-age': 'عمر', 'nav-loan': 'قرضہ', 'nav-solar': 'سولر',
      'title-standard': 'کیلکولیٹر', 'title-scientific': 'سائنسی', 'title-currency': 'کرنسی',
      'title-unit': 'یونٹ کنورٹر', 'title-bmi': 'بی ایم آئی', 'title-tip': 'ٹپ کیلکولیٹر',
      'title-age': 'عمر کیلکولیٹر', 'title-loan': 'قرضہ / ای ایم آئی', 'title-solar': 'سولر کیلکولیٹر',
      'clear-history': 'ہسٹری صاف کریں', 'refresh-rates': '↻ لائیو ریٹس',
      'bmi-calc': 'حساب کریں', 'age-calc': 'حساب کریں', 'loan-calc': 'حساب کریں',
      'history-title': 'ہسٹری', 'clear-all': 'سب صاف کریں', 'no-history': 'ابھی تک کوئی حساب نہیں۔'
    }
  };

  let currentLang = localStorage.getItem('calc-lang') || 'en';
  const langIcon = document.getElementById('langIcon');

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('calc-lang', lang);
    langIcon.textContent = lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    document.body.style.direction = lang === 'ur' ? 'rtl' : 'ltr';
    toast(lang === 'ur' ? 'زبان اردو میں تبدیل ہو گئی' : 'Language changed to English');
  }
  langBtn.addEventListener('click', () => applyLang(currentLang === 'en' ? 'ur' : 'en'));
  applyLang(currentLang);
}

/* ── HISTORY & TOAST ───────────────────────── */
function initHistory() {
  const drawer = document.getElementById('history-drawer'), overlay = document.getElementById('drawer-overlay');
  const close = document.getElementById('drawer-close'), toggle = document.getElementById('historyToggle');
  const clearAll = document.getElementById('drawer-clear-all');
  function openDrawer() { drawer.classList.add('open'); overlay.classList.add('open'); }
  function closeDrawer(){ drawer.classList.remove('open');overlay.classList.remove('open');}
  toggle.addEventListener('click', openDrawer); close.addEventListener('click', closeDrawer); overlay.addEventListener('click', closeDrawer);
  clearAll.addEventListener('click', ()=>{ globalHistory.length=0; renderHistoryDrawer(); toast('History cleared'); });
}
function addToGlobalHistory(expr, result) {
  globalHistory.unshift({expr, result, time: new Date().toLocaleTimeString()});
  if (globalHistory.length > 50) globalHistory.pop();
  renderHistoryDrawer();
}
function renderHistoryDrawer() {
  const body = document.getElementById('drawer-body');
  if (!globalHistory.length) { body.innerHTML = '<p class="drawer-empty">No calculations yet.</p>'; return; }
  body.innerHTML = '';
  globalHistory.forEach(h => {
    const d = document.createElement('div'); d.className = 'hist-entry';
    d.innerHTML = `<div class="he-expr">${h.expr}</div><div class="he-res">${h.result}</div><div class="he-time">${h.time}</div>`;
    body.appendChild(d);
  });
}
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(()=>t.remove(), 3200);
}
function addRipple(e) {
  const btn = e.currentTarget, r = document.createElement('span'), rc = btn.getBoundingClientRect(), sz = Math.max(rc.width, rc.height);
  r.className = 'kripple'; r.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rc.left-sz/2}px;top:${e.clientY-rc.top-sz/2}px;`;
  btn.appendChild(r); r.addEventListener('animationend',()=>r.remove());
}
function popResult(el) { el.classList.remove('res-pop'); void el.offsetWidth; el.classList.add('res-pop'); setTimeout(()=>el.classList.remove('res-pop'),200); }
function smartRound(n) { if (!isFinite(n)) return 'Error'; return String(parseFloat(n.toPrecision(12))); }
function factorial(n) { if (n<0||n>170) return Infinity; if (n===0||n===1) return 1; let r=1; for(let i=2;i<=n;i++) r*=i; return r; }
function fmtMoney(n) { if(!isFinite(n)) return '—'; return '$'+n.toLocaleString('en-US',{maximumFractionDigits:0}); }

/* ── STANDARD CALCULATOR ──────────────────── */
function initStandard() {
  const exprEl = document.getElementById('std-expr'), resEl = document.getElementById('std-result');
  const subEl = document.getElementById('std-sub'), histBar = document.getElementById('std-hist-bar');
  const clearHistBtn = document.getElementById('std-clear-hist');
  let cur='0', expr='', op=null, prev=null, newInput=true, history=[];

  function fmt(n) {
    if (n==='Error') return 'Error';
    const f = parseFloat(n); if (!isFinite(f)) return 'Error';
    if (Math.abs(f)>=1e15) return f.toExponential(5);
    if (n.includes('.')) return n;
    return f.toLocaleString('en-US');
  }
  function updateUI() {
    resEl.textContent = fmt(cur); exprEl.textContent = expr||'\u00a0';
    resEl.classList.toggle('active-res', op===null && cur!=='0' && newInput);
    resEl.classList.toggle('error-state', cur==='Error');
  }
  function renderHist() {
    histBar.innerHTML='';
    history.slice(0,8).forEach(h=>{
      const c=document.createElement('button'); c.className='hchip'; c.textContent=h.short; c.title=h.full;
      c.addEventListener('click',()=>{ cur=h.result; newInput=true; updateUI(); });
      histBar.appendChild(c);
    });
  }
  function pushHist(e,r) { history.unshift({full:`${e} = ${r}`,short:r,result:r}); if(history.length>20)history.pop(); addToGlobalHistory(e,r); renderHist(); }
  function operate(a,o,b) {
    a=parseFloat(a); b=parseFloat(b);
    switch(o){ case '+': return a+b; case '−': return a-b; case '×': return a*b; case '÷': return b===0?NaN:a/b; }
  }
  function handle(type, val) {
    subEl.textContent='\u00a0';
    if (type==='num') {
      if (newInput){ cur = val==='.'?'0.':val; newInput=false; }
      else { if(val==='.'&&cur.includes('.')) return; if(cur==='0'&&val!=='.') cur=val; else cur+=val; if(cur.length>16) cur=cur.slice(0,16); }
    } else if (type==='op') {
      if(prev!==null&&!newInput){ const r=operate(prev,op,cur); if(!isFinite(r)){cur='Error';}else{cur=smartRound(r);} } else { prev=cur; }
      op=val; expr=`${prev} ${val}`; newInput=true;
    } else if (type==='eq') {
      if(prev!==null&&op){
        const r=operate(prev,op,cur); const e=`${prev} ${op} ${cur}`;
        if(!isFinite(r)){ cur='Error'; subEl.textContent='Cannot divide by zero'; }
        else { cur=smartRound(r); pushHist(e,cur); expr=`${e} =`; popResult(resEl); }
        prev=null; op=null; newInput=true;
        document.querySelectorAll('#panel-standard .k-op').forEach(k=>k.classList.remove('active-op'));
      }
    } else if (type==='clear') { cur='0';expr='';op=null;prev=null;newInput=true; document.querySelectorAll('#panel-standard .k-op').forEach(k=>k.classList.remove('active-op')); }
    else if (type==='sign') { if(cur!=='0'&&cur!=='Error') cur=String(-parseFloat(cur)); }
    else if (type==='percent') { cur=smartRound(parseFloat(cur)/100); }
    else if (type==='dot') { if(!cur.includes('.')){ cur+='.'; newInput=false; } }
    else if (type==='bksp') { cur=cur.length>1?cur.slice(0,-1):'0'; }
    updateUI();
  }
  clearHistBtn.addEventListener('click',()=>{ history=[]; renderHist(); toast('Standard history cleared'); });
  document.querySelectorAll('#panel-standard .k').forEach(k=>{
    k.addEventListener('click',e=>{
      addRipple(e);
      if(k.dataset.n) handle('num',k.dataset.n);
      if(k.dataset.o){ handle('op',k.dataset.o); document.querySelectorAll('#panel-standard .k-op').forEach(b=>b.classList.remove('active-op')); k.classList.add('active-op'); }
      if(k.dataset.a) handle(k.dataset.a);
    });
  });
  updateUI(); window._stdHandle = handle;
}

/* ── SCIENTIFIC CALCULATOR ────────────────── */
function initScientific() {
  const exprEl = document.getElementById('sci-expr'), resEl = document.getElementById('sci-result');
  const subEl = document.getElementById('sci-sub'), histBar = document.getElementById('sci-hist-bar');
  const degRadBtn = document.getElementById('deg-rad-toggle'), invBtn = document.getElementById('inv-toggle');
  let cur='0', expr='', op=null, prev=null, newInput=true, isDeg=true, isInv=false, history=[];

  degRadBtn.addEventListener('click',()=>{ isDeg=!isDeg; degRadBtn.textContent=isDeg?'DEG':'RAD'; toast(isDeg?'Degrees mode':'Radians mode'); });
  invBtn.addEventListener('click',()=>{ isInv=!isInv; invBtn.classList.toggle('active-inv',isInv); toast(isInv?'Inverse ON':'Inverse OFF'); });
  function toRad(x){ return isDeg ? x*(Math.PI/180) : x; }
  function renderHist(){ histBar.innerHTML=''; history.slice(0,6).forEach(h=>{ const c=document.createElement('button'); c.className='hchip'; c.textContent=h.short; c.title=h.full; c.addEventListener('click',()=>{ cur=h.result; newInput=true; updateUI(); }); histBar.appendChild(c); }); }
  function pushHist(e,r){ history.unshift({full:`${e} = ${r}`,short:r,result:r}); if(history.length>20)history.pop(); addToGlobalHistory(e,r); renderHist(); }
  function operate(a,o,b){ a=parseFloat(a); b=parseFloat(b); switch(o){ case '+':return a+b; case '−':return a-b; case '×':return a*b; case '÷':return b===0?NaN:a/b; case '^':return Math.pow(a,b); case 'mod':return a%b; } }

  function doSci(fn) {
    let v=parseFloat(cur), r, lbl; const f = isInv;
    switch(fn){
      case 'sin': r=f?Math.asin(v)*(isDeg?180/Math.PI:1):Math.sin(toRad(v)); lbl=f?`asin(${v})`:`sin(${v}${isDeg?'°':'r'})`; break;
      case 'cos': r=f?Math.acos(v)*(isDeg?180/Math.PI:1):Math.cos(toRad(v)); lbl=f?`acos(${v})`:`cos(${v}${isDeg?'°':'r'})`; break;
      case 'tan': r=f?Math.atan(v)*(isDeg?180/Math.PI:1):Math.tan(toRad(v)); lbl=f?`atan(${v})`:`tan(${v}${isDeg?'°':'r'})`; break;
      case 'log': r=f?Math.pow(10,v):Math.log10(v); lbl=f?`10^${v}`:`log(${v})`; break;
      case 'ln': r=f?Math.exp(v):Math.log(v); lbl=f?`e^${v}`:`ln(${v})`; break;
      case 'sqrt': r=f?v*v:Math.sqrt(v); lbl=f?`${v}²`:`√${v}`; break;
      case 'cbrt': r=f?v*v*v:Math.cbrt(v); lbl=f?`${v}³`:`∛${v}`; break;
      case 'sq': r=v*v; lbl=`${v}²`; break; case 'exp': r=Math.exp(v); lbl=`e^${v}`; break;
      case 'abs': r=Math.abs(v); lbl=`|${v}|`; break; case 'inv': r=1/v; lbl=`1/${v}`; break;
      case 'fact': r=factorial(Math.round(v)); lbl=`${v}!`; break;
      case 'mod': op='mod'; prev=cur; expr=`${cur} mod`; newInput=true; updateUI(); return;
      case 'pow': op='^'; prev=cur; expr=`${cur}^`; newInput=true; updateUI(); return;
      case 'pi': cur=String(Math.PI); newInput=true; subEl.textContent='π = 3.14159...'; updateUI(); return;
      case 'e': cur=String(Math.E); newInput=true; subEl.textContent='e = 2.71828...'; updateUI(); return;
    }
    if(r===undefined)return; r=parseFloat(r);
    if(!isFinite(r)){ cur='Error'; subEl.textContent='Math Error'; }
    else { r=parseFloat(r.toPrecision(12)); pushHist(lbl,String(r)); cur=String(r); subEl.textContent=`${lbl} = ${r}`; }
    newInput=true; updateUI();
  }
  function handle(type,val) {
    subEl.textContent='\u00a0';
    if(type==='num'){ if(newInput){ cur=val==='.'?'0.':val; newInput=false; } else{ if(val==='.'&&cur.includes('.'))return; cur=(cur==='0'&&val!=='.')?val:cur+val; if(cur.length>16)cur=cur.slice(0,16); } }
    else if(type==='op'){ if(prev!==null&&!newInput){ const r=operate(prev,op,cur); cur=isFinite(r)?smartRound(r):'Error'; } else prev=cur; op=val; expr=`${prev} ${val}`; newInput=true; }
    else if(type==='eq'){ if(prev!==null&&op){ const r=operate(prev,op,cur); const e=`${prev} ${op} ${cur}`; if(!isFinite(r)){cur='Error';subEl.textContent='Error';} else{ cur=smartRound(r); pushHist(e,cur); expr=`${e} =`; popResult(resEl); } prev=null; op=null; newInput=true; } }
    else if(type==='clear'){ cur='0';expr='';op=null;prev=null;newInput=true; }
    else if(type==='sign'){ if(cur!=='Error')cur=String(-parseFloat(cur)); }
    else if(type==='percent'){ cur=smartRound(parseFloat(cur)/100); }
    else if(type==='bksp'){ cur=cur.length>1?cur.slice(0,-1):'0'; }
    updateUI();
  }
  function updateUI(){ resEl.textContent=cur; exprEl.textContent=expr||'\u00a0'; resEl.classList.toggle('error-state',cur==='Error'); }
  document.querySelectorAll('#panel-scientific .k').forEach(k=>{
    k.addEventListener('click',e=>{ addRipple(e); if(k.dataset.sci) doSci(k.dataset.sci); if(k.dataset.n) handle('num',k.dataset.n); if(k.dataset.o) handle('op',k.dataset.o); if(k.dataset.a) handle(k.dataset.a); });
  });
  updateUI();
}

/* ── CURRENCY ──────────────────────────────── */
const FX = {
  USD:{n:'US Dollar',f:'🇺🇸',r:1}, EUR:{n:'Euro',f:'🇪🇺',r:0.92}, GBP:{n:'British Pound',f:'🇬🇧',r:0.79},
  PKR:{n:'Pakistani Rupee',f:'🇵🇰',r:278}, INR:{n:'Indian Rupee',f:'🇮🇳',r:83}, AED:{n:'UAE Dirham',f:'🇦🇪',r:3.67},
  SAR:{n:'Saudi Riyal',f:'🇸🇦',r:3.75}, JPY:{n:'Japanese Yen',f:'🇯🇵',r:150}, CNY:{n:'Chinese Yuan',f:'🇨🇳',r:7.24},
  CAD:{n:'Canadian Dollar',f:'🇨🇦',r:1.36}, AUD:{n:'Australian Dollar',f:'🇦🇺',r:1.52}, CHF:{n:'Swiss Franc',f:'🇨🇭',r:0.90}
};
const POPULAR = [['USD','PKR'],['EUR','PKR'],['GBP','PKR'],['AED','PKR'],['SAR','PKR'],['USD','EUR'],['USD','INR'],['USD','AED']];
let fxUpdateInterval;

function initCurrency() {
  const fromSel = document.getElementById('fx-from'), toSel = document.getElementById('fx-to');
  const amtFrom = document.getElementById('fx-amount-from'), amtTo = document.getElementById('fx-amount-to');
  const flagFrom = document.getElementById('fx-flag-from'), flagTo = document.getElementById('fx-flag-to');
  const rateBadge = document.getElementById('fx-rate-badge'), status = document.getElementById('fx-status');
  const pairsGrid = document.getElementById('pairs-grid'), ratesTable = document.getElementById('rates-table');

  Object.entries(FX).forEach(([code,info])=>{
    [fromSel,toSel].forEach(sel=>{ const o=document.createElement('option'); o.value=code; o.textContent=`${info.f} ${code} — ${info.n}`; sel.appendChild(o); });
  });
  fromSel.value='USD'; toSel.value='PKR';

  function convert(){
    const f=fromSel.value, t=toSel.value, amt=parseFloat(amtFrom.value)||0;
    const res=(amt/FX[f].r)*FX[t].r;
    amtTo.value=parseFloat(res.toPrecision(8));
    rateBadge.textContent=`1 ${f} = ${parseFloat((FX[t].r/FX[f].r).toPrecision(6))} ${t}`;
    flagFrom.textContent=FX[f].f; flagTo.textContent=FX[t].f;
  }
  fromSel.addEventListener('change',convert); toSel.addEventListener('change',convert); amtFrom.addEventListener('input',convert);
  document.getElementById('fx-swap').addEventListener('click',()=>{ [fromSel.value,toSel.value]=[toSel.value,fromSel.value]; convert(); });

  async function fetchRates(showToast = false) {
    status.innerHTML = '<span class="live-dot fetching"></span> Fetching live rates...';
    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
      if (!res.ok) throw new Error('Primary API failed');
      const data = await res.json();
      const rates = data.usd;
      Object.keys(FX).forEach(c => { const code = c.toLowerCase(); if (rates[code]) FX[c].r = rates[code]; });
      status.innerHTML = `<span class="live-dot"></span> Live · Updated ${new Date().toLocaleTimeString()}`;
      convert(); buildRatesTable(); buildPairs();
      if (showToast) toast('Live rates updated!');
    } catch (e) {
      try {
        const res2 = await fetch('https://open.er-api.com/v6/latest/USD');
        if(res2.ok) {
          const data2 = await res2.json();
          Object.keys(FX).forEach(c => { if (data2.rates[c]) FX[c].r = data2.rates[c]; });
          status.innerHTML = `<span class="live-dot"></span> Live · Updated ${new Date().toLocaleTimeString()}`;
          convert(); buildRatesTable(); buildPairs();
          if (showToast) toast('Rates updated!');
        } else throw new Error();
      } catch {
        status.innerHTML = '<span class="live-dot error"></span> Offline · Using cached rates';
        if (showToast) toast('Network error. Using cached rates.');
      }
    }
  }
  fetchRates(true);
  if (fxUpdateInterval) clearInterval(fxUpdateInterval);
  fxUpdateInterval = setInterval(() => fetchRates(false), 300000);
  document.getElementById('fx-refresh').addEventListener('click', () => fetchRates(true));

  function buildPairs(){
    pairsGrid.innerHTML='';
    POPULAR.forEach(([f,t])=>{
      const r=parseFloat((FX[t].r/FX[f].r).toPrecision(5));
      const d=document.createElement('div'); d.className='pair-chip';
      d.innerHTML=`<div class="pc-name">${FX[f].f} ${f} → ${t} ${FX[t].f}</div><div class="pc-rate">1 ${f} = ${r} ${t}</div>`;
      d.addEventListener('click',()=>{ fromSel.value=f; toSel.value=t; amtFrom.value=1; convert(); });
      pairsGrid.appendChild(d);
    });
  }
  function buildRatesTable(){
    ratesTable.innerHTML='';
    Object.entries(FX).forEach(([c,info])=>{
      if(c==='USD')return;
      const d=document.createElement('div'); d.className='rate-row';
      d.innerHTML=`<span class="rc">${info.f} ${c}</span><span class="rv">${parseFloat(info.r.toPrecision(6))}</span>`;
      d.addEventListener('click',()=>{ fromSel.value='USD'; toSel.value=c; amtFrom.value=1; convert(); });
      ratesTable.appendChild(d);
    });
  }
  buildPairs(); buildRatesTable(); convert();
}

/* ── UNIT CONVERTER ────────────────────────── */
const UNIT_DEFS = { length:{units:{Meter:1,Kilometer:0.001,Centimeter:100,Millimeter:1000,Mile:0.000621371,Yard:1.09361,Foot:3.28084,Inch:39.3701}}, weight:{units:{Kilogram:1,Gram:1000,Pound:2.20462,Ounce:35.274}}, temp:{special:true,units:{Celsius:0,Fahrenheit:0,Kelvin:0}}, area:{units:{'Sq Meter':1,'Sq Foot':10.7639,Acre:0.000247105}}, speed:{units:{'m/s':1,'km/h':3.6,mph:2.23694}}, data:{units:{Byte:1,Kilobyte:0.001,Megabyte:1e-6,Gigabyte:1e-9}}, time:{units:{Second:1,Minute:1/60,Hour:1/3600,Day:1/86400}}, energy:{units:{Joule:1,Calorie:0.239,Kilojoule:0.001}}, pressure:{units:{Pascal:1,Bar:1e-5,PSI:1.45038e-4}}, volume:{units:{Liter:1,Milliliter:1000,Gallon:0.264172}} };
function convertTemp(v,from,to){ let c; if(from==='Celsius')c=v; else if(from==='Fahrenheit')c=(v-32)/1.8; else c=v-273.15; if(to==='Celsius')return c; if(to==='Fahrenheit')return c*1.8+32; return c+273.15; }
function initUnit() {
  const fromSel = document.getElementById('unit-from-sel'), toSel = document.getElementById('unit-to-sel');
  const inpFrom = document.getElementById('unit-inp-from'), inpTo = document.getElementById('unit-inp-to');
  const formula = document.getElementById('unit-formula'), quickGrid = document.getElementById('unit-quick');
  let cat='length';
  function fillSelects(){ [fromSel,toSel].forEach(s=>s.innerHTML=''); Object.keys(UNIT_DEFS[cat].units).forEach(u=>{ [fromSel,toSel].forEach(s=>{ const o=document.createElement('option'); o.value=u; o.textContent=u; s.appendChild(o); }); }); fromSel.value=Object.keys(UNIT_DEFS[cat].units)[0]; toSel.value=Object.keys(UNIT_DEFS[cat].units)[1]||Object.keys(UNIT_DEFS[cat].units)[0]; }
  function convert(){ const f=fromSel.value, t=toSel.value, v=parseFloat(inpFrom.value)||0; let res; if(cat==='temp') res=convertTemp(v,f,t); else { const u=UNIT_DEFS[cat].units; res=parseFloat(((v/u[f])*u[t]).toPrecision(8)); } inpTo.value=res; formula.textContent=`${v} ${f} = ${res} ${t}`; buildQuick(); }
  function buildQuick(){ quickGrid.innerHTML=''; Object.keys(UNIT_DEFS[cat].units).slice(0,6).forEach(t=>{ if(t===fromSel.value)return; let res; const v=parseFloat(inpFrom.value)||1; if(cat==='temp') res=convertTemp(v,fromSel.value,t); else { const u=UNIT_DEFS[cat].units; res=parseFloat(((v/u[fromSel.value])*u[t]).toPrecision(6)); } const d=document.createElement('div'); d.className='uq-chip'; d.innerHTML=`<span class="uq-label">${t}</span><span class="uq-val">${res}</span>`; d.addEventListener('click',()=>{ toSel.value=t; convert(); }); quickGrid.appendChild(d); }); }
  document.querySelectorAll('.ucat').forEach(btn=> btn.addEventListener('click',()=>{ document.querySelectorAll('.ucat').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); cat=btn.dataset.cat; fillSelects(); convert(); }));
  fromSel.addEventListener('change',convert); toSel.addEventListener('change',convert); inpFrom.addEventListener('input',convert);
  document.getElementById('unit-swap').addEventListener('click',()=>{ [fromSel.value,toSel.value]=[toSel.value,fromSel.value]; convert(); });
  fillSelects(); convert();
}

/* ── BMI ───────────────────────────────────── */
function initBMI() {
  const metricBtn = document.getElementById('bmi-metric'), imperialBtn = document.getElementById('bmi-imperial');
  const calcBtn = document.getElementById('bmi-calc-btn'), numEl = document.getElementById('bmi-number');
  const catEl = document.getElementById('bmi-cat'), fillEl = document.getElementById('bmi-fill');
  const markerEl = document.getElementById('bmi-marker'), idealEl = document.getElementById('bmi-ideal');
  let isMetric=true;
  metricBtn.addEventListener('click',()=>{ isMetric=true; metricBtn.classList.add('active'); imperialBtn.classList.remove('active'); document.getElementById('bmi-inputs-metric').classList.remove('hidden'); document.getElementById('bmi-inputs-imperial').classList.add('hidden'); });
  imperialBtn.addEventListener('click',()=>{ isMetric=false; imperialBtn.classList.add('active'); metricBtn.classList.remove('active'); document.getElementById('bmi-inputs-imperial').classList.remove('hidden'); document.getElementById('bmi-inputs-metric').classList.add('hidden'); });
  const cats=[{label:'Underweight',max:18.5,color:'#00cfff'},{label:'Normal',max:25,color:'#00e676'},{label:'Overweight',max:30,color:'#ffaa00'},{label:'Obese',max:Infinity,color:'#ff4d4d'}];
  calcBtn.addEventListener('click',()=>{
    let h,w,bmi;
    if(isMetric){
      h=parseFloat(document.getElementById('bmi-h-cm').value)/100;
      w=parseFloat(document.getElementById('bmi-w-kg').value);
    } else {
      h=parseFloat(document.getElementById('bmi-h-ft').value)*0.3048;
      w=parseFloat(document.getElementById('bmi-w-lbs').value)*0.453592;
    }
    if(!h||!w||h<=0||w<=0){ toast('Please enter valid height and weight'); return; }
    bmi=w/(h*h);
    numEl.textContent=bmi.toFixed(1);
    const cat=cats.find(c=>bmi<c.max);
    catEl.textContent=cat.label; catEl.style.color=cat.color;
    const pct=Math.min(100,Math.max(0,((bmi-15)/(35-15))*100));
    fillEl.style.width=(100-pct)+'%';
    markerEl.style.left=pct+'%';
    const idealMin=(18.5*h*h).toFixed(1), idealMax=(24.9*h*h).toFixed(1);
    idealEl.textContent=`Healthy weight range for your height: ${idealMin}–${idealMax} kg`;
    addToGlobalHistory(`BMI (${isMetric?'metric':'imperial'})`, bmi.toFixed(1));
    toast('BMI calculated');
  });
}

/* ── TIP ───────────────────────────────────── */
function initTip() {
  const bill = document.getElementById('tip-bill'), pct = document.getElementById('tip-pct'), split = document.getElementById('tip-split');
  const amountEl = document.getElementById('tip-amount'), totalEl = document.getElementById('tip-total'), perEl = document.getElementById('tip-per');
  function calc() {
    const b=parseFloat(bill.value)||0, p=parseFloat(pct.value)||0, s=Math.max(1,parseInt(split.value)||1);
    const tip=b*(p/100), total=b+tip, per=total/s;
    amountEl.textContent='$'+tip.toFixed(2);
    totalEl.textContent='$'+total.toFixed(2);
    perEl.textContent='$'+per.toFixed(2);
  }
  document.querySelectorAll('.tip-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tip-q').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); pct.value=btn.dataset.tip; calc();
    });
  });
  [bill,pct,split].forEach(el=>el.addEventListener('input',calc));
  calc();
}

/* ── AGE ───────────────────────────────────── */
function initAge() {
  const dob = document.getElementById('age-dob'), to = document.getElementById('age-to');
  const calcBtn = document.getElementById('age-calc-btn'), grid = document.getElementById('age-grid'), nextBday = document.getElementById('next-bday');
  const today = new Date();
  to.value = today.toISOString().slice(0,10);
  calcBtn.addEventListener('click', () => {
    if (!dob.value) { toast('Please select a date of birth'); return; }
    const start = new Date(dob.value + 'T00:00:00');
    const end = new Date((to.value || today.toISOString().slice(0,10)) + 'T00:00:00');
    if (start > end) { toast('Date of birth must be before the target date'); return; }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) { months--; const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0); days += prevMonth.getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((end - start) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    grid.innerHTML = '';
    [[years,'Years'],[months,'Months'],[days,'Days'],[totalWeeks.toLocaleString(),'Weeks'],[totalMonths,'Months Total'],[totalDays.toLocaleString(),'Days Total']].forEach(([num,lbl])=>{
      const cell = document.createElement('div'); cell.className='age-cell';
      cell.innerHTML = `<div class="age-num">${num}</div><div class="age-lbl">${lbl}</div>`;
      grid.appendChild(cell);
    });

    let nextBirthday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (nextBirthday < end) nextBirthday = new Date(end.getFullYear()+1, start.getMonth(), start.getDate());
    const daysToBday = Math.ceil((nextBirthday - end) / 86400000);
    nextBday.textContent = daysToBday === 0 ? '🎂 Happy Birthday!' : `🎂 ${daysToBday} day${daysToBday===1?'':'s'} until next birthday`;

    addToGlobalHistory('Age calculation', `${years}y ${months}m ${days}d`);
    toast('Age calculated');
  });
}

/* ── LOAN / EMI ────────────────────────────── */
function initLoan() {
  const amountEl = document.getElementById('loan-amount'), rateEl = document.getElementById('loan-rate'), yearsEl = document.getElementById('loan-years');
  const calcBtn = document.getElementById('loan-calc-btn'), emiEl = document.getElementById('loan-emi'), breakdown = document.getElementById('loan-breakdown');
  const canvas = document.getElementById('loan-chart'), legend = document.getElementById('chart-legend');
  calcBtn.addEventListener('click', () => {
    const P = parseFloat(amountEl.value), annualRate = parseFloat(rateEl.value), years = parseFloat(yearsEl.value);
    if (!P || !years || annualRate < 0) { toast('Please enter valid loan details'); return; }
    const r = (annualRate/100)/12, n = years*12;
    const emi = r === 0 ? P/n : (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
    const totalPay = emi * n, totalInterest = totalPay - P;

    emiEl.textContent = '$' + emi.toFixed(2);
    breakdown.innerHTML = '';
    [['Principal', fmtMoney(P)], ['Total Interest', fmtMoney(totalInterest)], ['Total Payment', fmtMoney(totalPay)], ['Loan Term', `${years} yrs (${n} mo)`]].forEach(([lbl,val])=>{
      const item = document.createElement('div'); item.className='lb-item';
      item.innerHTML = `<div class="lb-label">${lbl}</div><div class="lb-val">${val}</div>`;
      breakdown.appendChild(item);
    });

    drawDoughnut(canvas, [
      {label:'Principal', value:P, color:'#00d4ff'},
      {label:'Interest', value:totalInterest, color:'#ffaa00'}
    ]);
    legend.innerHTML = '';
    [['Principal','#00d4ff'],['Interest','#ffaa00']].forEach(([lbl,color])=>{
      const item = document.createElement('div'); item.className='cl-item';
      item.innerHTML = `<span class="cl-dot" style="background:${color}"></span>${lbl}`;
      legend.appendChild(item);
    });

    addToGlobalHistory(`Loan ${fmtMoney(P)} @ ${annualRate}%`, '$'+emi.toFixed(2)+'/mo');
    toast('EMI calculated');
  });
}

function drawDoughnut(canvas, slices) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 260;
  canvas.width = size * dpr; canvas.height = size * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,size,size);
  const cx = size/2, cy = size/2, radius = size/2 - 14, thickness = 26;
  const total = slices.reduce((a,s)=>a+s.value,0) || 1;
  let startAngle = -Math.PI/2;
  slices.forEach(s => {
    const angle = (s.value/total) * Math.PI*2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle+angle);
    ctx.lineWidth = thickness; ctx.strokeStyle = s.color; ctx.lineCap='butt'; ctx.stroke();
    startAngle += angle;
  });
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#fff';
  ctx.font = '700 15px Outfit, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Breakdown', cx, cy);
}

/* ── SOLAR CALCULATOR ─────────────────────── */
const SOLAR_CITIES = [
  ['Custom (enter manually)', null],
  ['Phoenix, USA', 6.5], ['Las Vegas, USA', 6.4], ['Los Angeles, USA', 5.8],
  ['Miami, USA', 5.3], ['Houston, USA', 5.0], ['New York, USA', 4.3], ['Chicago, USA', 4.2],
  ['Dubai, UAE', 5.9], ['Riyadh, Saudi Arabia', 6.0], ['Karachi, Pakistan', 5.6],
  ['Lahore, Pakistan', 5.3], ['Islamabad, Pakistan', 5.1], ['Delhi, India', 5.2],
  ['London, UK', 2.9], ['Berlin, Germany', 3.0], ['Sydney, Australia', 5.4], ['Cairo, Egypt', 6.0]
];

function initSolar() {
  const citySel = document.getElementById('solar-city');
  const sunHoursEl = document.getElementById('solar-sun-hours');
  const panelWattEl = document.getElementById('solar-panel-watt');
  const billEl = document.getElementById('solar-bill');
  const rateEl = document.getElementById('solar-rate');
  const roofEl = document.getElementById('solar-roof');
  const costWattEl = document.getElementById('solar-cost-watt');
  const lossesEl = document.getElementById('solar-losses');
  const incentiveEl = document.getElementById('solar-incentive');
  const inflationEl = document.getElementById('solar-inflation');
  const calcBtn = document.getElementById('solar-calc-btn');
  const sizeEl = document.getElementById('solar-size');
  const gridEl = document.getElementById('solar-grid');
  const warningEl = document.getElementById('solar-roof-warning');
  const legendEl = document.getElementById('solar-legend');
  const canvas = document.getElementById('solar-chart');

  SOLAR_CITIES.forEach(([label, hours]) => {
    const o = document.createElement('option');
    o.textContent = label; o.value = hours === null ? '' : hours;
    citySel.appendChild(o);
  });
  citySel.value = '5.6';
  citySel.addEventListener('change', () => { if (citySel.value !== '') sunHoursEl.value = citySel.value; });

  calcBtn.addEventListener('click', () => {
    const sunHours = parseFloat(sunHoursEl.value);
    const panelWatt = parseFloat(panelWattEl.value);
    const bill = parseFloat(billEl.value);
    const rate = parseFloat(rateEl.value);
    const roofAvail = parseFloat(roofEl.value);
    const costPerWatt = parseFloat(costWattEl.value);
    const lossesPct = parseFloat(lossesEl.value);
    const incentivePct = parseFloat(incentiveEl.value);
    const inflationPct = parseFloat(inflationEl.value);

    if (!sunHours || !panelWatt || !bill || !rate || !costPerWatt) { toast('Please fill in all fields with valid numbers'); return; }

    const monthlyKwh = bill / rate;
    const dailyKwh = monthlyKwh / 30;
    const derate = 1 - (lossesPct/100);
    const systemSizeKw = dailyKwh / sunHours / derate;
    const panelsNeeded = Math.ceil((systemSizeKw*1000) / panelWatt);
    const areaPerPanel = 17.6 * (panelWatt/400);
    const roofRequired = panelsNeeded * areaPerPanel;

    const grossCost = systemSizeKw * 1000 * costPerWatt;
    const netCost = grossCost * (1 - incentivePct/100);

    const annualProductionKwh = systemSizeKw * sunHours * 365 * derate;
    const monthlySavings = Math.min(bill, (annualProductionKwh/12) * rate);
    const annualSavings = monthlySavings * 12;
    const paybackYears = annualSavings > 0 ? netCost / annualSavings : Infinity;

    const co2FactorKgPerKwh = 0.42;
    const annualCo2Tons = (annualProductionKwh * co2FactorKgPerKwh) / 1000;
    const treesEquivalent = Math.round((annualProductionKwh * co2FactorKgPerKwh) / 21);

    let cumulative25 = -netCost;
    let yearSavings = annualSavings;
    const cashflow = [-netCost];
    for (let y=1; y<=25; y++) {
      cumulative25 += yearSavings;
      cashflow.push(cumulative25);
      yearSavings *= (1 + inflationPct/100);
    }
    const netSavings25 = cumulative25;

    sizeEl.textContent = systemSizeKw.toFixed(1) + ' kW';

    gridEl.innerHTML = '';
    const stats = [
      ['Panels Needed', panelsNeeded + ' panels'],
      ['Roof Area Needed', Math.round(roofRequired) + ' sq ft'],
      ['System Cost (gross)', fmtMoney(grossCost)],
      ['Cost After Incentive', fmtMoney(netCost)],
      ['Monthly Savings', fmtMoney(monthlySavings)],
      ['Payback Period', isFinite(paybackYears) ? paybackYears.toFixed(1)+' yrs' : '—'],
      ['25-Yr Net Savings', fmtMoney(netSavings25)],
      ['CO₂ Offset / yr', annualCo2Tons.toFixed(2)+' tons'],
      ['Equivalent Trees', treesEquivalent.toLocaleString()+' /yr']
    ];
    stats.forEach(([lbl,val], i)=>{
      const cell = document.createElement('div'); cell.className = 'solar-stat' + (i===5||i===6?' highlight':'');
      cell.innerHTML = `<div class="val">${val}</div><div class="lbl">${lbl}</div>`;
      gridEl.appendChild(cell);
    });

    warningEl.textContent = roofRequired > roofAvail
      ? `⚠ You need ~${Math.round(roofRequired)} sq ft of roof space but only ${roofAvail} sq ft is available. Consider higher-wattage panels or a smaller system.`
      : '';

    drawSolarChart(canvas, cashflow, netCost);
    legendEl.innerHTML = '';
    [['Net cost invested','#ff4d8d'],['Cumulative savings','#00d4ff'],['Break-even','#ffaa00']].forEach(([lbl,color])=>{
      const item = document.createElement('div'); item.className='cl-item';
      item.innerHTML = `<span class="cl-dot" style="background:${color}"></span>${lbl}`;
      legendEl.appendChild(item);
    });

    addToGlobalHistory(`Solar system ${systemSizeKw.toFixed(1)}kW`, fmtMoney(netCost));
    toast('Solar system calculated');
  });
}

function drawSolarChart(canvas, cashflow, netCost) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const cssH = parseInt(getComputedStyle(canvas).height) || 220;
  canvas.width = cssW * dpr; canvas.height = cssH * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,cssW,cssH);

  const padL = 50, padR = 16, padT = 16, padB = 26;
  const w = cssW - padL - padR, h = cssH - padT - padB;
  const minV = Math.min(...cashflow, 0), maxV = Math.max(...cashflow, 0);
  const range = (maxV - minV) || 1;
  const n = cashflow.length - 1;

  function xFor(i){ return padL + (i/n) * w; }
  function yFor(v){ return padT + h - ((v - minV)/range) * h; }

  // grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
  for (let g=0; g<=4; g++) {
    const gy = padT + (h/4)*g;
    ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL+w, gy); ctx.stroke();
  }

  // zero / break-even line
  const zeroY = yFor(0);
  ctx.strokeStyle = 'rgba(255,170,0,0.5)'; ctx.setLineDash([4,4]); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(padL, zeroY); ctx.lineTo(padL+w, zeroY); ctx.stroke();
  ctx.setLineDash([]);

  // area fill under curve
  const grad = ctx.createLinearGradient(0, padT, 0, padT+h);
  grad.addColorStop(0, 'rgba(0,212,255,0.35)'); grad.addColorStop(1, 'rgba(0,212,255,0.02)');
  ctx.beginPath(); ctx.moveTo(xFor(0), yFor(cashflow[0]));
  cashflow.forEach((v,i)=> ctx.lineTo(xFor(i), yFor(v)));
  ctx.lineTo(xFor(n), zeroY); ctx.lineTo(xFor(0), zeroY); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  // line
  ctx.beginPath(); ctx.moveTo(xFor(0), yFor(cashflow[0]));
  cashflow.forEach((v,i)=> ctx.lineTo(xFor(i), yFor(v)));
  ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2.5; ctx.lineJoin='round'; ctx.stroke();

  // break-even marker dot (first crossing to positive)
  const crossIdx = cashflow.findIndex(v => v >= 0);
  if (crossIdx > 0) {
    ctx.beginPath(); ctx.arc(xFor(crossIdx), yFor(cashflow[crossIdx]), 5, 0, Math.PI*2);
    ctx.fillStyle = '#ffaa00'; ctx.fill();
    ctx.strokeStyle = '#050508'; ctx.lineWidth = 2; ctx.stroke();
  }

  // axis labels
  ctx.fillStyle = 'rgba(240,244,255,0.4)'; ctx.font = '10px "Space Mono", monospace'; ctx.textAlign = 'left';
  ctx.fillText('Yr 0', padL-2, cssH-6);
  ctx.textAlign = 'right';
  ctx.fillText('Yr 25', padL+w, cssH-6);
  ctx.textAlign = 'right';
  ctx.fillText(fmtMoney(Math.round(maxV)), padL-6, padT+8);
  ctx.fillText(fmtMoney(Math.round(minV)), padL-6, padT+h);
}

/* ── KEYBOARD SUPPORT ──────────────────────── */
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    const activePanel = document.querySelector('.panel.active');
    if (!activePanel || activePanel.id !== 'panel-standard') return;
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
    const map = { '0':['num','0'],'1':['num','1'],'2':['num','2'],'3':['num','3'],'4':['num','4'],'5':['num','5'],'6':['num','6'],'7':['num','7'],'8':['num','8'],'9':['num','9'],'.':['dot'],'+':['op','+'],'-':['op','−'],'*':['op','×'],'/':['op','÷'],'Enter':['eq'],'=':['eq'],'Escape':['clear'],'Backspace':['bksp'],'%':['percent'] };
    const action = map[e.key];
    if (action && window._stdHandle) { e.preventDefault(); window._stdHandle(...action); }
  });
}

/* ── SIDEBAR SCROLL HINT (shows a bouncing chevron when there's more below) ── */
function initSidebarScrollHint() {
  const nav = document.getElementById('navItems');
  const hint = document.getElementById('scrollHint');
  if (!nav || !hint) return;
  function update() {
    const hasMore = nav.scrollHeight - nav.clientHeight - nav.scrollTop > 4;
    hint.classList.toggle('show', hasMore);
  }
  nav.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  hint.addEventListener('click', () => nav.scrollBy({top: 120, behavior: 'smooth'}));
  update();
  setTimeout(update, 300); // re-check after fonts/layout settle
}

/* ── 3D TILT INTERACTION — works across every panel's cards ── */
function init3DTilt() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduceMotion) return;
  const cards = document.querySelectorAll('.tool-card, .display-card, .fx-card, .unit-card');
  cards.forEach(card => {
    card.style.perspective = '700px';
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotX = (0.5 - py) * 6;
      const rotY = (px - 0.5) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(2px)`;
      card.classList.add('tilt-active');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.classList.remove('tilt-active');
    });
  });
}

/* ── FLOATING 3D ORB — site-wide fun element with rotating tips ── */
const ORB_TIPS = [
  '💡 Tip: Tap a number in your history to reuse the result instantly.',
  '☀ Solar fact: 1 kW of panels can offset roughly 1,200–1,600 kWh per year depending on sunlight.',
  '💰 Loan tip: Extra payments early in a loan save the most on total interest.',
  '🧮 Try the keyboard: numbers, + − × ÷ and Enter all work on the Standard calculator.',
  '🍽 Tip calculator: splitting a bill? Set "Split Between" before checking the per-person total.',
  '⚖ BMI is a general screening tool — it does not account for muscle mass directly.',
  '🌍 Currency rates auto-refresh every 5 minutes while the tab is open.',
  '📅 Age calculator also shows days until your next birthday.',
  '🔆 Peak sun hours is not the same as daylight hours — it is the sun\'s usable intensity per day.',
  '🌗 Try switching themes — your choice is remembered next time you visit.',
  '🧾 A bigger down payment or shorter loan term both cut total interest paid.',
  '🌳 Solar panels typically pay for themselves faster in high-sunlight, high-rate regions.'
];
function initFloatingOrb() {
  const orb = document.getElementById('fabOrb');
  if (!orb) return;
  let idx = 0;
  orb.addEventListener('click', () => {
    toast(ORB_TIPS[idx % ORB_TIPS.length]);
    idx++;
  });
}
