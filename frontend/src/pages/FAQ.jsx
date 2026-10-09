import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What is the minimum order quantity?", a: "Most products have a minimum order of 50 sqft, shown on each product page. Larger factory-direct orders may qualify for reduced minimums." },
  { q: "Do you ship internationally?", a: "Yes, we export to over 25 countries with palletized, crate-packed shipping suited for long-distance freight." },
  { q: "How do I become a dealer?", a: "Register on our Retailers page with your company and GST details. Approval typically takes under 48 hours." },
  { q: "Can I request a physical sample before ordering?", a: "Yes, logged-in retailers and customers can request samples directly from a product page or their dashboard." },
  { q: "How is granite priced?", a: "Pricing is per square foot and varies by color rarity, finish, and thickness. Approved dealers see wholesale rates automatically." },
  { q: "What finishes do you offer?", a: "Polished, honed, flamed, and leathered finishes are available across most colors — filterable in the catalog." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-16">
      <div className="text-center mb-12">
        <span className="font-mono text-xs text-fleck tracking-wide">FAQ</span>
        <h1 className="font-display text-4xl text-charcoal mt-1">Frequently Asked Questions</h1>
      </div>
      <div className="divide-y divide-black/5 border-t border-b border-black/5">
        {FAQS.map((item, i) => (
          <div key={item.q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between py-5 text-left">
              <span className="font-medium text-charcoal">{item.q}</span>
              <ChevronDown size={18} className={`text-fleck transition-transform shrink-0 ml-4 ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="pb-5 text-sm text-fleck leading-relaxed">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
