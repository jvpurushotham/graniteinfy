import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", company_name: "", gst_number: "", business_address: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await register({ ...form, role });
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-mist px-5 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="font-display text-3xl text-charcoal text-center">Create your account</h1>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {["customer", "retailer"].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${role === r ? "bg-deep-blue text-white border-deep-blue" : "border-black/10 text-charcoal"}`}>
              {r === "customer" ? "Customer" : "Retailer / Dealer"}
            </button>
          ))}
        </div>

        {success ? (
          <p className="mt-8 text-sm text-center text-charcoal">{success}</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input required placeholder="Full name" value={form.name} onChange={set("name")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
            <input required type="email" placeholder="Email address" value={form.email} onChange={set("email")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
            <input placeholder="Phone number" value={form.phone} onChange={set("phone")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
            <input required type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={set("password")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />

            {role === "retailer" && (
              <>
                <input placeholder="Company name" value={form.company_name} onChange={set("company_name")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
                <input placeholder="GST number" value={form.gst_number} onChange={set("gst_number")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
                <textarea placeholder="Business address" rows={2} value={form.business_address} onChange={set("business_address")} className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue resize-none" />
                <p className="text-xs text-fleck">Dealer accounts require admin approval before wholesale pricing is unlocked.</p>
              </>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-deep-blue hover:bg-deep-blue-hover text-white py-3 rounded-full font-medium text-sm transition-colors disabled:opacity-60">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-fleck mt-6">
          Already have an account? <Link to="/login" className="text-deep-blue font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
