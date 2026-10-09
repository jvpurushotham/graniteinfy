import { Link } from "react-router-dom";
import { Percent, Package, Headphones, FileCheck } from "lucide-react";

const BENEFITS = [
  { icon: Percent, title: "Wholesale Pricing", text: "Unlock dealer-only rates after approval, visible right on every product page." },
  { icon: Package, title: "Sample & Bulk Requests", text: "Request physical samples or place bulk quantity quotes directly from your dashboard." },
  { icon: Headphones, title: "Dedicated Sales Support", text: "A named account manager for order tracking, disputes, and priority restocking." },
  { icon: FileCheck, title: "Digital Invoicing", text: "Every order and quote logged with downloadable invoices in your dashboard." },
];

export default function Retailers() {
  return (
    <div>
      <section className="bg-charcoal text-stone-white relative overflow-hidden">
        <div className="absolute inset-0 speckle" />
        <div className="relative max-w-5xl mx-auto px-5 md:px-8 py-24 text-center">
          <h1 className="font-display text-4xl md:text-5xl">Become a Retail Partner</h1>
          <p className="mt-5 text-light-stone max-w-xl mx-auto">Join 1,200+ dealers sourcing directly from our quarries, with pricing and stock you can see in real time.</p>
          <Link to="/register" className="mt-8 inline-block bg-brass text-charcoal px-7 py-3.5 rounded-full font-semibold">
            Register as a Dealer
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <h2 className="font-display text-3xl text-charcoal text-center mb-12">Dealer Benefits</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-5 p-6 rounded-2xl border border-black/5 bg-white">
              <div className="w-11 h-11 rounded-xl bg-deep-blue/10 flex items-center justify-center text-deep-blue shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg text-charcoal">{title}</h3>
                <p className="mt-1 text-sm text-fleck leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display text-3xl text-charcoal mb-4">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10 text-left">
            {[
              ["01", "Register", "Submit your company details and GST information."],
              ["02", "Get Approved", "Our team verifies and approves your dealer account, usually within 48 hours."],
              ["03", "Start Ordering", "Browse wholesale pricing, request samples, and place quotes."],
            ].map(([num, title, text]) => (
              <div key={num}>
                <span className="font-mono text-xs text-brass">{num}</span>
                <h3 className="font-display text-xl text-charcoal mt-2">{title}</h3>
                <p className="mt-2 text-sm text-fleck">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
