/* ═══════════════════════════════════════════
   IRONWOOD — Shared JavaScript
═══════════════════════════════════════════ */

// ── Cursor ──────────────────────────────────
(function(){
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if(!cur||!ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);})();
})();

// ── Scroll Reveal ────────────────────────────
(function(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();

// ── Active nav link ──────────────────────────
(function(){
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href && path.includes(href.replace('.html','')) && href !== '/' && href !== '/index.html'){
      a.classList.add('active');
    }
  });
})();

// ── Mobile Nav ───────────────────────────────
function toggleNav(){
  const nl = document.querySelector('.nav-links');
  if(!nl) return;
  if(nl.style.display==='flex'){nl.style.display='none';return;}
  nl.style.cssText='display:flex;flex-direction:column;position:fixed;top:66px;left:0;right:0;background:#08071A;padding:20px 5vw;border-bottom:1px solid #1E1C40;gap:18px;z-index:499;';
}

// ── Ticker ───────────────────────────────────
(function(){
  const el = document.getElementById('ticker');
  if(!el) return;
  const threats=[
    {l:'BLOCKED',t:'Ransomware — Mumbai Node'},
    {l:'BLOCKED',t:'SQL Injection — API Gateway'},
    {l:'ALERT',t:'Port Scan from 185.220.x.x'},
    {l:'PATCHED',t:'CVE-2025-0831 Zero-Day'},
    {l:'BLOCKED',t:'Phishing Campaign — 2,840 emails'},
    {l:'MONITORED',t:'Suspicious AD Login — 03:24 IST'},
    {l:'BLOCKED',t:'DDoS 180 Gbps — Hyderabad DC'},
    {l:'RESOLVED',t:'Insider Threat — Data Exfil Prevented'},
    {l:'ALERT',t:'Exposed S3 Bucket — Remediated'},
    {l:'BLOCKED',t:'Brute Force — RDP Port 3389'},
    {l:'PATCHED',t:'Log4Shell variant detected'},
    {l:'BLOCKED',t:'C2 Callback — 3 endpoints isolated'},
  ];
  const doubled=[...threats,...threats];
  el.innerHTML=doubled.map(t=>`<div class="ticker-item"><div class="ticker-dot"></div><span class="t-lbl">[${t.l}]</span><span class="t-txt">${t.t}</span></div>`).join('');
})();

// ── Chatbot ──────────────────────────────────
let chatOpen=false, chatHistory=[], isTyping=false;
function toggleChat(){
  chatOpen=!chatOpen;
  const w=document.getElementById('chat-win');
  if(w) w.classList.toggle('open',chatOpen);
  if(chatOpen&&chatHistory.length===0) greetChat();
}
function openChat(){ if(!chatOpen) toggleChat(); }
function greetChat(){
  addChatMsg('bot',"Hello! I'm Ironwood Shield AI 🛡️\n\nI'm your cybersecurity expert assistant. Ask me anything about:\n• **Cyber threats** & attack vectors\n• **Ironwood's plans** (Sentinel, Fortress, Citadel)\n• **Compliance** — CERT-In, DPDP, SEBI\n• **Zero Trust, EDR, SIEM, SOAR** and more\n\nHow can I help you today?");
}
function addChatMsg(role,text){
  const msgs=document.getElementById('chat-messages');
  if(!msgs) return;
  const d=document.createElement('div'); d.className=`msg ${role}`;
  const b=document.createElement('div'); b.className='msg-b';
  b.innerHTML=text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/`(.*?)`/g,'<code style="background:rgba(79,70,255,.15);padding:1px 5px;border-radius:3px;font-family:var(--font-mono);font-size:.78em;">$1</code>');
  const ts=document.createElement('div'); ts.className='msg-t';
  ts.textContent=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  d.append(b,ts); msgs.append(d); msgs.scrollTop=msgs.scrollHeight;
  const qb=document.getElementById('quick-btns'); if(qb) qb.style.display='none';
}
function showTyping(){
  const msgs=document.getElementById('chat-messages'); if(!msgs) return;
  const d=document.createElement('div'); d.className='msg bot'; d.id='typing-msg';
  const b=document.createElement('div'); b.className='msg-b';
  b.innerHTML='<div class="typing-wrap"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>';
  d.appendChild(b); msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
}
function removeTyping(){ const t=document.getElementById('typing-msg'); if(t) t.remove(); }
async function sendMessage(){
  const inp=document.getElementById('chat-input'); if(!inp) return;
  const text=inp.value.trim();
  if(!text||isTyping) return;
  inp.value=''; inp.style.height='auto';
  addChatMsg('user',text);
  chatHistory.push({role:'user',content:text});
  isTyping=true; const s=document.getElementById('chat-send'); if(s) s.disabled=true;
  showTyping();
  try{
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:chatHistory})});
    const data=await res.json();
    removeTyping();
    const reply=data.reply||data.error||'Sorry, an error occurred. Please try again.';
    addChatMsg('bot',reply);
    chatHistory.push({role:'assistant',content:reply});
  }catch(err){ removeTyping(); addChatMsg('bot','Connection error. Please try again.'); }
  isTyping=false; if(s) s.disabled=false;
}
function sendQuick(q){ const i=document.getElementById('chat-input'); if(i){i.value=q;sendMessage();} }
function handleEnter(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();} }
function autoResize(el){ el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,100)+'px'; }
