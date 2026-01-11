import { useState } from "react";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";
import R2ImageField from "../../../components/R2ImageField";

export function PartForm({
  mode,
  initial,
  onCancel,
  onSubmit,
  saving,
}: {
  mode: "create" | "edit";
  initial?: any;
  onCancel: () => void;
  onSubmit: (payload: any) => void;
  saving?: boolean;
}) {
  // Django Part fields you showed: part_id, name, general_category, specific_category
  const [part_id, setPartId] = useState(initial?.part_id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [general_category, setGeneralCategory] = useState(initial?.general_category ?? "");
  const [specific_category, setSpecificCategory] = useState(initial?.specific_category ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? ""); // if your model has it

  return (
    <>
      <Section title="Basics" description="Matches your Django PartSerializer fields.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="part_id" hint="Example: 3001">
            <Input value={part_id} onChange={(e) => setPartId(e.target.value)} />
          </Field>
          <Field label="general_category">
            <Input value={general_category} onChange={(e) => setGeneralCategory(e.target.value)} />
          </Field>
        </div>

        <Field label="name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="specific_category">
          <Input value={specific_category} onChange={(e) => setSpecificCategory(e.target.value)} />
        </Field>
      </Section>

      <div className="border-t" />

      <Section title="Image" description="Upload to R2 and store the public URL.">
        <R2ImageField label="image_url" folder="parts" value={image_url} onChange={setImageUrl} />
      </Section>

      <div className="sticky bottom-0 border-t bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <SecondaryButton type="button" onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton
            type="button"
            disabled={!!saving}
            onClick={() =>
              onSubmit({ part_id, name, general_category, specific_category, image_url })
            }
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
