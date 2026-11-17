const SB = "https://rqtiuaiimyzuayctgrwk.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdGl1YWlpbXl6dWF5Y3RncndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3ODA1NjUsImV4cCI6MjEwNTM1NjU2NX0.26zCCI0Og1Gv4qK18I_Jq8VGHE2hRhXiuWnGEe5h4uA";
const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
async function rpc(fn, body) {
  const r = await fetch(SB + "/rest/v1/rpc/" + fn, { method: "POST", headers: H, body: JSON.stringify(body || {}) });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t; }
  if (!r.ok) throw new Error((j && j.message) || t);
  return j;
}
async function getGame() {
  const r = await fetch(SB + "/rest/v1/k3_game?id=eq.1&select=*", { headers: H, cache: "no-store" });
  return (await r.json())[0];
}
async function getPlayers(pin) {
  const r = await fetch(SB + "/rest/v1/k3_players?pin=eq." + encodeURIComponent(pin) + "&select=id,name,score,score_ok,score_speed,avatar&order=score.desc,created_at.asc", { headers: H, cache: "no-store" });
  return await r.json();
}
const LETTERS = ["ก", "ข", "ค", "ง"];
const COLORS = ["#ff7a8a", "#3cb6a0", "#ffa94d", "#8a7dff"];
const INK = "#2b2540";
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// ---------- เพลงคลอ สังเคราะห์ด้วย Web Audio (ไม่มีลิขสิทธิ์) แต่ละพาร์ทใช้เพลงต่างกัน ----------
const Music = (() => {
  let ac, master, timer, cur = null, step = 0, next = 0, muted = false;
  const N = n => 440 * Math.pow(2, (n - 69) / 12);
  const TR = {
    lobby: { bpm: 96, ch: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]], lead: "triangle", arp: [0, 1, 2, 1, 2, 1, 0, 2], kick: [0, 4], hat: 0.04, bass: "triangle" },
    p0: { bpm: 112, ch: [[60, 64, 67], [65, 69, 72], [55, 59, 62], [60, 64, 67]], lead: "triangle", arp: [0, 2, 1, 2, 0, 2, 1, 2], kick: [0, 4], hat: 0.05, bass: "triangle" },
    p1: { bpm: 122, ch: [[65, 69, 72], [62, 65, 69], [58, 62, 65], [60, 64, 67]], lead: "square", arp: [0, 1, 2, 0, 1, 2, 1, 0], kick: [0, 3, 4], hat: 0.06, bass: "triangle" },
    p2: { bpm: 128, ch: [[62, 65, 69], [58, 62, 65], [60, 64, 67], [57, 61, 64]], lead: "square", arp: [0, 0, 2, 1, 0, 2, 1, 2], kick: [0, 2, 4, 6], hat: 0.07, bass: "sawtooth" },
    p3: { bpm: 140, ch: [[64, 67, 71], [60, 64, 67], [62, 66, 69], [59, 62, 66]], lead: "sawtooth", arp: [0, 2, 1, 2, 0, 2, 1, 2], kick: [0, 2, 4, 6], hat: 0.08, bass: "sawtooth" }
  };
  function init() { if (ac) return; ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.3; master.connect(ac.destination); }
  function tone(f, t, d, type, v, filt) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    let last = o; if (filt) { const fl = ac.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = filt; o.connect(fl); last = fl; }
    last.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.05);
  }
  function kick(t, v) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2); }
  function hat(t, v) { const b = ac.createBuffer(1, 2200, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = "highpass"; f.frequency.value = 7000; g.gain.value = v; s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start(t); }
  function sched(t) {
    const c = TR[cur], s = step % 8, ch = c.ch[Math.floor(step / 8) % 4];
    if (c.kick.includes(s)) kick(t, 0.5);
    if (s % 2 === 1 || c.hat > .06) hat(t, s % 2 ? c.hat : c.hat / 2);
    tone(N(ch[c.arp[s]] + 12), t, 0.22, c.lead, c.lead === "triangle" ? 0.12 : 0.045, c.lead === "triangle" ? 0 : 2400);
    if (s % 4 === 0) tone(N(ch[0] - 24), t, 0.4, c.bass, c.bass === "triangle" ? 0.2 : 0.08, 600);
    if (s === 0 && cur === "lobby") ch.forEach(n => tone(N(n), t, 1.6, "sine", 0.05));
    step++;
  }
  function loop() { const spb = 60 / TR[cur].bpm / 2; while (next < ac.currentTime + 0.15) { sched(next); next += spb; } }
  return {
    play(m) { init(); if (ac.state === "suspended") ac.resume(); if (cur === m) return; cur = m; step = 0; next = ac.currentTime + 0.05; clearInterval(timer); if (m) timer = setInterval(loop, 40); },
    stop() { cur = null; clearInterval(timer); },
    sting(good) { if (!ac || muted) return; const t = ac.currentTime + 0.02; (good ? [60, 64, 67, 72] : [64, 60, 57]).forEach((n, i) => tone(N(n + 12), t + i * 0.09, 0.4, "triangle", 0.2)); },
    fanfare() { init(); const t = ac.currentTime + 0.05; [[60, 0], [64, .15], [67, .3], [72, .45], [67, .75], [72, .9]].forEach(([n, d]) => tone(N(n + 12), t + d, 0.5, "square", 0.08, 3000)); [48, 55, 60].forEach(n => tone(N(n), t + 0.9, 1.6, "triangle", 0.12)); },
    tick() { if (ac && !muted) tone(1200, ac.currentTime + 0.01, 0.06, "square", 0.06); },
    meow(p) {
      if (!ac || muted) return; const t = ac.currentTime + 0.01, k = p || 1;
      const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
      o.type = "sawtooth"; f.type = "bandpass"; f.Q.value = 4;
      o.frequency.setValueAtTime(520 * k, t); o.frequency.linearRampToValueAtTime(820 * k, t + 0.14); o.frequency.linearRampToValueAtTime(480 * k, t + 0.5);
      f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(1800, t + 0.15); f.frequency.linearRampToValueAtTime(800, t + 0.5);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + 0.6);
    },
    toggle() { init(); muted = !muted; master.gain.value = muted ? 0 : 0.3; return muted; }
  };
})();

