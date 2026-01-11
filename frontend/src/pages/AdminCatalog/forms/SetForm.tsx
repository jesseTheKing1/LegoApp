import { useState } from "react";
import { Section } from "../../../components/ui/Section";
import { Field } from "../../../components/ui/Field";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";
import R2ImageField from "../../../components/R2ImageField";

export function SetForm({
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
  // Django SetSerializer fields you showed:
  // number, set_name, image_url, age, piece_count, theme_id (write)
  const [number, setNumber] = useState(initial?.number ?? "");
  const [set_name, setSetName] = useState(initial?.set_name ?? "");
  const [age, setAge] = useState(initial?.age ?? "");
  const [piece_count, setPieceCount] = useState(initial?.piece_count ?? "");
  const [theme_id, setThemeId] = useState(initial?.theme?.id ?? initial?.theme_id ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? "");

  return (
    <>
      <Section title="Set Details" description="Matches your Django SetSerializer fields.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="number">
            <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="21325" />
          </Field>
          <Field label="theme_id" hint="Theme PK id (number). Later we’ll replace with dropdown.">
            <Input value={theme_id} onChange={(e) => setThemeId(e.target.value)} placeholder="1" />
          </Field>
        </div>

        <Field label="set_name">
          <Input value={set_name} onChange={(e) => setSetName(e.target.value)} />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="age">
            <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="8" />
          </Field>
          <Field label="piece_count">
            <Input value={piece_count} onChange={(e) => setPieceCount(e.target.value)} placeholder="1000" />
          </Field>
        </div>
      </Section>

      <div className="border-t" />

      <Section title="Image" description="Upload to R2 and store public URL.">
        <R2ImageField label="image_url" folder="sets" value={image_url} onChange={setImageUrl} />
      </Section>

      <div className="sticky bottom-0 border-t bg-white px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <SecondaryButton type="button" onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton
            type="button"
            disabled={!!saving}
            onClick={() =>
              onSubmit({
                number,
                set_name,
                image_url,
                age: age ? Number(age) : null,
                piece_count: piece_count ? Number(piece_count) : null,
                theme_id: Number(theme_id),
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
