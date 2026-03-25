import { useState } from "react";

const CATEGORIES = ["All", "Development", "Design", "Data Science", "Business", "AI & ML", "Photography"];

const COURSES = [
  // { emoji: "⚛️", title: "React for Beginners", instructor: "Sarah Chen", rating: 4.8, students: "12.4k", duration: "48h", tag: "Development", tagColor: "#6366f1", level: "Beginner" },
  // { emoji: "🎨", title: "UI/UX Design Masterclass", instructor: "Marcus Rivera", rating: 4.7, students: "8.9k", duration: "36h", tag: "Design", tagColor: "#f59e0b", level: "Intermediate" },
  // { emoji: "📊", title: "Data Science Bootcamp", instructor: "James Lee", rating: 4.9, students: "15.2k", duration: "60h", tag: "Data Science", tagColor: "#10b981", level: "Advanced" },
  // { emoji: "🤖", title: "AI & Machine Learning", instructor: "Dr. Anika Sharma", rating: 4.9, students: "20.1k", duration: "72h", tag: "AI & ML", tagColor: "#f43f5e", level: "Advanced" },
];

const FEATURES = [
  // { icon: "🎯", title: "Live Interactive Classes", desc: "Join real-time sessions. Ask questions and get instant feedback from instructors." },
  // { icon: "💬", title: "Real-Time Messaging", desc: "Chat with mentors and peers instantly. Study groups and doubt clearing in one place." },
  // { icon: "📜", title: "Verified Certificates", desc: "Industry-recognized certificates upon completion. Showcase skills to top employers." },
  // { icon: "🧠", title: "AI-Powered Learning Path", desc: "Personalized curriculum adapting to your pace, strengths, and career goals." },
  // { icon: "📱", title: "Learn Anywhere", desc: "Access all content on any device. Download lessons for offline learning." },
  // { icon: "🌐", title: "Global Community", desc: "Join 2M+ learners across 150+ countries. Network and grow together." },
];

const MENTORS = [
  // { name: "Sarah Chen", role: "Full-Stack Engineer", avatar: "SC", color: "#6366f1", courses: 12 },
  // { name: "Marcus Rivera", role: "Lead UX Designer", avatar: "MR", color: "#f59e0b", courses: 8 },
  // { name: "Dr. Anika Sharma", role: "ML Researcher", avatar: "AS", color: "#10b981", courses: 15 },
  // { name: "James Lee", role: "Data Scientist", avatar: "JL", color: "#f43f5e", courses: 10 },
];

const STATS = [
  // { value: "50K+", label: "Online Courses" },
  // { value: "2M+", label: "Active Learners" },
  // { value: "500+", label: "Expert Mentors" },
  // { value: "98%", label: "Satisfaction" },
];

function Stars({ r }) {
  return (
    <span style={{ fontSize: "12px", color: "#f59e0b" }}>
      {"★".repeat(Math.floor(r))}<span style={{ color: "#d1d5db" }}>{"★".repeat(5 - Math.floor(r))}</span>
      <span style={{ color: "#6b7280", marginLeft: "4px" }}>{r}</span>
    </span>
  );
}

