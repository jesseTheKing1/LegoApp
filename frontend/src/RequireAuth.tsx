import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loading, me } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!me) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
