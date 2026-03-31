import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function EditProfile() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

if (user._id !== id) {
  return <h3>Unauthorized</h3>;
}
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.put(`http://localhost:5000/api/users/profile/${id}`, {
        skillsOffered: skillsOffered.split(","),
        skillsWanted: skillsWanted.split(",")
      });

      navigate(`/profile/${id}`);

    } catch (error) {
      console.log(error);
    }
  };

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