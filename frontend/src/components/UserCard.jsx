import { Link } from "react-router-dom";

function UserCard({ user }) {
  return (
    <div style={styles.card}>
      <h3>{user.name}</h3>

      <p><b>Branch:</b> {user.branch}</p>
      <p><b>Year:</b> {user.year}</p>

      <p>
        <b>Teaches:</b> {user.skillsOffered?.join(", ")}
      </p>

      <p>
        <b>Wants:</b> {user.skillsWanted?.join(", ")}
      </p>

      <Link to={`/profile/${user._id}`}>
        <button style={styles.button}>View Profile</button>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "10px",
    width: "250px",
    margin: "10px",
    textAlign: "center"
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    cursor: "pointer"
  }
};

export default UserCard;