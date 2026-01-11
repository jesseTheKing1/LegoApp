// src/lib/r2Upload.ts
import api from "../api";

type PresignResponse = {
  upload_url: string;
  public_url: string;
};


export async function uploadImageToR2(file: File, folder: string) {
  // 1) ask backend for presigned PUT url
  const presign = await api.post<PresignResponse>("/r2/presign-upload/", {
    folder,
    filename: file.name,
    content_type: file.type || "application/octet-stream",
  });

  const { upload_url, public_url } = presign.data;

  // 2) upload file directly to R2 via PUT
  const putRes = await fetch(upload_url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      // IMPORTANT: do NOT add Authorization headers here
    },
  });

  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "");
    throw new Error(`R2 upload failed (${putRes.status}). ${text}`);
  }

  // 3) return the permanent public URL to store in Django
  return public_url;
}
