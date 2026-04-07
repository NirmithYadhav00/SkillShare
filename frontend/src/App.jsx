import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { connectSocket, socket } from "./pages/socket";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import EditProfile from "./pages/EditProfile";

import Sidebar from "./components/sidebar"; 


import ChatPage from "./features/chatPage";
import ChatWindow from "./features/chatWindow";
import EmptyChat from "./features/emptyChats";

// Routes where sidebar should NOT appear
const hiddenRoutes = ["/", "/login", "/signup"];

function Layout() {
  const location = useLocation();
  const showSidebar = !hiddenRoutes.includes(location.pathname.toLowerCase());

  return (
 <div style={{ display: "flex" }}>
  {showSidebar && <Sidebar />}

  <div
    style={{
      marginLeft: showSidebar ? "72px" : "0", // 👈 THIS FIX
      width: "100%",
      minHeight: "100vh",
      background: "#f5f7fa"
    }}
  >        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat-old" element={<Chat />} />
          <Route path="/chat" element={<ChatPage />}>
            <Route index element={<EmptyChat />} />
            <Route path=":id" element={<ChatWindow />} />
          </Route>
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const setupSocket = async () => {
      const connected = await connectSocket();
      if (!connected) return;

      if (userId) {
        socket.emit("register_user", userId);
        console.log("User registered:", userId);
      } else {
        console.log("No userId found");
      }
    };

    setupSocket();
  }, []);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
