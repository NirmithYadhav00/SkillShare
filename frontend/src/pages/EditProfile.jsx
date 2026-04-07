import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl } from "../config/api";

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch existing profile data
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || userId !== id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          apiUrl(`/users/profile/${id}`)
        );

        setSkillsOffered(res.data.skillsOffered?.join(", ") || "");
        setSkillsWanted(res.data.skillsWanted?.join(", ") || "");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, userId]);

  // 🔥 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // ❗ Safety check
      if (!token || token === "undefined") {
        alert("You are not logged in properly. Please login again.");
        return;
      }

      await axios.put(
        apiUrl(`/users/profile/${id}`),
        {
          skillsOffered: skillsOffered
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),

          skillsWanted: skillsWanted
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/profile/${id}`);
    } catch (error) {
      console.log(error);
      alert("Update failed. Check console.");
    }
  };

  // 🔒 Unauthorized access
  if (!userId || userId !== id) {
    return (
      <div>
        <Navbar />
        <h3>You are not allowed to edit this profile</h3>
      </div>
    );
  }

  // ⏳ Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Navbar />
        <h3>Loading profile...</h3>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar />

      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Skills you offer (comma separated)"
          value={skillsOffered}
          onChange={(e) => setSkillsOffered(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Skills you want"
          value={skillsWanted}
          onChange={(e) => setSkillsWanted(e.target.value)}
        />

        <br /><br />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
