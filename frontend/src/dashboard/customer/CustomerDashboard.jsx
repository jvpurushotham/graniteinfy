import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare } from "lucide-react";
import api from "../../services/api";
import SimpleDashboardShell from "../SimpleDashboardShell";
import ProductCard from "../../components/ProductCard";

export default function CustomerDashboard() {
  const [wishlist, setWishlist] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [tab, setTab] = useState("wishlist");

  useEffect(() => {
    api.get("/wishlist").then(({ data }) => setWishlist(data.wishlist));
    api.get("/inquiries/my").then(({ data }) => setInquiries(data.inquiries));
  }, []);

  return (
    <SimpleDashboardShell title="My Dashboard">
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <div className="bg-white rounded-2xl p-5 border border-black/5">
          <div className="w-9 h-9 rounded-lg bg-deep-blue/10 flex items-center justify-center text-deep-blue mb-3"><Heart size={16} /></div>
          <p className="font-display text-2xl text-charcoal">{wishlist.length}</p>
          <p className="text-xs text-fleck mt-1">Saved Products</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5">
          <div className="w-9 h-9 rounded-lg bg-deep-blue/10 flex items-center justify-center text-deep-blue mb-3"><MessageSquare size={16} /></div>
          <p className="font-display text-2xl text-charcoal">{inquiries.length}</p>
          <p className="text-xs text-fleck mt-1">Quote Requests</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6" id="wishlist">
        <button onClick={() => setTab("wishlist")} className={`text-sm px-4 py-2 rounded-full ${tab === "wishlist" ? "bg-deep-blue text-white" : "bg-white text-charcoal border border-black/10"}`}>Wishlist</button>
        <button onClick={() => setTab("inquiries")} className={`text-sm px-4 py-2 rounded-full ${tab === "inquiries" ? "bg-deep-blue text-white" : "bg-white text-charcoal border border-black/10"}`}>Inquiry History</button>
      </div>

      {tab === "wishlist" ? (
        wishlist.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-fleck text-sm">No saved products yet.</p>
            <Link to="/catalog" className="text-deep-blue text-sm font-medium mt-2 inline-block">Browse the catalog →</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )
      ) : (
        inquiries.length === 0 ? (
          <p className="text-fleck text-sm text-center py-16">No inquiries submitted yet.</p>
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
