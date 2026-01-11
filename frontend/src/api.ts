// src/api.ts
import axios from "axios";

function normalizeBaseUrl(raw: string) {
  // remove trailing slashes
  const base = raw.replace(/\/+$/, "");
  // ensure it ends with /api
  return base.endsWith("/api") ? base : `${base}/api`;
}

const apiBase = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL || "https://legoapp-web.onrender.com"
);

const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

export default api;

