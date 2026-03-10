import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");
function Chat() {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
//console.log("userId:", userId);
  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const room = [userId, id].sort().join("_");

  useEffect(() => {
    socket.emit("join_room", room);
  }, [room]);
//console.log("room:", room);
const sendMessage = () => {
//console.log("receiverId:", id);
  if (!text.trim()) return;

  const messageData = {
    room: room,
    sender: userId,
    receiver: id,
    text: text
  };

  socket.emit("send_message", messageData);

  setText("");

};

  useEffect(() => {

  const handleMessage = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  socket.on("receive_message", handleMessage);

  return () => {
    socket.off("receive_message", handleMessage);
  };

}, []);

useEffect(() => {

  const loadMessages = async () => {

    const res = await fetch(`http://localhost:5000/api/messages/${room}`);

    const data = await res.json();

    setMessages(data);

  };

  loadMessages();

}, [room]);

console.log(messages);
  return (

    <div>

      <Navbar />

      <h2 style={{textAlign:"center"}}>Chat</h2>

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

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>

  );

}const styles = {
  chatBox: {
    border: "1px solid gray",
    height: "300px",
    width: "400px",
    margin: "auto",
    padding: "10px",
    overflowY: "scroll"
  },

message: {
  background: "#e5e5e5",
  color: "#000",
  padding: "10px",
  margin: "5px",
  borderRadius: "8px",
  textAlign: "left",
  fontWeight: "500"
},

  inputBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    gap: "10px"
  }
};

export default Chat;
