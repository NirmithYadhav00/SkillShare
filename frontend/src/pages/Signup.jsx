import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// ─── COLORS (same as landing page) ───────────────────────────────────────────
const C = {
  bg:      "#0d0f14",
  surface: "#161920",
  s2:      "#1c2028",
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
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0   rgba(0,212,170,0.6); }
    50%       { box-shadow: 0 0 0 6px rgba(0,212,170,0);   }
  }
  @keyframes drift1 {
    from { transform: translate(0, 0); }
    to   { transform: translate(28px, 18px); }
  }
  @keyframes drift2 {
    from { transform: translate(0, 0); }
    to   { transform: translate(-18px, 22px); }
  }

  .signup-input {
    width: 100%;
    padding: 13px 16px;
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
  .signup-input::placeholder { color: ${C.dim}; }
  .signup-input:focus {
    border-color: ${C.bAccent};
    box-shadow: 0 0 0 3px rgba(0,212,170,0.08);
  }

  .signup-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-family: 'Satoshi', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #0a0c10;
    background: linear-gradient(135deg, ${C.a1}, ${C.a2});
    box-shadow: 0 6px 24px rgba(0,212,170,0.35);
    transition: all 0.2s;
  }
  .signup-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(0,212,170,0.5);
  }
  .signup-btn:active { transform: translateY(0); }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
function Signup() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  // background glow blobs (same as landing page hero)
  const blobs = [
    { w: 500, h: 500, color: "rgba(0,212,170,0.12)",   top: -160, left: -140,  anim: "drift1 13s ease-in-out infinite alternate"         },
    { w: 400, h: 400, color: "rgba(0,184,217,0.10)",   top: 100,  right: -120, anim: "drift2 15s ease-in-out infinite alternate"         },
    { w: 300, h: 300, color: "rgba(124,109,250,0.12)", bottom: 0, left: "40%", anim: "drift1 11s ease-in-out infinite alternate-reverse" },
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
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontWeight: 800, fontSize: "1.3rem",
          color: C.text, textDecoration: "none", letterSpacing: "-0.02em",
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
        </Link>

        {/* Nav action */}
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/login" style={{
            padding: "8px 20px", borderRadius: 10,
            fontWeight: 600, fontSize: "0.9rem", color: C.muted,
            border: `1.5px solid ${C.border}`,
            textDecoration: "none", transition: "all 0.2s",
          }}>
            Login
          </Link>
        </div>
      </nav>

      {/* ── Page body ── */}
      <div style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "calc(100vh - 68px)",
        padding: "60px 5%",
        overflow: "hidden",
      }}>

        {/* Glow blobs */}
        {blobs.map((b, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            filter: "blur(100px)", pointerEvents: "none",
            width: b.w, height: b.h,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            animation: b.anim,
          }} />
        ))}

        {/* ── Signup card ── */}
        <div style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 420,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 22,
          padding: "44px 40px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.06) inset",
          animation: "fadeUp 0.6s ease both",
        }}>

          {/* Card header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, margin: "0 auto 16px",
              background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(0,212,170,0.4)",
            }}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#0a0c10" />
              </svg>
            </div>
            <h1 style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontWeight: 900, fontSize: "1.8rem",
              letterSpacing: "-0.03em", color: C.text, marginBottom: 6,
            }}>
              Create account
            </h1>
            <p style={{ fontSize: "0.9rem", color: C.muted, fontWeight: 500 }}>
              Join Skill Share and start connecting
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: C.muted, marginBottom: 7, letterSpacing: "0.04em" }}>
                NAME
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="signup-input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: C.muted, marginBottom: 7, letterSpacing: "0.04em" }}>
                EMAIL
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signup-input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: C.muted, marginBottom: 7, letterSpacing: "0.04em" }}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="signup-input"
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <button type="submit" className="signup-btn">
                Sign Up
              </button>
            </div>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.88rem", color: C.muted, fontWeight: 500 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: C.a1, fontWeight: 700, textDecoration: "none" }}>
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;