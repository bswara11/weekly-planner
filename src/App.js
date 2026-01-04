import { useEffect, useState } from "react";
import "./App.css";
import anyaLow from "./characters/anya/anya_low.jpg";
import anyaMid from "./characters/anya/anya_mid.jpg";
import anyaHigh from "./characters/anya/anya_high.jpg";
import luffyResolve from "./characters/luffy/resolve.jpg";
import luffyVictory from "./characters/luffy/victory.jpg";




const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


export default function App() {
  const [currentWeek, setCurrentWeek] = useState("Week 1");
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");

  const [priority, setPriority] = useState("medium");

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("plannerTasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("plannerTasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!title.trim() || !startTime || !endTime) return;


    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title,
        day,
       time: `${startTime} – ${endTime}`,

        priority,
        completed: false,
        week: currentWeek,
      },
    ]);
    setTitle("");
  }

  function toggleTaskCompletion(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  function getDayProgress(d) {
    const dayTasks = tasks.filter(t => t.week === currentWeek && t.day === d);
    if (!dayTasks.length) return 0;
    return Math.round((dayTasks.filter(t => t.completed).length / dayTasks.length) * 100);
  }

  function getWeeklyProgress() {
    const weekTasks = tasks.filter(t => t.week === currentWeek);
    if (!weekTasks.length) return { total: 0, completed: 0, percent: 0 };
    const completed = weekTasks.filter(t => t.completed).length;
    return { total: weekTasks.length, completed, percent: Math.round((completed / weekTasks.length) * 100) };
  }

  function getCompletionStreak() {
    let streak = 0;
    for (let i = DAYS.length - 1; i >= 0; i--) {
      if (getDayProgress(DAYS[i]) === 100) streak++;
      else break;
    }
    return streak;
  }

  function getAnyaMood() {
  if (theme !== "soft") return null;

  const todayTasks = tasks.filter(
    (task) => task.week === currentWeek && task.day === day
  );

  const completedCount = todayTasks.filter(
    (task) => task.completed
  ).length;

  const totalCount = todayTasks.length;

  if (totalCount === 0) return anyaLow;

  const completionRatio = completedCount / totalCount;

  // 🟢 CLEAR, NON-OVERLAPPING ZONES
  if (completionRatio < 0.4) return anyaLow;     // < 40%
  if (completionRatio < 0.8) return anyaMid;     // 40% – 79%
  return anyaHigh;                               // ≥ 80%
}

function getTodayName() {
  const index = new Date().getDay();
  return DAYS[index === 0 ? 6 : index - 1]; // Sunday fix
}

function getAnyaMessage() {
  const todayTasks = tasks.filter(
    (task) => task.week === currentWeek && task.day === day
  );

  const completed = todayTasks.filter(t => t.completed).length;
  const total = todayTasks.length;

  if (total === 0) return "We can start whenever you’re ready 🌱";

  const ratio = completed / total;

  if (ratio < 0.4) return "It was a tough day… but you showed up.";
  if (ratio < 0.8) return "You’re doing your best. That matters.";
  return "You did great today! 🌷";
}
// LUFFY 
function getLuffyState() {
  if (theme !== "dark") return null;

  const weekTasks = tasks.filter(
    (task) => task.week === currentWeek
  );

  if (weekTasks.length === 0) return null;

  const completed = weekTasks.filter(t => t.completed).length;
  const total = weekTasks.length;

  const ratio = completed / total;

  if (ratio >= 0.8) return "victory";
  if (completed > 0) return "resolve";
  return null; // silence if no effort
}
function getLuffyMessage() {
  const state = getLuffyState();

  if (state === "victory") {
    return "You kept moving forward.";
  }

  if (state === "resolve") {
    return "If I die… at least I tried.";
  }

  return null;
}
function getBarColor(percent) {
  if (theme === "soft") {
    if (percent < 40) return "#e0b4b4";   // soft red
    if (percent < 75) return "#e6d7a3";   // soft yellow
    return "#b7d7c2";                     // soft green
  } else {
    if (percent < 40) return "#7a2e2e";   // dark red
    if (percent < 75) return "#8a7a2e";   // dark gold
    return "#2e7a4f";                     // dark green
  }
}
function getMonthlyProgress() {
  return WEEKS.map((week) => {
    const weekTasks = tasks.filter(
      (task) => task.week === week
    );

    if (weekTasks.length === 0) return 0;

    const completed = weekTasks.filter(
      (task) => task.completed
    ).length;

    return Math.round((completed / weekTasks.length) * 100);
  });
}

function isMentorMode() {
  const monthly = getMonthlyProgress();
  if (monthly.length === 0) return false;

  const avg =
    monthly.reduce((sum, p) => sum + p, 0) / monthly.length;

  return avg < 50;
}
function getAnyaMentorMessage() {
  return "Anya is going to study hard to restore world peace! ";
}
function getLuffyMentorMessage() {
  return "As long as you are alive,there are infinite chances!!";
}


  return (
    <div className={`app ${theme}`} style={{ padding: "20px", position: "relative" }}>

      <button onClick={() => setTheme(theme === "dark" ? "soft" : "dark")}>
        {theme === "dark" ? "🌸 Soft Mode" : "🖤 Dark Mode"}
      </button>
      

      <div className="card" style={{ marginTop: "16px" }}>
  <h2>➕ Add Task</h2>

  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    <input
      placeholder="Task title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <select value={day} onChange={(e) => setDay(e.target.value)}>
      {DAYS.map((d) => (
        <option key={d}>{d}</option>
      ))}
    </select>

    <input
  type="time"
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)}
/>

