import api from "./client";
import { ENDPOINTS, type CatalogTabKey } from "./endpoints";

export async function listTab(tab: CatalogTabKey) {
  const url =
    tab === "parts" ? ENDPOINTS.parts :
    tab === "partColors" ? ENDPOINTS.partColors :
    tab === "sets" ? ENDPOINTS.sets :
    ENDPOINTS.themes;

  const res = await api.get(url);
  return res.data;
}

export async function createTab(tab: CatalogTabKey, payload: any) {
  const url =
    tab === "parts" ? ENDPOINTS.parts :
    tab === "partColors" ? ENDPOINTS.partColors :
    tab === "sets" ? ENDPOINTS.sets :
    ENDPOINTS.themes;

  const res = await api.post(url, payload);
  return res.data;
}

export async function updateTab(tab: CatalogTabKey, id: number, payload: any) {
  const url =
    tab === "parts" ? `${ENDPOINTS.parts}${id}/` :
    tab === "partColors" ? `${ENDPOINTS.partColors}${id}/` :
    tab === "sets" ? `${ENDPOINTS.sets}${id}/` :
    `${ENDPOINTS.themes}${id}/`;

  const res = await api.put(url, payload);
  return res.data;
}

export async function deleteTab(tab: CatalogTabKey, id: number) {
  const url =
    tab === "parts" ? `${ENDPOINTS.parts}${id}/` :
    tab === "partColors" ? `${ENDPOINTS.partColors}${id}/` :
    tab === "sets" ? `${ENDPOINTS.sets}${id}/` :
    `${ENDPOINTS.themes}${id}/`;

  const res = await api.delete(url);
  return res.data;
}
