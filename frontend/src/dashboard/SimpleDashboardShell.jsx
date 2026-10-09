import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SimpleDashboardShell({ title, subtitle, children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-charcoal text-stone-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl">GraniteInfy</Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-light-stone">{user?.name}</span>
            <button onClick={logout} className="text-light-stone hover:text-brass">Sign out</button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        <h1 className="font-display text-3xl text-charcoal">{title}</h1>
        {subtitle && <p className="text-sm text-fleck mt-1">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
