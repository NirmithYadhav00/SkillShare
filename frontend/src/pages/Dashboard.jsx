import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();

  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>

      <h1>SkillShare Dashboard 🚀</h1>

      <button onClick={logout}>Logout</button>

      <br /><br />

      <input
        type="text"
        placeholder="Search skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          margin: "20px",
          width: "250px",
        }}
      />

      <h2>Available Teachers</h2>

      <Navbar />
      {users
        .filter((user) =>
          user.skillsOffered?.join(" ").toLowerCase().includes(search.toLowerCase())
        )
        .map((user) => (
          <div
            key={user._id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "15px",
              width: "250px",
              display: "inline-block"
            }}
          >
            <h3>{user.name}</h3>

            <p>Branch: {user.branch || "Not added"}</p>

            <p>
              <b>Teaches:</b>{" "}
              {user.skillsOffered?.length
                ? user.skillsOffered.join(", ")
                : "None listed"}
            </p>

            <p>
              <b>Wants to Learn:</b>{" "}
              {user.skillsWanted?.length
                ? user.skillsWanted.join(", ")
                : "None listed"}
            </p>

            <button onClick={() => navigate(`/chat/${user._id}`)}>
              Message
            </button>
            <button onClick={() => navigate(`/profile/${user._id}`)}>
              View Profile
            </button>
            <button onClick={() => navigate(`/edit-profile/${user._id}`)}>
  Edit Profile
</button>
          </div>
        ))}

    </div>

  );
}

export default Dashboard;