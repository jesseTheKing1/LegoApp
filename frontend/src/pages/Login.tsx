import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth";
import { useAuth } from "../AuthProvider";

export default function LoginPage() {
  const [username, setUsername] = useState("");
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
      await login(username.trim(), password);
      await refresh();
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Log in to manage your LEGO inventory.
              </p>
            </div>

            <form onSubmit={onSubmit} className="px-6 py-6">
              <div className="grid gap-4">
                {/* Username */}
                <label className="grid gap-1">
                  <span className="text-xs font-medium text-neutral-700">Username</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    autoComplete="username"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                               focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                  />
                </label>

                {/* Password */}
                <label className="grid gap-1">
                  <span className="text-xs font-medium text-neutral-700">Password</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                               focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                  />
                </label>

                {/* Error */}
                {err ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                ) : null}

                {/* Submit */}
                <button
                  disabled={loading}
                  className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white
                             hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in…" : "Login"}
                </button>

                {/* Footer */}
                <div className="text-center text-sm text-neutral-500">
                  No account?{" "}
                  <Link to="/signup" className="font-semibold text-neutral-900 hover:underline">
                    Create one
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Small brand line */}
          <p className="mt-4 text-center text-xs text-neutral-500">
            LEGO Inventory • Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}

