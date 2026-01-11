// src/pages/AdminCatalog.tsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api";
import { uploadImageToR2 } from "../lib/r2Upload";
import { Drawer } from "../components/ui/Drawer";
import { Section } from "../components/ui/Section";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { PartColorForm } from "./AdminCatalog/forms/PartColorForm";

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

function DangerButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        "rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    />
  );
}

/** ---- TYPES THAT MIRROR DJANGO SERIALIZERS ---- */
type Part = {
  id: number;
  part_id: string;
  name: string;
  general_category: string;
  specific_category: string;
};

type PartColor = {
  id: number;
  color_name: string;
  variant: string;
  image_url_1: string | null;
  image_url_2: string | null;
  part: Part; // read-only nested part
};

type SetItem = {
  id: number;
  number: string;
  set_name: string;
  image_url: string | null;
  age: number | null;
  piece_count: number | null;
  theme?: { id: number; name: string; image_url: string | null } | null;
};

function toast(msg: string) {
  // keep it simple; swap to a real toast later
  alert(msg);
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
  useEffect(() => {
  // When working on Part Colors, we need Parts for the dropdown.
  if (tab === "partColors" && parts.length === 0) {
    api
      .get(ENDPOINTS.parts)
      .then((res) => setParts(res.data))
      .catch((e) => {
        console.error(e);
        toast("Failed to load Parts for Part Colors dropdown.");
      });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [tab]);
  useEffect(() => {
    fetchTabData(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (tab === "parts") {
      return parts.filter((p) =>
        `${p.part_id} ${p.name} ${p.general_category} ${p.specific_category}`.toLowerCase().includes(q)
      );
    }
    if (tab === "partColors") {
      return partColors.filter((pc) =>
        `${pc.part?.part_id ?? ""} ${pc.part?.name ?? ""} ${pc.color_name} ${pc.variant}`.toLowerCase().includes(q)
      );
    }
    return sets.filter((s) =>
      `${s.number} ${s.set_name} ${s.theme?.name ?? ""}`.toLowerCase().includes(q)
    );
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
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Catalog Admin</h1>
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
                {loading ? (
                  <span className="text-neutral-500">Loading…</span>
                ) : (
                  <>
                    Showing <span className="font-semibold text-neutral-900">{data.length}</span>
                  </>
                )}
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
                          {tab === "parts" && `${row.part_id} — ${row.name}`}
                          {tab === "partColors" && `${row.part?.part_id ?? "—"} — ${row.color_name}`}
                          {tab === "sets" && `${row.number ?? ""} — ${row.set_name}`}
                        </div>
                        <div className="mt-1 text-xs text-neutral-500">ID: {row.id}</div>
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
                  ))}

                  {!loading && data.length === 0 ? (
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
                    {tab === "parts" && `${row.part_id} — ${row.name}`}
                    {tab === "partColors" && `${row.part?.part_id ?? "—"} — ${row.color_name}`}
                    {tab === "sets" && `${row.number ?? ""} — ${row.set_name}`}
                  </div>
                  <div className="mt-1 text-sm text-neutral-500">
                    {tab === "parts" && `${row.general_category} · ${row.specific_category}`}
                    {tab === "partColors" && (row.part?.name ?? "—")}
                    {tab === "sets" && (row.theme?.name ?? "—")}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                    <span>ID: {row.id}</span>
                    <span className="font-medium text-neutral-900">Tap to edit</span>
                  </div>
                </button>
              ))}

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

/** --------- REUSABLE IMAGE UPLOAD FIELD --------- */
function ImageUploadField({
  label,
  folder,
  value,
  setValue,
}: {
  label: string;
  folder: string; // e.g. "sets" | "parts" | "part-colors"
  value: string;
  setValue: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function onPick(file: File) {
    setUploading(true);
    try {
      const url = await uploadImageToR2(file, folder);
      setValue(url);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Field label={label} hint="Upload to R2, or paste a URL below.">
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            void onPick(file);
          }}
        />
      </Field>

      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border bg-neutral-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className="h-12 w-12 rounded-xl border bg-white object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-neutral-900">Preview</div>
            <div className="text-xs text-neutral-500 truncate">{value}</div>
          </div>
        </div>
      ) : null}

      <Field label="Image URL">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://…" />
      </Field>

      {uploading ? <div className="text-xs text-neutral-500">Uploading…</div> : null}
    </div>
  );
}

