import React from "react";

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? <p className="text-xs text-neutral-500">{description}</p> : null}
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}
