import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Factory, Star } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const STATS = [
  { value: "40+", label: "Years Quarrying" },
  { value: "1,200+", label: "Retailers Served" },
  { value: "26", label: "Countries Shipped" },
  { value: "3,800+", label: "Projects Completed" },
];

const WHY_US = [
  { icon: Factory, title: "Owned Quarries", text: "We control the block from quarry to slab — no middlemen inflating price or lead time." },
  { icon: ShieldCheck, title: "Graded & Certified", text: "Every batch is graded for consistency and backed by lab-tested durability certificates." },
  { icon: Truck, title: "Dealer-Ready Logistics", text: "Palletized, crated, and export-packed shipping to over two dozen countries." },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get("/products", { params: { sort: "popular", per_page: 4 } }).then(({ data }) => setFeatured(data.products));
    api.get("/testimonials").then(({ data }) => setTestimonials(data.testimonials));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-stone-white">
        <div className="absolute inset-0 speckle" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="spec-tag inline-block text-brass text-xs px-3 py-1 rounded-full mb-6">
              EST. 1984 · KARIMNAGAR, INDIA
            </span>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight">
              Every slab, <span className="text-brass italic">without</span> the sample crate.
            </h1>
            <p className="mt-6 text-light-stone text-lg leading-relaxed max-w-lg">
              GraniteInfy replaces the truckload of physical samples with a full digital
              catalog — real dimensions, live stock, and dealer pricing, browsable from
              your phone.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/catalog" className="flex items-center gap-2 bg-deep-blue hover:bg-deep-blue-hover px-6 py-3.5 rounded-full font-medium transition-colors">
                Browse the catalog <ArrowRight size={17} />
              </Link>
              <Link to="/retailers" className="flex items-center gap-2 border border-white/25 hover:border-white/50 px-6 py-3.5 rounded-full font-medium transition-colors">
                Become a dealer
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1000"
                alt="Polished black granite slab detail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl px-5 py-4 hidden sm:block">
              <p className="font-mono text-xs text-fleck">GRN-30086 · Colonial White</p>
              <p className="text-charcoal font-semibold text-sm mt-1">In stock · 1,500 sqft</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-mist border-b border-black/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-charcoal">{s.value}</p>
              <p className="text-xs md:text-sm text-fleck mt-1 tracking-wide uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal text-center">Why factories & dealers choose us</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {WHY_US.map(({ icon: Icon, title, text }) => (
            <div key={title} className="p-7 rounded-2xl border border-black/5 bg-white hover:shadow-lg transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-deep-blue/10 flex items-center justify-center text-deep-blue mb-5">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-xl text-charcoal">{title}</h3>
              <p className="mt-2 text-sm text-fleck leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-mist py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="font-mono text-xs text-fleck tracking-wide">POPULAR COLLECTIONS</span>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mt-1">Featured Granites</h2>
            </div>
            <Link to="/catalog" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-deep-blue">
              View full catalog <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-12">What our partners say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="p-6 rounded-2xl bg-mist">
                <div className="flex gap-0.5 text-brass mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm text-charcoal leading-relaxed">"{t.message}"</p>
                <p className="mt-4 text-sm font-semibold text-charcoal">{t.name}</p>
                <p className="text-xs text-fleck">{t.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-charcoal text-stone-white relative overflow-hidden">
        <div className="absolute inset-0 speckle" />
        <div className="relative max-w-4xl mx-auto px-5 text-center py-20">
          <h2 className="font-display text-3xl md:text-4xl">Ready to stock the right slab, faster?</h2>
          <p className="mt-4 text-light-stone">Request wholesale pricing or a callback from our sales team today.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 bg-brass text-charcoal px-7 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity">
            Talk to the factory <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
