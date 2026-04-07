import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

// â”€â”€â”€ COLORS (Brain Link Light Theme) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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


// â”€â”€â”€ MINIFIED GLOBAL CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{width:100%;min-height:100vh;}
  body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes drift{from{transform:translate(0,0)}to{transform:translate(28px,18px)}}
  .signup-input{width:100%;padding:13px 16px;border-radius:12px;border:1.5px solid ${C.border};background:#fff;color:${C.text};font-family:'Inter',sans-serif;font-size:.95rem;outline:none;transition:all .2s;}
  .signup-input::placeholder{color:${C.dim};}
  .signup-input:focus{border-color:${C.bAccent};box-shadow:0 0 0 3px rgba(0,86,210,.08);}
  .signup-btn{width:100%;padding:13px;border-radius:12px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:700;font-size:1rem;color:#fff;background:${C.a1};box-shadow:0 6px 20px rgba(0,86,210,.25);transition:all .2s;}
  .signup-btn:hover{transform:translateY(-2px);background:${C.a2};box-shadow:0 10px 28px rgba(0,86,210,.35);}
  .signup-btn:active{transform:translateY(0);}
  .btn-outline{padding:8px 20px;border-radius:10px;font-weight:600;font-size:.9rem;color:${C.muted};border:1.5px solid ${C.border};text-decoration:none;transition:all .2s;}
  .btn-outline:hover{color:${C.a1};border-color:${C.bAccent};background:${C.s3};}
`;

function Signup() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        apiUrl("/auth/register"),
        { username, name, email, password }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data._id) {
        localStorage.setItem("userId", res.data._id);
      }

      alert("Signup successful");
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed"
      );
    }
  };

  const blobs = [
    { w: 500, h: 500, color: "rgba(0,86,210,0.05)", top: -160, left: -140, anim: "drift 13s ease-in-out infinite alternate" },
    { w: 400, h: 400, color: "rgba(249,115,22,0.04)", top: 100, right: -120, anim: "drift 15s ease-in-out infinite alternate-reverse" },
    { w: 300, h: 300, color: "rgba(124,58,237,0.05)", bottom: 0, left: "40%", anim: "drift 11s ease-in-out infinite alternate" },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(160deg,#f0f4ff 0%,#fff 55%,#fff8f0 100%)", color: C.text, overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 68,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(22px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "1.3rem",
          color: C.text, textDecoration: "none", letterSpacing: "-0.02em",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: C.a1,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,86,210,0.3)",
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#fff" />
            </svg>
          </div>
          Skill Share
        </Link>
        <Link to="/login" className="btn-outline">Login</Link>
      </nav>

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 68px)", padding: "60px 5%", overflow: "hidden" }}>
        {blobs.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(100px)",
              pointerEvents: "none",
              width: b.w,
              height: b.h,
              background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              animation: b.anim,
            }}
          />
        ))}

        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: 420,
          background: "#fff", border: `1px solid ${C.border}`, borderRadius: 22,
          padding: "44px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, margin: "0 auto 16px",
              background: C.a1, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0,86,210,0.25)",
            }}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#fff" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "1.8rem", letterSpacing: "-0.03em", color: C.text, marginBottom: 6 }}>
              Create account
            </h1>
            <p style={{ fontSize: "0.9rem", color: C.muted, fontWeight: 400 }}>Join Skill Share and start connecting</p>
          </div>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: C.muted, marginBottom: 7, letterSpacing: "0.05em" }}>NAME</label>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="signup-input" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: C.muted, marginBottom: 7, letterSpacing: "0.05em" }}>USERNAME</label>
              <input type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} className="signup-input" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: C.muted, marginBottom: 7, letterSpacing: "0.05em" }}>EMAIL</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="signup-input" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: C.muted, marginBottom: 7, letterSpacing: "0.05em" }}>PASSWORD</label>
              <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" required />
            </div>
            <div style={{ marginTop: 8 }}>
              <button type="submit" className="signup-btn">Sign Up</button>
            </div>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.88rem", color: C.muted, fontWeight: 500 }}>
            Already have an account? <Link to="/login" style={{ color: C.a1, fontWeight: 700, textDecoration: "none" }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
