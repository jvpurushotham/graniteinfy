import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-light-stone">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-display text-2xl text-stone-white">GraniteInfy</span>
          <p className="mt-4 text-sm leading-relaxed text-fleck">
            Direct-from-quarry granite for retailers, builders, and designers —
            without the sample crates.
          </p>
        </div>

        <div>
          <h4 className="text-stone-white text-sm font-semibold tracking-wide uppercase mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/catalog" className="hover:text-brass">Product Catalog</Link></li>
            <li><Link to="/projects" className="hover:text-brass">Projects Gallery</Link></li>
            <li><Link to="/retailers" className="hover:text-brass">Become a Dealer</Link></li>
            <li><Link to="/blog" className="hover:text-brass">Blog & Buying Guides</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-white text-sm font-semibold tracking-wide uppercase mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-brass">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brass">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-brass">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-white text-sm font-semibold tracking-wide uppercase mb-4">Reach the factory</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={15} className="text-brass shrink-0" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-brass shrink-0" /> hello@graniteinfy.com</li>
            <li className="flex items-center gap-2"><MessageCircle size={15} className="text-brass shrink-0" /> WhatsApp Us</li>
            <li className="flex items-start gap-2"><MapPin size={15} className="text-brass shrink-0 mt-0.5" /> Plot 14, Industrial Estate, Karimnagar, Telangana, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-fleck">
        © {new Date().getFullYear()} GraniteInfy. All rights reserved.
      </div>
    </footer>
  );
}
