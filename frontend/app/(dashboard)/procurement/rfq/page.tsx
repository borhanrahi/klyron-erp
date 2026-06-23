"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import { FileText, Search, Plus, Eye, Trash2, Loader2 } from "lucide-react";

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fmtDate(s?: string | null) { if (!s) return "—"; return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "muted"> = {
  draft: "muted", open: "info", submitted: "warning", awarded: "success", closed: "muted", rejected: "danger",
};

interface RFQItem {
  id: number;
  rfq_number: string;
  title: string;
  description?: string;
  supplier_id?: number;
  status: string;
  issue_date?: string;
  due_date?: string;
  total_amount: number;
  created_at?: string;
}

export default function RFQListPage() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<RFQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchRFQs = () => {
    setLoading(true);
    apiGet<{ items: RFQItem[] }>("/procurement/rfqs")
      .then((res) => setRfqs(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRFQs(); }, []);

  const filtered = rfqs.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.rfq_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: rfqs.length,
    open: rfqs.filter((r) => r.status === "open").length,
    submitted: rfqs.filter((r) => r.status === "submitted").length,
    awarded: rfqs.filter((r) => r.status === "awarded").length,
    totalValue: rfqs.reduce((s, r) => s + (r.total_amount || 0), 0),
  };

  async function handleDelete(id: number) {
    if (!confirm("Delete this RFQ?")) return;
    try {
      await apiDelete(`/procurement/rfqs/${id}`);
      fetchRFQs();
    } catch { alert("Failed to delete RFQ"); }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Procurement</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Requests for Quotation</span>
      </div>

      <PageHeader
        title="Requests for Quotation"
        description="Manage and track RFQs sent to suppliers."
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <button onClick={() => alert("RFQ creation coming soon")} className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create RFQ
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total RFQs", value: stats.total, color: "text-foreground" },
          { label: "Open", value: stats.open, color: "text-info" },
          { label: "Submitted", value: stats.submitted, color: "text-warning" },
          { label: "Awarded", value: stats.awarded, color: "text-success" },
          { label: "Total Value", value: fmt(stats.totalValue), color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search RFQs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="All">Status: All</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="submitted">Submitted</option>
              <option value="awarded">Awarded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading RFQs...</div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-danger">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">RFQ Number</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Title</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Issue Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Due Date</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Amount</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4"><span className="text-sm font-medium text-primary">{rfq.rfq_number}</span></td>
                    <td className="py-3 px-4"><span className="text-sm font-medium">{rfq.title}</span></td>
                    <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{fmtDate(rfq.issue_date)}</span></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{fmtDate(rfq.due_date)}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm font-semibold">{fmt(rfq.total_amount)}</span></td>
                    <td className="py-3 px-4"><StatusBadge status={rfq.status} variant={STATUS_VARIANT[rfq.status] || "muted"} /></td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => alert("RFQ detail coming soon")} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(rfq.id)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No RFQs found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {rfqs.length} RFQs</p>
        </div>
      </div>
    </div>
  );
}
