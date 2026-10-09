import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Percent, Heart, MessageSquare, Package } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import SimpleDashboardShell from "../SimpleDashboardShell";
import ProductCard from "../../components/ProductCard";

export default function RetailerDashboard() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    api.get("/wishlist").then(({ data }) => setWishlist(data.wishlist));
    api.get("/inquiries/my").then(({ data }) => setInquiries(data.inquiries));
  }, []);

  const pendingApproval = user?.dealer_status === "pending";

  return (
    <SimpleDashboardShell title="Dealer Dashboard" subtitle={user?.company_name}>
      {pendingApproval && (
        <div className="bg-brass/15 border border-brass/40 rounded-2xl p-4 mb-8 text-sm text-charcoal">
          Your dealer application is pending admin approval. Wholesale pricing will unlock once approved.
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard icon={Percent} label="Dealer Discount" value={`${user?.dealer_discount_percent || 0}%`} />
        <StatCard icon={Heart} label="Wishlist Items" value={wishlist.length} />
        <StatCard icon={MessageSquare} label="Quote Requests" value={inquiries.length} />
      </div>

      <div className="flex gap-2 mb-6">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>Wishlist</TabBtn>
        <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>Order Requests</TabBtn>
      </div>

      {tab === "overview" ? (
        wishlist.length === 0 ? (
          <EmptyState text="No products saved yet." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      ) : (
        inquiries.length === 0 ? (
          <EmptyState text="No order or quote requests yet." />
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white rounded-2xl border border-black/5 p-4 flex justify-between text-sm">
                <div>
                  <p className="font-medium text-charcoal">{inq.product?.name || "General inquiry"}</p>
                  <p className="text-xs text-fleck">{new Date(inq.created_at).toLocaleDateString()} · {inq.inquiry_type}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-mist text-fleck capitalize h-fit">{inq.status}</span>
              </div>
            ))}
          </div>
        )
      )}
    </SimpleDashboardShell>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-black/5">
      <div className="w-9 h-9 rounded-lg bg-deep-blue/10 flex items-center justify-center text-deep-blue mb-3"><Icon size={16} /></div>
      <p className="font-display text-2xl text-charcoal">{value}</p>
      <p className="text-xs text-fleck mt-1">{label}</p>
    </div>
  );
}
function TabBtn({ active, onClick, children }) {
  return <button onClick={onClick} className={`text-sm px-4 py-2 rounded-full ${active ? "bg-deep-blue text-white" : "bg-white text-charcoal border border-black/10"}`}>{children}</button>;
}
function EmptyState({ text }) {
  return (
    <div className="text-center py-16">
      <p className="text-fleck text-sm">{text}</p>
      <Link to="/catalog" className="text-deep-blue text-sm font-medium mt-2 inline-block">Browse the catalog →</Link>
    </div>
  );
}
