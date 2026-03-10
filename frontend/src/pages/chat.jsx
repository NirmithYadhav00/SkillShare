import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

function Chat() {

  const { id } = useParams(); 

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const userId = localStorage.getItem("userId");

  const room = [userId, id].sort().join("_");

  useEffect(() => {
    socket.emit("join_room", room);
  }, [room]);

const sendMessage = () => {

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
