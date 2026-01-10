import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, login } from "../auth";
import { useAuth } from "../AuthProvider";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { refresh } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signup(username.trim(), email.trim(), password);
      await login(username.trim(), password); // auto-login
      await refresh();
      nav("/");
    } catch (e: any) {
      const data = e?.response?.data;
      setErr(data?.detail || (typeof data === "string" ? data : JSON.stringify(data)) || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 380 }}>
      <h1>Create account</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        {err && <div style={{ color: "crimson" }}>{err}</div>}
        <button disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have one? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
