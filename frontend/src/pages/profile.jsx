import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {

  const { id } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/users/profile/${id}`
        );

        setUser(res.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchUser();

  }, [id]);

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (

    <div style={{textAlign:"center"}}>

      <Navbar />

      <h1>{user.name}</h1>

      <p>Branch: {user.branch}</p>

      <p>Year: {user.year}</p>

      <p>Teaches: {user.skillsOffered?.join(", ")}</p>

      <p>Wants: {user.skillsWanted?.join(", ")}</p>

    </div>

  );

}

export default Profile;