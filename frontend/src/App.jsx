import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/profile";
import EditProfile from "./pages/EditProfile";

function App() {
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