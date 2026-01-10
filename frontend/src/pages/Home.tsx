import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export default function Home() {
  const { me, isAdmin, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200 px-6 py-6">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              LEGO Inventory
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Track parts, sets, and builds — simple and fast.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {!me ? (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                  <div className="text-sm font-semibold text-neutral-900">You’re not logged in</div>
                  <div className="mt-1 text-sm text-neutral-600">
                    Log in to manage your inventory, or create an account.
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {/* Signed-in banner */}
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
                  <div className="text-sm text-neutral-600">Logged in as</div>
                  <div className="mt-1 text-lg font-semibold text-neutral-900">
                    {me.username}
                  </div>
                  {isAdmin ? (
                    <div className="mt-2 inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                      Admin access
                    </div>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                    >
                      Go to Admin
                    </Link>
                  ) : (
                    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
                      Admin link appears for admin users.
                    </div>
                  )}

                  <button
                    onClick={signOut}
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    Logout
                  </button>
                </div>

                {/* Quick links placeholder */}
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-semibold text-neutral-900">Inventory</div>
                    <div className="mt-1 text-sm text-neutral-500">Browse your parts & colors</div>
                    <div className="mt-3 text-sm text-neutral-400">Coming soon</div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-semibold text-neutral-900">Sets</div>
                    <div className="mt-1 text-sm text-neutral-500">Track sets you own</div>
                    <div className="mt-3 text-sm text-neutral-400">Coming soon</div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-semibold text-neutral-900">Builds</div>
                    <div className="mt-1 text-sm text-neutral-500">See what you can build</div>
                    <div className="mt-3 text-sm text-neutral-400">Coming soon</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-500">
          LEGO Inventory • v0
        </p>
      </div>
    </div>
  );
}

