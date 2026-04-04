import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [connectionStatus, setConnectionStatus] = useState("none");
  const isOwnProfile = user ? localStorage.getItem("userId") === String(user._id) : false;
const [connectionId, setConnectionId] = useState(null);

  // ✅ Handle Connect Click
  const handleConnect = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/connections/send/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConnectionStatus("pending"); // instant UI update
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Connection feature is not available yet");
        return;
      }

      console.log(err);
    }
  };
const handleAccept = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/connections/accept/${connectionId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setConnectionStatus("connected");
  } catch (err) {
    console.log(err);
  }
};

const handleReject = () => {
  console.log("Rejected");
};

  // ✅ Load Data
useEffect(() => {
  const loadData = async () => {
    try {
      const userRes = await axios.get(
        `http://localhost:5000/api/users/profile/${id}`
      );
      setUser(userRes.data);

      const token = localStorage.getItem("token");

      const connRes = await axios.get(
        `http://localhost:5000/api/connections/status/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

setConnectionStatus(connRes.data.status);
setConnectionId(connRes.data.connectionId);    } catch (err) {
      console.log(err);
    }
  };

  loadData();
}, [id]);

  // ⏳ Loading State
  if (!user) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.avatarWrapper}>
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.name} style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Skills */}
          <div style={styles.sideSection}>
            <p style={styles.sideLabel}>SKILLS TEACHES</p>
            {user.skillsOffered?.length > 0 ? (
              user.skillsOffered.map((skill, i) => (
                <div key={i} style={styles.skillItem}>
                  <span style={styles.skillDot} />
                  <span style={styles.skillText}>{skill}</span>
                </div>
              ))
            ) : (
              <span style={styles.emptyText}>None listed</span>
            )}
          </div>

          <div style={styles.sideSection}>
            <p style={styles.sideLabel}>SKILLS WANTS</p>
            {user.skillsWanted?.length > 0 ? (
              user.skillsWanted.map((skill, i) => (
                <div key={i} style={styles.skillItem}>
                  <span
                    style={{ ...styles.skillDot, background: "#f59e0b" }}
                  />
                  <span style={styles.skillText}>{skill}</span>
                </div>
              ))
            ) : (
              <span style={styles.emptyText}>None listed</span>
            )}
          </div>
        </aside>

        {/* Main */}
        <main style={styles.main}>
          <div style={styles.profileHeader}>
            <div>
              <h1 style={styles.name}>{user.name}</h1>
              <p style={styles.role}>{user.branch}</p>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actionRow}>
            {!isOwnProfile ? (
              <>
                <button
                  style={styles.messageBtn}
                  onClick={() => navigate(`/chat/${user._id}`)}
                >
                  Send message
                </button>

               {connectionStatus === "none" && (
  <button style={styles.contactBtn} onClick={handleConnect}>
    Connect
  </button>
)}

{connectionStatus === "pending" && (
  <button style={styles.contactBtn} disabled>
    Pending
  </button>
)}

{connectionStatus === "incoming" && (
  <>
    <button style={styles.messageBtn} onClick={handleAccept}>
      Accept
    </button>

    <button style={styles.reportBtn} onClick={handleReject}>
      Reject
    </button>
  </>
)}

{connectionStatus === "connected" && (
  <button style={styles.contactBtn} disabled>
    Connected
  </button>
)}

                <button
                  style={styles.reportBtn}
                  onClick={() => alert("User reported")}
                >
                  Report user
                </button>
              </>
            ) : (
              <button
                style={styles.messageBtn}
                onClick={() => navigate(`/edit-profile/${user._id}`)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={styles.tabRow}>
            <button
              style={activeTab === "about" ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
          </div>

          {/* Info */}
          <div style={styles.aboutGrid}>
            <div style={styles.infoBlock}>
              <p style={styles.infoLabel}>CONTACT INFORMATION</p>
              <div style={styles.infoRow}>
                <span>Email</span>
                <span>{user.email || "—"}</span>
              </div>
            </div>

            <div style={styles.infoBlock}>
              <p style={styles.infoLabel}>BASIC INFORMATION</p>
              <div style={styles.infoRow}>
                <span>Branch</span>
                <span>{user.branch || "—"}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f4ff",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: 12,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 14,
  },
  container: {
    maxWidth: 900,
    margin: "32px auto",
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
    display: "flex",
    overflow: "hidden",
    minHeight: 520,
  },
  sidebar: {
    width: 230,
    minWidth: 230,
    borderRight: "1px solid #f1f5f9",
    padding: "28px 20px",
    background: "#fafbff",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  avatarWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  avatar: {
    width: 130,
    height: 155,
    objectFit: "cover",
    borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
  },
  avatarPlaceholder: {
    width: 130,
    height: 155,
    borderRadius: 10,
    background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 52,
    color: "#fff",
    fontWeight: 700,
    boxShadow: "0 2px 12px rgba(59,130,246,0.3)",
  },
  sideSection: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  sideLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#9ca3af",
    margin: "0 0 4px 0",
    textTransform: "uppercase",
  },
  skillItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  skillDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#3b82f6",
    flexShrink: 0,
  },
  skillText: {
    fontSize: 13.5,
    color: "#374151",
    fontWeight: 500,
  },
  emptyText: {
    fontSize: 12,
    color: "#d1d5db",
    fontStyle: "italic",
  },
  main: {
    flex: 1,
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.3px",
  },
  role: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: 500,
  },
  actionRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  messageBtn: {
    display: "flex",
    alignItems: "center",
    padding: "8px 18px",
    background: "#1d4ed8",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.01em",
    boxShadow: "0 2px 8px rgba(29,78,216,0.25)",
  },
  contactBtn: {
    display: "flex",
    alignItems: "center",
    padding: "8px 18px",
    background: "#eff6ff",
    color: "#3b82f6",
    border: "1.5px solid #bfdbfe",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  reportBtn: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    fontSize: 13,
    cursor: "pointer",
    padding: "8px 6px",
  },
  tabRow: {
    display: "flex",
    borderBottom: "2px solid #f1f5f9",
    gap: 4,
  },
  tab: {
    padding: "8px 16px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
    fontSize: 14,
    fontWeight: 500,
    color: "#9ca3af",
    cursor: "pointer",
  },
  tabActive: {
    padding: "8px 16px",
    background: "none",
    border: "none",
    borderBottom: "2px solid #3b82f6",
    marginBottom: -2,
    fontSize: 14,
    fontWeight: 600,
    color: "#1d4ed8",
    cursor: "pointer",
  },
  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    paddingTop: 4,
  },
  infoBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#9ca3af",
    margin: "0 0 4px 0",
    textTransform: "uppercase",
  },
  infoRow: {
    display: "grid",
    gridTemplateColumns: "80px 1fr",
    gap: 8,
    alignItems: "start",
  },
};

export default Profile;
