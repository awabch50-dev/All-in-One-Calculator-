/* ══════════════════════════════════════════════════
   CALC X — Premium Calculator Script (Upgraded)
   Features: Multi-lang, Auto-Currency, Cross-Browser
══════════════════════════════════════════════════ */
'use strict';

const globalHistory = [];
let isDark = true;

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initParticles();
  initCursorGlow();
  initNavigation();
  initTheme();       // Updated with LocalStorage
  initLanguage();    // NEW: Language Switcher
  initHistory();
  initStandard();
  initScientific();  // Fixed 'mod' bug
  initCurrency();    // Updated with Auto-Refresh
  initUnit();
  initBMI();
  initTip();
  initAge();         // Fixed Date timezone bug
  initLoan();
  initKeyboard();
  initCustomPopups(); // NEW: Custom Premium Popups
});

/* ── CUSTOM POPUPS (Date Picker & Selects) ── */
function initCustomPopups() {
  // 1. Flatpickr
  if (typeof flatpickr !== 'undefined') {
    flatpickr("input[type='date']", {
      dateFormat: "Y-m-d",
      allowInput: true,
      disableMobile: true
    });
  }

  // 2. Custom Select Dropdowns
  const selects = document.querySelectorAll('.unit-sel');
  selects.forEach(select => {
    if (select.parentElement.classList.contains('custom-select-wrapper')) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    
    // Replace select position with wrapper
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.style.display = 'none'; // Hide native completely
    
    // Create custom trigger button
    const trigger = document.createElement('div');
    trigger.className = `custom-select-trigger ${select.className}`; // inherit styles
    trigger.innerHTML = `<span>${select.options[select.selectedIndex]?.text || ''}</span>
                         <svg width="12" height="12" fill="#8B5CF6" viewBox="0 0 16 16"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>`;
    
    // Create options container
    const optionsList = document.createElement('div');
    optionsList.className = 'custom-select-options';
    
    // Build options list
    function buildOptions() {
      optionsList.innerHTML = '';
      Array.from(select.options).forEach(opt => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'custom-option';
        optionDiv.dataset.value = opt.value;
        optionDiv.textContent = opt.text;
        if (opt.selected) optionDiv.classList.add('selected');
        
        optionDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = opt.value;
          select.dispatchEvent(new Event('change')); // Trigger native logic
          trigger.querySelector('span').textContent = opt.text;
          optionsList.classList.remove('open');
          optionsList.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
          optionDiv.classList.add('selected');
        });
        optionsList.appendChild(optionDiv);
      });
      trigger.querySelector('span').textContent = select.options[select.selectedIndex]?.text || '';
    }

    buildOptions();

    const observer = new MutationObserver(buildOptions);
    observer.observe(select, { childList: true });
    
    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsList);
    
    // Listen for external changes (like swap button)
    select.addEventListener('change', () => {
      trigger.querySelector('span').textContent = select.options[select.selectedIndex]?.text;
      optionsList.querySelectorAll('.custom-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.value === select.value);
      });
    });
    

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = optionsList.classList.contains('open');
      document.querySelectorAll('.custom-select-options.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) {
        optionsList.classList.add('open');
        const selectedOpt = optionsList.querySelector('.selected');
        if (selectedOpt) {
          optionsList.scrollTop = selectedOpt.offsetTop - optionsList.clientHeight / 2 + selectedOpt.clientHeight / 2;
        }
      }
    });
  });
  
  // Close all custom dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-options.open').forEach(el => el.classList.remove('open'));
  });
}

