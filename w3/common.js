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
const COLORS = ["#ff6b4a", "#14a89a", "#f5a524", "#5b6cff"];
const INK = "#1d2340";
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// ---------- เพลงคลอ สังเคราะห์ด้วย Web Audio (ไม่มีลิขสิทธิ์) ----------
const Music = (() => {
  let ac, master, timer, mode = null, step = 0, next = 0, muted = false;
  const N = n => 440 * Math.pow(2, (n - 69) / 12);
  function init() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0.32; master.connect(ac.destination);
  }
  function tone(f, t, d, type, v, dest) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + d + 0.05);
  }
  function kick(t, v) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2);
  }
  function hat(t, v) {
    const b = ac.createBuffer(1, 2200, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = "highpass"; f.frequency.value = 7000; g.gain.value = v;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }
  // คอร์ด: C G Am F (lobby) / Am F C G (question)
  const LOBBY = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]];
  const QUEST = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
  function sched(t) {
    if (mode === "lobby") {
      const bar = Math.floor(step / 8) % 4, s = step % 8, ch = LOBBY[bar];
      if (s % 4 === 0) kick(t, 0.5);
      if (s % 2 === 1) hat(t, 0.05);
      tone(N(ch[[0, 1, 2, 1, 0, 2, 1, 2][s]] + 12), t, 0.28, "triangle", 0.12);
      if (s === 0) ch.forEach(n => tone(N(n), t, 1.6, "sine", 0.05));
      if (s === 0 || s === 4) tone(N(ch[0] - 24), t, 0.5, "triangle", 0.18);
    } else if (mode === "question") {
      const bar = Math.floor(step / 8) % 4, s = step % 8, ch = QUEST[bar];
      if (s % 2 === 0) kick(t, 0.55);
      hat(t, s % 2 ? 0.08 : 0.04);
      tone(N(ch[0] - 24), t, 0.13, "sawtooth", 0.07);
      if (s === 0 || s === 3 || s === 6) tone(N(ch[(s / 3) | 0] + 12), t, 0.18, "square", 0.04);
    }
    step++;
  }
  function loop() {
    const spb = mode === "question" ? 60 / 136 / 2 : 60 / 100 / 2;
    while (next < ac.currentTime + 0.15) { sched(next); next += spb; }
  }
  return {
    play(m) {
      init(); if (ac.state === "suspended") ac.resume();
      if (mode === m) return; mode = m; step = 0; next = ac.currentTime + 0.05;
      clearInterval(timer); if (m) timer = setInterval(loop, 40);
    },
    stop() { mode = null; clearInterval(timer); },
    sting(good) {
      if (!ac || muted) return; const t = ac.currentTime + 0.02;
      (good ? [60, 64, 67, 72] : [64, 60, 57]).forEach((n, i) => tone(N(n + 12), t + i * 0.09, 0.4, "triangle", 0.2));
    },
    fanfare() {
      init(); const t = ac.currentTime + 0.05;
      [[60, 0], [64, .15], [67, .3], [72, .45], [67, .75], [72, .9]].forEach(([n, d]) => tone(N(n + 12), t + d, 0.5, "square", 0.08));
      [48, 55, 60].forEach(n => tone(N(n), t + 0.9, 1.6, "triangle", 0.12));
    },
    tick() { if (ac && !muted) tone(1200, ac.currentTime + 0.01, 0.06, "square", 0.08); },
    toggle() { init(); muted = !muted; master.gain.value = muted ? 0 : 0.32; return muted; }
  };
})();

