import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { uploadImageToR2 } from "../../../lib/r2Upload";

type Part = {
  id: number;
  part_id: string;
  name: string;
  general_category: string;
  specific_category: string;
  image_url_1?: string | null; 
};

export function PartForm({
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

  // ✅ start empty (don’t depend on initial here)
  const [imageUrl1, setImageUrl1] = useState("");
  const [partId, setPartId] = useState("");
  const [name, setName] = useState("");
  const [generalCategory, setGeneralCategory] = useState("");
  const [specificCategory, setSpecificCategory] = useState("");

  // ✅ hydrate when switching between edit targets
  useEffect(() => {
  if (mode === "create") {
    setPartId("");
    setName("");
    setGeneralCategory("");
    setSpecificCategory("");
    setImageUrl1(""); // ✅
    return;
  }

  setPartId(initial?.part_id ?? "");
  setName(initial?.name ?? "");
  setGeneralCategory(initial?.general_category ?? "");
  setSpecificCategory(initial?.specific_category ?? "");
  setImageUrl1(initial?.image_url_1 ?? ""); // ✅
}, [mode, initial?.id]);


  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        part_id: partId.trim(),
        name: name.trim(),
        general_category: generalCategory.trim(),
        specific_category: specificCategory.trim(),
        image_url_1: imageUrl1.trim() || null, // ✅
};

      if (!payload.part_id || !payload.name) {
        alert("Part ID and Name are required.");
        return;
      }

      if (mode === "create") {
        await api.post("/admin/parts/", payload);
      } else if (initial) {
        await api.patch(`/admin/parts/${initial.id}/`, payload);
      }

      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Section title="Basics" description="Edit a Part.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Part ID (LEGO #)">
            <Input value={partId} onChange={(e) => setPartId(e.target.value)} />
          </Field>
          <Field label="General Category">
            <Input value={generalCategory} onChange={(e) => setGeneralCategory(e.target.value)} />
          </Field>
        </div>

        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Image URL (optional)">
          <Input
            value={imageUrl1}
            onChange={(e) => setImageUrl1(e.target.value)}
            placeholder="https://.../3001.png"
          />
        </Field>
        <Field label="Specific Category">
          <Input value={specificCategory} onChange={(e) => setSpecificCategory(e.target.value)} />
        </Field>
      </Section>

      {/* reuse your footer component or inline buttons */}
      <div className="sticky bottom-0 border-t bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onCancel} type="button" className="rounded-xl border px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            type="button"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-white"
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </button>
        </div>
      </div>
    </>
  );
}

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

function ImageUploadField({
  label,
  folder,
  value,
  setValue,
}: {
  label: string;
  folder: string;
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
      <Field label={label} hint="Optional. Upload to R2 or paste a URL below.">
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

      <Field label="Image URL (optional)">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://…" />
      </Field>

      <div className="flex items-center justify-between">
        {uploading ? <div className="text-xs text-neutral-500">Uploading…</div> : <div />}
        {value ? (
          <button
            type="button"
            className="text-xs font-semibold text-red-600 hover:underline"
            onClick={() => setValue("")}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
