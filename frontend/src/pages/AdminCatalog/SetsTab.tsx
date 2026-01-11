import { useState } from "react";
import { SecondaryButton } from "../../components/ui/Button";
import { deleteTab, createTab, updateTab } from "../../api/catalog";
import { SetForm } from "./forms/SetForm";

export function SetsTab({
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
              <th className="px-6 py-3 text-left font-semibold">Set</th>
              <th className="px-6 py-3 text-left font-semibold">Theme</th>
              <th className="px-6 py-3 text-left font-semibold">Stats</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-neutral-100 hover:bg-neutral-50/70">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {row.image_url ? (
                      <img
                        src={row.image_url}
                        className="h-10 w-10 rounded-xl border border-neutral-200 object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl border border-dashed border-neutral-200 bg-neutral-50" />
                    )}

                    <div className="min-w-0">
                      <div className="font-medium text-neutral-900 truncate">
                        {row.number} — {row.set_name}
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">ID: {row.id}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-neutral-700">
                  {row.theme?.name ?? "—"}
                </td>

                <td className="px-6 py-4 text-neutral-700">
                  <div className="text-xs">
                    Age: <span className="font-semibold">{row.age ?? "—"}</span>
                  </div>
                  <div className="text-xs">
                    Pieces: <span className="font-semibold">{row.piece_count ?? "—"}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <SecondaryButton onClick={() => onEdit(row)}>Edit</SecondaryButton>
                    <button
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        if (!confirm("Delete this Set?")) return;
                        await deleteTab("sets", row.id);
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
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  No sets yet.
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
            <div className="flex items-center gap-3">
              {row.image_url ? (
                <img
                  src={row.image_url}
                  className="h-12 w-12 rounded-xl border border-neutral-200 object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl border border-dashed border-neutral-200 bg-neutral-50" />
              )}
              <div className="min-w-0">
                <div className="text-base font-semibold text-neutral-900 truncate">
                  {row.number} — {row.set_name}
                </div>
                <div className="text-sm text-neutral-500 truncate">{row.theme?.name ?? "—"}</div>
                <div className="mt-2 text-xs text-neutral-500">
                  Age: {row.age ?? "—"} • Pieces: {row.piece_count ?? "—"}
                </div>
              </div>
            </div>
          </button>
        ))}

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
            No sets yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

SetsTab.Form = function SetsFormWrapper({
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
    <SetForm
      mode={mode}
      initial={initial}
      saving={saving}
      onCancel={onClose}
      onSubmit={async (payload) => {
        setSaving(true);
        try {
          if (mode === "create") await createTab("sets", payload);
          else await updateTab("sets", initial.id, payload);
          onClose();
          onSaved();
        } finally {
          setSaving(false);
        }
      }}
    />
  );
};
