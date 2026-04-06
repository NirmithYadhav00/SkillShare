import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { connectSocket, socket } from "./socket";

// ─── COLORS (Brain Link Light Theme) ─────────────────────────────────────────
const C = {
  bg:      "#fff",
  surface: "#f8f7f4",
  s2:      "#f0ede6",
  s3:      "#e8f0fe",
  a1:      "#0056d2",
  a2:      "#1a73e8",
  text:    "#1f1f1f",
  muted:   "#5f5f5f",
  dim:     "#9e9e9e",
  border:  "rgba(0,0,0,0.1)",
  bAccent: "rgba(0,86,210,0.18)",
};

// ─── MINIFIED GLOBAL CSS ──────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{width:100%;min-height:100vh;}
  body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes drift{from{transform:translate(0,0)}to{transform:translate(28px,18px)}}
  .dash-search{width:100%;padding:13px 16px 13px 44px;border-radius:12px;border:1.5px solid ${C.border};background:#fff;color:${C.text};font-family:'Inter',sans-serif;font-size:.95rem;outline:none;transition:all .2s;}
  .dash-search::placeholder{color:${C.dim};}
  .dash-search:focus{border-color:${C.bAccent};box-shadow:0 0 0 3px rgba(0,86,210,.08);}
  .user-card{background:#fff;border:1px solid ${C.border};border-radius:14px;padding:24px;transition:all .2s;animation:fadeUp .5s ease both;position:relative;overflow:hidden;}
  .user-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:${C.a1};opacity:0;transition:opacity .2s;}
  .user-card:hover{transform:translateY(-4px);border-color:${C.bAccent};box-shadow:0 10px 30px rgba(0,0,0,.08);}
  .user-card:hover::after{opacity:1;}
  .btn-msg{flex:1;padding:9px 12px;border-radius:10px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:700;font-size:.82rem;color:#fff;background:${C.a1};box-shadow:0 4px 14px rgba(0,86,210,.25);transition:all .2s;}
  .btn-msg:hover{transform:translateY(-1px);background:${C.a2};box-shadow:0 6px 20px rgba(0,86,210,.35);}
  .btn-outline{flex:1;padding:9px 12px;border-radius:10px;border:1.5px solid ${C.border};cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:.82rem;color:${C.muted};background:#fff;transition:all .2s;}
  .btn-outline:hover{color:${C.a1};border-color:${C.bAccent};background:${C.s3};}
  .btn-logout{padding:7px 18px;border-radius:8px;border:1.5px solid ${C.border};cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:.88rem;color:${C.muted};background:transparent;transition:all .2s;}
  .btn-logout:hover{color:#d32f2f;border-color:rgba(211,47,47,.3);background:rgba(211,47,47,.06);}
  .skill-tag{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.72rem;font-weight:600;background:${C.s3};border:1px solid ${C.bAccent};color:${C.a1};margin:2px;}
  .skill-tag-want{background:rgba(124,58,237,.08);border-color:rgba(124,58,237,.18);color:#7c3aed;}
`;

// ─── AVATAR (Brain Link Gradients) ────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg,#0056d2,#1a73e8)",
  "linear-gradient(135deg,#e8505b,#f97316)",
  "linear-gradient(135deg,#059669,#0891b2)",
  "linear-gradient(135deg,#7c3aed,#a78bfa)",
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
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
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
    connectSocket();

    socket.on("online-users", (users) => {
      console.log("🟢 Online users:", users);
      setOnlineUsers(users);
    });
    return () => socket.off("online-users");
  }, []);

const userId = localStorage.getItem("userId");

const filteredUsers = users
  .filter((user) => user._id !== userId) // 🔥 remove yourself
  .filter((user) =>
    user.skillsOffered?.join(" ").toLowerCase().includes(search.toLowerCase())
  );
  // background glow blobs (light theme)
  const blobs = [
    { w: 500, h: 500, color: "rgba(0,86,210,0.05)",   top: -160, left: -140,  anim: "drift 13s ease-in-out infinite alternate" },
    { w: 400, h: 400, color: "rgba(249,115,22,0.04)", top: 200,  right: -120, anim: "drift 15s ease-in-out infinite alternate-reverse" },
    { w: 300, h: 300, color: "rgba(124,58,237,0.05)", bottom: 0, left: "50%", anim: "drift 11s ease-in-out infinite alternate" },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(160deg,#f0f4ff 0%,#fff 55%,#fff8f0 100%)", color: C.text, overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Page body ── */}
      <div style={{ position: "relative", padding: "48px 5% 80px", overflow: "hidden" }}>

        {/* Glow blobs */}
        {blobs.map((b, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none",
            width: b.w, height: b.h, background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom, animation: b.anim,
          }} />
        ))}

        {/* ── Page header ── */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: 40 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px 5px 9px",
            background: C.s3, border: `1px solid ${C.bAccent}`, borderRadius: 999,
            fontSize: "0.75rem", fontWeight: 600, color: C.a1, marginBottom: 16,
          }}>
            
          </span>

          <h1 style={{
            fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            letterSpacing: "-0.03em", lineHeight: 1.15, color: C.text, marginBottom: 8,
          }}>
            Find Friends &amp; Learners
          </h1>
          <p style={{ fontSize: "1rem", color: C.muted, fontWeight: 400 }}>
            Connect with people who can teach what you want to learn.
          </p>
        </div>

        {/* ── Search bar ── */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480, marginBottom: 48 }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search by skill…" value={search} onChange={(e) => setSearch(e.target.value)} className="dash-search" />
        </div>

        {/* ── User cards grid ── */}
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filteredUsers.map((user, idx) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div key={user._id} className="user-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                
                {/* Card top: avatar + name + status */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar name={user.name} size={44} />
                    <span style={{
                      position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%",
                      background: isOnline ? "#22c55e" : C.dim, border: `2px solid #fff`,
                      boxShadow: isOnline ? "0 0 6px rgba(34,197,94,0.4)" : "none",
                    }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "1.05rem", color: C.text }}>{user.name}</div>
                    <div style={{ fontSize: "0.75rem", color: isOnline ? "#22c55e" : C.dim, fontWeight: 600 }}>{isOnline ? "● Online" : "○ Offline"}</div>
                  </div>
                </div>

                {user.branch && <div style={{ fontSize: "0.85rem", color: C.muted, marginBottom: 12, fontWeight: 500 }}>📍 {user.branch}</div>}

                {/* Skills offered */}
                {user.skillsOffered?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.dim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Teaches</div>
                    <div>{user.skillsOffered.map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
                  </div>
                )}

                {/* Skills wanted */}
                {user.skillsWanted?.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.dim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Wants to Learn</div>
                    <div>{user.skillsWanted.map(s => <span key={s} className="skill-tag skill-tag-want">{s}</span>)}</div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
{status === "accepted" && (
  <button>💬 Message</button>
)}                  <button className="btn-outline" onClick={() => navigate(`/profile/${user._id}`)}>Profile</button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "80px 20px", color: C.muted }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "1.2rem", color: C.text, marginBottom: 8 }}>No results found</div>
            <p style={{ fontSize: "0.95rem", fontWeight: 400 }}>Try searching for a different skill.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
