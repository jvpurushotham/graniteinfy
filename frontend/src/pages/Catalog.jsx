import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const COLORS = ["Black", "White", "Brown", "Grey"];
const FINISHES = ["Polished", "Honed", "Flamed", "Leather"];
const APPLICATIONS = ["Countertop", "Floor", "Wall", "Outdoor"];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: "", color: "", finish: "", application: "", sort: "newest",
  });

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get("/products", { params: { ...params, per_page: 24 } })
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: f[key] === value ? "" : value }));
  const clearFilters = () => setFilters({ q: "", color: "", finish: "", application: "", sort: "newest" });
  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== "sort" && k !== "q").length;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <div className="mb-8">
        <span className="font-mono text-xs text-fleck tracking-wide">{total} SLABS AVAILABLE</span>
        <h1 className="font-display text-4xl text-charcoal mt-1">Product Catalog</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-fleck" />
          <input
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            placeholder="Search by name, color, or product code..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-black/10 focus:border-deep-blue outline-none text-sm"
          />
        </div>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="px-4 py-3 rounded-full border border-black/10 text-sm bg-white"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-black/10 text-sm font-medium md:hidden"
        >
          <SlidersHorizontal size={16} /> Filters {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className={`${showFilters ? "block" : "hidden"} md:block space-y-7`}>
          {activeCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-deep-blue font-medium">
              <X size={13} /> Clear all filters
            </button>
          )}
          <FilterGroup label="Color" options={COLORS} active={filters.color} onSelect={(v) => setFilter("color", v)} />
          <FilterGroup label="Finish" options={FINISHES} active={filters.finish} onSelect={(v) => setFilter("finish", v)} />
          <FilterGroup label="Application" options={APPLICATIONS} active={filters.application} onSelect={(v) => setFilter("application", v)} />
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-mist rounded-2xl" />
                  <div className="h-4 bg-mist rounded mt-3 w-2/3" />
                  <div className="h-3 bg-mist rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-fleck">No slabs match those filters yet.</p>
              <button onClick={clearFilters} className="mt-3 text-deep-blue text-sm font-medium">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, active, onSelect }) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-wide uppercase text-fleck mb-3">{label}</h4>
      <div className="flex flex-wrap md:flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`text-left text-sm px-3 py-1.5 rounded-full md:rounded-lg transition-colors ${
              active === opt ? "bg-deep-blue text-white" : "bg-mist text-charcoal hover:bg-light-stone/40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
