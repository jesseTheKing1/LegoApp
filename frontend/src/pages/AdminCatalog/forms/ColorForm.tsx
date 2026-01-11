import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";

type Color = {
  id: number;
  lego_id: number | null;
  name: string;
  hex: string;
  is_transparent?: boolean;
  is_metallic?: boolean;
};

const ENDPOINT = "/admin/colors/";

function isHex(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v.trim());
}

export function ColorForm({
  mode,
  initial,
  onCancel,
  onSaved,
}: {
  mode: "create" | "edit";
  initial: Color | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const [legoId, setLegoId] = useState("");
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");
  const [transparent, setTransparent] = useState(false);
  const [metallic, setMetallic] = useState(false);

  // ✅ Hydrate when editing
  useEffect(() => {
    if (mode === "create") {
      setLegoId("");
      setName("");
      setHex("");
      setTransparent(false);
      setMetallic(false);
      return;
    }

    setLegoId(initial?.lego_id != null ? String(initial.lego_id) : "");
    setName(initial?.name ?? "");
    setHex(initial?.hex ?? "");
    setTransparent(!!initial?.is_transparent);
    setMetallic(!!initial?.is_metallic);
  }, [mode, initial?.id]);

  async function handleSave() {
    const payload = {
      lego_id: legoId.trim() ? Number(legoId) : null,
      name: name.trim(),
      hex: hex.trim(),
      is_transparent: transparent,
      is_metallic: metallic,
    };

    if (!payload.name) {
      alert("Color name is required.");
      return;
    }
    if (payload.hex && !isHex(payload.hex)) {
      alert("Hex must look like #RRGGBB (example: #1B2A34). Leave blank if unknown.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        await api.post(ENDPOINT, payload);
      } else if (initial) {
        await api.patch(`${ENDPOINT}${initial.id}/`, payload);
      }
      onSaved();
    } catch (e: any) {
      console.error(e);
      alert("Save failed. Check API + uniqueness (name/lego_id).");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Section title="Color" description="Add LEGO official colors here (used as dropdown elsewhere).">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="LEGO Color ID (optional)">
            <Input value={legoId} onChange={(e) => setLegoId(e.target.value)} inputMode="numeric" placeholder="e.g. 11" />
          </Field>

          <Field label="Hex (optional)">
            <div className="flex items-center gap-2">
              <div
                className="h-9 w-9 rounded-xl border border-neutral-200"
                style={{ backgroundColor: isHex(hex) ? hex.trim() : "#ffffff" }}
                title={isHex(hex) ? hex.trim() : "No hex"}
              />
              <Input value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#1B2A34" />
            </div>
          </Field>
        </div>

        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Black" />
        </Field>

        <div className="mt-3 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
            Transparent
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={metallic} onChange={(e) => setMetallic(e.target.checked)} />
            Metallic
          </label>
        </div>
      </Section>

      <div className="sticky bottom-0 border-t bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onCancel} type="button" className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            type="button"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </button>
        </div>
      </div>
    </>
  );
}
