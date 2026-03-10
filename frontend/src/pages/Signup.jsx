import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      alert(res.data.message);

    } catch (error) {

      alert(error.response?.data?.message || "Signup failed");

    }

  };

  return (

    <div style={{textAlign:"center",marginTop:"100px"}}>

      <h1>SkillShare</h1>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <br/><br/>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button type="submit">Signup</button>

      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

    </div>

  );

}

export default Signup;