/* ── PARTICLES & CURSOR (Same as before) ──── */
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
      ctx.fillStyle = isDarkTheme ? `rgba(139,92,246,${p.a*0.5})` : `rgba(139,92,246,${p.a*0.25})`;
      ctx.fill();
    });
    pts.forEach((a,i) => {
      pts.slice(i+1).forEach(b => {
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          const alpha = (1-d/100)*0.12;
          ctx.strokeStyle = isDarkTheme ? `rgba(139,92,246,${alpha})` : `rgba(139,92,246,${alpha*0.5})`;
          ctx.lineWidth = .5; ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize); resize(); draw();
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  let mx=0, my=0, cx=0, cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function animate(){ cx += (mx-cx)*.08; cy += (my-cy)*.08; glow.style.left = cx+'px'; glow.style.top = cy+'px'; requestAnimationFrame(animate); })();
}

/* ── NAVIGATION ───────────────────────────── */
function initNavigation() {
  function switchPanel(name) {
    document.querySelectorAll('.nav-item,.bnav-item').forEach(b=> b.classList.toggle('active', b.dataset.panel===name));
    document.querySelectorAll('.panel').forEach(p=> p.classList.toggle('active', p.id==='panel-'+name));
  }
  document.querySelectorAll('.nav-item,.bnav-item').forEach(btn => btn.addEventListener('click', ()=> switchPanel(btn.dataset.panel)));
}

/* ── THEME (Updated with LocalStorage) ────── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  
  // Load saved theme
  const savedTheme = localStorage.getItem('calc-theme');
  if (savedTheme === 'light') {
    isDark = false;
    document.documentElement.setAttribute('data-theme','light');
    icon.textContent = '◐';
  }

  btn.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      icon.textContent = '◑';
    } else {
      document.documentElement.setAttribute('data-theme','light');
      icon.textContent = '◐';
    }
    localStorage.setItem('calc-theme', isDark ? 'dark' : 'light');
    toast(isDark ? window._t('toast-dark') : window._t('toast-light'));
  });
}

/* ── LANGUAGE SWITCHER (NEW) ──────────────── */
function initLanguage() {
  // 1. Inject Language Button into Global Controls
  const footer = document.querySelector('.global-controls');
  const langBtn = document.createElement('button');
  langBtn.className = 'lang-toggle';
  langBtn.id = 'langToggle';
  langBtn.title = 'Language';
  langBtn.innerHTML = '<span id="langIcon">EN</span>';
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.insertAdjacentElement('afterend', langBtn);

  // 2. Map existing HTML elements to translation keys
  const i18nMap = {
    '.nav-item[data-panel="standard"] .nav-label': 'nav-standard',
    '.nav-item[data-panel="scientific"] .nav-label': 'nav-scientific',
    '.nav-item[data-panel="currency"] .nav-label': 'nav-currency',
    '.nav-item[data-panel="unit"] .nav-label': 'nav-unit',
    '.nav-item[data-panel="bmi"] .nav-label': 'nav-bmi',
    '.nav-item[data-panel="tip"] .nav-label': 'nav-tip',
    '.nav-item[data-panel="age"] .nav-label': 'nav-age',
    '.nav-item[data-panel="loan"] .nav-label': 'nav-loan',
    '#panel-standard .panel-title': 'title-standard',
    '#panel-scientific .panel-title': 'title-scientific',
    '#panel-currency .panel-title': 'title-currency',
    '#panel-unit .panel-title': 'title-unit',
    '#panel-bmi .panel-title': 'title-bmi',
    '#panel-tip .panel-title': 'title-tip',
    '#panel-age .panel-title': 'title-age',
    '#panel-loan .panel-title': 'title-loan',
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

  // 3. Dynamic Translation Loading
  let currentLang = localStorage.getItem('calc-lang') || 'en';
  const langIcon = document.getElementById('langIcon');
  window.currentTranslations = {};

  window._t = function(key) {
    return window.currentTranslations[key] || key;
  };

  async function applyLang(lang) {
    try {
      const res = await fetch(`${lang}.json`);
      if (!res.ok) throw new Error(`Could not load ${lang}.json`);
      const translations = await res.json();
      window.currentTranslations = translations;

      currentLang = lang;
      localStorage.setItem('calc-lang', lang);
      langIcon.textContent = lang.toUpperCase();
      
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) el.textContent = translations[key];
      });

      // Force LTR layout for all languages
      document.body.style.direction = 'ltr';
      toast(translations['toast-lang']);
      document.dispatchEvent(new Event('langChanged'));
    } catch (e) {
      console.error('Translation error:', e);
    }
  }

  langBtn.addEventListener('click', () => applyLang(currentLang === 'en' ? 'ur' : 'en'));
  applyLang(currentLang); // Apply on load
}

