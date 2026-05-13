// ╔══════════════════════════════════════════════════════════════╗
// ║  FocusFlow — src/App.jsx                                     ║
// ║  Features: localStorage · PWA · Username · Export · Import   ║
// ╚══════════════════════════════════════════════════════════════╝
//
// SETUP INSTRUCTIONS
// ──────────────────
// 1. npx create-react-app focusflow  (or: npm create vite@latest focusflow -- --template react)
// 2. cd focusflow && npm install
// 3. Replace src/App.js (or src/App.jsx) with this file
// 4. Copy the PWA files below into /public  (manifest.json, sw.js)
// 5. npm start  (CRA) or  npm run dev  (Vite)
//
// PWA FILE 1 ─ public/manifest.json
// ──────────────────────────────────
// {
//   "name": "FocusFlow",
//   "short_name": "FocusFlow",
//   "description": "Habit tracker, to-dos & focus timer",
//   "start_url": "/",
//   "display": "standalone",
//   "background_color": "#f4f9ff",
//   "theme_color": "#1a91d0",
//   "icons": [
//     { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
//     { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
//   ]
// }
//
// PWA FILE 2 ─ public/sw.js  (Service Worker)
// ─────────────────────────────────────────────
// const CACHE = "focusflow-v1";
// const ASSETS = ["/", "/index.html", "/static/js/main.chunk.js",
//                 "/static/js/bundle.js", "/static/css/main.chunk.css"];
// self.addEventListener("install", e =>
//   e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
// self.addEventListener("fetch", e =>
//   e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
//
// PWA FILE 3 ─ Add to public/index.html <head>
// ──────────────────────────────────────────────
// <link rel="manifest" href="/manifest.json" />
// <meta name="theme-color" content="#1a91d0" />
//
// PWA FILE 4 ─ Register SW in src/index.js  (add before ReactDOM.render)
// ────────────────────────────────────────────────────────────────────────
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () =>
//     navigator.serviceWorker.register("/sw.js"));
// }
//
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

