"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  Package,
  Loader2,
} from "lucide-react";

function fmtDate(s?: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "muted"> = {
  draft: "muted", received: "success", partial: "warning", rejected: "danger", confirmed: "info",
};

interface GRNItem {
  id: number;
  grn_id: number;
  po_item_id?: number;
  received_qty: number;
  accepted_qty: number;
  rejected_qty: number;
  reason?: string;
}

interface GRNRecord {
  id: number;
  grn_number: string;
  po_id?: number;
  date?: string;
  received_by?: number;
  status: string;
  warehouse_id?: number;
  notes?: string;
  created_at?: string;
  items?: GRNItem[];
}

export default function GRNListPage() {
  const router = useRouter();
  const [grns, setGrns] = useState<GRNRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { confirm, state, handleClose } = useConfirm();

  const fetchGRNs = () => {
    setLoading(true);
    apiGet<{ items: GRNRecord[] }>("/procurement/grn")
      .then((res) => setGrns(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGRNs(); }, []);

  const filtered = grns.filter((g) => {
    const matchSearch = g.grn_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: grns.length,
    draft: grns.filter((g) => g.status === "draft").length,
    received: grns.filter((g) => g.status === "received").length,
    partial: grns.filter((g) => g.status === "partial").length,
  };

  async function handleDelete(id: number) {
    const ok = await confirm("Delete this GRN?");
    if (!ok) return;
    try {
      await apiDelete(`/procurement/grn/${id}`);
      fetchGRNs();
    } catch { alert("Failed to delete GRN"); }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Procurement</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Goods Received Notes</span>
      </div>

      <PageHeader
        title="Goods Received Notes"
        description="Track received goods against purchase orders."
        icon={<Package className="h-6 w-6 text-primary" />}
        actions={
          <button onClick={() => router.push("/procurement/grn/new")} className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
            <Plus className="h-4 w-4" /> New GRN
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total GRNs", value: stats.total, color: "text-foreground" },
          { label: "Draft", value: stats.draft, color: "text-muted-foreground" },
          { label: "Received", value: stats.received, color: "text-success" },
          { label: "Partial", value: stats.partial, color: "text-warning" },
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
              <input type="text" placeholder="Search GRNs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="All">Status: All</option>
              <option value="draft">Draft</option>
              <option value="received">Received</option>
              <option value="partial">Partial</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading GRNs...</div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-danger">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">GRN Number</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">PO Reference</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Items</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((grn) => (
                  <tr key={grn.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4"><span className="text-sm font-medium text-primary">{grn.grn_number}</span></td>
                    <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{grn.po_id ? `PO-${grn.po_id}` : "—"}</span></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{fmtDate(grn.date || grn.created_at)}</span></td>
                    <td className="py-3 px-4"><span className="text-sm text-muted-foreground">{grn.items?.length || 0} items</span></td>
                    <td className="py-3 px-4"><StatusBadge status={grn.status} variant={STATUS_VARIANT[grn.status] || "muted"} /></td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => router.push(`/procurement/grn/${grn.id}`)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(grn.id)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No GRNs found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {grns.length} GRNs</p>
        </div>
      </div>
      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
