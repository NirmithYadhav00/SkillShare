import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";

// ─── COLORS (same as landing page) ───────────────────────────────────────────
const C = {
  bg:      "#0d0f14",
  surface: "#161920",
  s2:      "#1c2028",
  s3:      "#222731",
  a1:      "#00d4aa",
  a2:      "#00b8d9",
  text:    "#eef0f6",
  muted:   "#8b92a8",
  dim:     "#555d74",
  border:  "rgba(255,255,255,0.07)",
  bAccent: "rgba(0,212,170,0.18)",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@800;900&family=Satoshi:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
  }

  body {
    font-family: 'Satoshi', sans-serif;
    background: ${C.bg};
    color: ${C.text};
    overflow-x: hidden;
  }

  /* same grid overlay as landing page */
  body::after {
    content: '';
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes drift1 {
    from { transform: translate(0, 0); }
    to   { transform: translate(28px, 18px); }
  }
  @keyframes drift2 {
    from { transform: translate(0, 0); }
    to   { transform: translate(-18px, 22px); }
  }

  /* Search input */
  .dash-search {
    width: 100%;
    padding: 13px 16px 13px 44px;
    border-radius: 12px;
    border: 1.5px solid ${C.border};
    background: ${C.s2};
    color: ${C.text};
    font-family: 'Satoshi', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .dash-search::placeholder { color: ${C.dim}; }
  .dash-search:focus {
    border-color: ${C.bAccent};
    box-shadow: 0 0 0 3px rgba(0,212,170,0.08);
  }

  /* User cards */
  .user-card {
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: 18px;
    padding: 24px;
    transition: all 0.25s;
    animation: fadeUp 0.5s ease both;
  }
  .user-card:hover {
    transform: translateY(-4px);
    border-color: ${C.bAccent};
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }

  /* Buttons */
  .btn-msg {
    flex: 1;
    padding: 9px 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'Satoshi', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    color: #0a0c10;
    background: linear-gradient(135deg, ${C.a1}, ${C.a2});
    box-shadow: 0 4px 14px rgba(0,212,170,0.3);
    transition: all 0.2s;
  }
  .btn-msg:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,212,170,0.45); }

  .btn-outline {
    flex: 1;
    padding: 9px 12px;
    border-radius: 10px;
    border: 1.5px solid ${C.border};
    cursor: pointer;
    font-family: 'Satoshi', sans-serif;
    font-weight: 600;
    font-size: 0.82rem;
    color: ${C.muted};
    background: ${C.s2};
    transition: all 0.2s;
  }
  .btn-outline:hover { color: ${C.a1}; border-color: ${C.bAccent}; background: rgba(0,212,170,0.06); }

  .btn-logout {
    padding: 9px 22px;
    border-radius: 10px;
    border: 1.5px solid ${C.border};
    cursor: pointer;
    font-family: 'Satoshi', sans-serif;
    font-weight: 600;
    font-size: 0.88rem;
    color: ${C.muted};
    background: transparent;
    transition: all 0.2s;
  }
  .btn-logout:hover { color: #ff5f57; border-color: rgba(255,95,87,0.4); background: rgba(255,95,87,0.06); }

  /* Skill tags */
  .skill-tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    background: rgba(0,212,170,0.1);
    border: 1px solid rgba(0,212,170,0.2);
    color: ${C.a1};
    margin: 2px;
  }
  .skill-tag-want {
    background: rgba(124,109,250,0.1);
    border-color: rgba(124,109,250,0.2);
    color: #a78bfa;
  }
