import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { socket } from "./socket";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  const room = [String(userId), String(id)].sort().join("_");

  // REGISTER USER
  useEffect(() => {
    if (userId) {
      socket.emit("add-user", userId);
    }
  }, [userId]);

  // JOIN ROOM
  useEffect(() => {
    if (!userId || !id) return;

    socket.emit("join_room", room);
    console.log("JOINED ROOM:", room);
  }, [userId, id, room]);

  // SEND MESSAGE (FIXED FUNCTION)
  const sendMessage = () => {
    if (!text.trim()) return;

    const messageData = {
      room,
      sender: userId,
      receiver: id,
      text,
    };

    console.log(" Sending:", messageData);

    socket.emit("send_message", messageData);

    // instant UI update
    setMessages((prev) => [...prev, messageData]);
    setText("");
  };

  // RECEIVE MESSAGE (FIXED)
  useEffect(() => {
    const handleMessage = (data) => {
      console.log("📩 RECEIVED:", data);
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  // LOAD OLD MESSAGES
  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch(`http://localhost:5000/api/messages/${room}`);
      const data = await res.json();
      setMessages(data);
    };

    if (room) loadMessages();
  }, [room]);

  return (
    <div>
      <Navbar />

      <h2 style={{ textAlign: "center" }}>Chat</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            {msg?.text || msg}
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type message..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatBox: {
    border: "1px solid gray",
    height: "300px",
    width: "400px",
    margin: "auto",
    padding: "10px",
    overflowY: "scroll",
  },

  message: {
    background: "#e5e5e5",
    color: "#000",
    padding: "10px",
    margin: "5px",
    borderRadius: "8px",
    textAlign: "left",
    fontWeight: "500",
  },

  inputBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    gap: "10px",
  },
};

export default Chat;