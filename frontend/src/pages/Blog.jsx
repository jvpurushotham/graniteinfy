const POSTS = [
  { title: "How to Care for Polished Granite Countertops", category: "Granite Care", excerpt: "Daily cleaning habits and the sealants that keep polish and color true for decades." },
  { title: "A Buyer's Guide to Granite Finishes", category: "Buying Guide", excerpt: "Polished, honed, flamed, or leathered — how each finish performs by application." },
  { title: "Installation Checklist for Large-Format Slabs", category: "Installation", excerpt: "What installers should confirm on-site before a slab ever leaves the crate." },
  { title: "2026 Interior Trends: Warm Stone Tones", category: "Latest Trends", excerpt: "Why browns and earthy greys are replacing stark whites in kitchen design this year." },
];

export default function Blog() {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <div className="text-center mb-12">
        <span className="font-mono text-xs text-fleck tracking-wide">RESOURCES</span>
        <h1 className="font-display text-4xl text-charcoal mt-1">Blog & Buying Guides</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {POSTS.map((p) => (
          <article key={p.title} className="p-6 rounded-2xl border border-black/5 bg-white hover:shadow-lg transition-shadow">
            <span className="text-xs font-mono text-brass">{p.category}</span>
            <h2 className="font-display text-xl text-charcoal mt-2">{p.title}</h2>
            <p className="mt-2 text-sm text-fleck leading-relaxed">{p.excerpt}</p>
            <span className="inline-block mt-4 text-sm text-deep-blue font-medium">Read more →</span>
          </article>
        ))}
      </div>
    </div>
  );
}
