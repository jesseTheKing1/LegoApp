// src/pages/AdminCatalog.tsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

/**
 * Assumes Tailwind is installed.
 * If you already use shadcn/ui, you can swap components easily.
 */

type TabKey = "parts" | "partColors" | "sets";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpointPx);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpointPx]);
  return isMobile;
}

function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cx(
          "fixed inset-0 z-40 bg-black/40 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cx(
          "fixed z-50 bg-white shadow-2xl transition-transform",
          isMobile
            ? "inset-0 rounded-none"
            : "top-0 right-0 h-full w-[520px] max-w-[92vw] rounded-l-2xl",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{title}</h2>
            <p className="text-xs text-neutral-500">Keep it clean. Fewer fields per section.</p>
          </div>
          <button
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className={cx("h-[calc(100%-56px)] overflow-auto", isMobile && "pb-24")}>
          {children}
        </div>
      </div>
    </>
  );
}

function Section({
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

function Field({
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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
      )}
    />
  );
}


function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
      )}
    />
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        "rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white",
        "hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    />
  );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        "rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900",
        "hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    />
  );
}

/** Replace these with real API data */
type Part = { id: number; number: string; name: string; category?: string; image_url?: string };
type PartColor = { id: number; part_number: string; color_name: string; color_hex?: string; partName?: string };
type SetItem = { id: number; title: string; set_number?: string; theme?: string; image_url?: string };

