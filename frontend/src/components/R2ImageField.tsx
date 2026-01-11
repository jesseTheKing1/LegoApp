import { useState } from "react";
import { presignR2Upload } from "../api/r2";

export default function R2ImageField({
  label,
  folder,
  value,
  onChange,
}: {
  label: string;
  folder: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const presign = await presignR2Upload({
        folder,
        filename: file.name,
        content_type: file.type || "application/octet-stream",
      });

      const putRes = await fetch(presign.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          ...(presign.headers || {}),
        },
        body: file,
      });

      if (!putRes.ok) {
        const text = await putRes.text();
        throw new Error(`R2 upload failed: ${putRes.status} ${text}`);
      }

      onChange(presign.public_url);
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-neutral-700">{label}</div>
          <div className="text-[11px] text-neutral-500">Uploads to R2 and saves the public URL.</div>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-neutral-50">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.currentTarget.value = "";
            }}
          />
          {uploading ? "Uploading…" : "Upload"}
        </label>
      </div>

      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
          <img src={value} className="h-12 w-12 rounded-xl border border-neutral-200 object-cover" />
          <div className="min-w-0">
            <div className="text-sm font-semibold">Preview</div>
            <div className="truncate text-xs text-neutral-500">{value}</div>
          </div>
          <button
            type="button"
            className="ml-auto rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            onClick={() => onChange("")}
            disabled={uploading}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
          No image yet.
        </div>
      )}

      {err ? <div className="text-xs text-red-600">{err}</div> : null}
    </div>
  );
}
