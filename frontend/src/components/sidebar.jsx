import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const navItems = [
    {
      label: "Home",
      path: "/dashboard",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Search",
      path: "/search",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      label: "Add Post",
      path: "/add-post",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: "Chat",
      path: "/chat",
      badge: 3,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Alerts",
      path: "/notifications",
      badge: 7,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      label: "Network",
      path: "/network",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <line x1="12" y1="7" x2="5" y2="17" />
          <line x1="12" y1="7" x2="19" y2="17" />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div
      style={{
        width: "72px",
        height: "100vh",
        background: "#1c1f26",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "12px",
        paddingBottom: "16px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#4a90e2",
          letterSpacing: "0.5px",
          marginBottom: "20px",
          textAlign: "center",
          lineHeight: "1.2",
        }}
      >
        Skill<br />Share
      </div>

      {/* Nav Items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          flex: 1,
          width: "100%",
          paddingLeft: "6px",
          paddingRight: "6px",
          boxSizing: "border-box",
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                width: "100%",
                padding: "10px 0",
                borderRadius: "10px",
                textDecoration: "none",
                color: active ? "#4a90e2" : "#6b7280",
                background: active ? "rgba(74,144,226,0.13)" : "transparent",
                position: "relative",
                transition: "background 0.15s, color 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "#c9d1d9";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }
              }}
            >
              {/* Badge */}
              {item.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "7px",
                    right: "10px",
                    background: "#e74c3c",
                    color: "white",
                    fontSize: "9px",
                    fontWeight: "700",
                    borderRadius: "50%",
                    width: "15px",
                    height: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  {item.badge}
                </span>
              )}

              {/* Active left bar indicator */}
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: "-6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "24px",
                    background: "#4a90e2",
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              )}

              {item.icon}
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: active ? "600" : "400",
                  letterSpacing: "0.2px",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div
        style={{
          width: "40px",
          height: "1px",
          background: "rgba(255,255,255,0.08)",
          marginBottom: "12px",
        }}
      />

      {/* Profile Avatar Button */}
      <div
        onClick={() => navigate(`/profile/${userId}`)}
        title="My Profile"
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#4a90e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "700",
          fontSize: "14px",
          cursor: "pointer",
          marginBottom: "10px",
          flexShrink: 0,
          overflow: "hidden",
          border: location.pathname.startsWith("/profile")
            ? "2px solid #4a90e2"
            : "2px solid transparent",
          boxSizing: "border-box",
          transition: "border 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initials
        )}
      </div>

      {/* Logout */}
      <div
        onClick={handleLogout}
        title="Logout"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#6b7280",
          flexShrink: 0,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(231,76,60,0.15)";
          e.currentTarget.style.color = "#e74c3c";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#6b7280";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </div>

    </div>
  );
}

export default Sidebar;