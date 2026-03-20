import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "./pages/socket";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import EditProfile from "./pages/EditProfile";

function App() {

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!socket.connected) {
      socket.connect();
    }

    if (userId) {
      socket.emit("register_user", userId); 
      console.log(" User registered:", userId);
    } else {
      console.log(" No userId found");
    }
  }, []);

  useEffect(() => {
    const handleMessage = (data) => {
      console.log("Incoming message:", data);

    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />

      </Routes>
    </Router>
  );
}

export default App;