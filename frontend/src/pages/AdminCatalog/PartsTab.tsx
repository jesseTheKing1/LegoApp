import { useState } from "react";
import { SecondaryButton } from "../../components/ui/Button";
import { deleteTab, createTab, updateTab } from "../../api/catalog";
import { PartForm } from "./forms/PartForm";

export function PartsTab({
  rows,
  onEdit,
  onRefresh,
}: {
  rows: any[];
  onEdit: (row: any) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
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
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-neutral-100 hover:bg-neutral-50/70">
                <td className="px-6 py-4">
                  <div className="font-medium text-neutral-900">
                    {row.part_id} — {row.name}
                  </div>
                  <div className="mt-1 text-xs text-neutral-500">ID: {row.id}</div>
                </td>

                <td className="px-6 py-4 text-neutral-700">
                  <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                    {row.general_category ?? "—"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <SecondaryButton onClick={() => onEdit(row)}>Edit</SecondaryButton>
                    <button
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        if (!confirm("Delete this Part?")) return;
                        await deleteTab("parts", row.id);
                        onRefresh();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                  No results.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-3 grid gap-3">
        {rows.map((row) => (
          <button
            key={row.id}
            onClick={() => onEdit(row)}
            className="rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]"
          >
            <div className="text-base font-semibold text-neutral-900">
              {row.part_id} — {row.name}
            </div>
            <div className="mt-1 text-sm text-neutral-500">{row.general_category ?? "—"}</div>
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
              <span>ID: {row.id}</span>
              <span className="font-medium text-neutral-900">Tap to edit</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// attach form as a static property for clean usage in AdminCatalogPage
PartsTab.Form = function PartsFormWrapper({
  mode,
  initial,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  initial: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);

  return (
    <PartForm
      mode={mode}
      initial={initial}
      saving={saving}
      onCancel={onClose}
      onSubmit={async (payload) => {
        setSaving(true);
        try {
          if (mode === "create") await createTab("parts", payload);
          else await updateTab("parts", initial.id, payload);
          onClose();
          onSaved();
        } finally {
          setSaving(false);
        }
      }}
    />
  );
};
