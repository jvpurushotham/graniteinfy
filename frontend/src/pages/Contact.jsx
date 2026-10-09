import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import api from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", inquiry_type: "question" });
  const [status, setStatus] = useState("idle");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/inquiries", form);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-2 gap-14">
      <div>
        <span className="font-mono text-xs text-fleck tracking-wide">GET IN TOUCH</span>
        <h1 className="font-display text-4xl text-charcoal mt-1">Contact the Factory</h1>
        <p className="mt-4 text-fleck leading-relaxed">Have a bulk order, dealer question, or need a custom slab cut? Reach us directly.</p>

        <div className="mt-8 space-y-4 text-sm">
          <div className="flex items-center gap-3"><Phone size={17} className="text-deep-blue" /> +91 98765 43210</div>
          <div className="flex items-center gap-3"><Mail size={17} className="text-deep-blue" /> hello@graniteinfy.com</div>
          <div className="flex items-center gap-3"><MessageCircle size={17} className="text-deep-blue" /> WhatsApp: +91 98765 43210</div>
          <div className="flex items-start gap-3"><MapPin size={17} className="text-deep-blue mt-0.5" /> Plot 14, Industrial Estate, Karimnagar, Telangana, India - 505001</div>
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden aspect-video">
          <iframe
            title="Factory location"
            className="w-full h-full border-0"
            src="https://maps.google.com/maps?q=Karimnagar,Telangana,India&output=embed"
          />
        </div>
      </div>

      <div className="bg-mist rounded-2xl p-7">
        {status === "sent" ? (
          <p className="text-charcoal">Thanks — your message has been sent. We'll respond within one business day.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input required placeholder="Your name" value={form.name} onChange={set("name")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue bg-white" />
            <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue bg-white" />
            <input placeholder="Phone" value={form.phone} onChange={set("phone")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue bg-white" />
            <textarea required rows={5} placeholder="Your message" value={form.message} onChange={set("message")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue bg-white resize-none" />
            {status === "error" && <p className="text-xs text-red-600">Something went wrong, please try again.</p>}
            <button type="submit" disabled={status === "sending"} className="w-full bg-deep-blue hover:bg-deep-blue-hover text-white py-3 rounded-full font-medium text-sm transition-colors disabled:opacity-60">
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
