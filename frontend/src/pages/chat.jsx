import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
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
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
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

  /* message bubbles animate in */
  .msg-bubble { animation: fadeIn 0.2s ease both; }

  /* chat input */
  .chat-input {
    flex: 1;
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
  .chat-input::placeholder { color: ${C.dim}; }
  .chat-input:focus {
    border-color: ${C.bAccent};
    box-shadow: 0 0 0 3px rgba(0,212,170,0.08);
  }

  /* send button */
  .btn-send {
    padding: 13px 22px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-family: 'Satoshi', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    color: #0a0c10;
    background: linear-gradient(135deg, ${C.a1}, ${C.a2});
    box-shadow: 0 4px 16px rgba(0,212,170,0.3);
    transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .btn-send:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(0,212,170,0.45); }
  .btn-send:active { transform: translateY(0); }

  /* scrollbar styling */
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: ${C.s3}; border-radius: 4px; }
`;

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg,#00d4aa,#00b8d9)",
  "linear-gradient(135deg,#f472b6,#fb923c)",
  "linear-gradient(135deg,#34d399,#22d3ee)",
  "linear-gradient(135deg,#fbbf24,#f87171)",
  "linear-gradient(135deg,#7c6dfa,#a78bfa)",
];

function Avatar({ seed, size = 30 }) {
  const grad = GRADIENTS[seed?.charCodeAt(0) % GRADIENTS.length] || GRADIENTS[0];
  const initials = seed?.slice(0, 2).toUpperCase() || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: "#fff",
    }}>
      {initials}
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const bottomRef               = useRef(null);

  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const room   = [String(userId), String(id)].sort().join("_");

  // register user
  useEffect(() => {
    if (userId) socket.emit("add-user", userId);
  }, [userId]);

  // join room
  useEffect(() => {
    if (!userId || !id) return;
    socket.emit("join_room", room);
    console.log("JOINED ROOM:", room);
  }, [userId, id, room]);

  // receive messages
  useEffect(() => {
    const handleMessage = (data) => {
      console.log("📩 RECEIVED:", data);
      setMessages((prev) => [...prev, data]);
    };
    socket.on("receive_message", handleMessage);
    return () => socket.off("receive_message", handleMessage);
  }, []);

  // load old messages
  useEffect(() => {
    const loadMessages = async () => {
      const res  = await fetch(`http://localhost:5000/api/messages/${room}`);
      const data = await res.json();
      setMessages(data);
    };
    if (room) loadMessages();
  }, [room]);

  // auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const messageData = { room, sender: userId, receiver: id, text };
    console.log("Sending:", messageData);
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setText("");
  };

  // background glow blobs
  const blobs = [
    { w: 400, h: 400, color: "rgba(0,212,170,0.08)",   top: -100, left: -100,  anim: "drift1 13s ease-in-out infinite alternate"         },
    { w: 350, h: 350, color: "rgba(0,184,217,0.07)",   top: 200,  right: -80,  anim: "drift2 15s ease-in-out infinite alternate"         },
    { w: 300, h: 300, color: "rgba(124,109,250,0.07)", bottom: 0, left: "45%", anim: "drift1 11s ease-in-out infinite alternate-reverse" },
  ];

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: C.bg, color: C.text, overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 68,
        background: "rgba(13,15,20,0.88)",
        backdropFilter: "blur(22px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
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

        {/* Chat header info in center */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar seed={id} size={28} />
          <div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: C.text }}>
              Chat
            </div>
            <div style={{ fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>● Active now</div>
          </div>
        </div>

        <div style={{ width: 80 }} /> {/* spacer to center the chat header */}
      </nav>

      {/* ── Page body ── */}
      <div style={{
        position: "relative",
        display: "flex", justifyContent: "center",
        padding: "40px 5% 40px",
        minHeight: "calc(100vh - 68px)",
        overflow: "hidden",
      }}>

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

        {/* ── Chat window ── */}
        <div style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 680,
          display: "flex", flexDirection: "column",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.06) inset",
          animation: "fadeUp 0.5s ease both",
          height: "calc(100vh - 180px)",
          minHeight: 500,
        }}>

          {/* Window top bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "14px 18px",
            borderBottom: `1px solid ${C.border}`,
            background: "#111318",
            flexShrink: 0,
          }}>
            {["#ff5f57", "#febc2e", "#27c93f"].map(color => (
              <span key={color} style={{ width: 11, height: 11, borderRadius: "50%", background: color }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: "0.8rem", fontWeight: 600, color: C.dim }}>
              Skill Share — Chat
            </span>
          </div>

          {/* Messages area */}
          <div className="chat-messages" style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px 10px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {messages.length === 0 && (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                color: C.dim, textAlign: "center", gap: 12, paddingTop: 40,
              }}>
                <div style={{ fontSize: "2.5rem" }}>💬</div>
                <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: "1rem", color: C.muted }}>
                  No messages yet
                </div>
                <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>Say hello and start the conversation!</p>
              </div>
            )}

            {messages.map((msg, index) => {
              const isMine = (msg.sender || msg.from) === userId;
              const msgText = msg?.text || msg;

              return (
                <div key={index} className="msg-bubble" style={{
                  display: "flex",
                  flexDirection: isMine ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 8,
                }}>
                  {/* Avatar */}
                  <Avatar seed={isMine ? userId : id} size={28} />

                  {/* Bubble */}
                  <div style={{
                    maxWidth: "68%",
                    padding: "10px 14px",
                    borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: "0.9rem", lineHeight: 1.55,
                    fontWeight: isMine ? 600 : 500,
                    background: isMine
                      ? `linear-gradient(135deg, ${C.a1}, ${C.a2})`
                      : C.s3,
                    color: isMine ? "#0a0c10" : C.text,
                    boxShadow: isMine ? "0 4px 16px rgba(0,212,170,0.2)" : "none",
                  }}>
                    {msgText}
                  </div>
                </div>
              );
            })}

            {/* scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            padding: "14px 16px",
            borderTop: `1px solid ${C.border}`,
            background: C.s2,
            display: "flex", gap: 10, alignItems: "center",
            flexShrink: 0,
          }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Type a message…"
              className="chat-input"
            />
            <button onClick={sendMessage} className="btn-send">
              Send
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0a0c10" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#0a0c10" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Existing Navbar component (unchanged) */}
      <Navbar />
    </div>
  );
}

export default Chat;