export default function AdminCatalog() {
  const [tab, setTab] = useState<TabKey>("parts");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  // selected rows
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedPartColor, setSelectedPartColor] = useState<PartColor | null>(null);
  const [selectedSet, setSelectedSet] = useState<SetItem | null>(null);

  // dummy lists
  const parts: Part[] = [
    { id: 1, number: "3001", name: "Brick 2 x 4", category: "Bricks", image_url: "" },
    { id: 2, number: "3023", name: "Plate 1 x 2", category: "Plates", image_url: "" },
  ];
  const partColors: PartColor[] = [
    { id: 1, part_number: "3001", color_name: "Red", color_hex: "#c91a09", partName: "Brick 2 x 4" },
    { id: 2, part_number: "3023", color_name: "Black", color_hex: "#1b2a34", partName: "Plate 1 x 2" },
  ];
  const sets: SetItem[] = [
    { id: 1, title: "Police Station", set_number: "10278", theme: "Creator Expert" },
    { id: 2, title: "Medieval Blacksmith", set_number: "21325", theme: "Ideas" },
  ];

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (tab === "parts") {
      return parts.filter((p) => `${p.number} ${p.name} ${p.category ?? ""}`.toLowerCase().includes(q));
    }
    if (tab === "partColors") {
      return partColors.filter((pc) =>
        `${pc.part_number} ${pc.color_name} ${pc.partName ?? ""}`.toLowerCase().includes(q)
      );
    }
    return sets.filter((s) => `${s.set_number ?? ""} ${s.title} ${s.theme ?? ""}`.toLowerCase().includes(q));
  }, [tab, search]);

  function openCreate() {
    setMode("create");
    setSelectedPart(null);
    setSelectedPartColor(null);
    setSelectedSet(null);
    setDrawerOpen(true);
  }

  function openEdit(row: any) {
    setMode("edit");
    if (tab === "parts") setSelectedPart(row);
    if (tab === "partColors") setSelectedPartColor(row);
    if (tab === "sets") setSelectedSet(row);
    setDrawerOpen(true);
  }

  const drawerTitle =
    tab === "parts"
      ? mode === "create"
        ? "New Part"
        : `Edit Part`
      : tab === "partColors"
      ? mode === "create"
        ? "New Part Color"
        : `Edit Part Color`
      : mode === "create"
      ? "New Set"
      : "Edit Set";

  return (
  <AdminLayout>
    {/* Top header */}
    <div className="border-b border-neutral-200 bg-white">
      <div className="px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Catalog Admin
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage Parts, Colors, and Sets with clean create/edit flows.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[360px]">
              <Input
                placeholder={`Search ${tab === "parts" ? "parts" : tab === "partColors" ? "part colors" : "sets"}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <PrimaryButton onClick={openCreate} className="w-full sm:w-auto">
              + New
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>

    {/* Content area */}
    <div className="bg-neutral-50">
      <div className="px-4 sm:px-6 py-6 grid gap-4">
        {/* Tabs / toolbar */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex w-full sm:w-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
              {(["parts", "partColors", "sets"] as TabKey[]).map((k) => (
                <button
                  key={k}
                  className={cx(
                    "flex-1 sm:flex-none rounded-xl px-4 py-2 text-sm font-medium transition",
                    tab === k
                      ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                  onClick={() => {
                    setTab(k);
                    setSearch("");
                  }}
                >
                  {k === "parts" ? "Parts" : k === "partColors" ? "Part Colors" : "Sets"}
                </button>
              ))}
            </div>

            <div className="sm:ml-auto text-sm text-neutral-500">
              Showing <span className="font-semibold text-neutral-900">{data.length}</span>
            </div>
          </div>
        </div>

        {/* Table / Cards */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-neutral-50 text-xs text-neutral-500">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Item</th>
                  <th className="px-6 py-3 text-left font-semibold">Details</th>
                  <th className="px-6 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.map((row: any) => (
                  <tr key={row.id} className="border-t border-neutral-100 hover:bg-neutral-50/70">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">
                        {tab === "parts" && `${row.number} — ${row.name}`}
                        {tab === "partColors" && `${row.part_number} — ${row.color_name}`}
                        {tab === "sets" && `${row.set_number ?? ""} — ${row.title}`}
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">ID: {row.id}</div>
                    </td>

                    <td className="px-6 py-4 text-neutral-700">
                      {tab === "parts" && (
                        <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                          {row.category ?? "—"}
                        </span>
                      )}

                      {tab === "partColors" && (
                        <div className="flex items-center gap-2">
                          <span className="truncate">{row.partName ?? "—"}</span>
                          {row.color_hex ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                              <span
                                className="h-3 w-3 rounded-full border border-neutral-200"
                                style={{ backgroundColor: row.color_hex }}
                              />
                              {row.color_hex}
                            </span>
                          ) : null}
                        </div>
                      )}

                      {tab === "sets" && (
                        <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                          {row.theme ?? "—"}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <SecondaryButton onClick={() => openEdit(row)}>Edit</SecondaryButton>
                        <button className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="text-sm font-semibold text-neutral-900">No results</div>
                      <div className="mt-1 text-sm text-neutral-500">
                        Try a different search or create a new item.
                      </div>
                      <div className="mt-4">
                        <PrimaryButton onClick={openCreate}>+ New</PrimaryButton>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden p-3 grid gap-3">
            {data.map((row: any) => (
              <button
                key={row.id}
                onClick={() => openEdit(row)}
                className="rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]"
              >
                <div className="text-base font-semibold text-neutral-900">
                  {tab === "parts" && `${row.number} — ${row.name}`}
                  {tab === "partColors" && `${row.part_number} — ${row.color_name}`}
                  {tab === "sets" && `${row.set_number ?? ""} — ${row.title}`}
                </div>
                <div className="mt-1 text-sm text-neutral-500">
                  {tab === "parts" && (row.category ?? "—")}
                  {tab === "partColors" && (row.partName ?? "—")}
                  {tab === "sets" && (row.theme ?? "—")}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>ID: {row.id}</span>
                  <span className="font-medium text-neutral-900">Tap to edit</span>
                </div>
              </button>
            ))}

            {data.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
                <div className="text-sm font-semibold text-neutral-900">No results</div>
                <div className="mt-1 text-sm text-neutral-500">
                  Try a different search or create a new item.
                </div>
                <div className="mt-4">
                  <PrimaryButton onClick={openCreate} className="w-full">
                    + New
                  </PrimaryButton>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>

    {/* Drawer */}
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={drawerTitle}>
      {tab === "parts" ? (
        <PartForm mode={mode} initial={selectedPart} onCancel={() => setDrawerOpen(false)} onSave={() => setDrawerOpen(false)} />
      ) : tab === "partColors" ? (
        <PartColorForm mode={mode} initial={selectedPartColor} onCancel={() => setDrawerOpen(false)} onSave={() => setDrawerOpen(false)} />
      ) : (
        <SetForm mode={mode} initial={selectedSet} onCancel={() => setDrawerOpen(false)} onSave={() => setDrawerOpen(false)} />
      )}
    </Drawer>
  </AdminLayout>
);


}

function FormFooter({
  mode,
  onCancel,
  onSave,
  saving,
}: {
  mode: "create" | "edit";
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
}) {
  return (
    <div className="sticky bottom-0 border-t bg-white px-4 py-3">
      <div className="flex items-center justify-end gap-2">
        <SecondaryButton onClick={onCancel} type="button">
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={onSave} disabled={!!saving} type="button">
          {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
        </PrimaryButton>
      </div>
    </div>
  );
}

/** Example forms (wire these to your API) */
function PartForm({
  mode,
  initial,
  onCancel,
  onSave,
}: {
  mode: "create" | "edit";
  initial: any;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [number, setNumber] = useState(initial?.number ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");

  return (
    <>
      <Section title="Basics" description="The 2–3 fields you’ll use every time.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Part Number">
            <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 3001" />
          </Field>
          <Field label="Category">
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Bricks, Plates, Tiles…" />
          </Field>
        </div>
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brick 2 x 4" />
        </Field>
      </Section>

      <div className="border-t" />

      <Section title="Image" description="Use a URL for now; later you can support uploads.">
        <Field label="Image URL" hint="Tip: keep images consistent size/aspect ratio for a premium feel.">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
        </Field>
      </Section>

      <FormFooter mode={mode} onCancel={onCancel} onSave={onSave} />
    </>
  );
}

function PartColorForm({
  mode,
  initial,
  onCancel,
  onSave,
}: {
  mode: "create" | "edit";
  initial: any;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [partNumber, setPartNumber] = useState(initial?.part_number ?? "");
  const [colorName, setColorName] = useState(initial?.color_name ?? "");
  const [colorHex, setColorHex] = useState(initial?.color_hex ?? "");

  return (
    <>
      <Section title="Link + Color" description="Use official LEGO colors consistently.">
        <Field label="Part Number" hint="This should match your Part.number.">
          <Input value={partNumber} onChange={(e) => setPartNumber(e.target.value)} placeholder="e.g. 3001" />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Color Name">
            <Input value={colorName} onChange={(e) => setColorName(e.target.value)} placeholder="Red" />
          </Field>
          <Field label="Color Hex">
            <Input value={colorHex} onChange={(e) => setColorHex(e.target.value)} placeholder="#c91a09" />
          </Field>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border bg-neutral-50 p-3">
          <div
            className="h-10 w-10 rounded-xl border bg-white"
            style={{ backgroundColor: colorHex || "#ffffff" }}
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{colorName || "Preview"}</div>
            <div className="text-xs text-neutral-500 truncate">{colorHex || "No hex yet"}</div>
          </div>
        </div>
      </Section>

      <FormFooter mode={mode} onCancel={onCancel} onSave={onSave} />
    </>
  );
}

function SetForm({
  mode,
  initial,
  onCancel,
  onSave,
}: {
  mode: "create" | "edit";
  initial: any;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [setNumber, setSetNumber] = useState(initial?.set_number ?? "");
  const [theme, setTheme] = useState(initial?.theme ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [notes, setNotes] = useState("");

  return (
    <>
    <AdminLayout children={undefined}>


    </AdminLayout>
      <Section title="Set Details" description="Keep it simple. Add advanced fields later.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Set Number">
            <Input value={setNumber} onChange={(e) => setSetNumber(e.target.value)} placeholder="e.g. 21325" />
          </Field>
          <Field label="Theme">
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ideas, City…" />
          </Field>
        </div>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Medieval Blacksmith" />
        </Field>
      </Section>

      <div className="border-t" />

      <Section title="Media + Notes" description="Optional, but helps polish the catalog.">
        <Field label="Image URL">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="Internal Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything helpful…" rows={4} />
        </Field>
      </Section>

      <FormFooter mode={mode} onCancel={onCancel} onSave={onSave} />
    </>
  );
}