// ─── Theme ───────────────────────────────────────────────────
const C = {
  blue: "#1a91d0", green: "#64bc46", bgLight: "#f4f9ff",
  textMain: "#1e293b", textMuted: "#64748b", card: "#ffffff",
  shadow: "0 10px 40px rgba(26,145,208,0.10)",
};
const grad = "linear-gradient(135deg, #1a91d0, #64bc46)";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  input[type=checkbox] { accent-color: #1a91d0; width: 20px; height: 20px; cursor: pointer; }
  input[type=text], input[type=number], select {
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e2e8f0; border-radius: 14px;
    padding: 10px 16px; font-size: 14px; color: #1e293b;
    background: #f8fafc; outline: none; width: 100%; transition: border 0.2s;
  }
  input[type=text]:focus, input[type=number]:focus, select:focus { border-color: #1a91d0; background: #fff; }
  .task-item { background: #f8fafc; padding: 14px 18px; border-radius: 18px; margin-bottom: 10px;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); border: 1px solid transparent; }
  .task-item:hover { transform: translateX(10px); background: white;
    border-color: rgba(26,145,208,0.3); box-shadow: 8px 8px 20px rgba(0,0,0,0.04); }
  .task-item:hover .task-label { color: #1a91d0; }
  .task-label { font-weight: 600; font-size: 0.93rem; color: #1e293b; transition: color 0.2s; }
  .habit-pill { display: inline-block; padding: 9px 18px; border-radius: 25px; background: #f1f5f9;
    font-size: 0.85rem; font-weight: 700; margin: 4px; color: #64748b; cursor: pointer;
    transition: 0.25s; border: none; }
  .habit-pill.done { background: #64bc46; color: white; }
  .dock-item { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
    background: white; border-radius: 50%; font-size: 1.25rem; cursor: pointer;
    transition: 0.3s cubic-bezier(0.175,0.885,0.32,1.275); border: none; }
  .dock-item:hover { transform: translateY(-14px) scale(1.2); background: #64bc46; }
  .dock-item.active { background: #1a91d0; }
  .btn-grad { background: linear-gradient(135deg,#1a91d0,#64bc46); color: white; border: none;
    padding: 13px 32px; border-radius: 18px; font-weight: 700; font-size: 0.95rem; cursor: pointer;
    box-shadow: 0 8px 20px rgba(26,145,208,0.22); transition: 0.2s; font-family: inherit; }
  .btn-grad:hover { transform: scale(1.05); }
  .btn-ghost { background: #f1f5f9; color: #64748b; border: none; padding: 13px 28px;
    border-radius: 18px; font-weight: 700; font-size: 0.95rem; cursor: pointer; font-family: inherit; transition: 0.2s; }
  .btn-ghost:hover { background: #e2e8f0; }
  .btn-danger { background: #fff0f0; color: #ef4444; border: 1.5px solid #fecaca;
    padding: 10px 20px; border-radius: 14px; font-weight: 700; font-size: 0.88rem;
    cursor: pointer; font-family: inherit; transition: 0.2s; }
  .btn-danger:hover { background: #ef4444; color: white; }
  .toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
    background: #1e293b; color: white; padding: 12px 24px; border-radius: 20px;
    font-weight: 700; font-size: 0.88rem; z-index: 9999;
    animation: slideDown 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  @keyframes slideDown { from { opacity:0; transform: translateX(-50%) translateY(-12px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
  @media (max-width: 700px) {
    .grid-3 { grid-template-columns: 1fr !important; }
    .grid-2 { grid-template-columns: 1fr !important; }
    .dock-item { width: 42px; height: 42px; font-size: 1.05rem; }
  }
`;

// ─── localStorage hook ────────────────────────────────────────
function useStore(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const set = x => {
    const val = typeof x === "function" ? x(v) : x;
    setV(val);
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };
  return [v, set];
}

// ─── Helpers ──────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split("T")[0]; }

function gradText(text, style = {}) {
  return (
    <span style={{ background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent", ...style }}>
      {text}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, borderRadius: 30, padding: 28, boxShadow: C.shadow, border: "1px solid rgba(255,255,255,0.7)", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return <p style={{ fontSize: "0.72rem", fontWeight: 800, color: C.textMuted, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>{children}</p>;
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return <div className="toast">{msg}</div>;
}

// ─── Onboarding / Name Screen ─────────────────────────────────
function Onboarding({ onDone }) {
  const [name, setName] = useState("");
  const submit = () => { if (name.trim()) onDone(name.trim()); };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bgLight, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{css}</style>
      <Card style={{ maxWidth: 420, width: "90%", textAlign: "center", padding: "48px 36px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
          Welcome to {gradText("FocusFlow")}
        </h1>
        <p style={{ color: C.textMuted, fontWeight: 600, fontSize: "0.9rem", marginBottom: 28 }}>
          Your personal habit tracker, to-do list & focus timer.
        </p>
        <SectionLabel>What should we call you?</SectionLabel>
        <input
          type="text" placeholder="Enter your name..."
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ marginBottom: 16, textAlign: "center", fontSize: 16 }}
          autoFocus
        />
        <button className="btn-grad" onClick={submit} style={{ width: "100%", padding: 15 }}>
          Let's Go →
        </button>
      </Card>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────
function Settings({ userName, setUserName, toast }) {
  const [editName, setEditName] = useState(userName);
  const fileRef = useRef();

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      habits: JSON.parse(localStorage.getItem("ff_habits") || "[]"),
      todos: JSON.parse(localStorage.getItem("ff_todos") || "[]"),
      sessions: JSON.parse(localStorage.getItem("ff_sessions") || "0"),
      userName: localStorage.getItem("ff_username") || "",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `focusflow-backup-${todayStr()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast("✅ Data exported successfully!");
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.habits) localStorage.setItem("ff_habits", JSON.stringify(data.habits));
        if (data.todos) localStorage.setItem("ff_todos", JSON.stringify(data.todos));
        if (data.sessions !== undefined) localStorage.setItem("ff_sessions", JSON.stringify(data.sessions));
        if (data.userName) { localStorage.setItem("ff_username", data.userName); setUserName(data.userName); setEditName(data.userName); }
        toast("✅ Data imported! Refreshing...");
        setTimeout(() => window.location.reload(), 1200);
      } catch { toast("❌ Invalid backup file."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const clearAll = () => {
    if (!window.confirm("Delete ALL FocusFlow data? This cannot be undone.")) return;
    ["ff_habits", "ff_todos", "ff_sessions", "ff_username"].forEach(k => localStorage.removeItem(k));
    toast("🗑️ All data cleared. Refreshing...");
    setTimeout(() => window.location.reload(), 1200);
  };

  const saveName = () => {
    if (!editName.trim()) return;
    setUserName(editName.trim());
    localStorage.setItem("ff_username", editName.trim());
    toast("✅ Name updated!");
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 24 }}>⚙️ Settings</h2>

      {/* Name */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 4, fontSize: "1rem" }}>👤 Your Name</h3>
        <p style={{ color: C.textMuted, fontSize: "0.83rem", marginBottom: 16 }}>Shown on the home screen welcome message.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="text" value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveName()} placeholder="Your name" />
          <button className="btn-grad" onClick={saveName} style={{ whiteSpace: "nowrap" }}>Save</button>
        </div>
      </Card>

      {/* Export */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 4, fontSize: "1rem" }}>📤 Export Data</h3>
        <p style={{ color: C.textMuted, fontSize: "0.83rem", marginBottom: 16 }}>
          Download a JSON backup of all your habits, tasks, streaks and sessions. Keep it safe to restore later.
        </p>
        <button className="btn-grad" onClick={exportData}>Download Backup JSON</button>
      </Card>

      {/* Import */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 4, fontSize: "1rem" }}>📥 Import Data</h3>
        <p style={{ color: C.textMuted, fontSize: "0.83rem", marginBottom: 16 }}>
          Restore from a previously exported FocusFlow backup. <strong>This will overwrite your current data.</strong>
        </p>
        <input type="file" accept=".json" ref={fileRef} onChange={importData} style={{ display: "none" }} />
        <button className="btn-ghost" onClick={() => fileRef.current.click()}>Choose Backup File…</button>
      </Card>

      {/* PWA Install hint */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 4, fontSize: "1rem" }}>📱 Install as App</h3>
        <p style={{ color: C.textMuted, fontSize: "0.83rem", marginBottom: 8 }}>
          FocusFlow is a Progressive Web App (PWA). Install it for an app-like experience with offline support.
        </p>
        <ul style={{ color: C.textMuted, fontSize: "0.83rem", paddingLeft: 18, lineHeight: 2 }}>
          <li><strong>Chrome / Edge (Desktop):</strong> Click the install icon (⊕) in the address bar</li>
          <li><strong>Android Chrome:</strong> Tap the menu → "Add to Home Screen"</li>
          <li><strong>iOS Safari:</strong> Tap Share → "Add to Home Screen"</li>
        </ul>
      </Card>

      {/* Danger zone */}
      <Card style={{ border: "1.5px solid #fecaca" }}>
        <h3 style={{ fontWeight: 800, marginBottom: 4, fontSize: "1rem", color: "#ef4444" }}>🗑️ Danger Zone</h3>
        <p style={{ color: C.textMuted, fontSize: "0.83rem", marginBottom: 16 }}>Permanently delete all FocusFlow data from this device.</p>
        <button className="btn-danger" onClick={clearAll}>Delete All Data</button>
      </Card>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────
function Home({ userName, setTab }) {
  const [habits] = useStore("ff_habits", []);
  const [todos] = useStore("ff_todos", []);
  const [sessions] = useStore("ff_sessions", 0);
  const today = todayStr();
  const todayTodos = todos.filter(t => t.date === today);
  const done = todayTodos.filter(t => t.done).length;
  const topStreak = habits.reduce((a, b) => b.streak > a ? b.streak : a, 0);
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      <header style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{ color: C.textMuted, fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{dateStr}</p>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: C.textMain }}>
          Welcome back, {gradText(userName)}.
        </h1>
      </header>

      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 22, marginBottom: 22 }}>
        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 16 }}>📝 Today's Tasks</h3>
          {todayTodos.slice(0, 4).map(t => (
            <div key={t.id} className="task-item">
              <span className="task-label" style={{ textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.5 : 1 }}>{t.text}</span>
              <input type="checkbox" checked={t.done} readOnly />
            </div>
          ))}
          {todayTodos.length === 0 && <p style={{ color: C.textMuted, fontSize: 13 }}>No tasks yet</p>}
          <div onClick={() => setTab(1)} style={{ color: C.blue, fontWeight: 800, padding: "8px 4px", cursor: "pointer", fontSize: "0.88rem" }}>+ Add tasks</div>
        </Card>

        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 16 }}>🌱 Daily Habits</h3>
          {habits.slice(0, 6).map(h => (
            <button key={h.id} className={`habit-pill${h.completions?.includes(today) ? " done" : ""}`}
              style={{ background: h.completions?.includes(today) ? h.color : undefined }}>
              {h.name}
            </button>
          ))}
          {habits.length === 0 && <p style={{ color: C.textMuted, fontSize: 13 }}>No habits added</p>}
        </Card>

        <Card>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 16 }}>⚡ Flow Stats</h3>
          {[
            { label: "TASKS DONE TODAY", val: `${done}/${todayTodos.length}` },
            { label: "FOCUS SESSIONS", val: `${sessions}` },
            { label: "TOP STREAK", val: `🔥 ${topStreak}d` },
          ].map(m => (
            <div key={m.label} style={{ marginBottom: 18 }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 800, color: C.textMuted, letterSpacing: 1 }}>{m.label}</p>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: 4 }}>{gradText(m.val)}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── HABITS ───────────────────────────────────────────────────
const HCOLORS = ["#1a91d0","#64bc46","#f59e0b","#ef4444","#8b5cf6","#ec4899","#f97316","#06b6d4"];

function Habits() {
  const [habits, setHabits] = useStore("ff_habits", []);
  const [name, setName] = useState("");
  const [color, setColor] = useState(HCOLORS[0]);
  const today = todayStr();

  const calcStreak = (completions) => {
    let streak = 0, d = new Date();
    while (true) {
      const ds = d.toISOString().split("T")[0];
      if (completions.includes(ds)) { streak++; d.setDate(d.getDate() - 1); } else break;
    }
    return streak;
  };

  const add = () => {
    if (!name.trim()) return;
    setHabits([...habits, { id: Date.now(), name: name.trim(), color, completions: [], streak: 0 }]);
    setName("");
  };

  const toggle = (id) => setHabits(habits.map(h => {
    if (h.id !== id) return h;
    const done = h.completions.includes(today);
    const completions = done ? h.completions.filter(d => d !== today) : [...h.completions, today];
    return { ...h, completions, streak: calcStreak(completions) };
  }));

  const del = (id) => setHabits(habits.filter(h => h.id !== id));

  return (
    <div>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 24 }}>🌿 Daily Habits</h2>
      <Card style={{ marginBottom: 22 }}>
        <SectionLabel>Add new habit</SectionLabel>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <input type="text" placeholder="e.g. Morning walk, Read 20 pages..." value={name}
            onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} />
          <button className="btn-grad" onClick={add} style={{ whiteSpace: "nowrap" }}>Add</button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {HCOLORS.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: color === c ? `3px solid ${C.textMain}` : "3px solid transparent", transition: "0.15s" }} />
          ))}
        </div>
      </Card>

      {habits.length === 0 && <p style={{ color: C.textMuted, textAlign: "center", padding: "40px 0" }}>No habits yet — add one above</p>}

      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {habits.map(h => {
          const done = h.completions.includes(today);
          return (
            <Card key={h.id} style={{ borderTop: `4px solid ${h.color}`, padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>{h.name}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.textMuted }}>
                    {h.streak > 0 ? `🔥 ${h.streak}-day streak` : "No streak yet"} · {h.completions.length} total
                  </div>
                </div>
                <button onClick={() => del(h.id)} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, marginBottom: 14 }}>
                <div style={{ height: 6, background: h.color, borderRadius: 99, width: `${Math.min(100, (h.streak / 30) * 100)}%`, transition: "width 0.4s" }} />
              </div>
              <button onClick={() => toggle(h.id)} className={done ? "btn-grad" : "btn-ghost"}
                style={{ width: "100%", padding: "10px", borderRadius: 14, fontSize: "0.88rem", background: done ? h.color : undefined, boxShadow: done ? `0 6px 16px ${h.color}44` : undefined }}>
                {done ? "✓ Done today" : "Mark done"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── TODO ─────────────────────────────────────────────────────
function Todo() {
  const [todos, setTodos] = useStore("ff_todos", []);
  const [text, setText] = useState("");
  const [pri, setPri] = useState("medium");
  const today = todayStr();
  const priColor = { high: "#ef4444", medium: "#f59e0b", low: "#64bc46" };

  const add = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), priority: pri, done: false, date: today }]);
    setText("");
  };
  const toggle = (id) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del = (id) => setTodos(todos.filter(t => t.id !== id));

  const renderList = (list, label) => list.length > 0 && (
    <div style={{ marginBottom: 20 }}>
      <SectionLabel>{label}</SectionLabel>
      {list.map(t => (
        <div key={t.id} className="task-item" style={{ opacity: t.done ? 0.55 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span className="task-label" style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: priColor[t.priority] + "22", color: priColor[t.priority], borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{t.priority}</span>
            <button onClick={() => del(t.id)} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 24 }}>📝 Today's Objectives</h2>
      <Card style={{ marginBottom: 22 }}>
        <SectionLabel>New Task</SectionLabel>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="text" placeholder="What needs to be done?" value={text}
            onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} />
          <select value={pri} onChange={e => setPri(e.target.value)} style={{ width: 120 }}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="btn-grad" onClick={add} style={{ whiteSpace: "nowrap" }}>Add</button>
        </div>
      </Card>
      <Card>
        {todos.length === 0 && <p style={{ color: C.textMuted, textAlign: "center", padding: "20px 0" }}>No tasks yet</p>}
        {renderList(todos.filter(t => t.date === today), "Today")}
        {renderList(todos.filter(t => t.date !== today && !t.done), "Carry-over")}
      </Card>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────
function Analytics() {
  const [habits] = useStore("ff_habits", []);
  const [todos] = useStore("ff_todos", []);
  const [sessions] = useStore("ff_sessions", 0);
  const today = todayStr();
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split("T")[0]; });
  const todayTodos = todos.filter(t => t.date === today);
  const done = todayTodos.filter(t => t.done).length;
  const topStreak = habits.reduce((a, b) => b.streak > a ? b.streak : a, 0);
  const barMax = Math.max(1, ...last7.map(d => habits.filter(h => h.completions.includes(d)).length));

  return (
    <div>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 24 }}>📈 Analytics</h2>
      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 22 }}>
        {[
          { label: "HABITS TODAY", val: `${habits.filter(h => h.completions.includes(today)).length}/${habits.length}` },
          { label: "TASKS DONE", val: `${done}/${todayTodos.length}` },
          { label: "TOP STREAK", val: `🔥 ${topStreak}d` },
        ].map(m => (
          <Card key={m.label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 800, color: C.textMuted, letterSpacing: 1 }}>{m.label}</p>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: 6 }}>{gradText(m.val)}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 22 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 20 }}>7-Day Habit Completion</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
          {last7.map(d => {
            const count = habits.filter(h => h.completions.includes(d)).length;
            const h = Math.max(8, (count / barMax) * 100);
            const isToday = d === today;
            return (
              <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: isToday ? C.blue : C.textMuted }}>{count}</span>
                <div style={{ width: "100%", height: 100, display: "flex", alignItems: "flex-end" }}>
                  <div style={{ width: "100%", height: h, background: isToday ? grad : "#e2e8f0", borderRadius: "8px 8px 0 0", transition: "height 0.4s" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: isToday ? C.blue : C.textMuted }}>{d.slice(5).replace("-", "/")}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: 22 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 16 }}>Habit Streaks</h3>
        {habits.length === 0 && <p style={{ color: C.textMuted, fontSize: 13 }}>No habits yet</p>}
        {[...habits].sort((a, b) => b.streak - a.streak).map(h => (
          <div key={h.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              <span>{h.name}</span><span style={{ color: h.color }}>🔥 {h.streak}d</span>
            </div>
            <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99 }}>
              <div style={{ height: 8, background: h.color, borderRadius: 99, width: `${Math.min(100, (h.streak / 30) * 100)}%`, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <h3 style={{ fontWeight: 800, marginBottom: 14 }}>30-Day Heatmap</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {Array.from({ length: 30 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (29 - i));
            const ds = d.toISOString().split("T")[0];
            const count = habits.filter(h => h.completions.includes(ds)).length;
            const pct = habits.length ? count / habits.length : 0;
            return <div key={ds} title={ds} style={{ width: 20, height: 20, borderRadius: 5, background: C.blue, opacity: pct === 0 ? 0.08 : 0.15 + pct * 0.85 }} />;
          })}
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 10, fontSize: 11, color: C.textMuted, fontWeight: 600 }}>
          <span>Less</span>
          {[0.08, 0.3, 0.55, 0.78, 1].map(o => <div key={o} style={{ width: 16, height: 16, borderRadius: 4, background: C.blue, opacity: o }} />)}
          <span>More</span>
        </div>
      </Card>
    </div>
  );
}