// ---------- ตัวละครแมว 8 ตัว (วาดเอง) ----------
const AV_NAMES = ["แมวส้ม", "แมวดำ", "แมวขาว", "แมวสามสี", "แมวสีสวาด", "แมววิเชียรมาศ", "แมวลายเสือ", "แมวขาวดำ"];
const CATS = [
  { fur: "#f6a54c", earIn: "#ffc9a8", eye: null, mc: INK, wc: INK, pat: `<path d="M43 26 V34 M50 24 V33 M57 26 V34" stroke="#d97a1e" stroke-width="3.2" stroke-linecap="round"/><path d="M21 45 H29 M21 52 H28 M79 45 H71 M79 52 H72" stroke="#d97a1e" stroke-width="3" stroke-linecap="round"/>`, body: `<path d="M34 78 H42 M58 78 H66" stroke="#d97a1e" stroke-width="3" stroke-linecap="round"/>` },
  { fur: "#3a3646", earIn: "#7a6688", eye: "#ffd84d", mc: "#fff", wc: "#fff", pat: "", body: "" },
  { fur: "#ffffff", earIn: "#ffb3c1", eye: null, mc: INK, wc: INK, pat: "", body: "" },
  { fur: "#ffffff", earIn: "#ffb3c1", eye: null, mc: INK, wc: INK, pat: `<ellipse cx="30" cy="34" rx="15" ry="13" fill="#f6a54c"/><ellipse cx="72" cy="36" rx="13" ry="11" fill="#3a3646"/>`, body: `<ellipse cx="62" cy="80" rx="9" ry="7" fill="#f6a54c"/><ellipse cx="38" cy="88" rx="7" ry="6" fill="#3a3646"/>`, tail: "#f6a54c" },
  { fur: "#9aa7b8", earIn: "#d9bccb", eye: "#a6e36d", mc: INK, wc: INK, pat: "", body: "" },
  { fur: "#f5e6cc", earIn: "#9b7765", eye: "#6ec6ff", mc: "#fff", wc: "#fff", pat: `<ellipse cx="50" cy="58" rx="16" ry="13" fill="#6b4a3a"/>`, body: "", ear: "#6b4a3a", tail: "#6b4a3a", paw: "#6b4a3a" },
  { fur: "#c99a6b", earIn: "#f0c6a4", eye: "#a6e36d", mc: INK, wc: INK, pat: `<path d="M43 26 V35 M50 24 V34 M57 26 V35" stroke="#7a5536" stroke-width="3.2" stroke-linecap="round"/><path d="M21 44 H30 M21 51 H29 M79 44 H70 M79 51 H71" stroke="#7a5536" stroke-width="3" stroke-linecap="round"/>`, body: `<path d="M33 76 H43 M57 76 H67 M36 84 H44 M56 84 H64" stroke="#7a5536" stroke-width="3" stroke-linecap="round"/>` },
  { fur: "#3a3646", earIn: "#7a6688", eye: "#ffd84d", mc: INK, wc: "#fff", pat: `<ellipse cx="50" cy="61" rx="15" ry="11" fill="#fff"/><path d="M50 26 L45 50 H55 Z" fill="#fff"/>`, body: `<ellipse cx="50" cy="86" rx="10" ry="11" fill="#fff"/>`, paw: "#fff" }
];
const CAT_BASE = SB + "/storage/v1/object/public/k3img/cat";
function avatar(id, mood) {
  id = ((id | 0) % 8 + 8) % 8;
  return `<img class="catimg ${mood || ""}" src="${CAT_BASE}${id}.png" alt="" draggable="false">`;
}
function avatarSvg(id, mood) {
  id = ((id | 0) % 8 + 8) % 8; const c = CATS[id], ear = c.ear || c.fur, tail = c.tail || c.fur, paw = c.paw || c.fur;
  const eye = (x) => c.eye
    ? `<ellipse cx="${x}" cy="49" rx="5.2" ry="6.2" fill="${c.eye}" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x}" cy="49.5" rx="2.2" ry="4.4" fill="${INK}"/><circle cx="${x + 1.6}" cy="46.5" r="1.4" fill="#fff"/>`
    : `<ellipse cx="${x}" cy="49" rx="4.6" ry="5.6" fill="${INK}"/><circle cx="${x + 1.5}" cy="46.8" r="1.5" fill="#fff"/>`;
  const eyes = mood === "happy"
    ? `<g class="eyes"><path d="M34 50 Q39 43 44 50 M56 50 Q61 43 66 50" fill="none" stroke="${c.fur === "#3a3646" ? "#fff" : INK}" stroke-width="3" stroke-linecap="round"/></g>`
    : `<g class="eyes">${eye(39)}${eye(61)}</g>`;
  const mouth = mood === "happy" ? `<path d="M44 60 Q50 71 56 60 Z" fill="#ff6b81" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`
    : mood === "sad" ? `<path d="M45 65 Q50 60.5 55 65" fill="none" stroke="${c.mc}" stroke-width="2.2" stroke-linecap="round"/><path d="M67 53 q2.5 4 0 6 q-2.5 -2 0 -6Z" fill="#7cc8ff"/>`
    : `<path d="M44 61 Q47 64.5 50 61 Q53 64.5 56 61" fill="none" stroke="${c.mc}" stroke-width="2.2" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
<g class="tail"><path d="M68 92 Q92 92 88 62" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M68 92 Q92 92 88 62" fill="none" stroke="${tail}" stroke-width="6" stroke-linecap="round"/></g>
<g class="feet"><ellipse class="f1" cx="40" cy="103" rx="8" ry="5.5" fill="${paw}" stroke="${INK}" stroke-width="2.5"/><ellipse class="f2" cx="60" cy="103" rx="8" ry="5.5" fill="${paw}" stroke="${INK}" stroke-width="2.5"/></g>
<g class="body">
<defs><clipPath id="k3hc"><ellipse cx="50" cy="50" rx="30" ry="25"/></clipPath><clipPath id="k3bc"><ellipse cx="50" cy="84" rx="22" ry="18"/></clipPath></defs><ellipse cx="50" cy="84" rx="22" ry="18" fill="${c.fur}"/><g clip-path="url(#k3bc)">${c.body}</g><ellipse cx="50" cy="84" rx="22" ry="18" fill="none" stroke="${INK}" stroke-width="3"/>
<path d="M23 42 L25 12 L46 28 Z M77 42 L75 12 L54 28 Z" fill="${ear}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M28 33 L29 19 L39 27 Z M72 33 L71 19 L61 27 Z" fill="${c.earIn}"/>
<ellipse cx="50" cy="50" rx="30" ry="25" fill="${c.fur}"/>
<g clip-path="url(#k3hc)">${c.pat}</g>
<ellipse cx="50" cy="50" rx="30" ry="25" fill="none" stroke="${INK}" stroke-width="3"/>
<circle cx="31" cy="59" r="4" fill="#ff8fab" opacity=".55"/><circle cx="69" cy="59" r="4" fill="#ff8fab" opacity=".55"/>
${eyes}
<path d="M47 55.5 L53 55.5 L50 59 Z" fill="#ff8fab" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>
${mouth}
<path d="M22 56 L36 58 M22 62 L36 61 M78 56 L64 58 M78 62 L64 61" stroke="${c.wc}" stroke-width="1.5" stroke-linecap="round" opacity=".75"/>
</g></svg>`;
}
(function () {
  const st = document.createElement("style");
  st.textContent = `
.av{display:inline-block;position:relative}.av .catimg{width:100%;height:100%;object-fit:contain;object-position:center bottom;display:block;filter:drop-shadow(0 .3em .25em rgba(43,37,64,.18))}.av .catimg.sad{filter:saturate(.45) brightness(.92)}
.av.walk .catimg{animation:k3sway .35s ease-in-out infinite alternate;transform-origin:50% 100%}.av svg{width:100%;height:100%;overflow:visible;display:block}
.av .eyes{transform-box:fill-box;transform-origin:center;animation:k3blink 4.5s infinite}
.av:nth-child(3n) .eyes{animation-delay:1.6s}.av:nth-child(3n+1) .eyes{animation-delay:3.1s}
@keyframes k3blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.av .tail{transform-box:view-box;transform-origin:68px 92px;animation:k3wag 1.6s ease-in-out infinite alternate}
@keyframes k3wag{from{transform:rotate(-8deg)}to{transform:rotate(12deg)}}
.av.bob{animation:k3bob 1.4s ease-in-out infinite}
@keyframes k3bob{50%{transform:translateY(-6%)}}
.av.walk .body{animation:k3sway .4s ease-in-out infinite alternate;transform-box:view-box;transform-origin:50px 100px}
.av.walk .f1{animation:k3step .4s infinite alternate}.av.walk .f2{animation:k3step .4s infinite alternate-reverse}
.av.walk .tail{animation-duration:.5s}
@keyframes k3sway{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
@keyframes k3step{from{transform:translateY(0)}to{transform:translateY(-6px)}}
.av.jump{animation:k3jump .7s cubic-bezier(.3,1.6,.6,1) infinite}
@keyframes k3jump{0%,100%{transform:translateY(0) scaleY(1)}15%{transform:translateY(0) scaleY(.88)}50%{transform:translateY(-26%) scaleY(1.05)}}
.av.sad{animation:k3shake .5s 2}
@keyframes k3shake{25%{transform:translateX(-6%)}75%{transform:translateX(6%)}}
.av.pop{animation:k3pop .5s cubic-bezier(.3,1.7,.5,1) both}
@keyframes k3pop{from{transform:scale(0) translateY(40%)}}
.stroll{display:none;position:fixed;bottom:0;left:-12%;z-index:5;pointer-events:none;animation:k3stroll linear infinite}
.stroll.back{animation-name:k3strollb}
body.strollon .stroll{display:block}
@keyframes k3stroll{from{left:-12%}to{left:108%}}
@keyframes k3strollb{from{left:108%}to{left:-12%}}
.stroll.back .av{transform:scaleX(-1)}
body.paws{background-color:#fff6ee;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cg fill='%23f6e2d3'%3E%3Cellipse cx='22' cy='30' rx='6' ry='5'/%3E%3Ccircle cx='14' cy='22' r='2.6'/%3E%3Ccircle cx='19' cy='18' r='2.6'/%3E%3Ccircle cx='25' cy='18' r='2.6'/%3E%3Ccircle cx='30' cy='22' r='2.6'/%3E%3Cellipse cx='66' cy='72' rx='6' ry='5'/%3E%3Ccircle cx='58' cy='64' r='2.6'/%3E%3Ccircle cx='63' cy='60' r='2.6'/%3E%3Ccircle cx='69' cy='60' r='2.6'/%3E%3Ccircle cx='74' cy='64' r='2.6'/%3E%3C/g%3E%3C/svg%3E")}`;
  document.head.appendChild(st);
})();
function avEl(id, cls, mood, size) { return `<span class="av ${cls || ""}" style="width:${size};height:calc(${size} * 1.12)">${avatar(id, mood)}</span>`; }
function addStrollers(n, size) {
  for (let i = 0; i < n; i++) {
    const d = document.createElement("div"); d.className = "stroll" + (i % 2 ? " back" : "");
    d.style.animationDuration = (24 + i * 9) + "s"; d.style.animationDelay = (-i * 11) + "s";
    d.innerHTML = avEl((Math.random() * 8) | 0, "walk", "normal", size); document.body.appendChild(d);
  }
}