/* ── HISTORY & TOAST (Same as before) ─────── */
function initHistory() {
  const drawer = document.getElementById('history-drawer'), overlay = document.getElementById('drawer-overlay');
  const close = document.getElementById('drawer-close'), toggle = document.getElementById('historyToggle');
  const clearAll = document.getElementById('drawer-clear-all');
  function openDrawer() { 
    drawer.classList.add('open'); 
    overlay.classList.add('open'); 
    toggle.querySelector('span').textContent = '✕';
  }
  function closeDrawer(){ 
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    toggle.querySelector('span').textContent = '☰';
  }
  toggle.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  close.addEventListener('click', closeDrawer); 
  overlay.addEventListener('click', closeDrawer);
  clearAll.addEventListener('click', ()=>{ globalHistory.length=0; renderHistoryDrawer(); toast(window._t('toast-hist-cleared')); });
}
function addToGlobalHistory(expr, result) {
  globalHistory.unshift({expr, result, time: new Date().toLocaleTimeString()});
  if (globalHistory.length > 50) globalHistory.pop();
  renderHistoryDrawer();
}
function renderHistoryDrawer() {
  const body = document.getElementById('drawer-body');
  if (!globalHistory.length) { body.innerHTML = '<p class="drawer-empty" data-i18n="no-history">' + window._t('no-history') + '</p>'; return; }
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
  clearHistBtn.addEventListener('click',()=>{ history=[]; renderHist(); toast(window._t('toast-std-cleared')); });
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

/* ── SCIENTIFIC CALCULATOR (Fixed 'mod' bug) ─ */
function initScientific() {
  const exprEl = document.getElementById('sci-expr'), resEl = document.getElementById('sci-result');
  const subEl = document.getElementById('sci-sub'), histBar = document.getElementById('sci-hist-bar');
  const degRadBtn = document.getElementById('deg-rad-toggle'), invBtn = document.getElementById('inv-toggle');
  let cur='0', expr='', op=null, prev=null, newInput=true, isDeg=true, isInv=false, history=[];

  degRadBtn.addEventListener('click',()=>{ isDeg=!isDeg; degRadBtn.textContent=isDeg?'DEG':'RAD'; toast(isDeg ? window._t('toast-deg') : window._t('toast-rad')); });
  invBtn.addEventListener('click',()=>{ isInv=!isInv; invBtn.classList.toggle('active-inv',isInv); toast(isInv ? window._t('toast-inv-on') : window._t('toast-inv-off')); });
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
      // FIXED MOD BUG HERE:
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

/* ── CURRENCY (Updated with Auto-Refresh) ─── */
const FX = { 
  USD:{n:'US Dollar',f:'🇺🇸',r:1}, 
  EUR:{n:'Euro',f:'🇪🇺',r:0.92}, 
  GBP:{n:'British Pound',f:'🇬🇧',r:0.79}, 
  PKR:{n:'Pakistani Rupee',f:'🇵🇰',r:278}, 
  INR:{n:'Indian Rupee',f:'🇮🇳',r:83}, 
  AED:{n:'UAE Dirham',f:'🇦🇪',r:3.67}, 
  SAR:{n:'Saudi Riyal',f:'🇸🇦',r:3.75}, 
  JPY:{n:'Japanese Yen',f:'🇯🇵',r:150}, 
  CNY:{n:'Chinese Yuan',f:'🇨🇳',r:7.24}, 
  CAD:{n:'Canadian Dollar',f:'🇨🇦',r:1.36}, 
  AUD:{n:'Australian Dollar',f:'🇦🇺',r:1.52}, 
  CHF:{n:'Swiss Franc',f:'🇨🇭',r:0.90} 
};
const POPULAR = [['USD','PKR'],['EUR','PKR'],['GBP','PKR'],['AED','PKR'],['SAR','PKR'],['USD','EUR'],['USD','INR'],['USD','AED']];

let fxUpdateInterval;

function initCurrency() {
  const fromSel = document.getElementById('fx-from'), toSel = document.getElementById('fx-to');
  const amtFrom = document.getElementById('fx-amount-from'), amtTo = document.getElementById('fx-amount-to');
  const rateBadge = document.getElementById('fx-rate-badge'), status = document.getElementById('fx-status');
  const pairsGrid = document.getElementById('pairs-grid'), ratesTable = document.getElementById('rates-table');

  function fillCurrencySelects() {
    [fromSel,toSel].forEach(sel => sel.innerHTML='');
    Object.entries(FX).forEach(([code,info])=>{
      [fromSel,toSel].forEach(sel=>{ 
        const o=document.createElement('option'); 
        o.value=code; 
        o.textContent=`${info.f} ${code} — ${window._t('fx-'+code)}`; 
        sel.appendChild(o); 
      });
    });
  }
  fillCurrencySelects();
  
  // ── Modal UI Logic ──
  let activeSelect = null;
  const modalOverlay = document.getElementById('currency-modal-overlay');
  const modalList = document.getElementById('currency-list');
  const searchInput = document.getElementById('cm-search');
  const closeBtn = document.getElementById('cm-close');

  function openModal(selectId) {
    activeSelect = document.getElementById(selectId);
    searchInput.value = '';
    renderModalList('');
    modalOverlay.classList.add('show');
    setTimeout(() => searchInput.focus(), 300);
  }
  function closeModal() {
    modalOverlay.classList.remove('show');
    activeSelect = null;
  }
  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  searchInput.addEventListener('input', (e) => {
    renderModalList(e.target.value.toLowerCase());
  });

  function renderModalList(filter = '') {
    modalList.innerHTML = '';
    Object.entries(FX).forEach(([code, info]) => {
      const nameLocal = window._t('fx-'+code) || info.n;
      if (filter && !code.toLowerCase().includes(filter) && !nameLocal.toLowerCase().includes(filter) && !info.n.toLowerCase().includes(filter)) return;
      
      const item = document.createElement('div');
      item.className = 'cm-item';
      if (activeSelect && activeSelect.value === code) item.classList.add('active');
      
      item.innerHTML = `
        <div class="cm-item-flag">${info.f}</div>
        <div class="cm-item-code">${code}</div>
        <div class="cm-item-name">${nameLocal}</div>
        <div class="cm-item-rate">${info.r}</div>
      `;
      item.addEventListener('click', () => {
        if (activeSelect) {
          activeSelect.value = code;
          activeSelect.dispatchEvent(new Event('change'));
        }
        closeModal();
      });
      modalList.appendChild(item);
    });
  }

  // Setup Trigger Buttons
  [fromSel, toSel].forEach(sel => {
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger fx-sel';
    
    function updateTriggerText() {
      const code = sel.value || 'USD';
      const prefix = code.substring(0, 2);
      trigger.innerHTML = `<span>${prefix} ${code}</span>
                           <svg width="12" height="12" fill="currentColor" opacity="0.5" viewBox="0 0 16 16"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>`;
    }
    
    updateTriggerText();
    sel.parentNode.insertBefore(trigger, sel);
    sel.style.display = 'none'; // hide native select
    
    trigger.addEventListener('click', () => openModal(sel.id));
    
    // Sync trigger text on change
    sel.addEventListener('change', updateTriggerText);
  });
  document.addEventListener('langChanged', () => {
    const f=fromSel.value, t=toSel.value;
    fillCurrencySelects();
    fromSel.value=f; toSel.value=t;
    fromSel.dispatchEvent(new Event('change'));
    toSel.dispatchEvent(new Event('change'));
    buildPairs(); buildRatesTable();
  });
  fromSel.value='USD'; toSel.value='PKR';
  fromSel.dispatchEvent(new Event('change'));
  toSel.dispatchEvent(new Event('change'));

  function convert(){
    const f=fromSel.value, t=toSel.value, amt=parseFloat(amtFrom.value)||0;
    const res=(amt/FX[f].r)*FX[t].r;
    amtTo.value=parseFloat(res.toPrecision(8));
    rateBadge.textContent=`1 ${f} = ${parseFloat((FX[t].r/FX[f].r).toPrecision(6))} ${t}`;
    drawTrendGraph(f, t);
  }
  
  fromSel.addEventListener('change',convert); 
  toSel.addEventListener('change',convert); 
  amtFrom.addEventListener('input',convert);
  document.getElementById('fx-swap').addEventListener('click',()=>{ 
    [fromSel.value,toSel.value]=[toSel.value,fromSel.value]; 
    convert(); 
  });

  async function fetchRates(showToast = false) {
    status.innerHTML = '<span class="live-dot fetching"></span> Fetching live rates...';
    
    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
      if (!res.ok) throw new Error('Primary API failed');
      const data = await res.json();
      const rates = data.usd;
      
      Object.keys(FX).forEach(c => { 
        const code = c.toLowerCase();
        if (rates[code]) FX[c].r = rates[code]; 
      });
      
      status.innerHTML = `<span class="live-dot"></span> Live · Updated ${new Date().toLocaleTimeString()}`;
      convert(); buildRatesTable(); buildPairs();
      if (showToast) toast(window._t('toast-rates-live'));
      
    } catch (e) {
      try {
        const res2 = await fetch('https://open.er-api.com/v6/latest/USD');
        if(res2.ok) {
          const data2 = await res2.json();
          Object.keys(FX).forEach(c => { if (data2.rates[c]) FX[c].r = data2.rates[c]; });
          status.innerHTML = `<span class="live-dot"></span> Live · Updated ${new Date().toLocaleTimeString()}`;
          convert(); buildRatesTable(); buildPairs();
          if (showToast) toast(window._t('toast-rates-upd'));
        } else throw new Error();
      } catch {
        status.innerHTML = '<span class="live-dot error"></span> Offline · Using cached rates';
        if (showToast) toast(window._t('toast-network-err'));
      }
    }
  }

  fetchRates(true);

  // --- Historical Trend Logic ---
  let historyData = [];
  async function fetchHistory() {
    try {
      const dates = [];
      const today = new Date();
      for (let i = 7; i >= 1; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
      
      const requests = dates.map(d => 
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/usd.json`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      );
      const results = await Promise.all(requests);
      
      historyData = results.filter(r => r && r.usd).map((r, i) => ({
        date: dates[i],
        rates: r.usd
      }));
      convert(); 
    } catch (e) {
      console.warn("Failed to fetch historical rates");
    }
  }

  function drawTrendGraph(f, t) {
    const canvas = document.getElementById('trend-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.clientWidth || 300, h = canvas.clientHeight || 80;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    
    ctx.clearRect(0, 0, w, h);

    const codeF = f.toLowerCase(), codeT = t.toLowerCase();
    let dataPoints = [];

    if (historyData.length < 2) {
      ctx.beginPath();
      ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; ctx.lineWidth = 2; ctx.stroke();
      return;
    }

    historyData.forEach(day => {
      const rf = day.rates[codeF] || 1;
      const rt = day.rates[codeT] || 1;
      dataPoints.push(rt / rf);
    });

    const currentRate = FX[t].r / FX[f].r;
    dataPoints.push(currentRate);

    const firstRate = dataPoints[0];
    const pctChange = ((currentRate - firstRate) / firstRate) * 100;
    const pctEl = document.getElementById('trend-pct');
    if (pctEl) {
      const sign = pctChange >= 0 ? '▲' : '▼';
      pctEl.textContent = `${sign} ${Math.abs(pctChange).toFixed(2)}%`;
      pctEl.className = 'trend-pct ' + (pctChange >= 0 ? 'up' : 'down');
    }

    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = max - min || 1;
    const padding = 10;
    
    ctx.beginPath();
    const step = w / (dataPoints.length - 1);
    
    dataPoints.forEach((val, i) => {
      const x = i * step;
      const y = h - padding - ((val - min) / range) * (h - padding * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    const isUp = pctChange >= 0;
    ctx.strokeStyle = isUp ? '#00e676' : '#ff4d4d';
    ctx.lineWidth = 2;
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isUp ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 77, 77, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    const lastX = w;
    const lastY = h - padding - ((currentRate - min) / range) * (h - padding * 2);
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  }

  fetchHistory();
  
  if (fxUpdateInterval) clearInterval(fxUpdateInterval);
  fxUpdateInterval = setInterval(() => fetchRates(false), 300000); 

  document.getElementById('fx-refresh').addEventListener('click', () => fetchRates(true));

  // Toggle Extra Rates Sections
  const ratesToggleBtn = document.getElementById('rates-toggle-btn');
  const ratesExtraContainer = document.getElementById('rates-extra-container');
  let ratesVisible = false;
  ratesToggleBtn.addEventListener('click', () => {
    ratesVisible = !ratesVisible;
    ratesExtraContainer.style.display = ratesVisible ? 'block' : 'none';
    ratesToggleBtn.textContent = ratesVisible ? window._t('hide-rates-btn') : window._t('show-rates-btn');
  });
  
  // Update toggle button text on language change
  document.addEventListener('langChanged', () => {
    ratesToggleBtn.textContent = ratesVisible ? window._t('hide-rates-btn') : window._t('show-rates-btn');
  });

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

/* ── UNIT, BMI, TIP, LOAN (Same as before) ── */
const UNIT_DEFS = { length:{units:{Meter:1,Kilometer:0.001,Centimeter:100,Millimeter:1000,Mile:0.000621371,Yard:1.09361,Foot:3.28084,Inch:39.3701}}, weight:{units:{Kilogram:1,Gram:1000,Pound:2.20462,Ounce:35.274}}, temp:{special:true,units:{Celsius:0,Fahrenheit:0,Kelvin:0}}, area:{units:{'Sq Meter':1,'Sq Foot':10.7639,Acre:0.000247105}}, speed:{units:{'m/s':1,'km/h':3.6,mph:2.23694}}, data:{units:{Byte:1,Kilobyte:0.001,Megabyte:1e-6,Gigabyte:1e-9}}, time:{units:{Second:1,Minute:1/60,Hour:1/3600,Day:1/86400}}, energy:{units:{Joule:1,Calorie:0.239,Kilojoule:0.001}}, pressure:{units:{Pascal:1,Bar:1e-5,PSI:1.45038e-4}}, volume:{units:{Liter:1,Milliliter:1000,Gallon:0.264172}} };
function convertTemp(v,from,to){ let c; if(from==='Celsius')c=v; else if(from==='Fahrenheit')c=(v-32)/1.8; else c=v-273.15; if(to==='Celsius')return c; if(to==='Fahrenheit')return c*1.8+32; return c+273.15; }
function initUnit() {
  const fromSel = document.getElementById('unit-from-sel'), toSel = document.getElementById('unit-to-sel');
  const inpFrom = document.getElementById('unit-inp-from'), inpTo = document.getElementById('unit-inp-to');
  const formula = document.getElementById('unit-formula'), quickGrid = document.getElementById('unit-quick');
  let cat='length';
  function fillSelects(){ [fromSel,toSel].forEach(s=>s.innerHTML=''); Object.keys(UNIT_DEFS[cat].units).forEach(u=>{ [fromSel,toSel].forEach(s=>{ const o=document.createElement('option'); o.value=u; o.textContent=window._t('unit-'+u); s.appendChild(o); }); }); fromSel.value=Object.keys(UNIT_DEFS[cat].units)[0]; toSel.value=Object.keys(UNIT_DEFS[cat].units)[1]||Object.keys(UNIT_DEFS[cat].units)[0]; }
  function convert(){ const f=fromSel.value, t=toSel.value, v=parseFloat(inpFrom.value)||0; let res; if(cat==='temp') res=convertTemp(v,f,t); else { const u=UNIT_DEFS[cat].units; res=parseFloat(((v/u[f])*u[t]).toPrecision(8)); } inpTo.value=res; formula.textContent=`${v} ${window._t('unit-'+f)} = ${res} ${window._t('unit-'+t)}`; buildQuick(); }
  function buildQuick(){ quickGrid.innerHTML=''; Object.keys(UNIT_DEFS[cat].units).slice(0,6).forEach(t=>{ if(t===fromSel.value)return; let res; const v=parseFloat(inpFrom.value)||1; if(cat==='temp') res=convertTemp(v,fromSel.value,t); else { const u=UNIT_DEFS[cat].units; res=parseFloat(((v/u[fromSel.value])*u[t]).toPrecision(6)); } const d=document.createElement('div'); d.className='uq-chip'; d.innerHTML=`<span class="uq-label">${window._t('unit-'+t)}</span><span class="uq-val">${res}</span>`; d.addEventListener('click',()=>{ toSel.value=t; convert(); }); quickGrid.appendChild(d); }); }
  document.addEventListener('langChanged', () => { const f=fromSel.value, t=toSel.value; fillSelects(); fromSel.value=f; toSel.value=t; convert(); });
  document.querySelectorAll('.ucat').forEach(btn=> btn.addEventListener('click',()=>{ document.querySelectorAll('.ucat').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); cat=btn.dataset.cat; fillSelects(); convert(); }));
  fromSel.addEventListener('change',convert); toSel.addEventListener('change',convert); inpFrom.addEventListener('input',convert);
  document.getElementById('unit-swap').addEventListener('click',()=>{ [fromSel.value,toSel.value]=[toSel.value,fromSel.value]; convert(); });
  fillSelects(); convert();
}

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
    if(isMetric){ h=parseFloat(document.getElementById('bmi-h-cm').value)/100; w=parseFloat(document.getElementById('bmi-w-kg').value); } 
    else { h=parseFloat(document.getElementById('bmi-h-ft').value)*0.3048; w=parseFloat(document.getElementById('bmi-w-lbs').value)*0.453592; }
    if(!h||!w||h<=0||w<=0){ toast(window._t('toast-valid-val')); return; }
    bmi=parseFloat((w/(h*h)).toFixed(1)); numEl.textContent=bmi;
    const cat=cats.find(c=>bmi<c.max)||cats[3]; catEl.textContent=window._t('bmi-'+cat.label); catEl.style.color=cat.color;
    const pct=Math.min(100,Math.max(0,((bmi-10)/30)*100)); fillEl.style.width=(100-pct)+'%'; markerEl.style.left=pct+'%';
    idealEl.textContent=`${window._t('bmi-ideal')}: ${(18.5*h*h).toFixed(1)}–${(24.9*h*h).toFixed(1)} ${isMetric?'kg':'lbs'}`;
    addToGlobalHistory(`BMI`,String(bmi)); popResult(numEl);
  });
}

function initTip() {
  const bill = document.getElementById('tip-bill'), pct = document.getElementById('tip-pct'), split = document.getElementById('tip-split');
  function calc(){ const b=parseFloat(bill.value)||0, p=parseFloat(pct.value)||0, s=parseInt(split.value)||1; const tip=b*p/100, total=b+tip, per=total/s; document.getElementById('tip-amount').textContent='$'+tip.toFixed(2); document.getElementById('tip-total').textContent='$'+total.toFixed(2); document.getElementById('tip-per').textContent='$'+per.toFixed(2); }
  [bill,pct,split].forEach(el=>el.addEventListener('input',calc));
  document.querySelectorAll('.tip-q').forEach(btn=> btn.addEventListener('click',()=>{ document.querySelectorAll('.tip-q').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); pct.value=btn.dataset.tip; calc(); }));
  calc();
}

function initAge() {
  const dobEl = document.getElementById('age-dob'), toEl = document.getElementById('age-to'), btn = document.getElementById('age-calc-btn');
  const grid = document.getElementById('age-grid'), bday = document.getElementById('next-bday');
  const now = new Date(); toEl.value = now.toISOString().split('T')[0]; dobEl.value = '1995-01-01';
  btn.addEventListener('click',()=>{
    // FIXED: Added 'T00:00:00' to prevent Safari/UTC timezone bugs
    const dob=new Date(dobEl.value + 'T00:00:00'), to=new Date(toEl.value + 'T00:00:00');
    if(isNaN(dob)||isNaN(to)||dob>=to){ toast(window._t('toast-invalid-date')); return; }
    let years=to.getFullYear()-dob.getFullYear(), months=to.getMonth()-dob.getMonth(), days=to.getDate()-dob.getDate();
    if(days<0){ months--; const prev=new Date(to.getFullYear(),to.getMonth(),0); days+=prev.getDate(); }
    if(months<0){ years--; months+=12; }
    const totalDays=Math.floor((to-dob)/86400000);
    grid.innerHTML='';
    [{n:years,l:'Years'},{n:months,l:'Months'},{n:days,l:'Days'},{n:Math.floor(totalDays/7),l:'Weeks'},{n:(totalDays*24).toLocaleString(),l:'Hours'},{n:(totalDays*24*60).toLocaleString(),l:'Minutes'}].forEach(c=>{
      const d=document.createElement('div'); d.className='age-cell'; d.innerHTML=`<div class="age-num">${c.n}</div><div class="age-lbl">${window._t('age-'+c.l)}</div>`; grid.appendChild(d);
    });
    const nb=new Date(to.getFullYear(),dob.getMonth(),dob.getDate()); if(nb<=to) nb.setFullYear(nb.getFullYear()+1);
    bday.textContent=`🎂 Next birthday in ${Math.ceil((nb-to)/86400000)} days`;
    addToGlobalHistory(`Age`,`${years}y ${months}m ${days}d`);
  });
}

function initLoan() {
  const btn = document.getElementById('loan-calc-btn');
  btn.addEventListener('click',()=>{
    const P=parseFloat(document.getElementById('loan-amount').value)||0, annual=parseFloat(document.getElementById('loan-rate').value)||0, years=parseFloat(document.getElementById('loan-years').value)||0;
    if(!P||!years){ toast(window._t('toast-valid-val')); return; }
    const r=annual/100/12, n=years*12; let emi = r===0 ? P/n : P*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    const totalPay=emi*n, totalInt=totalPay-P;
    document.getElementById('loan-emi').textContent='$'+emi.toLocaleString('en-US',{maximumFractionDigits:2});
    const bd=document.getElementById('loan-breakdown'); bd.innerHTML='';
    [{l:'loan-lbl-Principal',v:'$'+P.toLocaleString()},{l:'loan-lbl-Interest',v:'$'+totalInt.toLocaleString('en-US',{maximumFractionDigits:0})},{l:'loan-lbl-Total',v:'$'+totalPay.toLocaleString('en-US',{maximumFractionDigits:0})},{l:'loan-lbl-Term',v:`${years} ${window._t('loan-lbl-Years')}`}].forEach(it=>{
      const d=document.createElement('div'); d.className='lb-item'; d.innerHTML=`<div class="lb-label">${window._t(it.l)}</div><div class="lb-val">${it.v}</div>`; bd.appendChild(d);
    });
    drawDonut(P,totalInt); addToGlobalHistory(`EMI`,emi.toFixed(2));
  });
}
function drawDonut(principal,interest) {
  const canvas=document.getElementById('loan-chart'), ctx=canvas.getContext('2d'), total=principal+interest;
  const cx=canvas.width/2, cy=canvas.height/2, R=90, r=55; ctx.clearRect(0,0,canvas.width,canvas.height);
  function arc(start,end,color){ ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,start,end); ctx.arc(cx,cy,r,end,start,true); ctx.closePath(); ctx.fillStyle=color; ctx.fill(); }
  const pAngle=(principal/total)*(Math.PI*2)-Math.PI/2;
  arc(-Math.PI/2,pAngle,'#8B5CF6'); arc(pAngle,3*Math.PI/2,'#F59E0B');
  ctx.fillStyle = isDark ? '#F0F0F3' : '#1A1A2E'; ctx.font='bold 13px JetBrains Mono'; ctx.textAlign='center'; ctx.fillText(window._t('loan-lbl-TOTAL'),cx,cy-6);
  ctx.font='bold 11px JetBrains Mono'; ctx.fillText('$'+total.toLocaleString('en-US',{maximumFractionDigits:0}),cx,cy+10);
  document.getElementById('chart-legend').innerHTML=`<div class="cl-item"><div class="cl-dot" style="background:#8B5CF6"></div><span>${window._t('loan-lbl-Principal')}</span></div><div class="cl-item"><div class="cl-dot" style="background:#F59E0B"></div><span>${window._t('loan-lbl-Interest')}</span></div>`;
}

/* ── KEYBOARD ─────────────────────────────── */
function initKeyboard() {
  document.addEventListener('keydown',e=>{
    const active=document.querySelector('.panel.active'); if(!active) return;
    const id=active.id; if(id!=='panel-standard'&&id!=='panel-scientific') return;
    const h = id==='panel-standard' ? window._stdHandle : null; if(!h) return;
    if(e.key>='0'&&e.key<='9'){ h('num',e.key); return; }
    if(e.key==='.') { h('dot'); return; }
    if(e.key==='Enter'||e.key==='='){ e.preventDefault(); h('eq'); return; }
    if(e.key==='Escape'){ h('clear'); return; }
    if(e.key==='Backspace'){ h('bksp'); return; }
    if(e.key==='+') { h('op','+'); return; }
    if(e.key==='-') { h('op','−'); return; }
    if(e.key==='*') { h('op','×'); return; }
    if(e.key==='/') { e.preventDefault(); h('op','÷'); return; }
  });
}

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