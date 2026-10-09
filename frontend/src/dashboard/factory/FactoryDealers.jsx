import { useEffect, useState } from "react";
import { Check, X as XIcon } from "lucide-react";
import api from "../../services/api";

export default function FactoryDealers() {
  const [dealers, setDealers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [discountDraft, setDiscountDraft] = useState({});

  const load = () => {
    api.get("/dealers", { params: filter ? { status: filter } : {} }).then(({ data }) => setDealers(data.dealers));
  };
  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => { await api.post(`/dealers/${id}/approve`); load(); };
  const reject = async (id) => { await api.post(`/dealers/${id}/reject`); load(); };
  const saveDiscount = async (id) => {
    await api.put(`/dealers/${id}/discount`, { discount_percent: discountDraft[id] });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Dealer Management</h1>
        <p className="text-sm text-fleck mt-1">Approve retail partners and manage wholesale discount rates.</p>
      </div>

      <div className="flex gap-2">
        {["pending", "approved", "rejected", ""].map((s) => (
          <button key={s || "all"} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full capitalize ${filter === s ? "bg-deep-blue text-white" : "bg-mist text-charcoal"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {dealers.length === 0 && <p className="text-sm text-fleck">No dealers in this view.</p>}
        {dealers.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-black/5 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-charcoal">{d.company_name || d.name}</p>
                <p className="text-xs text-fleck mt-0.5">{d.name} · {d.email}</p>
                <p className="text-xs text-fleck">{d.business_address}</p>
                <p className="text-xs text-fleck">GST: {d.gst_number || "—"}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full capitalize shrink-0 ${
                d.dealer_status === "approved" ? "bg-green-50 text-green-600" : d.dealer_status === "rejected" ? "bg-red-50 text-red-500" : "bg-brass/20 text-brass"
              }`}>{d.dealer_status}</span>
            </div>

            {d.dealer_status === "pending" ? (
              <div className="mt-4 flex gap-2">
                <button onClick={() => approve(d.id)} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-green-600 text-white font-medium">
                  <Check size={13} /> Approve
                </button>
                <button onClick={() => reject(d.id)} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium">
                  <XIcon size={13} /> Reject
                </button>
              </div>
            ) : d.dealer_status === "approved" ? (
              <div className="mt-4 flex items-center gap-2">
                <input type="number" placeholder="Discount %" defaultValue={d.dealer_discount_percent}
                  onChange={(e) => setDiscountDraft((s) => ({ ...s, [d.id]: e.target.value }))}
                  className="w-28 px-3 py-2 rounded-lg border border-black/10 text-xs outline-none focus:border-deep-blue" />
                <button onClick={() => saveDiscount(d.id)} className="text-xs px-4 py-2 rounded-lg bg-mist text-charcoal font-medium hover:bg-light-stone/30">Update Discount</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
