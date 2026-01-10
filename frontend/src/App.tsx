import Login from "./pages/Login";

export default function App() {
  const path = window.location.pathname;

  if (path === "/login") return <Login />;

  return (
    <div style={{ padding: 24 }}>
      <h1>Frontend works ✅</h1>
      <p>
        API: {import.meta.env.VITE_API_BASE_URL ?? "(missing VITE_API_BASE_URL)"}
      </p>
      <p>
        Go to: <a href="/login">/login</a>
      </p>
    </div>
  );
}
