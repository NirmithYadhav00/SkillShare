import { useState, useEffect } from "react";

// ─── COLORS ───────────────────────────────────────────────────────────────────
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

// ─── GLOBAL CSS (animations + hover states) ───────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@800;900&family=Satoshi:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Satoshi', sans-serif;
    background: ${C.bg};
    color: ${C.text};
    overflow-x: hidden;
  }

  /* subtle grid overlay */
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

  .grad {
    background: linear-gradient(135deg, ${C.a1} 0%, #4eecd4 40%, ${C.a2} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card:hover       { transform: translateY(-5px) !important; }
  .btn-p:hover      { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(0,212,170,0.5) !important; }
  .btn-g:hover      { color: ${C.a1}; border-color: ${C.bAccent}; background: rgba(0,212,170,0.06); }
  .footer-link:hover { color: ${C.a1}; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CHAT_USERS = [
  { initials: "AM", grad: "linear-gradient(135deg,#00d4aa,#00b8d9)", name: "Alex M.",  lastMsg: "Great idea! Let's try it.", online: true  },
  { initials: "SR", grad: "linear-gradient(135deg,#f472b6,#fb923c)", name: "Sara R.",  lastMsg: "Sent you the doc 📎",        online: true  },
  { initials: "JK", grad: "linear-gradient(135deg,#34d399,#22d3ee)", name: "James K.", lastMsg: "How does it work?",           online: false },
  { initials: "PL", grad: "linear-gradient(135deg,#fbbf24,#f87171)", name: "Priya L.", lastMsg: "Thanks for sharing!",         online: true  },
];

const CHAT_MESSAGES = [
  { mine: false, text: "Hey! Have you tried the new knowledge sharing feature?" },
  { mine: true,  text: "Yes! It's super smooth. Love how it works 🚀"           },
  { mine: false, text: "Agreed — the real-time sync is instant!"                },
  { mine: true,  text: "Let's set up a session with the whole team 💡"          },
];

const FEATURES = [
  { icon: "⚡", title: "Real-Time Messaging",  desc: "Instant delivery with zero lag. See replies appear live with typing indicators."      },
  { icon: "🟢", title: "Online Presence",       desc: "Always know who's available. Live status lets you reach the right people instantly."  },
  { icon: "✨", title: "Intuitive Interface",   desc: "Clean, distraction-free UI designed so you focus on ideas, not the app."              },
  { icon: "🔒", title: "Secure Conversations",  desc: "All messages encrypted in transit. Your conversations are private and protected."     },
];

const STEPS = [
  { num: "1", title: "Create your account",      desc: "Sign up in seconds with just your email. No credit card, no friction."              },
  { num: "2", title: "Find & connect",           desc: "Browse users, explore skills, connect with people who share your interests."        },
  { num: "3", title: "Start chatting instantly", desc: "Jump into real-time conversations. Share knowledge and build connections."           },
];

const CTA_AVATARS = [
  ["AM", "linear-gradient(135deg,#00d4aa,#00b8d9)"],
  ["SR", "linear-gradient(135deg,#f472b6,#fb923c)"],
  ["JK", "linear-gradient(135deg,#34d399,#22d3ee)"],
  ["PL", "linear-gradient(135deg,#fbbf24,#f87171)"],
  ["+",  "linear-gradient(135deg,#7c6dfa,#a78bfa)"],
];

// ─── SMALL REUSABLE COMPONENTS (defined OUTSIDE main component) ───────────────

function Avatar({ initials, grad, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.22, fontWeight: 700, color: "#fff",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Logo({ size = 34 }) {
  return (
    <a href="/" style={{
      display: "flex", alignItems: "center", gap: 10,
      fontFamily: "'Cabinet Grotesk', sans-serif",
      fontWeight: 800, fontSize: "1.3rem",
      color: C.text, textDecoration: "none", letterSpacing: "-0.02em",
    }}>
      <div style={{
        width: size, height: size, borderRadius: 9,
        background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 18px rgba(0,212,170,0.35)",
      }}>
        <svg width={size * 0.53} height={size * 0.53} viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#0a0c10" />
        </svg>
      </div>
      Skill Share
    </a>
  );
}

function SectionLabel({ children }) {
  return (
    <span style={{
      display: "block", marginBottom: 14,
      fontSize: "0.75rem", fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      color: C.a1,
    }}>
      {children}
    </span>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: "'Cabinet Grotesk', sans-serif",
      fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.9rem)",
      letterSpacing: "-0.03em", lineHeight: 1.15,
      color: C.text, marginBottom: 14,
    }}>
      {children}
    </h2>
  );
}

function SectionSub({ children }) {
  return (
    <p style={{
      fontSize: "1.05rem", color: C.muted,
      maxWidth: 500, fontWeight: 500, lineHeight: 1.6, marginBottom: 56,
    }}>
      {children}
    </p>
  );
}

// ─── PAGE SECTIONS (defined OUTSIDE main component) ───────────────────────────

function Navbar({ scrolled }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 5%", height: 68,
      background: "rgba(13,15,20,0.88)",
      backdropFilter: "blur(22px)",
      borderBottom: `1px solid ${scrolled ? C.bAccent : C.border}`,
      boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.6)" : "none",
      transition: "all 0.3s",
    }}>
      <Logo />
      <div style={{ display: "flex", gap: 10 }}>
        <a href="/login" className="btn-g" style={{
          padding: "8px 20px", borderRadius: 10,
          fontWeight: 600, fontSize: "0.9rem", color: C.muted,
          border: `1.5px solid ${C.border}`,
          textDecoration: "none", transition: "all 0.2s",
        }}>
          Login
        </a>
        <a href="/Signup" className="btn-p" style={{
          padding: "9px 22px", borderRadius: 10,
          fontWeight: 700, fontSize: "0.9rem", color: "#0a0c10",
          background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
          textDecoration: "none",
          boxShadow: "0 4px 18px rgba(0,212,170,0.3)",
          transition: "all 0.2s",
        }}>
          Sign Up
        </a>
      </div>
    </nav>
  );
}

