import { useEffect, useState } from "react";
import api from "../api";

type Tab = "parts" | "part-colors" | "themes" | "sets";

function Field({ label, children }: { label: string; children: any }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, color: "#555" }}>{label}</div>
      {children}
    </label>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("parts");

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Admin</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <TabButton current={tab} value="parts" setTab={setTab} />
        <TabButton current={tab} value="part-colors" setTab={setTab} />
        <TabButton current={tab} value="themes" setTab={setTab} />
        <TabButton current={tab} value="sets" setTab={setTab} />
      </div>

      {tab === "parts" && <PartsAdmin />}
      {tab === "part-colors" && <PartColorsAdmin />}
      {tab === "themes" && <ThemesAdmin />}
      {tab === "sets" && <SetsAdmin />}
    </div>
  );
}

function TabButton({
  current,
  value,
  setTab,
}: {
  current: string;
  value: Tab;
  setTab: (t: Tab) => void;
}) {
  const active = current === value;
  return (
    <button
      onClick={() => setTab(value)}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: active ? "#111" : "#fff",
        color: active ? "#fff" : "#111",
        cursor: "pointer",
      }}
    >
      {value}
    </button>
  );
}

/** ---------------- PARTS ---------------- */
type Part = {
  id: number;
  part_id: string;
  name: string;
  general_category?: string;
  specific_category?: string;
};

