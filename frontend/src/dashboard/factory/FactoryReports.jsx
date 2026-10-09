import { useEffect, useState } from "react";
import { Download, TrendingUp, MessageSquareText } from "lucide-react";
import api from "../../services/api";

export default function FactoryReports() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get("/dashboard/stats").then(({ data }) => setData(data)); }, []);

  const exportCsv = () => {
    if (!data) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Products", data.cards.total_products],
      ["Total Retailers", data.cards.total_retailers],
      ["Total Customers", data.cards.total_customers],
      ["Today's Inquiries", data.cards.todays_inquiries],
      ["Pending Inquiries", data.cards.pending_inquiries],
      ["Low Stock Products", data.cards.low_stock_count],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "graniteinfy-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!data) return <p className="text-fleck text-sm">Loading reports...</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Reports</h1>
          <p className="text-sm text-fleck mt-1">Top products, inquiry trends, and monthly exports.</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 bg-mist hover:bg-light-stone/30 text-charcoal px-5 py-2.5 rounded-full text-sm font-medium">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg text-charcoal mb-4"><TrendingUp size={18} className="text-deep-blue" /> Most Viewed Products</h3>
          <ol className="space-y-2.5">
            {data.most_viewed_products.map((p, i) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span className="text-charcoal">{i + 1}. {p.name}</span>
                <span className="text-fleck font-mono text-xs">{p.view_count} views</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg text-charcoal mb-4"><MessageSquareText size={18} className="text-deep-blue" /> Most Inquired Products</h3>
          <ol className="space-y-2.5">
            {data.most_inquired_products.map((p, i) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span className="text-charcoal">{i + 1}. {p.name}</span>
                <span className="text-fleck font-mono text-xs">{p.inquiry_count} inquiries</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6">
        <h3 className="font-display text-lg text-charcoal mb-4">Monthly Summary</h3>
        <p className="text-sm text-fleck">
          {data.cards.total_products} products live across the catalog, {data.cards.total_retailers} approved and pending
          retail dealers, and {data.cards.pending_inquiries} inquiries awaiting a response. Download the CSV above for a
          shareable snapshot, or connect this endpoint to a PDF export service for branded monthly reports.
        </p>
      </div>
    </div>
  );
}
