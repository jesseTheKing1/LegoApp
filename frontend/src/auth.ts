// src/auth.ts
import api from "./api";

export type Me = {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
};

export async function signup(username: string, email: string, password: string) {
  // baseURL already ends with /api
  const res = await api.post("/signup/", { username, email, password });
  return res.data;
}

export async function login(username: string, password: string) {
  // baseURL already ends with /api
  const res = await api.post("/token/", { username, password });

  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);

  return res.data;
}

export async function fetchMe(): Promise<Me> {
  // baseURL already ends with /api
  const res = await api.get("/me/");
  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function hasToken() {
  return !!localStorage.getItem("access_token");
}
