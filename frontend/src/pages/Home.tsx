import { useAuth } from "../AuthProvider";
import { Link } from "react-router-dom";

export default function Home() {
  const { me, isAdmin, signOut } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>

      {!me ? (
        <p>
          <Link to="/login">Login</Link> | <Link to="/signup">Create account</Link>
        </p>
      ) : (
        <>
          <p>Logged in as: <b>{me.username}</b></p>
          <button onClick={signOut}>Logout</button>

          <div style={{ marginTop: 16 }}>
            {isAdmin && <Link to="/admin">Admin</Link>}
          </div>
        </>
      )}
    </div>
  );
}
