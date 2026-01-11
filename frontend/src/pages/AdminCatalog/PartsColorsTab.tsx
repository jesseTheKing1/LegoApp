import { SecondaryButton } from "../../components/ui/Button";
import { deleteTab } from "../../api/catalog";

function Thumb({ src }: { src?: string }) {
  if (!src) {
    return (
      <div className="h-10 w-10 rounded-xl border border-dashed border-neutral-200 bg-neutral-50" />
    );
  }
  return (
    <img
      src={src}
      className="h-10 w-10 rounded-xl border border-neutral-200 object-cover"
      loading="lazy"
      alt=""
    />
  );
}

export function PartColorsTab({
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
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-neutral-50 text-xs text-neutral-500">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Part Color</th>
              <th className="px-6 py-3 text-left font-semibold">Part</th>
              <th className="px-6 py-3 text-left font-semibold">Images</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-neutral-100 hover:bg-neutral-50/70"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-neutral-900">
                    {row.color_name ?? "—"}
                    {row.variant ? (
                      <span className="ml-2 text-xs text-neutral-500">
                        ({row.variant})
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-neutral-500">ID: {row.id}</div>
                </td>

                <td className="px-6 py-4 text-neutral-700">
                  <div className="font-medium">
                    {row.part?.part_id ?? "—"}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {row.part?.name ?? "—"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Thumb src={row.image_url_1} />
                    <Thumb src={row.image_url_2} />
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <SecondaryButton onClick={() => onEdit(row)}>Edit</SecondaryButton>
                    <button
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        if (!confirm("Delete this Part Color?")) return;
                        await deleteTab("partColors", row.id);
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
                  No part colors yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden p-3 grid gap-3">
        {rows.map((row) => (
          <button
            key={row.id}
            onClick={() => onEdit(row)}
            className="rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <Thumb src={row.image_url_1} />
              <div className="min-w-0">
                <div className="text-base font-semibold text-neutral-900 truncate">
                  {row.part?.part_id ?? "—"} — {row.color_name ?? "—"}
                </div>
                <div className="text-sm text-neutral-500 truncate">
                  {row.part?.name ?? "—"} {row.variant ? `• ${row.variant}` : ""}
                </div>
                <div className="mt-2 text-xs text-neutral-500">ID: {row.id}</div>
              </div>
            </div>
          </button>
        ))}

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
            No part colors yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
