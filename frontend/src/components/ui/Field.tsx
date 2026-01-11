import React from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-neutral-700">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-neutral-500">{hint}</span> : null}
    </label>
  );
}
