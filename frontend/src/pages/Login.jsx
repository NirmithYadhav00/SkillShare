import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login clicked", email, password);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

    localStorage.setItem("token", res.data.token);

    alert("Login successful");
    navigate("/dashboard");
    } catch (error) {
      // clear any previous token just in case
      localStorage.removeItem("token");

      console.log(error);
      alert(error.response?.data?.message || "Login failed");

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