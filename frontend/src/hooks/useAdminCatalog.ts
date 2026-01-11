import { useEffect, useMemo, useState } from "react";
import type { CatalogTabKey } from "../api/endpoints";
import { listTab } from "../api/catalog";

export function useAdminCatalog(tab: CatalogTabKey, search: string) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listTab(tab);
      setRows(Array.isArray(data) ? data : data.results ?? []);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, search]);

  return { rows, filtered, loading, error, refresh, setRows };
}
