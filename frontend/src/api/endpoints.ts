export const ENDPOINTS = {
  parts: "/admin/parts/",
  partColors: "/admin/part-colors/",
  themes: "/admin/themes/",
  sets: "/admin/sets/",
  presignUpload: "/r2/presign-upload/",
} as const;

export type CatalogTabKey = "parts" | "partColors" | "sets" | "themes";
