// src/layouts/AdminLayout.tsx
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 py-5 sm:py-8">
        {/* Page frame */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

