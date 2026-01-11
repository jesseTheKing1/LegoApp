import { useState } from "react";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";
import R2ImageField from "../../../components/R2ImageField";

export function PartColorForm({
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
  // Django PartColor serializer: part_id (FK id), color_name, variant, image_url_1, image_url_2
  const [part_id, setPartId] = useState(initial?.part?.id ?? initial?.part_id ?? "");
  const [color_name, setColorName] = useState(initial?.color_name ?? "");
  const [variant, setVariant] = useState(initial?.variant ?? "");
  const [image_url_1, setImage1] = useState(initial?.image_url_1 ?? "");
  const [image_url_2, setImage2] = useState(initial?.image_url_2 ?? "");

  return (
    <>
      <Section title="Link + Color" description="Matches your Django PartColorSerializer.">
        <Field label="part_id" hint="This is the Part primary key ID (not part_id string).">
          <Input value={part_id} onChange={(e) => setPartId(e.target.value)} />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="color_name">
            <Input value={color_name} onChange={(e) => setColorName(e.target.value)} />
          </Field>
          <Field label="variant">
            <Input value={variant} onChange={(e) => setVariant(e.target.value)} placeholder="Optional" />
          </Field>
        </div>
      </Section>

      <div className="border-t" />

      <Section title="Images" description="Upload both angles to R2.">
        <R2ImageField label="image_url_1" folder="partColors" value={image_url_1} onChange={setImage1} />
        <R2ImageField label="image_url_2" folder="partColors" value={image_url_2} onChange={setImage2} />
      </Section>

      <div className="sticky bottom-0 border-t bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <SecondaryButton type="button" onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton
            type="button"
            disabled={!!saving}
            onClick={() =>
              onSubmit({
                part_id: Number(part_id), // serializer expects PK
                color_name,
                variant,
                image_url_1,
                image_url_2,
              })
            }
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
