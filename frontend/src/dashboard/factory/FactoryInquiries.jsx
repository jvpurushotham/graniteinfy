import { useEffect, useState } from "react";
import api from "../../services/api";

const STATUSES = ["pending", "contacted", "closed"];

export default function FactoryInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState("");
  const [notesDraft, setNotesDraft] = useState({});

  const load = () => {
    api.get("/inquiries", { params: filter ? { status: filter } : {} }).then(({ data }) => setInquiries(data.inquiries));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/inquiries/${id}`, { status });
    load();
  };

  const saveNotes = async (id) => {
    await api.put(`/inquiries/${id}`, { internal_notes: notesDraft[id] });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Inquiries</h1>
        <p className="text-sm text-fleck mt-1">Quotes, callbacks, visits, and questions from customers and dealers.</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilter("")} className={`text-xs px-3 py-1.5 rounded-full ${filter === "" ? "bg-deep-blue text-white" : "bg-mist text-charcoal"}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full capitalize ${filter === s ? "bg-deep-blue text-white" : "bg-mist text-charcoal"}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-4">
        {inquiries.length === 0 && <p className="text-sm text-fleck">No inquiries found.</p>}
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white rounded-2xl border border-black/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-charcoal">{inq.user?.name || inq.guest_name} <span className="text-xs text-fleck font-normal">({inq.user?.email || inq.guest_email})</span></p>
                <p className="text-xs text-fleck mt-0.5">{inq.guest_phone} · {new Date(inq.created_at).toLocaleString()}</p>
                <p className="text-sm text-charcoal mt-2">
                  <span className="font-mono text-xs bg-mist px-2 py-0.5 rounded-full mr-2 capitalize">{inq.inquiry_type}</span>
                  {inq.product ? `Re: ${inq.product.name}` : "General inquiry"}
                </p>
                {inq.message && <p className="text-sm text-fleck mt-2 italic">"{inq.message}"</p>}
              </div>
              <select value={inq.status} onChange={(e) => updateStatus(inq.id, e.target.value)}
                className={`text-xs px-3 py-1.5 rounded-full border capitalize ${
                  inq.status === "pending" ? "bg-brass/20 text-brass border-brass/30" : inq.status === "contacted" ? "bg-deep-blue/10 text-deep-blue border-deep-blue/20" : "bg-mist text-fleck border-black/10"
                }`}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                placeholder="Internal notes..."
                defaultValue={inq.internal_notes || ""}
                onChange={(e) => setNotesDraft((d) => ({ ...d, [inq.id]: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg border border-black/10 text-xs outline-none focus:border-deep-blue"
              />
              <button onClick={() => saveNotes(inq.id)} className="text-xs px-4 py-2 rounded-lg bg-mist text-charcoal font-medium hover:bg-light-stone/30">Save Note</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
