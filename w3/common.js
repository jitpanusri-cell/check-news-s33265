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
  const r = await fetch(SB + "/rest/v1/k3_players?pin=eq." + encodeURIComponent(pin) + "&select=id,name,score&order=score.desc,created_at.asc", { headers: H, cache: "no-store" });
  return await r.json();
}
const SHAPES = [
  '<svg viewBox="0 0 40 40"><polygon points="20,4 37,35 3,35" fill="#fff"/></svg>',
  '<svg viewBox="0 0 40 40"><polygon points="20,3 37,20 20,37 3,20" fill="#fff"/></svg>',
  '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#fff"/></svg>',
  '<svg viewBox="0 0 40 40"><rect x="5" y="5" width="30" height="30" rx="3" fill="#fff"/></svg>'
];
const COLORS = ["#e21b3c", "#1368ce", "#d89e00", "#26890c"];
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
