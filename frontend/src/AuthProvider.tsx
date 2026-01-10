import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, hasToken, logout, type Me } from "./auth";

type AuthState = {
  loading: boolean;
  me: Me | null;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);

  async function refresh() {
    if (!hasToken()) {
      setMe(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMe();
      setMe(data);
    } catch {
      // token invalid / expired
      logout();
      setMe(null);
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    logout();
    setMe(null);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthState>(() => {
    const isAdmin = !!me?.is_staff || !!me?.is_superuser;
    return { loading, me, isAdmin, refresh, signOut };
  }, [loading, me]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
