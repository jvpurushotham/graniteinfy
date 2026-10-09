import { useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const TYPES = [
  { value: "quote", label: "Request Quote" },
  { value: "callback", label: "Request Callback" },
  { value: "visit", label: "Schedule Visit" },
  { value: "question", label: "Ask a Question" },
];

export default function InquiryModal({ product, onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    inquiry_type: "quote", message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/inquiries", { ...form, product_id: product?.id });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-7 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 text-fleck hover:text-charcoal">
          <X size={20} />
        </button>

        {status === "sent" ? (
          <div className="text-center py-8">
            <h3 className="font-display text-2xl text-charcoal">Inquiry sent</h3>
            <p className="mt-2 text-sm text-fleck">Our sales team will get back to you shortly.</p>
            <button onClick={onClose} className="mt-6 bg-deep-blue text-white px-6 py-2.5 rounded-full text-sm font-medium">Done</button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-2xl text-charcoal">Contact the Factory</h3>
            {product && <p className="text-sm text-fleck mt-1">Regarding: {product.name} ({product.product_code})</p>}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setForm((f) => ({ ...f, inquiry_type: t.value }))}
                    className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                      form.inquiry_type === t.value ? "bg-deep-blue text-white border-deep-blue" : "border-black/10 text-charcoal"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <input required placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
              <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
              <input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
              <textarea placeholder="Message (optional)" rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue resize-none" />

              {status === "error" && <p className="text-xs text-red-600">Something went wrong. Please try again.</p>}

              <button type="submit" disabled={status === "sending"} className="w-full bg-deep-blue hover:bg-deep-blue-hover text-white py-3 rounded-full font-medium text-sm transition-colors disabled:opacity-60">
                {status === "sending" ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
