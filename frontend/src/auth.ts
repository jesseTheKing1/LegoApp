import api from "./api";

export async function fetchMe() {
  const res = await api.get("/api/me/");
  return res.data as { is_staff: boolean; is_superuser: boolean; username: string };
}