function HeroSection() {
  const blobs = [
    { w: 560, h: 560, color: "rgba(0,212,170,0.14)",   top: -120, left: -100,   anim: "drift1 13s ease-in-out infinite alternate"         },
    { w: 440, h: 440, color: "rgba(0,184,217,0.12)",   top: 20,   right: -80,   anim: "drift2 15s ease-in-out infinite alternate"         },
    { w: 320, h: 320, color: "rgba(124,109,250,0.15)", bottom: 40, left: "38%", anim: "drift1 11s ease-in-out infinite alternate-reverse" },
  ];

  return (
    <section style={{
      position: "relative", zIndex: 1,
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center",
      padding: "110px 5% 90px",
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

      {/* Live badge */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "5px 16px 5px 9px",
        background: "rgba(0,212,170,0.08)",
        border: "1px solid rgba(0,212,170,0.25)",
        borderRadius: 999, fontSize: "0.78rem", fontWeight: 600, color: C.a1,
        marginBottom: 28, animation: "fadeUp 0.6s ease both",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.a1, animation: "pulse 2s ease infinite" }} />
        Now live — real-time messaging for everyone
      </div>

      {/* Headline */}
      <h1 style={{
        position: "relative", zIndex: 1,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 900, fontSize: "clamp(3rem, 7vw, 5.4rem)",
        letterSpacing: "-0.04em", lineHeight: 1.05,
        color: C.text, marginBottom: 22,
        animation: "fadeUp 0.7s 0.1s ease both",
      }}>
        Connect. Learn. <span className="grad">Share.</span>
      </h1>

      {/* Subtitle */}
      <p style={{
        position: "relative", zIndex: 1,
        fontSize: "clamp(1rem, 2vw, 1.2rem)", color: C.muted,
        maxWidth: 520, marginBottom: 42, fontWeight: 500, lineHeight: 1.65,
        animation: "fadeUp 0.7s 0.2s ease both",
      }}>
        Chat in real-time, exchange ideas, and grow together — all in one beautifully simple platform.
      </p>

      {/* CTA buttons */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
        animation: "fadeUp 0.7s 0.3s ease both",
      }}>
        <a href="/Signup" className="btn-p" style={{
          padding: "14px 32px", borderRadius: 14,
          fontWeight: 700, fontSize: "1rem", color: "#0a0c10",
          background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
          textDecoration: "none",
          boxShadow: "0 6px 28px rgba(0,212,170,0.38)",
          transition: "all 0.22s",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Get Started Free
          <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a href="/login" className="btn-g" style={{
          padding: "13px 28px", borderRadius: 14,
          fontWeight: 600, fontSize: "1rem", color: C.muted,
          background: C.surface, border: `1.5px solid ${C.border}`,
          textDecoration: "none", transition: "all 0.22s",
        }}>
          Sign In
        </a>
      </div>

      {/* Chat mockup */}
      <div style={{
        position: "relative", zIndex: 1,
        marginTop: 68, width: "100%", maxWidth: 800,
        animation: "fadeUp 0.8s 0.4s ease both",
      }}>
        <div style={{
          background: C.surface, borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 80px rgba(0,212,170,0.05)",
          overflow: "hidden",
        }}>
          {/* Window bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "14px 18px", borderBottom: `1px solid ${C.border}`,
            background: "#111318",
          }}>
            {["#ff5f57", "#febc2e", "#27c93f"].map(color => (
              <span key={color} style={{ width: 11, height: 11, borderRadius: "50%", background: color }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: "0.8rem", fontWeight: 600, color: C.dim }}>
              Skill Share — Conversations
            </span>
          </div>

          {/* Sidebar + Chat */}
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", height: 360 }}>

            {/* Sidebar */}
            <div style={{
              borderRight: `1px solid ${C.border}`,
              padding: "16px 12px",
              background: "rgba(13,15,20,0.6)",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: C.dim, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 8px 8px" }}>
                Recent Chats
              </div>
              {CHAT_USERS.map((user, i) => (
                <div key={user.initials} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                  background: i === 0 ? "rgba(0,212,170,0.1)" : "transparent",
                }}>
                  <div style={{ position: "relative" }}>
                    <Avatar initials={user.initials} grad={user.grad} size={32} />
                    {user.online && (
                      <span style={{
                        position: "absolute", bottom: 1, right: 1,
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#22c55e", border: `2px solid ${C.surface}`,
                        boxShadow: "0 0 6px #22c55e",
                      }} />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.text }}>{user.name}</div>
                    <div style={{ fontSize: "0.7rem", color: C.dim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.lastMsg}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat panel */}
            <div style={{ display: "flex", flexDirection: "column", padding: 16, gap: 12, overflow: "hidden" }}>
              {/* Chat header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                <Avatar initials="AM" grad="linear-gradient(135deg,#00d4aa,#00b8d9)" size={28} />
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text }}>Alex M.</div>
                  <div style={{ fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>● Online</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                {CHAT_MESSAGES.map((msg, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 8, alignItems: "flex-end",
                    flexDirection: msg.mine ? "row-reverse" : "row",
                  }}>
                    <Avatar
                      initials={msg.mine ? "ME" : "AM"}
                      grad={msg.mine ? "linear-gradient(135deg,#f472b6,#fb923c)" : "linear-gradient(135deg,#00d4aa,#00b8d9)"}
                      size={24}
                    />
                    <div style={{
                      maxWidth: "72%", padding: "8px 13px",
                      borderRadius: msg.mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      fontSize: "0.78rem", lineHeight: 1.5, fontWeight: msg.mine ? 600 : 500,
                      background: msg.mine ? `linear-gradient(135deg, ${C.a1}, ${C.a2})` : C.s3,
                      color: msg.mine ? "#0a0c10" : C.text,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div style={{
                display: "flex", gap: 8, alignItems: "center",
                padding: "10px 14px", marginTop: 8,
                background: C.s2, borderRadius: 12, border: `1px solid ${C.border}`,
              }}>
                <span style={{ flex: 1, fontSize: "0.75rem", color: C.dim }}>Type a message…</span>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#0a0c10" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#0a0c10" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section style={{ padding: "96px 5%", position: "relative", zIndex: 1 }}>
      <SectionLabel>Why Skill Share</SectionLabel>
      <SectionHeading>Everything you need to<br />communicate & grow</SectionHeading>
      <SectionSub>Built for teams, learners, and creators — in a simple, focused experience.</SectionSub>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        {FEATURES.map(f => (
          <div key={f.title} className="card" style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 18, padding: "32px 28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            transition: "all 0.25s",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, fontSize: "1.4rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
              background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.15)",
            }}>
              {f.icon}
            </div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 10, color: C.text }}>
              {f.title}
            </div>
            <p style={{ fontSize: "0.92rem", color: C.muted, lineHeight: 1.65, fontWeight: 500 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section style={{
      padding: "96px 5%", position: "relative", zIndex: 1,
      background: "linear-gradient(160deg, rgba(0,212,170,0.03), rgba(0,184,217,0.04))",
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
    }}>
      <SectionLabel>How It Works</SectionLabel>
      <SectionHeading>Up and running in<br />three simple steps</SectionHeading>
      <SectionSub>From sign-up to your first conversation in under a minute.</SectionSub>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
        {STEPS.map(step => (
          <div key={step.num} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{
              width: 58, height: 58, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
              color: "#0a0c10",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontWeight: 900, fontSize: "1.3rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 0 24px rgba(0,212,170,0.4), 0 6px 20px rgba(0,0,0,0.4)",
              border: `3px solid ${C.bg}`,
            }}>
              {step.num}
            </div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: "1.08rem", letterSpacing: "-0.02em", marginBottom: 8, color: C.text }}>
              {step.title}
            </div>
            <p style={{ fontSize: "0.9rem", color: C.muted, lineHeight: 1.65, fontWeight: 500 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section style={{
      padding: "96px 5%", position: "relative", zIndex: 1,
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    }}>
      <div style={{
        maxWidth: 580, padding: 64, borderRadius: 28,
        border: `1px solid ${C.bAccent}`,
        background: "linear-gradient(145deg, rgba(0,212,170,0.05), rgba(0,184,217,0.06))",
      }}>
        <h2 style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontWeight: 900, fontSize: "clamp(2rem, 4vw, 2.8rem)",
          letterSpacing: "-0.03em", lineHeight: 1.15,
          color: C.text, marginBottom: 16,
        }}>
          Start your journey with<br /><span className="grad">Skill Share</span> today
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.muted, marginBottom: 36, fontWeight: 500 }}>
          Join thousands already connecting, sharing, and growing together.
        </p>
        <a href="/Signup" className="btn-p" style={{
          padding: "15px 42px", borderRadius: 14,
          fontWeight: 700, fontSize: "1.05rem", color: "#0a0c10",
          background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`,
          textDecoration: "none",
          boxShadow: "0 8px 32px rgba(0,212,170,0.42)",
          transition: "all 0.22s",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Join Now — It's Free
          <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Stacked avatars + count */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, justifyContent: "center" }}>
          <div style={{ display: "flex" }}>
            {CTA_AVATARS.map(([initials, grad], idx) => (
              <div key={initials} style={{
                width: 32, height: 32, borderRadius: "50%",
                background: grad, border: `2px solid ${C.bg}`,
                marginLeft: idx ? -8 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 700, color: "#fff",
              }}>
                {initials}
              </div>
            ))}
          </div>
          <span style={{ fontSize: "0.85rem", color: C.muted, fontWeight: 600 }}>
            <span style={{ color: C.a1 }}>2,400+</span> people already onboard
          </span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = ["Features", "How it works", "Login", "Sign Up", "Privacy", "Terms"];
  return (
    <footer style={{
      padding: "44px 5%", position: "relative", zIndex: 1,
      borderTop: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 20,
    }}>
      <Logo size={28} />
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        {links.map(l => (
          <a key={l} href="#" className="footer-link" style={{
            fontSize: "0.88rem", fontWeight: 500,
            color: C.dim, textDecoration: "none", transition: "color 0.2s",
          }}>
            {l}
          </a>
        ))}
      </div>
      <span style={{ fontSize: "0.82rem", color: C.dim }}>© 2026 Skill Share. All rights reserved.</span>
    </footer>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function SkillShare() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: C.bg,
      color: C.text,
      overflowX: "hidden",
    }}>
      <style>{GLOBAL_CSS}</style>

      <Navbar scrolled={scrolled} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </div>
  );
}