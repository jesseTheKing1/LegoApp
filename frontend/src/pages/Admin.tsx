import { useEffect, useState } from "react";
import { fetchMe } from "../auth";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        setAllowed(!!me.is_staff || !!me.is_superuser);
      } catch (e: any) {
        setErr("Not logged in or cannot verify account.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (err) return <div style={{ padding: 24, color: "crimson" }}>{err}</div>;
  if (!allowed) return <div style={{ padding: 24 }}>403 — Admins only</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p>Add/edit: Themes, Sets, Parts, Part Colors</p>

      {/* Next: add forms + tables here */}
    </div>
  );
}