<span style={{ opacity: 0.6 }}>–</span>

<input
  type="time"
  value={endTime}
  onChange={(e) => setEndTime(e.target.value)}
/>


    <select
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
    >
      <option value="high">🔥 High</option>
      <option value="medium">🟡 Medium</option>
      <option value="low">🟢 Low</option>
    </select>

    <button onClick={addTask}>Add</button>
  </div>
</div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        <div className="card">
          <h2>Weekly Tasks</h2>

          {DAYS.map(d => (
            <div key={d}>
              <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  <strong>
    {d} — {getDayProgress(d)}%
  </strong>

  {theme === "soft" && d === getTodayName() && (
    <img
      src={getAnyaMood()}
      alt="Anya companion"
      className="anya-inline"
    />
  )}
</div>


              <div style={{ height: 6, background: "var(--border)", margin: "6px 0" }}>
                <div style={{ height: "100%", width: `${getDayProgress(d)}%`, background: "var(--accent)" }} />
              </div>

              {tasks.filter(t => t.week === currentWeek && t.day === d).map(t => (
                <div key={t.id} style={{ display: "flex", gap: 6 }}>
                  <input type="checkbox" checked={t.completed} onChange={() => toggleTaskCompletion(t.id)} />
                  <span style={{ textDecoration: t.completed ? "line-through" : "none", flex: 1 }}>
                    [{t.time}] {t.title}
                  </span>
                  <span>{t.priority === "high" ? "🔥" : t.priority === "medium" ? "🟡" : "🟢"}</span>
                  <button onClick={() => deleteTask(t.id)}>✖</button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="card">
            <h2>Weekly Summary</h2>
            <p>{getWeeklyProgress().completed}/{getWeeklyProgress().total} tasks</p>
            <div style={{ height: 8, background: "var(--border)" }}>
              <div style={{ height: "100%", width: `${getWeeklyProgress().percent}%`, background: "var(--accent)" }} />
            </div>
            <p>🔥 Streak: {getCompletionStreak()} days</p>
          </div>

         <div className="card">
  <h2>Monthly Progress</h2>

  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: "16px",
      height: "140px",
      marginTop: "16px",
    }}
  >
    {getMonthlyProgress().map((percent, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: `${percent}px`,
            background: getBarColor(percent),
            borderRadius: "8px",
            transition: "height 0.3s ease",
          }}
        />

        <small style={{ opacity: 0.7 }}>
          {WEEKS[index]}
        </small>

        <small style={{ fontSize: "0.75rem", opacity: 0.6 }}>
          {percent}%
        </small>
      </div>
    ))}
  </div>
</div>
 
<div className="card">
  {theme === "soft" && (
    <>
      <h2>Anya’s Remarks</h2>

      <div className="anya-remarks">
        <img
          src={getAnyaMood()}
          alt="Anya reaction"
          className="anya-remarks-img"
        />
        <p className="anya-text">
          {isMentorMode()
            ? getAnyaMentorMessage()
            : getAnyaMessage()}
        </p>
      </div>

      <textarea
        placeholder="Write how today felt…"
        className="anya-notes"
      />
    </>
  )}

  {theme === "dark" && (
    <>
      <h2>Luffy’s Resolve</h2>

      {getLuffyState() ? (
        <div className="luffy-remarks">
          <img
            src={
              getLuffyState() === "victory"
                ? luffyVictory
                : luffyResolve
            }
            alt="Luffy resolve"
            className="luffy-img"
          />

          <p className="luffy-text">
            {isMentorMode()
              ? getLuffyMentorMessage()
              : getLuffyMessage()}
          </p>
        </div>
      ) : (
        <p className="luffy-silent">
          …
        </p>
      )}
    </>
  )}
</div>


        </div>
      </div>
    </div>
  );
}
