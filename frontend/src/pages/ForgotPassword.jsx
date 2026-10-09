import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-mist px-5 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="font-display text-3xl text-charcoal text-center">Reset your password</h1>
        {sent ? (
          <p className="mt-6 text-sm text-center text-fleck">If an account exists for {email}, a reset link is on its way.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input required type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
            <button type="submit" disabled={loading} className="w-full bg-deep-blue hover:bg-deep-blue-hover text-white py-3 rounded-full font-medium text-sm transition-colors disabled:opacity-60">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
        <p className="text-center text-sm text-fleck mt-6">
          <Link to="/login" className="text-deep-blue font-medium">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
