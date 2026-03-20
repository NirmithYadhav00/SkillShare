import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      // ✅ SAFE userId extraction
      const userId =
        data.user?._id || data._id || data.userId;

      if (!userId) {
        console.log("❌ userId not found in response");
        return;
      }

      // ✅ SAVE to localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", data.token);

      console.log("✅ Saved userId:", userId);

      // ✅ Navigate AFTER saving
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>SkillShare</h1>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/">Signup</Link>
      </p>
    </div>
  );
}

export default Login;