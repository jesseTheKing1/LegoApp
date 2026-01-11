import { useState } from "react";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";
import R2ImageField from "../../../components/R2ImageField";

export function ThemeForm({
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
  const [name, setName] = useState(initial?.name ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? "");

  return (
    <>
      <Section title="Theme" description="Matches ThemeSerializer fields.">
        <Field label="name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
      </Section>

      <div className="border-t" />

      <Section title="Image" description="Upload to R2 and store public URL.">
        <R2ImageField label="image_url" folder="themes" value={image_url} onChange={setImageUrl} />
      </Section>

      <div className="sticky bottom-0 border-t bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <SecondaryButton type="button" onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton type="button" disabled={!!saving} onClick={() => onSubmit({ name, image_url })}>
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