export default function App() {
  const [cat, setCat] = useState("All");
  const [hovered, setHovered] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    // { u: "Alex K.", a: "AK", c: "#6366f1", t: "Just finished the React module 🚀", time: "2m ago" },
    // { u: "Mentor · Sarah", a: "SC", c: "#10b981", t: "Great work! Keep going 💪", time: "3m ago", mentor: true },
    // { u: "Priya M.", a: "PM", c: "#f59e0b", t: "Can someone explain async/await?", time: "5m ago" },
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs(p => [...p, { u: "You", a: "YO", c: "#6366f1", t: msg, time: "now" }]);
    setMsg("");
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", color: "#111827", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
        input::placeholder { color: #9ca3af; }
        a { text-decoration: none; }
        button { font-family: inherit; cursor: pointer; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .nav-inner, .section-inner {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 768px) {
          .nav-inner, .section-inner { padding: 0 16px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 99, background: "#fff", borderBottom: "1px solid #e5e7eb", height: "60px", display: "flex", alignItems: "center", width: "100%" }}>
        <div className="nav-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#4f46e5", color: "#fff", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>B</span>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>Brain<span style={{ color: "#4f46e5" }}>Link</span></span>
          </div>
          <div style={{ display: "flex", gap: "6px", background: "#f3f4f6", padding: "5px", borderRadius: "10px" }}>
            {["Courses", "Live Classes", "Mentors", "Community"].map(n => (
              <a key={n} href="#" style={{ padding: "6px 14px", borderRadius: "7px", fontSize: 13, fontWeight: 600, color: "#374151", background: "transparent" }}>{n}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ padding: "8px 18px", border: "1.5px solid #4f46e5", background: "#fff", color: "#4f46e5", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Sign In</button>
            <button style={{ padding: "8px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff 100%)", width: "100%" }}>
        <div className="section-inner" style={{ padding: "80px 32px", display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ede9fe", color: "#4f46e5", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 24, letterSpacing: "0.5px" }}>
              <span style={{ width: 6, height: 6, background: "#4f46e5", borderRadius: "50%", animation: "float 1.5s ease-in-out infinite" }} />
              LIVE CLASSES AVAILABLE NOW
            </div>
            <h1 style={{ fontSize: "clamp(38px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-2px", marginBottom: 18 }}>
              Learn Skills That<br /><span style={{ color: "#4f46e5" }}>Actually Matter</span>
            </h1>
            <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
              Where ideas move fast and skills flow freely 
              <br />welcome to Brain Link. The ultimate platform for learning and growth.
            </p>
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <button style={{ padding: "13px 28px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15 }}>Explore Courses →</button>
              <button style={{ padding: "13px 28px", background: "#fff", border: "1.5px solid #e5e7eb", color: "#374151", borderRadius: 10, fontWeight: 600, fontSize: 15 }}>▶ Watch Demo</button>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {STATS.map((s, i) => (
                <div key={i}>
                  <div style={{ fontWeight: 900, fontSize: 22, color: "#4f46e5" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: "1 1 300px", position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, width: 300, boxShadow: "0 20px 60px rgba(79,70,229,0.12)" }}>
              <div style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", borderRadius: 12, padding: "24px", fontSize: 48, textAlign: "center", marginBottom: 14 }}>⚛️</div>
              {/* <div style={{ fontSize: 11, color: "#4f46e5", fontWeight: 700, marginBottom: 4 }}>Google Career Certificates</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10, lineHeight: 1.3 }}>Full-Stack Web Development Bootcamp</div> */}
              <Stars r={4.9} />
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280", margin: "10px 0 14px" }}>
                <span>⏱ 48h</span><span>👥 12.4k</span>
              </div>
              <button style={{ width: "100%", padding: 11, background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Enroll Free →</button>
            </div>
            <div style={{ position: "absolute", top: -12, left: -20, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", animation: "float 4s ease-in-out infinite", fontSize: 12 }}>
              🎓 <div><div style={{ fontWeight: 700 }}>Certificate Earned</div><div style={{ color: "#9ca3af" }}>by 2M+ learners</div></div>
            </div>
            <div style={{ position: "absolute", bottom: 10, right: -16, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", animation: "float 4s ease-in-out infinite 2s", fontSize: 12 }}>
              ⭐ <div><div style={{ fontWeight: 700 }}>4.9 / 5 Rating</div><div style={{ color: "#9ca3af" }}>Avg across courses</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section style={{ width: "100%" }}>
        <div className="section-inner" style={{ padding: "72px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "2px", marginBottom: 6 }}>FEATURED COURSES</p>
              <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, letterSpacing: "-0.5px" }}>Top Picks This Week</h2>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{ padding: "7px 16px", borderRadius: 100, border: "1.5px solid", borderColor: cat === c ? "#4f46e5" : "#e5e7eb", background: cat === c ? "#4f46e5" : "#fff", color: cat === c ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 13 }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {COURSES.map((c, i) => (
              <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", transition: "all 0.25s", transform: hovered === i ? "translateY(-6px)" : "none", boxShadow: hovered === i ? "0 16px 48px rgba(79,70,229,0.12)" : "0 2px 8px rgba(0,0,0,0.05)", background: "#fff" }}>
                <div style={{ background: "linear-gradient(135deg, #ede9fe, #faf5ff)", padding: 28, fontSize: 48, textAlign: "center" }}>{c.emoji}</div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ background: c.tagColor + "22", color: c.tagColor, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{c.tag}</span>
                    <span style={{ fontSize: 11, background: "#f3f4f6", color: "#6b7280", padding: "3px 10px", borderRadius: 100 }}>{c.level}</span>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, lineHeight: 1.35 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>by {c.instructor}</p>
                  <Stars r={c.rating} />
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9ca3af", margin: "10px 0 14px" }}>
                    <span>👥 {c.students}</span><span>⏱ {c.duration}</span>
                  </div>
                  <button style={{ width: "100%", padding: 10, background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Enroll Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#f9fafb", width: "100%" }}>
        <div className="section-inner" style={{ padding: "72px 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "2px", marginBottom: 8, textAlign: "center" }}>PLATFORM</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, textAlign: "center", marginBottom: 8, letterSpacing: "-0.5px" }}>Everything You Need to Grow</h2>
          <p style={{ fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 48 }}>Built for serious learners. Designed for real results.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE CHAT */}
      <section style={{ width: "100%" }}>
        <div className="section-inner" style={{ padding: "72px 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "2px", marginBottom: 8, textAlign: "center" }}>COMMUNITY</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, textAlign: "center", marginBottom: 8, letterSpacing: "-0.5px" }}>Real-Time Classroom Chat</h2>
          <p style={{ fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 40 }}>Ask questions, share insights, and learn together — live.</p>
          <div style={{ maxWidth: 640, margin: "0 auto", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "14px 20px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, background: "#10b981", borderRadius: "50%", display: "inline-block" }} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>Live Session — React Bootcamp</span>
              </div>
              <span style={{ fontSize: 12, color: "#6b7280" }}>🟢 284 online</span>
            </div>
            <div style={{ padding: "16px 20px", maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", ...(m.mentor ? { background: "#f0fdf4", margin: "0 -20px", padding: "8px 20px", borderLeft: "3px solid #10b981" } : {}) }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: m.c + "22", color: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{m.a}</div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: m.c }}>{m.u}</span>
                      {m.mentor && <span style={{ fontSize: 9, fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "2px 6px", borderRadius: 4 }}>MENTOR</span>}
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{m.time}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#374151" }}>{m.t}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10 }}>
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask a question..." style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }} />
              <button onClick={send} style={{ padding: "10px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Send ↑</button>
            </div>
          </div>
        </div>
      </section>

      {/* MENTORS */}
      <section style={{ background: "#f9fafb", width: "100%" }}>
        <div className="section-inner" style={{ padding: "72px 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "2px", marginBottom: 8, textAlign: "center" }}>MENTORS</p>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, textAlign: "center", marginBottom: 40, letterSpacing: "-0.5px" }}>Learn from the Best</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {MENTORS.map((m, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 24, textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: m.color + "22", color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, margin: "0 auto 12px", border: `2px solid ${m.color}44` }}>{m.avatar}</div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>{m.role}</div>
                <div style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 12px", borderRadius: 100, display: "inline-block", color: "#374151", fontWeight: 600 }}>{m.courses} courses</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#4f46e5", width: "100%" }}>
        <div className="section-inner" style={{ padding: "80px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", letterSpacing: "2px", marginBottom: 16 }}>START TODAY</p>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", marginBottom: 14 }}>Your Learning Journey<br />Begins Here</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 36 }}>Join millions of learners. No credit card required for the first 7 days.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <button style={{ padding: "14px 32px", background: "#fff", color: "#4f46e5", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15 }}>Create Free Account</button>
            <button style={{ padding: "14px 32px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 10, fontWeight: 700, fontSize: 15 }}>View All Courses</button>
          </div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["✓ 7-day free trial", "✓ Cancel anytime", "✓ 500+ live courses"].map(b => (
              <span key={b} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111827", width: "100%" }}>
        <div className="section-inner" style={{ padding: "48px 32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: "#4f46e5", color: "#fff", width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>B</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Brain<span style={{ color: "#818cf8" }}>Link</span></span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Empowering minds. Shaping futures.</p>
            </div>
            {[["Platform", ["Courses", "Live Classes", "Certificates", "AI Paths"]],["Company", ["About", "Blog", "Careers", "Press"]],["Support", ["Help Center", "Terms", "Privacy", "Contact"]]].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>{title}</div>
                {links.map(l => <div key={l} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2025 BrainLink, Inc. All rights reserved.</span>
            <div style={{ display: "flex", gap: 14 }}>
              {["𝕏", "in", "f", "▶"].map((icon, i) => <span key={i} style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>{icon}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}