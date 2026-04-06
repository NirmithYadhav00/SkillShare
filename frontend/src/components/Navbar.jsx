import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const styles = {
    navBtn: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "12px 20px",
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "15px 40px",
        background: "#282c34",
        color: "white",
        position: "relative",
      }}
    >

      {/* Hamburger + Dropdown */}
      <div ref={menuRef} style={{ position: "relative" }}>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "5px",
          }}
        >
          <span style={{ width: "25px", height: "3px", background: "white", borderRadius: "2px" }} />
          <span style={{ width: "25px", height: "3px", background: "white", borderRadius: "2px" }} />
          <span style={{ width: "25px", height: "3px", background: "white", borderRadius: "2px" }} />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "45px",
              left: "0",
              background: "#1e2229",
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              minWidth: "180px",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >

            {/* Profile */}
            <Link
              to={`/profile/${userId}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 20px",
                color: "white",
                textDecoration: "none",
                borderBottom: "1px solid #333",
              }}
              onMouseEnter={e => e.target.style.background = "#333"}
              onMouseLeave={e => e.target.style.background = "transparent"}
            >
              👤 Profile
            </Link>

            {/* Edit Profile */}
            {currentUser && (
              <button
                style={styles.navBtn}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/edit-profile/${currentUser._id}`);
                }}
                onMouseEnter={e => e.target.style.background = "#333"}
                onMouseLeave={e => e.target.style.background = "transparent"}
              >
                ✏️ Edit Profile
              </button>
            )}

            {/* Logout */}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 20px",
                background: "none",
                border: "none",
                color: "#ff6b6b",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={e => e.target.style.background = "#333"}
              onMouseLeave={e => e.target.style.background = "transparent"}
            >
              🚪 Logout
            </button>

          </div>
        )}
      </div>

      {/* Brand */}
      <h2 style={{ margin: "0 0 0 20px" }}>Skill Share</h2>

    </div>
  );
}

export default Navbar;