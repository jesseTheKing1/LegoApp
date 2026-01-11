import React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100",
        props.className
      )}
    />
  );
}
