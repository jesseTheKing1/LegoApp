import api from "./api";

export async function createTheme(data: { name: string; image_url?: string }) {
  return (await api.post("/api/admin/themes/", data)).data;
}

export async function listThemes() {
  return (await api.get("/api/admin/themes/")).data;
}
