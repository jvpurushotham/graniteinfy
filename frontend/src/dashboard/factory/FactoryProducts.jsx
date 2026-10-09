import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import api from "../../services/api";

const EMPTY_FORM = {
  name: "", category_id: "", color: "", finish: "Polished", origin: "",
  thickness_mm: 20, price_per_sqft: "", show_price_publicly: true,
  available_quantity_sqft: 0, minimum_order_sqft: 50, description: "",
  applications: [], is_featured: false, images: [],
};

export default function FactoryProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null); // null | 'new' | product object
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/products", { params: { q, per_page: 50 } }).then(({ data }) => setProducts(data.products));
  };

  useEffect(() => { load(); }, [q]);
  useEffect(() => { api.get("/categories").then(({ data }) => setCategories(data.categories)); }, []);

  const openNew = () => { setForm(EMPTY_FORM); setModal("new"); };
  const openEdit = async (p) => {
    const { data } = await api.get(`/products/${p.slug}`);
    const prod = data.product;
    setForm({
      ...EMPTY_FORM, ...prod,
      applications: prod.applications || [],
      images: prod.images || [],
      category_id: prod.category_id || "",
    });
    setModal(prod);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, images: form.images.length ? form.images : [
        "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800",
      ] };
      if (modal === "new") {
        await api.post("/products", payload);
      } else {
        await api.put(`/products/${modal.id}`, payload);
      }
      setModal(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    await api.delete(`/products/${p.id}`);
    load();
  };

  const toggleApp = (app) => {
    setForm((f) => ({
      ...f,
      applications: f.applications.includes(app) ? f.applications.filter((a) => a !== app) : [...f.applications, app],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Products</h1>
          <p className="text-sm text-fleck mt-1">{products.length} products in catalog</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-deep-blue hover:bg-deep-blue-hover text-white px-5 py-2.5 rounded-full text-sm font-medium">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fleck" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-black/10 text-sm outline-none focus:border-deep-blue bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mist text-left text-xs text-fleck uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-mist/50">
                <td className="px-5 py-3 flex items-center gap-3">
                  <img src={p.primary_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-fleck">{p.color} · {p.finish}</p>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-fleck">{p.product_code}</td>
                <td className="px-5 py-3">{p.price_per_sqft ? `₹${p.price_per_sqft}` : "—"}</td>
                <td className="px-5 py-3">
                  <span className={p.is_low_stock ? "text-red-500 font-medium" : "text-charcoal"}>{p.available_quantity_sqft} sqft</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${p.is_active ? "bg-green-50 text-green-600" : "bg-mist text-fleck"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg hover:bg-mist flex items-center justify-center text-fleck"><Pencil size={14} /></button>
                    <button onClick={() => remove(p)} className="w-8 h-8 rounded-lg hover:bg-mist flex items-center justify-center text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-charcoal">{modal === "new" ? "Add Product" : "Edit Product"}</h2>
              <button onClick={() => setModal(null)}><X size={20} className="text-fleck" /></button>
            </div>

            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name">
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
                </Field>
                <Field label="Category">
                  <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className="input">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Color">
                  <input value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="input" />
                </Field>
                <Field label="Finish">
                  <select value={form.finish} onChange={(e) => setForm((f) => ({ ...f, finish: e.target.value }))} className="input">
                    {["Polished", "Honed", "Flamed", "Leather"].map((f) => <option key={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Origin">
                  <input value={form.origin} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))} className="input" />
                </Field>
                <Field label="Thickness (mm)">
                  <input type="number" value={form.thickness_mm} onChange={(e) => setForm((f) => ({ ...f, thickness_mm: e.target.value }))} className="input" />
                </Field>
                <Field label="Price / sqft (₹)">
                  <input type="number" value={form.price_per_sqft} onChange={(e) => setForm((f) => ({ ...f, price_per_sqft: e.target.value }))} className="input" />
                </Field>
                <Field label="Available Quantity (sqft)">
                  <input type="number" value={form.available_quantity_sqft} onChange={(e) => setForm((f) => ({ ...f, available_quantity_sqft: e.target.value }))} className="input" />
                </Field>
              </div>

              <Field label="Description">
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input resize-none" />
              </Field>

              <Field label="Applications">
                <div className="flex flex-wrap gap-2">
                  {["Countertop", "Floor", "Wall", "Outdoor", "Kitchen", "Tiles", "Slabs", "Indoor"].map((app) => (
                    <button type="button" key={app} onClick={() => toggleApp(app)}
                      className={`text-xs px-3 py-1.5 rounded-full border ${form.applications.includes(app) ? "bg-deep-blue text-white border-deep-blue" : "border-black/10 text-charcoal"}`}>
                      {app}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input type="checkbox" checked={form.show_price_publicly} onChange={(e) => setForm((f) => ({ ...f, show_price_publicly: e.target.checked }))} /> Show price publicly
                </label>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-deep-blue hover:bg-deep-blue-hover text-white py-3 rounded-full font-medium text-sm disabled:opacity-60">
                {saving ? "Saving..." : modal === "new" ? "Create Product" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`.input { width: 100%; padding: 0.6rem 0.9rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); font-size: 0.875rem; outline: none; } .input:focus { border-color: #1D3E8C; }`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-fleck">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
