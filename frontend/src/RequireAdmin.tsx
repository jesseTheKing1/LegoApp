import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, me, isAdmin } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!me) return <Navigate to="/login" replace />;
  if (!isAdmin) return <div style={{ padding: 24 }}>403 — Admins only</div>;
  return <>{children}</>;
}