/** --------- FORMS THAT MATCH DJANGO SERIALIZERS --------- */

function PartForm({
  mode,
  initial,
  onCancel,
  onSaved,
}: {
  mode: "create" | "edit";
  initial: Part | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);

  // Django fields:
  const [partId, setPartId] = useState(initial?.part_id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [generalCategory, setGeneralCategory] = useState(initial?.general_category ?? "");
  const [specificCategory, setSpecificCategory] = useState(initial?.specific_category ?? "");

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        part_id: partId.trim(),
        name: name.trim(),
        general_category: generalCategory.trim(),
        specific_category: specificCategory.trim(),
      };

      if (!payload.part_id || !payload.name) {
        alert("Part ID and Name are required.");
        return;
      }

      if (mode === "create") {
        await api.post(ENDPOINTS.parts, payload);
      } else if (initial) {
        await api.patch(`${ENDPOINTS.parts}${initial.id}/`, payload);
      }

      onSaved();
    } catch (e: any) {
      console.error(e);
      alert("Save failed. Check required fields + API endpoint.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Section title="Basics" description="These fields mirror the Django serializer.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Part ID (LEGO #)">
            <Input value={partId} onChange={(e) => setPartId(e.target.value)} placeholder="e.g. 3001" />
          </Field>
          <Field label="General Category">
            <Input
              value={generalCategory}
              onChange={(e) => setGeneralCategory(e.target.value)}
              placeholder="e.g. Bricks"
            />
          </Field>
        </div>

        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brick 2 x 4" />
        </Field>

        <Field label="Specific Category">
          <Input
            value={specificCategory}
            onChange={(e) => setSpecificCategory(e.target.value)}
            placeholder="e.g. Standard Bricks"
          />
        </Field>
      </Section>

      <FormFooter mode={mode} onCancel={onCancel} onSave={handleSave} saving={saving} />
    </>
  );
}

function SetForm({
  mode,
  initial,
  onCancel,
  onSaved,
}: {
  mode: "create" | "edit";
  initial: SetItem | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);

  // Django fields:
  const [number, setNumber] = useState(initial?.number ?? "");
  const [setName, setSetName] = useState(initial?.set_name ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [age, setAge] = useState<string>(initial?.age?.toString() ?? "");
  const [pieceCount, setPieceCount] = useState<string>(initial?.piece_count?.toString() ?? "");

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        number: number.trim(),
        set_name: setName.trim(),
        image_url: imageUrl.trim() ? imageUrl.trim() : null,
        age: age.trim() ? Number(age) : null,
        piece_count: pieceCount.trim() ? Number(pieceCount) : null,
        // NOTE: your serializer has theme_id required for write.
        // If you haven't added themes to this UI yet, you can set theme_id server-side
        // or make it optional in serializer. For now we won't send it.
      };

      if (!payload.number || !payload.set_name) {
        alert("Set number and set name are required.");
        return;
      }

      if (mode === "create") {
        await api.post(ENDPOINTS.sets, payload);
      } else if (initial) {
        await api.patch(`${ENDPOINTS.sets}${initial.id}/`, payload);
      }

      onSaved();
    } catch (e: any) {
      console.error(e);
      alert("Save failed. If Django requires theme_id, add Themes tab or make theme optional.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Section title="Set Details" description="Matches Django: number, set_name, age, piece_count.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Set Number">
            <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 21325" />
          </Field>
          <Field label="Age (optional)">
            <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="18" inputMode="numeric" />
          </Field>
        </div>

        <Field label="Set Name">
          <Input value={setName} onChange={(e) => setSetName(e.target.value)} placeholder="Medieval Blacksmith" />
        </Field>

        <Field label="Piece Count (optional)">
          <Input
            value={pieceCount}
            onChange={(e) => setPieceCount(e.target.value)}
            placeholder="2164"
            inputMode="numeric"
          />
        </Field>
      </Section>

      <div className="border-t" />

      <Section title="Image" description="Upload to R2 or paste a URL.">
        <ImageUploadField label="Set Image Upload" folder="sets" value={imageUrl} setValue={setImageUrl} />
      </Section>

      <FormFooter mode={mode} onCancel={onCancel} onSave={handleSave} saving={saving} />
    </>
  );
}
