import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";

type Part = {
  id: number;
  part_id: string;
  name: string;
  general_category: string;
  specific_category: string;
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
      return;
    }

    setPartId(initial?.part_id ?? "");
    setName(initial?.name ?? "");
    setGeneralCategory(initial?.general_category ?? "");
    setSpecificCategory(initial?.specific_category ?? "");
  }, [mode, initial?.id]);

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
