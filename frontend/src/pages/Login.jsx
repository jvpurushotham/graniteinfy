import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      const dest = user.role?.startsWith("factory") || user.role === "sales_manager"
        ? "/factory/dashboard"
        : user.role === "retailer" ? "/retailer/dashboard" : "/customer/dashboard";
      navigate(location.state?.from || dest);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-mist px-5 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="font-display text-3xl text-charcoal text-center">Welcome back</h1>
        <p className="text-sm text-fleck text-center mt-2">Sign in to your GraniteInfy account</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-medium text-fleck">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-fleck">Password</label>
              <Link to="/forgot-password" className="text-xs text-deep-blue font-medium">Forgot password?</Link>
            </div>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg border border-black/10 text-sm outline-none focus:border-deep-blue" />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-deep-blue hover:bg-deep-blue-hover text-white py-3 rounded-full font-medium text-sm transition-colors disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-fleck mt-6">
          Don't have an account? <Link to="/register" className="text-deep-blue font-medium">Create one</Link>
        </p>

        <div className="mt-8 pt-6 border-t border-black/5">
          <p className="text-xs text-fleck text-center mb-3">Demo accounts</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button type="button" onClick={() => fillDemo("owner@graniteinfy.com", "Owner@123")} className="border border-black/10 rounded-lg py-2 hover:bg-mist">Factory Admin</button>
            <button type="button" onClick={() => fillDemo("retailer@graniteinfy.com", "Retailer@123")} className="border border-black/10 rounded-lg py-2 hover:bg-mist">Retailer</button>
            <button type="button" onClick={() => fillDemo("customer@graniteinfy.com", "Customer@123")} className="border border-black/10 rounded-lg py-2 hover:bg-mist">Customer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
