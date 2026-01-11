import type { CatalogTabKey } from "../../api/endpoints";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Tabs({
  tab,
  setTab,
}: {
  tab: CatalogTabKey;
  setTab: (t: CatalogTabKey) => void;
}) {
  const items: Array<{ key: CatalogTabKey; label: string }> = [
    { key: "parts", label: "Parts" },
    { key: "partColors", label: "Part Colors" },
    { key: "sets", label: "Sets" },
    { key: "themes", label: "Themes" },
  ];

  return (
    <div className="inline-flex w-full sm:w-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
      {items.map((it) => (
        <button
          key={it.key}
          className={cx(
            "flex-1 sm:flex-none rounded-xl px-4 py-2 text-sm font-medium transition",
            tab === it.key
              ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
              : "text-neutral-600 hover:text-neutral-900"
          )}
          onClick={() => setTab(it.key)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
