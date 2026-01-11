import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Drawer } from "../../components/ui/Drawer";
import { Input } from "../../components/ui/Input";
import { PrimaryButton } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import type { CatalogTabKey } from "../../api/endpoints";
import { useAdminCatalog } from "../../hooks/useAdminCatalog";

import { PartsTab } from "./PartsTab";
import { PartForm } from "./forms/PartForm";

import { PartColorsTab } from "./PartsColorsTab";
import { PartColorForm } from "./forms/PartColorForm";

import { SetsTab } from "./SetsTab";
import { SetForm } from "./forms/SetForm";

import { ThemesTab } from "./ThemesTab";
import { ThemeForm } from "./forms/ThemeForm";

export default function AdminCatalogPage() {
  const [tab, setTab] = useState<CatalogTabKey>("parts");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<any>(null);

  const { filtered, loading, error, refresh } = useAdminCatalog(tab, search);

  const drawerTitle = useMemo(() => {
    const label =
      tab === "parts" ? "Part" :
      tab === "partColors" ? "Part Color" :
      tab === "sets" ? "Set" :
      "Theme";
    return mode === "create" ? `New ${label}` : `Edit ${label}`;
  }, [tab, mode]);

  function openCreate() {
    setMode("create");
    setSelected(null);
    setDrawerOpen(true);
  }

  function openEdit(row: any) {
    setMode("edit");
    setSelected(row);
    setDrawerOpen(true);
  }

  return (
    <AdminLayout>
      <div className="border-b border-neutral-200 bg-white">
        <div className="px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Catalog Admin</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Parts, Part Colors, Sets, Themes — with R2 image uploads.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="w-full sm:w-[360px]">
                <Input
                  placeholder={`Search ${tab}…`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <PrimaryButton onClick={openCreate} className="w-full sm:w-auto">
                + New
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50">
        <div className="px-4 sm:px-6 py-6 grid gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Tabs
                tab={tab}
                setTab={(t) => {
                  setTab(t);
                  setSearch("");
                }}
              />
              <div className="sm:ml-auto text-sm text-neutral-500">
                {loading ? "Loading…" : error ? `Error: ${error}` : `Showing ${filtered.length}`}
              </div>
            </div>
          </div>

          {tab === "parts" && <PartsTab rows={filtered} onEdit={openEdit} onRefresh={refresh} />}
          {tab === "partColors" && <PartColorsTab rows={filtered} onEdit={openEdit} onRefresh={refresh} />}
          {tab === "sets" && <SetsTab rows={filtered} onEdit={openEdit} onRefresh={refresh} />}
          {tab === "themes" && <ThemesTab rows={filtered} onEdit={openEdit} onRefresh={refresh} />}
        </div>
      </div>

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={drawerTitle}>
  {tab === "parts" && (
    <PartForm
      mode={mode}
      initial={selected}
      onCancel={() => setDrawerOpen(false)}
      onSubmit={async (payload) => {
        // create/update already known here
        await refresh();
        setDrawerOpen(false);
      }}
    />
  )}

  {tab === "partColors" && (
    <PartColorForm
      mode={mode}
      initial={selected}
      onCancel={() => setDrawerOpen(false)}
      onSubmit={async (payload) => {
        await refresh();
        setDrawerOpen(false);
      }}
    />
  )}

  {tab === "sets" && (
    <SetForm
      mode={mode}
      initial={selected}
      onCancel={() => setDrawerOpen(false)}
      onSubmit={async (payload) => {
        await refresh();
        setDrawerOpen(false);
      }}
    />
  )}

  {tab === "themes" && (
    <ThemeForm
      mode={mode}
      initial={selected}
      onCancel={() => setDrawerOpen(false)}
      onSubmit={async (payload) => {
        await refresh();
        setDrawerOpen(false);
      }}
    />
  )}
</Drawer>



    </AdminLayout>
  );
}