`;

// ─── AVATAR (initials-based) ──────────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg,#00d4aa,#00b8d9)",
  "linear-gradient(135deg,#f472b6,#fb923c)",
  "linear-gradient(135deg,#34d399,#22d3ee)",
  "linear-gradient(135deg,#fbbf24,#f87171)",
  "linear-gradient(135deg,#7c6dfa,#a78bfa)",
  "linear-gradient(135deg,#60a5fa,#818cf8)",
];

function Avatar({ name, size = 44 }) {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const grad = GRADIENTS[name?.charCodeAt(0) % GRADIENTS.length] || GRADIENTS[0];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: grad, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: "#fff",
    }}>
      {initials}
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [users, setUsers]           = useState([]);
  const [search, setSearch]         = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  // fetch users + auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [navigate]);

  // online users via socket
  useEffect(() => {
    socket.on("online-users", (users) => {
      console.log("🟢 Online users:", users);
      setOnlineUsers(users);
    });
    return () => socket.off("online-users");
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredUsers = users.filter((user) =>
    user.skillsOffered?.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // background glow blobs
  const blobs = [
    { w: 500, h: 500, color: "rgba(0,212,170,0.08)",   top: -160, left: -140,  anim: "drift1 13s ease-in-out infinite alternate"         },
    { w: 400, h: 400, color: "rgba(0,184,217,0.07)",   top: 200,  right: -120, anim: "drift2 15s ease-in-out infinite alternate"         },
    { w: 300, h: 300, color: "rgba(124,109,250,0.08)", bottom: 0, left: "50%", anim: "drift1 11s ease-in-out infinite alternate-reverse" },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text, overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Navbar (same as landing page) ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 68,
        background: "rgba(13,15,20,0.88)",
        backdropFilter: "blur(22px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontWeight: 800, fontSize: "1.3rem",
          color: C.text, letterSpacing: "-0.02em",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 18px rgba(0,212,170,0.35)",
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#0a0c10" />
            </svg>
          </div>
          Skill Share
        </div>

        <button onClick={logout} className="btn-logout">Logout</button>
      </nav>

      {/* ── Page body ── */}
      <div style={{ position: "relative", padding: "48px 5% 80px", overflow: "hidden" }}>

        {/* Glow blobs */}
        {blobs.map((b, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            filter: "blur(120px)", pointerEvents: "none",
            width: b.w, height: b.h,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            animation: b.anim,
          }} />
        ))}

        {/* ── Page header ── */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: 40 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 14px 5px 9px",
            background: "rgba(0,212,170,0.08)",
            border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 999, fontSize: "0.75rem", fontWeight: 600, color: C.a1,
            marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.a1 }} />
            {onlineUsers.length} people online now
          </span>

          <h1 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            letterSpacing: "-0.03em", lineHeight: 1.15,
            color: C.text, marginBottom: 8,
          }}>
            Find Teachers &amp; Learners
          </h1>
          <p style={{ fontSize: "1rem", color: C.muted, fontWeight: 500 }}>
            Connect with people who can teach what you want to learn.
          </p>
        </div>

        {/* ── Search bar ── */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480, marginBottom: 48 }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dash-search"
          />
        </div>

        {/* ── User cards grid ── */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {filteredUsers.map((user, idx) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div key={user._id} className="user-card" style={{ animationDelay: `${idx * 0.05}s` }}>

                {/* Card top: avatar + name + status */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar name={user.name} size={44} />
                    {/* online dot */}
                    <span style={{
                      position: "absolute", bottom: 1, right: 1,
                      width: 10, height: 10, borderRadius: "50%",
                      background: isOnline ? "#22c55e" : C.s3,
                      border: `2px solid ${C.surface}`,
                      boxShadow: isOnline ? "0 0 6px #22c55e" : "none",
                    }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: "1rem", color: C.text }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: isOnline ? "#22c55e" : C.dim, fontWeight: 600 }}>
                      {isOnline ? "● Online" : "○ Offline"}
                    </div>
                  </div>
                </div>

                {/* Branch */}
                {user.branch && (
                  <div style={{ fontSize: "0.8rem", color: C.muted, marginBottom: 12, fontWeight: 500 }}>
                    📍 {user.branch}
                  </div>
                )}

                {/* Skills offered */}
                {user.skillsOffered?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.dim, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>
                      Teaches
                    </div>
                    <div>
                      {user.skillsOffered.map(s => (
                        <span key={s} className="skill-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills wanted */}
                {user.skillsWanted?.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.dim, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>
                      Wants to Learn
                    </div>
                    <div>
                      {user.skillsWanted.map(s => (
                        <span key={s} className="skill-tag skill-tag-want">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-msg"     onClick={() => navigate(`/chat/${user._id}`)}>
                    💬 Message
                  </button>
                  <button className="btn-outline" onClick={() => navigate(`/profile/${user._id}`)}>
                    Profile
                  </button>
                  <button className="btn-outline" onClick={() => navigate(`/edit-profile/${user._id}`)}>
                    Edit
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div style={{
            position: "relative", zIndex: 1,
            textAlign: "center", padding: "80px 20px",
            color: C.muted,
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: C.text, marginBottom: 8 }}>
              No results found
            </div>
            <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              Try searching for a different skill.
            </p>
          </div>
        )}

        {/* Existing Navbar component (unchanged) */}
        <Navbar />
      </div>
    </div>
  );
}

export default Dashboard;