function PartsAdmin() {
  const [items, setItems] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [part_id, setPartId] = useState("");
  const [name, setName] = useState("");
  const [general_category, setGeneral] = useState("");
  const [specific_category, setSpecific] = useState("");

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.get("/api/admin/parts/");
      setItems(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Failed to load parts");
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    setErr(null);
    try {
      await api.post("/api/admin/parts/", {
        part_id: part_id.trim(),
        name: name.trim(),
        general_category: general_category.trim(),
        specific_category: specific_category.trim(),
      });
      setPartId("");
      setName("");
      setGeneral("");
      setSpecific("");
      await load();
    } catch (e: any) {
      setErr(JSON.stringify(e?.response?.data || "Create failed"));
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api.delete(`/api/admin/parts/${id}/`);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Delete failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h2>Parts</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <Field label="Part ID (shape id)">
          <input value={part_id} onChange={(e) => setPartId(e.target.value)} />
        </Field>
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="General category">
          <input value={general_category} onChange={(e) => setGeneral(e.target.value)} />
        </Field>
        <Field label="Specific category">
          <input value={specific_category} onChange={(e) => setSpecific(e.target.value)} />
        </Field>

        <button onClick={create} style={{ padding: 10, borderRadius: 10 }}>
          Add Part
        </button>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <b>{p.part_id}</b> — {p.name}
                <div style={{ fontSize: 12, color: "#666" }}>
                  {p.general_category} / {p.specific_category}
                </div>
              </div>
              <button onClick={() => remove(p.id)} style={{ borderRadius: 10 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** ---------------- PART COLORS ---------------- */
type PartColor = {
  id: number;
  part: Part; // nested read
  color_name: string;
  variant?: string;
  image_url_1?: string;
  image_url_2?: string;
};

function PartColorsAdmin() {
  const [items, setItems] = useState<PartColor[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [partId, setPartId] = useState<number | "">("");
  const [color_name, setColorName] = useState("");
  const [variant, setVariant] = useState("");
  const [image_url_1, setImg1] = useState("");
  const [image_url_2, setImg2] = useState("");

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const [colorsRes, partsRes] = await Promise.all([
        api.get("/api/admin/part-colors/"),
        api.get("/api/admin/parts/"),
      ]);
      setItems(colorsRes.data);
      setParts(partsRes.data);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Failed to load part colors");
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    setErr(null);
    if (!partId) return setErr("Pick a Part first.");
    try {
      await api.post("/api/admin/part-colors/", {
        part_id: partId, // matches serializer write field: part_id -> part FK
        color_name: color_name.trim(),
        variant: variant.trim(),
        image_url_1: image_url_1.trim(),
        image_url_2: image_url_2.trim(),
      });
      setPartId("");
      setColorName("");
      setVariant("");
      setImg1("");
      setImg2("");
      await load();
    } catch (e: any) {
      setErr(JSON.stringify(e?.response?.data || "Create failed"));
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api.delete(`/api/admin/part-colors/${id}/`);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Delete failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h2>Part Colors</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 620 }}>
        <Field label="Part (shape)">
          <select value={partId} onChange={(e) => setPartId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">Select Part…</option>
            {parts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.part_id} — {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Color name">
          <input value={color_name} onChange={(e) => setColorName(e.target.value)} />
        </Field>

        <Field label="Variant (optional: print/decal)">
          <input value={variant} onChange={(e) => setVariant(e.target.value)} />
        </Field>

        <Field label="Image URL 1">
          <input value={image_url_1} onChange={(e) => setImg1(e.target.value)} />
        </Field>

        <Field label="Image URL 2">
          <input value={image_url_2} onChange={(e) => setImg2(e.target.value)} />
        </Field>

        <button onClick={create} style={{ padding: 10, borderRadius: 10 }}>
          Add Part Color
        </button>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <b>{c.part?.part_id}</b> — {c.color_name}
                <div style={{ fontSize: 12, color: "#666" }}>
                  {c.part?.name} {c.variant ? `• ${c.variant}` : ""}
                </div>
              </div>
              <button onClick={() => remove(c.id)} style={{ borderRadius: 10 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** ---------------- THEMES ---------------- */
type Theme = { id: number; name: string; image_url?: string };

function ThemesAdmin() {
  const [items, setItems] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [image_url, setImageUrl] = useState("");

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.get("/api/admin/themes/");
      setItems(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Failed to load themes");
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    setErr(null);
    try {
      await api.post("/api/admin/themes/", { name: name.trim(), image_url: image_url.trim() });
      setName("");
      setImageUrl("");
      await load();
    } catch (e: any) {
      setErr(JSON.stringify(e?.response?.data || "Create failed"));
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api.delete(`/api/admin/themes/${id}/`);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Delete failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h2>Themes</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Image URL">
          <input value={image_url} onChange={(e) => setImageUrl(e.target.value)} />
        </Field>

        <button onClick={create} style={{ padding: 10, borderRadius: 10 }}>
          Add Theme
        </button>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((t) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <b>{t.name}</b>
              </div>
              <button onClick={() => remove(t.id)} style={{ borderRadius: 10 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** ---------------- SETS ---------------- */
type SetRow = {
  id: number;
  number: string;
  set_name: string;
  image_url?: string;
  age?: string;
  piece_count?: number;
  theme?: Theme; // nested read
};

function SetsAdmin() {
  const [items, setItems] = useState<SetRow[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [number, setNumber] = useState("");
  const [set_name, setSetName] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [age, setAge] = useState("");
  const [piece_count, setPieceCount] = useState<number | "">("");
  const [themeId, setThemeId] = useState<number | "">("");

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const [setsRes, themesRes] = await Promise.all([
        api.get("/api/admin/sets/"),
        api.get("/api/admin/themes/"),
      ]);
      setItems(setsRes.data);
      setThemes(themesRes.data);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Failed to load sets");
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    setErr(null);
    if (!themeId) return setErr("Pick a Theme.");
    try {
      await api.post("/api/admin/sets/", {
        number: number.trim(),
        set_name: set_name.trim(),
        image_url: image_url.trim(),
        age: age.trim(),
        piece_count: piece_count === "" ? null : piece_count,
        theme_id: themeId, // matches serializer write field: theme_id -> theme FK
      });
      setNumber("");
      setSetName("");
      setImageUrl("");
      setAge("");
      setPieceCount("");
      setThemeId("");
      await load();
    } catch (e: any) {
      setErr(JSON.stringify(e?.response?.data || "Create failed"));
    }
  }

  async function remove(id: number) {
    setErr(null);
    try {
      await api.delete(`/api/admin/sets/${id}/`);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Delete failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h2>Sets</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 700 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Set number">
            <input value={number} onChange={(e) => setNumber(e.target.value)} />
          </Field>
          <Field label="Set name">
            <input value={set_name} onChange={(e) => setSetName(e.target.value)} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Age">
            <input value={age} onChange={(e) => setAge(e.target.value)} />
          </Field>
          <Field label="Piece count">
            <input
              value={piece_count}
              onChange={(e) => setPieceCount(e.target.value ? Number(e.target.value) : "")}
              type="number"
            />
          </Field>
        </div>

        <Field label="Theme">
          <select value={themeId} onChange={(e) => setThemeId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">Select Theme…</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Image URL">
          <input value={image_url} onChange={(e) => setImageUrl(e.target.value)} />
        </Field>

        <button onClick={create} style={{ padding: 10, borderRadius: 10 }}>
          Add Set
        </button>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((s) => (
            <div
              key={s.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <b>{s.number}</b> — {s.set_name}
                <div style={{ fontSize: 12, color: "#666" }}>
                  {s.theme?.name ? `Theme: ${s.theme.name}` : ""} {s.piece_count ? `• ${s.piece_count} pcs` : ""}
                </div>
              </div>
              <button onClick={() => remove(s.id)} style={{ borderRadius: 10 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
