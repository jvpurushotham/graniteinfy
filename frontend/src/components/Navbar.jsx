import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search, Heart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/retailers", label: "Retailers" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user?.role?.startsWith("factory") || user?.role === "sales_manager"
    ? "/factory/dashboard"
    : user?.role === "retailer"
    ? "/retailer/dashboard"
    : "/customer/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-2xl text-stone-white tracking-tight">GraniteInfy</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-brass" : "text-light-stone hover:text-stone-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => navigate("/catalog")}
            aria-label="Search catalog"
            className="text-light-stone hover:text-stone-white transition-colors"
          >
            <Search size={19} />
          </button>
          {user ? (
            <>
              <Link to="/customer/dashboard#wishlist" className="text-light-stone hover:text-stone-white transition-colors" aria-label="Wishlist">
                <Heart size={19} />
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm text-stone-white font-medium">
                  <span className="w-8 h-8 rounded-full bg-deep-blue flex items-center justify-center text-xs uppercase">
                    {user.name?.[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-card-dark py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to={dashboardPath} className="block px-4 py-2 text-sm text-stone-white hover:text-brass">Dashboard</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-stone-white hover:text-brass">Sign out</button>
                </div>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-deep-blue hover:bg-deep-blue-hover text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <User size={16} /> Sign in
            </Link>
          )}
        </div>

        <button className="lg:hidden text-stone-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-charcoal border-t border-white/10 px-5 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-light-stone text-sm font-medium">
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <Link to={dashboardPath} onClick={() => setOpen(false)} className="text-brass text-sm font-medium">Dashboard</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="text-left text-light-stone text-sm font-medium">Sign out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="bg-deep-blue text-white text-sm font-medium px-4 py-2.5 rounded-full text-center">
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
