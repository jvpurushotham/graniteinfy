import { useEffect, useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import api from "../services/api";

const CATEGORIES = ["All", "Residential", "Commercial", "Hotels", "Hospitals", "Schools", "Airports", "Shopping Malls"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    api.get("/projects", { params: active === "All" ? {} : { category: active } })
      .then(({ data }) => setProjects(data.projects));
  }, [active]);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
      <div className="text-center mb-10">
        <span className="font-mono text-xs text-fleck tracking-wide">CASE STUDIES</span>
        <h1 className="font-display text-4xl text-charcoal mt-1">Projects Gallery</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setActive(c)}
            className={`text-sm px-4 py-2 rounded-full transition-colors ${active === c ? "bg-deep-blue text-white" : "bg-mist text-charcoal hover:bg-light-stone/40"}`}>
            {c}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-fleck py-16">No projects in this category yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div key={p.id} className="rounded-2xl overflow-hidden border border-black/5 bg-white hover:shadow-lg transition-shadow">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full aspect-[4/3] object-cover" />}
              <div className="p-5">
                <span className="text-xs font-mono text-brass">{p.category}</span>
                <h3 className="font-display text-xl text-charcoal mt-1">{p.title}</h3>
                <p className="text-sm text-fleck mt-2">{p.description}</p>
                <div className="mt-4 space-y-1.5 text-xs text-fleck">
                  <div className="flex items-center gap-1.5"><MapPin size={12} /> {p.location} · {p.area_sqft?.toLocaleString()} sqft</div>
                  <div className="flex items-center gap-1.5"><Calendar size={12} /> {p.completion_date}</div>
                  <div className="font-mono text-charcoal mt-2">Granite used: {p.granite_used}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
