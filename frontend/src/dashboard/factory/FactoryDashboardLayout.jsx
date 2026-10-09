import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, Inbox, Users2, FileBarChart, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/factory/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/factory/dashboard/products", label: "Products", icon: Package },
  { to: "/factory/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/factory/dashboard/dealers", label: "Dealers", icon: Users2 },
  { to: "/factory/dashboard/reports", label: "Reports", icon: FileBarChart },
];

export default function FactoryDashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-mist">
      <aside className="w-60 shrink-0 bg-charcoal text-stone-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="font-display text-xl">GraniteInfy</Link>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-deep-blue text-white" : "text-light-stone hover:bg-white/5"
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-light-stone hover:bg-white/5">
            <ExternalLink size={16} /> View Site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-light-stone hover:bg-white/5">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-8">
          <div>
            <p className="text-xs text-fleck">Factory Admin</p>
            <p className="text-sm font-semibold text-charcoal">{user?.name}</p>
          </div>
          <span className="text-xs bg-mist px-3 py-1.5 rounded-full text-fleck capitalize">{user?.role?.replace("_", " ")}</span>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
