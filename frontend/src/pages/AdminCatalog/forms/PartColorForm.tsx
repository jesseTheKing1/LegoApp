import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api";
import { uploadImageToR2 } from "../../../lib/r2Upload";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";

type Part = {
  id: number;       // DB pk
  part_id: string;  // LEGO shape number
  name: string;
  general_category: string;
  specific_category: string;
};

type PartColor = {
  id: number;               // DB pk (auto)
  color_id: number;         // MANUAL "Color ID"
  color_name: string;
  variant: string | null;
  image_url_1: string | null;
  image_url_2: string | null;
  part: Part;               // nested read-only
};

const ENDPOINTS = {
  partColors: "/admin/part-colors/",
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

export function PartColorForm({
  mode,
  initial,
  parts,
  onCancel,
  onSaved,
}: {
  mode: "create" | "edit";
  initial: PartColor | null;
  parts: Part[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const firstPartPk = useMemo(() => parts?.[0]?.id ?? 0, [parts]);

  // REQUIRED: manual color_id (your "Color ID")
  const [colorId, setColorId] = useState<string>(initial?.color_id?.toString?.() ?? "");

  // REQUIRED: part link + color_name
  const [partPk, setPartPk] = useState<number>(initial?.part?.id ?? firstPartPk);
  const [colorName, setColorName] = useState(initial?.color_name ?? "");

  // OPTIONALS
  const [variant, setVariant] = useState(initial?.variant ?? "");
  const [image1, setImage1] = useState(initial?.image_url_1 ?? "");
  const [image2, setImage2] = useState(initial?.image_url_2 ?? "");

  useEffect(() => {
    if (mode === "create" && (!partPk || partPk === 0) && firstPartPk) {
      setPartPk(firstPartPk);
    }
  }, [firstPartPk, mode, partPk]);

  async function handleSave() {
    setSaving(true);
    try {
      const parsedColorId = Number(colorId);

      if (!Number.isFinite(parsedColorId) || parsedColorId <= 0) {
        alert("Color ID is required and must be a positive number.");
        return;
      }
      if (!partPk) {
        alert("Part (shape) is required.");
        return;
      }
      if (!colorName.trim()) {
        alert("Color name is required.");
        return;
      }

      // EXACT serializer match (after you add color_id field)
      const payload = {
        color_id: parsedColorId,         // ✅ manual
        part_id: partPk,                 // ✅ write-only FK
        color_name: colorName.trim(),    // ✅ required
        variant: variant.trim(),         // optional
        image_url_1: image1.trim() ? image1.trim() : null,
        image_url_2: image2.trim() ? image2.trim() : null,
      };

      if (mode === "create") {
        await api.post(ENDPOINTS.partColors, payload);
      } else if (initial) {
        await api.patch(`${ENDPOINTS.partColors}${initial.id}/`, payload);
      }

      onSaved();
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data ? JSON.stringify(e.response.data, null, 2) : e?.message || "Save failed";
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Section
        title="Part Color"
        description="Required: Color ID + Part (shape) + Color Name. Optional: Variant + Images."
      >
        {/* DB id is still real, but not manually entered */}
        {mode === "edit" && initial ? (
          <Field label="DB Row ID (read-only)" hint="Internal database id (auto). Not your manual Color ID.">
            <Input value={String(initial.id)} readOnly />
          </Field>
        ) : null}

        <Field label="Color ID (manual) — required" hint="This is your custom ID for the color row. Must be unique.">
          <Input
            value={colorId}
            onChange={(e) => setColorId(e.target.value)}
            placeholder="e.g. 1001"
            inputMode="numeric"
          />
        </Field>

        <Field label="Part (shape) — required" hint="This links the color row to the base Part shape.">
          <select
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
            value={partPk}
            onChange={(e) => setPartPk(Number(e.target.value))}
            disabled={parts.length === 0}
          >
            {parts.length === 0 ? (
              <option value={0}>Loading parts…</option>
            ) : (
              parts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.part_id} — {p.name}
                </option>
              ))
            )}
          </select>
        </Field>

        <Field label="Color Name — required">
          <Input value={colorName} onChange={(e) => setColorName(e.target.value)} placeholder="Red" />
        </Field>

        <Field label="Variant (optional)">
          <Input value={variant} onChange={(e) => setVariant(e.target.value)} placeholder="print / alt / v2 / etc." />
        </Field>
      </Section>

      <div className="border-t" />

      <Section title="Images (optional)" description="Upload to R2 or paste URLs. Leave blank if you want.">
        <ImageUploadField label="Image 1" folder="part-colors" value={image1} setValue={setImage1} />
        <ImageUploadField label="Image 2" folder="part-colors" value={image2} setValue={setImage2} />
      </Section>

      <FormFooter mode={mode} onCancel={onCancel} onSave={handleSave} saving={saving} />
    </>
  );
}

