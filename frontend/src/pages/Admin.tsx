// src/pages/AdminCatalog.tsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api";
import { Drawer } from "../components/ui/Drawer";
import { Input } from "../components/ui/Input";
import { PartColorForm } from "./AdminCatalog/forms/PartColorForm";
import { Thumb } from "../components/ui/Tumb";
import { SetForm } from "./AdminCatalog/forms/SetForm";
import { PartForm } from "./AdminCatalog/forms/PartForm";
type TabKey = "parts" | "partColors" | "sets";

const ENDPOINTS = {
  parts: "/admin/parts/",
  partColors: "/admin/part-colors/",
  sets: "/admin/sets/",
  themes: "/admin/themes/",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={cx(
        "rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white",
        "hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={cx(
        "rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900",
        "hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
}

function DangerButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={cx(
        "rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
}

/** ---- TYPES THAT MIRROR DJANGO SERIALIZERS ---- */
export type Part = {
  id: number;
  part_id: string;
  name: string;
  general_category: string;
  specific_category: string;
  thumb_url?: string | null; // backend should provide this (recommended)
};

export type PartColor = {
  id: number; // ✅ THIS is the color id you want to manually enter
  color_name: string;
  variant: string;
  image_url_1: string | null;
  image_url_2: string | null;
  thumb_url?: string | null; // backend can provide, otherwise fallback to url1/url2
  part: Part; // read-only nested part
};

export type SetItem = {
  id: number;
  number: string;
  set_name: string;
  image_url: string | null;
  age: number | null;
  piece_count: number | null;
  theme?: { id: number; name: string; image_url: string | null } | null;
};

function toast(msg: string) {
  alert(msg);
}

function getRowThumb(tab: TabKey, row: any): string | null {
  if (tab === "parts") {
    // expects backend field thumb_url; if not present it will show placeholder
    return row.thumb_url ?? null;
  }
  if (tab === "partColors") {
    return row.thumb_url ?? row.image_url_1 ?? row.image_url_2 ?? null;
  }
  // sets
  return row.image_url ?? null;
}

export default function AdminCatalog() {
  const [tab, setTab] = useState<TabKey>("parts");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [loading, setLoading] = useState(false);

  // data
  const [parts, setParts] = useState<Part[]>([]);
  const [partColors, setPartColors] = useState<PartColor[]>([]);
  const [sets, setSets] = useState<SetItem[]>([]);

  // selected rows
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedPartColor, setSelectedPartColor] = useState<PartColor | null>(null);
  const [selectedSet, setSelectedSet] = useState<SetItem | null>(null);

  async function fetchTabData(currentTab: TabKey) {
    setLoading(true);
    try {
      if (currentTab === "parts") {
        const res = await api.get(ENDPOINTS.parts);
        setParts(res.data);
      } else if (currentTab === "partColors") {
        const res = await api.get(ENDPOINTS.partColors);
        setPartColors(res.data);
      } else {
        const res = await api.get(ENDPOINTS.sets);
        setSets(res.data);
      }
    } catch (e: any) {
      console.error(e);
      toast("Failed to load data. Check API endpoints + auth.");
    } finally {
      setLoading(false);
    }
  }

  // Load tab data
  useEffect(() => {
    void fetchTabData(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Ensure Parts are loaded when working with Part Colors (dropdown needs it)
  useEffect(() => {
    if (tab !== "partColors") return;
    if (parts.length > 0) return;

    api
      .get(ENDPOINTS.parts)
      .then((res) => setParts(res.data))
      .catch((e) => {
        console.error(e);
        toast("Failed to load Parts for Part Colors dropdown.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, parts.length]);

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (tab === "parts") {
      return parts.filter((p) =>
        `${p.part_id} ${p.name} ${p.general_category} ${p.specific_category}`.toLowerCase().includes(q)
      );
    }
    if (tab === "partColors") {
      return partColors.filter((pc) =>
        `${pc.part?.part_id ?? ""} ${pc.part?.name ?? ""} ${pc.id ?? ""} ${pc.color_name} ${pc.variant}`
          .toLowerCase()
          .includes(q)
      );
    }
    return sets.filter((s) => `${s.number} ${s.set_name} ${s.theme?.name ?? ""}`.toLowerCase().includes(q));
  }, [tab, search, parts, partColors, sets]);

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

  async function handleDelete(row: any) {
    const ok = confirm("Delete this item? This cannot be undone.");
    if (!ok) return;

    try {
      if (tab === "parts") {
        await api.delete(`${ENDPOINTS.parts}${row.id}/`);
        setParts((prev) => prev.filter((p) => p.id !== row.id));
      } else if (tab === "partColors") {
        await api.delete(`${ENDPOINTS.partColors}${row.id}/`);
        setPartColors((prev) => prev.filter((p) => p.id !== row.id));
      } else {
        await api.delete(`${ENDPOINTS.sets}${row.id}/`);
        setSets((prev) => prev.filter((s) => s.id !== row.id));
      }
    } catch (e) {
      console.error(e);
      toast("Delete failed. Check permissions / endpoint.");
    }
  }

  const drawerTitle =
    tab === "parts"
      ? mode === "create"
        ? "New Part"
        : "Edit Part"
      : tab === "partColors"
      ? mode === "create"
        ? "New Part Color"
        : "Edit Part Color"
      : mode === "create"
      ? "New Set"
      : "Edit Set";

  return (
    <AdminLayout>
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Catalog Admin</h1>
              <p className="mt-1 text-sm text-neutral-500">Manage Parts, Colors, and Sets with clean flows.</p>
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

      {/* Content */}
      <div className="bg-neutral-50">
        <div className="px-4 sm:px-6 py-6 grid gap-4">
          {/* Tabs */}
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
                {loading ? (
                  <span>Loading…</span>
                ) : (
                  <>
                    Showing <span className="font-semibold text-neutral-900">{data.length}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            {/* Desktop table */}
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
                  {data.map((row: any) => {
                    const thumb = getRowThumb(tab, row);
                    return (
                      <tr key={row.id} className="border-t border-neutral-100 hover:bg-neutral-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Thumb src={thumb} alt={tab === "sets" ? row.set_name : tab === "parts" ? row.name : row.color_name} />

                            <div className="min-w-0">
                              <div className="font-medium text-neutral-900 truncate">
                                {tab === "parts" && `${row.part_id} — ${row.name}`}
                                {tab === "partColors" && `${row.part?.part_id ?? "—"} — ${row.color_name}`}
                                {tab === "sets" && `${row.number ?? ""} — ${row.set_name}`}
                              </div>

                              <div className="mt-1 text-xs text-neutral-500">
                                {tab === "partColors" ? (
                                  <>
                                    Color ID: <span className="font-semibold text-neutral-800">{row.id}</span>
                                  </>
                                ) : (
                                  <>ID: {row.id}</>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-neutral-700">
                          {tab === "parts" && (
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                                {row.general_category}
                              </span>
                              <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                                {row.specific_category}
                              </span>
                            </div>
                          )}

                          {tab === "partColors" && (
                            <div className="flex flex-col gap-1">
                              <span className="truncate">{row.part?.name ?? "—"}</span>
                              <span className="text-xs text-neutral-500 truncate">Variant: {row.variant || "—"}</span>
                              <span className="text-xs text-neutral-500 truncate">
                                Img: {row.image_url_1 ? "1" : "—"} / {row.image_url_2 ? "2" : "—"}
                              </span>
                            </div>
                          )}

                          {tab === "sets" && (
                            <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                              {row.theme?.name ?? "—"}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <SecondaryButton onClick={() => openEdit(row)}>Edit</SecondaryButton>
                            <DangerButton onClick={() => handleDelete(row)}>Delete</DangerButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {!loading && data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="text-sm font-semibold text-neutral-900">No results</div>
                        <div className="mt-1 text-sm text-neutral-500">Try a different search or create a new item.</div>
                        <div className="mt-4">
                          <PrimaryButton onClick={openCreate}>+ New</PrimaryButton>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden p-3 grid gap-3">
              {data.map((row: any) => {
                const thumb = getRowThumb(tab, row);
                return (
                  <button
                    key={row.id}
                    onClick={() => openEdit(row)}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <Thumb src={thumb} alt={tab === "sets" ? row.set_name : tab === "parts" ? row.name : row.color_name} />
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-neutral-900 truncate">
                          {tab === "parts" && `${row.part_id} — ${row.name}`}
                          {tab === "partColors" && `${row.part?.part_id ?? "—"} — ${row.color_name}`}
                          {tab === "sets" && `${row.number ?? ""} — ${row.set_name}`}
                        </div>

                        <div className="mt-1 text-sm text-neutral-500 truncate">
                          {tab === "parts" && `${row.general_category} · ${row.specific_category}`}
                          {tab === "partColors" && (row.part?.name ?? "—")}
                          {tab === "sets" && (row.theme?.name ?? "—")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                      {tab === "partColors" ? <span>Color ID: {row.id}</span> : <span>ID: {row.id}</span>}
                      <span className="font-medium text-neutral-900">Tap to edit</span>
                    </div>
                  </button>
                );
              })}

              {!loading && data.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
                  <div className="text-sm font-semibold text-neutral-900">No results</div>
                  <div className="mt-1 text-sm text-neutral-500">Try a different search or create a new item.</div>
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
    <PartForm
      key={`parts-${mode}-${selectedPart?.id ?? "new"}`}
      mode={mode}
      initial={selectedPart}
      onCancel={() => setDrawerOpen(false)}
      onSaved={async () => {
        setDrawerOpen(false);
        await fetchTabData("parts");
      }}
    />
  ) : tab === "partColors" ? (
    <PartColorForm
      key={`partColors-${mode}-${selectedPartColor?.id ?? "new"}`}
      mode={mode}
      initial={selectedPartColor}
      parts={parts}
      onCancel={() => setDrawerOpen(false)}
      onSaved={async () => {
        setDrawerOpen(false);
        await fetchTabData("partColors");
      }}
    />
  ) : (
    <SetForm
      key={`sets-${mode}-${selectedSet?.id ?? "new"}`}
      mode={mode}
      initial={selectedSet}
      onCancel={() => setDrawerOpen(false)}
      onSaved={async () => {
        setDrawerOpen(false);
        await fetchTabData("sets");
      }}
    />
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