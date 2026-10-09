import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Users2, UserCheck, MessageSquare, AlertTriangle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../services/api";

export default function FactoryOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then(({ data }) => setData(data));
  }, []);

  if (!data) return <p className="text-fleck text-sm">Loading dashboard...</p>;

  const cards = [
    { label: "Total Products", value: data.cards.total_products, icon: Package, color: "text-deep-blue" },
    { label: "Retailers", value: data.cards.total_retailers, icon: Users2, color: "text-deep-blue" },
    { label: "Customers", value: data.cards.total_customers, icon: UserCheck, color: "text-deep-blue" },
    { label: "Today's Inquiries", value: data.cards.todays_inquiries, icon: MessageSquare, color: "text-brass" },
    { label: "Pending Inquiries", value: data.cards.pending_inquiries, icon: Clock, color: "text-brass" },
    { label: "Low Stock Alerts", value: data.cards.low_stock_count, icon: AlertTriangle, color: "text-red-500" },
  ];

  const chartData = data.most_viewed_products.map((p) => ({ name: p.name, views: p.view_count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Overview</h1>
        <p className="text-sm text-fleck mt-1">Live snapshot of catalog, dealer, and inquiry activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-black/5">
            <div className={`w-9 h-9 rounded-lg bg-mist flex items-center justify-center ${color} mb-4`}>
              <Icon size={17} />
            </div>
            <p className="font-display text-3xl text-charcoal">{value}</p>
            <p className="text-xs text-fleck mt-1">{label}</p>
          </div>
        ))}
      </div>

      {data.cards.pending_dealer_approvals > 0 && (
        <div className="bg-brass/15 border border-brass/40 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm text-charcoal">
            <strong>{data.cards.pending_dealer_approvals}</strong> dealer application(s) awaiting approval.
          </p>
          <Link to="/factory/dashboard/dealers" className="text-sm font-medium text-deep-blue">Review →</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <h3 className="font-display text-lg text-charcoal mb-4">Most Viewed Products</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F3F4" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="views" fill="#1D3E8C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <h3 className="font-display text-lg text-charcoal mb-4">Recent Inquiries</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.recent_inquiries.length === 0 && <p className="text-sm text-fleck">No inquiries yet.</p>}
            {data.recent_inquiries.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between text-sm border-b border-black/5 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-charcoal">{inq.user?.name || inq.guest_name}</p>
                  <p className="text-xs text-fleck">{inq.product?.name || "General inquiry"} · {inq.inquiry_type}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                  inq.status === "pending" ? "bg-brass/20 text-brass" : inq.status === "contacted" ? "bg-deep-blue/10 text-deep-blue" : "bg-mist text-fleck"
                }`}>
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/factory/dashboard/inquiries" className="block mt-4 text-sm font-medium text-deep-blue">Manage all inquiries →</Link>
        </div>
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <h3 className="font-display text-lg text-charcoal mb-4">Low Stock Alerts</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.low_stock_products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-mist text-sm">
                <span className="text-charcoal font-medium">{p.name}</span>
                <span className="text-red-500 font-mono text-xs">{p.available_quantity_sqft} sqft</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
