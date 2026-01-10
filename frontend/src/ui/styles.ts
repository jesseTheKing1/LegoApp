// src/ui/styles.ts
export const ui = {
  page: "min-h-screen bg-[rgb(var(--bg))] text-neutral-900",
  container: "mx-auto max-w-6xl px-4",

  card: "rounded-2xl border border-neutral-200 bg-white shadow-sm",
  cardHeader: "border-b px-4 py-3",
  cardTitle: "text-sm font-semibold",
  cardBody: "p-4",

  pill: "rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700",

  input:
    "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none " +
    "focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100",

  textarea:
    "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none " +
    "focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100",

  select:
    "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none " +
    "focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100",

  btnPrimary:
    "rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white " +
    "hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50",

  btnSecondary:
    "rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 " +
    "hover:bg-neutral-50 active:scale-[0.99]",

  btnDanger:
    "rounded-xl px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.99]",
};
