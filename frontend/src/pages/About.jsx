import { ShieldCheck, Factory, Award, Users } from "lucide-react";

const MILESTONES = [
  { year: "1984", text: "Founded as a single quarry operation in Karimnagar, Telangana." },
  { year: "1998", text: "Opened our first automated slab-polishing line." },
  { year: "2011", text: "Began exporting to the Gulf, Southeast Asia, and Europe." },
  { year: "2023", text: "Digitized our entire dealer catalog with GraniteInfy." },
];

export default function About() {
  return (
    <div>
      <section className="bg-charcoal text-stone-white relative overflow-hidden">
        <div className="absolute inset-0 speckle" />
        <div className="relative max-w-5xl mx-auto px-5 md:px-8 py-24 text-center">
          <h1 className="font-display text-4xl md:text-5xl">Four decades of stone, one factory floor.</h1>
          <p className="mt-5 text-light-stone max-w-2xl mx-auto leading-relaxed">
            GraniteInfy is the digital face of a family-run granite manufacturing
            operation that has supplied dealers, builders, and designers since 1984.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-display text-2xl text-charcoal mb-3">Our Vision</h2>
          <p className="text-fleck leading-relaxed">To make premium natural stone as easy to source as any catalog product — transparent pricing, real stock data, and no guesswork for the dealer or homeowner on the other end.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-charcoal mb-3">Our Mission</h2>
          <p className="text-fleck leading-relaxed">Cut lead times for our retail partners, maintain consistent grading across every block, and put the factory's real-time inventory directly in front of the people who need it.</p>
        </div>
      </section>

      <section className="bg-mist py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <h2 className="font-display text-3xl text-charcoal text-center mb-12">Manufacturing Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Block Extraction", "Cutting & Slabbing", "Polishing & Finishing", "Grading & Packing"].map((step, i) => (
              <div key={step} className="text-center">
                <span className="font-mono text-xs text-brass">{`0${i + 1}`}</span>
                <p className="mt-2 text-sm font-medium text-charcoal">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 md:px-8 py-20">
        <h2 className="font-display text-3xl text-charcoal text-center mb-12">Milestones</h2>
        <div className="space-y-6">
          {MILESTONES.map((m) => (
            <div key={m.year} className="flex gap-6 items-start border-b border-black/5 pb-6">
              <span className="font-display text-2xl text-deep-blue w-20 shrink-0">{m.year}</span>
              <p className="text-charcoal">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-charcoal text-stone-white py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Factory, label: "2 Owned Quarries" },
            { icon: ShieldCheck, label: "ISO 9001 Certified" },
            { icon: Award, label: "12 Export Awards" },
            { icon: Users, label: "180+ Employees" },
          ].map(({ icon: Icon, label }) => (
            <div key={label}>
              <Icon className="mx-auto text-brass" size={26} />
              <p className="mt-3 text-sm text-light-stone">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
