import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

<Link to={`/profile/${userId}`}>Profile</Link>

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
      background: "#282c34",
      color: "white"
    }}>

      <h2>🚀 SkillShare</h2>

      <div style={{display:"flex", gap:"20px"}}>

        <Link to="/dashboard" style={{color:"white"}}>Dashboard</Link>

        <Link to="/profile/yourUserId" style={{color:"white"}}>
          Profile
        </Link>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;