// ─── TIMER ────────────────────────────────────────────────────
const MODES = [{ label: "Focus", mins: 25 }, { label: "Short Break", mins: 5 }, { label: "Long Break", mins: 15 }];

function Timer() {
  const [modeIdx, setModeIdx] = useState(0);
  const [secs, setSecs] = useState(MODES[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useStore("ff_sessions", 0);
  const [custom, setCustom] = useState("");
  const ref = useRef();

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) { clearInterval(ref.current); setRunning(false); if (modeIdx === 0) setSessions(p => p + 1); return 0; }
          return s - 1;
        });
      }, 1000);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);

  const selectMode = (i) => { setRunning(false); setModeIdx(i); setSecs(MODES[i].mins * 60); setCustom(""); };
  const reset = () => { setRunning(false); setSecs((parseInt(custom) || MODES[modeIdx].mins) * 60); };
  const applyCustom = () => { const m = parseInt(custom); if (m > 0) { setRunning(false); setSecs(m * 60); } };
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss2 = String(secs % 60).padStart(2, "0");

  return (
    <div>
      <Card style={{ borderRadius: 40, padding: 50, textAlign: "center", marginBottom: 28 }}>
        <p style={{ color: C.blue, fontWeight: 800, fontSize: "0.72rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          {MODES[modeIdx].label} Session
        </p>
        <div style={{ fontSize: "clamp(60px,16vw,110px)", fontWeight: 800, letterSpacing: -3, background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent", lineHeight: 1.1, margin: "10px 0 24px" }}>
          {mm}:{ss2}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          {MODES.map((m, i) => (
            <button key={i} onClick={() => selectMode(i)} className={modeIdx === i ? "btn-grad" : "btn-ghost"} style={{ padding: "10px 20px", borderRadius: 16, fontSize: "0.85rem" }}>{m.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 18 }}>
          <button className="btn-grad" onClick={() => setRunning(r => !r)}>{running ? "Pause" : "Start Flow"}</button>
          <button className="btn-ghost" onClick={reset}>Reset</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
          <input type="number" placeholder="Custom mins" value={custom} onChange={e => setCustom(e.target.value)} style={{ width: 130, textAlign: "center" }} min="1" />
          <button className="btn-ghost" onClick={applyCustom}>Set</button>
        </div>
      </Card>

      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { label: "SESSIONS TODAY", val: sessions },
          { label: "MINUTES FOCUSED", val: sessions * 25 },
          { label: "HOURS TODAY", val: ((sessions * 25) / 60).toFixed(1) },
        ].map(m => (
          <Card key={m.label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 800, color: C.textMuted, letterSpacing: 1 }}>{m.label}</p>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: 6 }}>{gradText(m.val)}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 16 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 12, fontSize: "0.95rem" }}>Session log</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Array.from({ length: sessions }, (_, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,#1a91d022,#64bc4622)`, border: `1.5px solid #1a91d033`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.blue }}>{i + 1}</div>
          ))}
          {sessions === 0 && <span style={{ fontSize: 13, color: C.textMuted }}>No sessions yet — start the timer!</span>}
        </div>
      </Card>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────
const TABS = [
  { label: "Home",      icon: "🏠" },
  { label: "To-Do",     icon: "📝" },
  { label: "Habits",    icon: "🌿" },
  { label: "Analytics", icon: "📈" },
  { label: "Focus",     icon: "⏱️" },
  { label: "Settings",  icon: "⚙️" },
];

export default function App() {
  const [userName, setUserName] = useStore("ff_username", null);
  const [tab, setTab] = useState(0);
  const [toastMsg, setToastMsg] = useState(null);

  const toast = (msg) => setToastMsg(msg);

  // Show onboarding if no name saved
  if (!userName) return <Onboarding onDone={name => setUserName(name)} />;

  return (
    <>
      <style>{css}</style>
      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
      <div style={{ background: C.bgLight, backgroundImage: `radial-gradient(at 0% 0%, rgba(26,145,208,0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(100,188,70,0.06) 0px, transparent 50%)`, minHeight: "100vh", paddingBottom: 110, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 20px" }}>
          {tab === 0 && <Home userName={userName} setTab={setTab} />}
          {tab === 1 && <Todo />}
          {tab === 2 && <Habits />}
          {tab === 3 && <Analytics />}
          {tab === 4 && <Timer />}
          {tab === 5 && <Settings userName={userName} setUserName={setUserName} toast={toast} />}
        </div>
      </div>
      <nav style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", padding: "10px 22px", borderRadius: 40, display: "flex", gap: 12, boxShadow: "0 15px 40px rgba(0,0,0,0.10)", border: "1px solid rgba(255,255,255,0.5)", zIndex: 1000 }}>
        {TABS.map((t, i) => (
          <button key={i} className={`dock-item${tab === i ? " active" : ""}`} title={t.label} onClick={() => setTab(i)}>
            {t.icon}
          </button>
        ))}
      </nav>
    </>
  );
}