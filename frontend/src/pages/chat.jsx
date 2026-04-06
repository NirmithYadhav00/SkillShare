import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { connectSocket, socket } from "./socket";

// Colors
const C = {
  bg: "#fff",
  surface: "#f8f7f4",
  s2: "#f0ede6",
  s3: "#e8f0fe",
  a1: "#0056d2",
  a2: "#1a73e8",
  text: "#1f1f1f",
  muted: "#5f5f5f",
  dim: "#9e9e9e",
  border: "rgba(0,0,0,0.1)",
  bAccent: "rgba(0,86,210,0.18)",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{width:100%;min-height:100vh;}
  body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes drift{from{transform:translate(0,0)}to{transform:translate(28px,18px)}}
  .msg-bubble{animation:fadeIn .2s ease both;}
  .chat-input{flex:1;padding:13px 16px;border-radius:12px;border:1.5px solid ${C.border};background:#fff;color:${C.text};font-family:'Inter',sans-serif;font-size:.95rem;outline:none;transition:all .2s;}
  .chat-input::placeholder{color:${C.dim};}
  .chat-input:focus{border-color:${C.bAccent};box-shadow:0 0 0 3px rgba(0,86,210,.08);}
  .btn-send{padding:13px 22px;border-radius:12px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:700;font-size:.95rem;color:#fff;background:${C.a1};box-shadow:0 4px 14px rgba(0,86,210,.25);transition:all .2s;display:flex;align-items:center;gap:6px;}
  .btn-send:hover{transform:translateY(-1px);background:${C.a2};box-shadow:0 6px 20px rgba(0,86,210,.35);}
  .btn-send:active{transform:translateY(0);}
  .chat-messages::-webkit-scrollbar{width:4px;}
  .chat-messages::-webkit-scrollbar-track{background:transparent;}
  .chat-messages::-webkit-scrollbar-thumb{background:${C.s3};border-radius:4px;}
`;

const GRADIENTS = [
  "linear-gradient(135deg,#0056d2,#1a73e8)",
  "linear-gradient(135deg,#e8505b,#f97316)",
  "linear-gradient(135deg,#059669,#0891b2)",
  "linear-gradient(135deg,#7c3aed,#a78bfa)",
];

function Avatar({ seed, size = 30 }) {
  const grad = GRADIENTS[seed?.charCodeAt(0) % GRADIENTS.length] || GRADIENTS[0];
  const initials = seed?.slice(0, 2).toUpperCase() || "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: grad,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 700,
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {initials}
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("none");
  const bottomRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const room = userId && id ? [userId, id].sort().join("_") : "";

  console.log("userId:", userId);
  console.log("chat id:", id);
  console.log("room:", room);

  useEffect(() => {
    const registerUser = async () => {
      if (!userId) return;

      const connected = await connectSocket();
      if (connected) {
        socket.emit("add-user", userId);
      }
    };

    registerUser();
  }, [userId]);

  useEffect(() => {
    if (!room) return;

    const joinRoom = () => {
      console.log("JOINING ROOM:", room);
      socket.emit("join_room", room);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [room]);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!id || !token) {
        setConnectionStatus("none");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/connections/status/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch connection status:", data);
          setConnectionStatus("none");
          return;
        }

        setConnectionStatus(data.status);
      } catch (err) {
        console.error(err);
        setConnectionStatus("none");
      }
    };

    fetchStatus();
  }, [id, token]);

 useEffect(() => {
  const handleMessage = (msg) => {
    console.log("📩 received:", msg);

    setMessages((prev) => {
      if (!Array.isArray(prev)) return [msg];
      return [...prev, msg];
    });
  };

  socket.on("receive_message", handleMessage);

  return () => {
    socket.off("receive_message", handleMessage);
  };
}, []);

useEffect(() => {
  const handleError = (err) => {
    console.log("❌ socket error:", err);
    alert(err.message); // you can style later
  };

  socket.on("message_error", handleError);

  return () => {
    socket.off("message_error", handleError);
  };
}, []);

useEffect(() => {
  const loadMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/messages/${room}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Failed to load messages:", data);
        setMessages([]);
        return;
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessages([]);
    }
  };

  if (room) loadMessages();
}, [room]);useEffect(() => {
  const loadMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/messages/${room}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Failed to load messages:", data);
        setMessages([]);
        return;
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessages([]);
    }
  };

  if (room) loadMessages();
}, [room]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = () => {
  if (!text.trim()) return;

  const messageData = {
    room,
    sender: userId,
    receiver: id,
    text,
  };

  socket.emit("send_message", messageData);
  setText("");
};

  const blobs = [
    { w: 400, h: 400, color: "rgba(0,86,210,0.06)", top: -100, left: -100, anim: "drift 13s ease-in-out infinite alternate" },
    { w: 350, h: 350, color: "rgba(249,115,22,0.05)", top: 200, right: -80, anim: "drift 15s ease-in-out infinite alternate-reverse" },
    { w: 300, h: 300, color: "rgba(124,58,237,0.05)", bottom: 0, left: "45%", anim: "drift 11s ease-in-out infinite alternate" },
  ];
  const statusLabel =
    connectionStatus === "connected"
      ? "Connected"
      : connectionStatus === "pending"
        ? "Request pending"
        : connectionStatus === "incoming"
          ? "Request received"
          : "Not connected";

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "linear-gradient(160deg,#f0f4ff 0%,#fff 55%,#fff8f0 100%)", color: C.text, overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
          height: 68,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(22px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "1.3rem", color: C.text, letterSpacing: "-0.02em" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.a1, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,86,210,0.3)" }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#fff" />
            </svg>
          </div>
          Skill Share
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar seed={id} size={28} />
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: C.text }}>Chat</div>
            <div
              style={{
                fontSize: "0.7rem",
                color: connectionStatus === "connected" ? "#22c55e" : C.muted,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {statusLabel}
            </div>
          </div>
        </div>
        <div style={{ width: 80 }} />
      </nav>

      <div style={{ position: "relative", display: "flex", justifyContent: "center", padding: "40px 5% 40px", minHeight: "calc(100vh - 68px)", overflow: "hidden" }}>
        {blobs.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(120px)",
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

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 680,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            border: `1px solid ${C.border}`,
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            animation: "fadeUp 0.5s ease both",
            height: "calc(100vh - 180px)",
            minHeight: 500,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "14px 18px", borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
            {["#ff5f57", "#febc2e", "#27c93f"].map((color) => (
              <span key={color} style={{ width: 11, height: 11, borderRadius: "50%", background: color }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: "0.8rem", fontWeight: 600, color: C.dim }}>Skill Share - Chat</span>
          </div>

          <div className="chat-messages" style={{ flex: 1, overflowY: "auto", padding: "20px 20px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.dim, textAlign: "center", gap: 12, paddingTop: 40 }}>
                <div style={{ fontSize: "2.5rem" }}>Chat</div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "1.1rem", color: C.text }}>No messages yet</div>
                <p style={{ fontSize: "0.85rem", fontWeight: 500, color: C.muted }}>Say hello and start the conversation!</p>
              </div>
            )}

            {Array.isArray(messages) &&
              messages.map((msg, index) => {
                const senderId = msg.senderId || msg.sender;
                console.log("FULL MSG:", msg);
                console.log("sender field:", msg.sender);
                console.log("computed senderId:", senderId);
                console.log("userId:", userId);

                const isMine = String(senderId) === String(userId);
                const msgText = msg?.text || msg;

                return (
                  <div key={index} className="msg-bubble" style={{ display: "flex", flexDirection: isMine ? "row-reverse" : "row", alignItems: "flex-end", gap: 8 }}>
                    <Avatar seed={isMine ? userId : id} size={28} />
                    <div
                      style={{
                        maxWidth: "68%",
                        padding: "10px 14px",
                        borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        fontSize: "0.9rem",
                        lineHeight: 1.55,
                        fontWeight: 500,
                        background: isMine ? C.a1 : C.surface,
                        color: isMine ? "#fff" : C.text,
                        border: isMine ? "none" : `1px solid ${C.border}`,
                        boxShadow: isMine ? "0 4px 14px rgba(0,86,210,0.2)" : "none",
                      }}
                    >
                      {msgText}
                    </div>
                  </div>
                );
              })}

            <div ref={bottomRef} />
          </div>

         {connectionStatus !== "connected" ? (
  <div style={{
    textAlign: "center",
    padding: "20px",
    color: "#666",
    fontWeight: 600
  }}>
    🔒 You can only message after connecting
  </div>
) : (
  <div style={{
    padding: "14px 16px",
    borderTop: `1px solid ${C.border}`,
    background: "#fff",
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexShrink: 0
  }}>
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage();
      }}
      placeholder="Type a message..."
      className="chat-input"
    />

    <button onClick={sendMessage} className="btn-send">
      Send
    </button>
  </div>
)}
        </div>
      </div>

      <Navbar />
    </div>
  );
}

export default Chat;