// ---------- ตัวละคร (ออกแบบเอง) ----------
const AV_NAMES = ["กล่องพัสดุ", "ถุงช้อปปิ้ง", "เหรียญ", "ป้ายราคา", "ชานมไข่มุก", "มือถือ", "ขนมปัง", "หมวกกันน็อก"];
const AV_BODY = [
  // กล่องพัสดุ
  `<rect x="18" y="30" width="64" height="60" rx="6" fill="#d4955a" stroke="${INK}" stroke-width="3"/><path d="M18 46 H82" stroke="${INK}" stroke-width="2" opacity=".35"/><rect x="43" y="30" width="14" height="16" fill="#f3d3a4" stroke="${INK}" stroke-width="2"/>`,
  // ถุงช้อปปิ้ง
  `<path d="M36 40 Q36 16 50 16 Q64 16 64 40" fill="none" stroke="${INK}" stroke-width="4"/><path d="M20 38 H80 L76 92 H24 Z" fill="#ff6b4a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
  // เหรียญ
  `<circle cx="50" cy="56" r="35" fill="#ffc93c" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="56" r="27" fill="none" stroke="#e09b00" stroke-width="3"/>`,
  // ป้ายราคา
  `<path d="M36 22 H82 V92 H36 L18 57 Z" fill="#14a89a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="57" r="4.5" fill="#fff7ec" stroke="${INK}" stroke-width="2"/>`,
  // ชานมไข่มุก
  `<rect x="56" y="6" width="7" height="26" rx="2" fill="#ff6b4a" stroke="${INK}" stroke-width="2" transform="rotate(12 59 19)"/><rect x="20" y="24" width="60" height="10" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M24 34 H76 L70 94 H30 Z" fill="#e8c39a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><g fill="${INK}"><circle cx="38" cy="86" r="4"/><circle cx="48" cy="88" r="4"/><circle cx="58" cy="86" r="4"/><circle cx="64" cy="80" r="3.5"/><circle cx="34" cy="79" r="3.5"/></g>`,
  // มือถือ
  `<rect x="24" y="12" width="52" height="84" rx="11" fill="#5b6cff" stroke="${INK}" stroke-width="3"/><rect x="30" y="22" width="40" height="62" rx="5" fill="#e3e7ff"/><rect x="44" y="88" width="12" height="3" rx="1.5" fill="#e3e7ff"/>`,
  // ขนมปัง
  `<path d="M20 52 Q14 22 50 22 Q86 22 80 52 V92 H20 Z" fill="#c9782f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M27 54 Q22 30 50 30 Q78 30 73 54 V86 H27 Z" fill="#ffe0a8"/>`,
  // หมวกกันน็อก
  `<path d="M16 70 Q16 20 50 20 Q84 20 84 70 Z" fill="#e63946" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M28 70 V84 Q50 96 72 84 V70" fill="#ffd9c2" stroke="${INK}" stroke-width="3"/><path d="M50 21 V34" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`
];
const AV_FACE_Y = [64, 66, 58, 58, 58, 52, 60, 52];
const AV_FACE_X = [0, 0, 0, 8, 0, 0, 0, 0];
function avatar(id, mood) {
  id = ((id | 0) % 8 + 8) % 8; const y = AV_FACE_Y[id];
  const mouth = mood === "happy" ? `<path d="M40 ${y + 6} Q50 ${y + 20} 60 ${y + 6} Z" fill="${INK}"/>`
    : mood === "sad" ? `<path d="M42 ${y + 13} Q50 ${y + 6} 58 ${y + 13}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
    : `<path d="M42 ${y + 7} Q50 ${y + 14} 58 ${y + 7}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const eyes = mood === "happy"
    ? `<g class="eyes"><path d="M35 ${y - 2} Q39 ${y - 8} 43 ${y - 2}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M57 ${y - 2} Q61 ${y - 8} 65 ${y - 2}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`
    : `<g class="eyes"><ellipse cx="39" cy="${y - 4}" rx="4" ry="5.5" fill="${INK}"/><ellipse cx="61" cy="${y - 4}" rx="4" ry="5.5" fill="${INK}"/><circle cx="40.5" cy="${y - 6}" r="1.4" fill="#fff"/><circle cx="62.5" cy="${y - 6}" r="1.4" fill="#fff"/></g>`;
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg"><g class="feet"><ellipse class="f1" cx="38" cy="104" rx="9" ry="5" fill="${INK}"/><ellipse class="f2" cx="62" cy="104" rx="9" ry="5" fill="${INK}"/></g><g class="body">${AV_BODY[id]}<g transform="translate(${AV_FACE_X[id]} 0)"><circle cx="31" cy="${y + 6}" r="4.5" fill="#ff8fa3" opacity=".7"/><circle cx="69" cy="${y + 6}" r="4.5" fill="#ff8fa3" opacity=".7"/>${eyes}${mouth}</g></g></svg>`;
}
(function () {
  const st = document.createElement("style");
  st.textContent = `
.av{display:inline-block;position:relative}.av svg{width:100%;height:100%;overflow:visible;display:block}
.av .eyes{transform-box:fill-box;transform-origin:center;animation:k3blink 4.5s infinite}
.av:nth-child(3n) .eyes{animation-delay:1.6s}.av:nth-child(3n+1) .eyes{animation-delay:3.1s}
@keyframes k3blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.av.bob{animation:k3bob 1.4s ease-in-out infinite}
@keyframes k3bob{50%{transform:translateY(-7%)}}
.av.walk .body{animation:k3sway .4s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:bottom center}
.av.walk .f1{animation:k3step .4s infinite alternate}.av.walk .f2{animation:k3step .4s infinite alternate-reverse}
@keyframes k3sway{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes k3step{from{transform:translateY(0)}to{transform:translateY(-6px)}}
.av.jump{animation:k3jump .7s cubic-bezier(.3,1.6,.6,1) infinite}
@keyframes k3jump{0%,100%{transform:translateY(0) scaleY(1)}15%{transform:translateY(0) scaleY(.88)}50%{transform:translateY(-28%) scaleY(1.05)}}
.av.sad{animation:k3shake .5s 2}
@keyframes k3shake{25%{transform:translateX(-6%)}75%{transform:translateX(6%)}}
.av.pop{animation:k3pop .5s cubic-bezier(.3,1.7,.5,1) both}
@keyframes k3pop{from{transform:scale(0) translateY(40%)}}`;
  document.head.appendChild(st);
})();
function avEl(id, cls, mood, size) { return `<span class="av ${cls || ""}" style="width:${size};height:calc(${size} * 1.12)">${avatar(id, mood)}</span>`; }
