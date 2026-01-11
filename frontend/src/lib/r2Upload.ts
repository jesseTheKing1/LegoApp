import api from "../api"; // your axios instance

export async function uploadImageToR2(file: File, folder: string): Promise<string> {
  // 1) ask Django for presigned URL
  const presign = await api.post("/r2/presign-upload/", {
    folder,
    filename: file.name,
    content_type: file.type || "application/octet-stream",
  });

  const { upload_url, public_url } = presign.data as {
    upload_url: string;
    public_url: string;
  };

  // 2) upload directly to R2
  const res = await fetch(upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`R2 upload failed (${res.status}) ${text}`);
  }

  // 3) return the public URL you store in Django model
  return public_url;
}
