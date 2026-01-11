import api from "./client";
import { ENDPOINTS } from "./endpoints";

export async function presignR2Upload(args: {
  folder: string;
  filename: string;
  content_type: string;
}) {
  const res = await api.post(ENDPOINTS.presignUpload, args);
  return res.data as {
    upload_url: string;
    public_url: string;
    headers?: Record<string, string>;
  };
}
