import React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        "rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white",
        "hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
    />
  );
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        "rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900",
        "hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
    />
  );
}
