"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { Receipt, Search, Plus, Eye, Loader2 } from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  applied: "success", pending: "warning", draft: "muted", rejected: "danger", paid: "success",
};
function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fmtDate(s?: string | null) { if (!s) return "—"; return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

interface DebitNote { id: number; debit_number: string; supplier_id?: number; amount: number; status: string; reason?: string; invoice_id?: number; date: string; }

export default function DebitNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<DebitNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    apiGet<{ items: DebitNote[] }>("/finance/debit-notes")
      .then((res) => setNotes(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter((n) => {
    const matchSearch = !searchTerm || n.debit_number.toLowerCase().includes(searchTerm.toLowerCase()) || (n.reason || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === "All" || n.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const totalValue = notes.reduce((s, n) => s + n.amount, 0);
  const pendingCount = notes.filter((n) => n.status === "pending" || n.status === "draft").length;
  const appliedCount = notes.filter((n) => n.status === "applied").length;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Debit Notes</span>
      </div>

      <PageHeader
        title="Debit Notes"
        description="Issue and manage debit notes for supplier adjustments and disputes."
        icon={<Receipt className="h-6 w-6 text-primary" />}
        actions={<button onClick={() => router.push("/finance/debit-notes/new")} className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"><Plus className="h-4 w-4" /> New Debit Note</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">Total Debit Notes</p><p className="text-2xl font-bold mt-1">{notes.length}</p></div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">Total Value</p><p className="text-2xl font-bold mt-1">{fmt(totalValue)}</p></div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold mt-1">{pendingCount}</p></div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">Applied</p><p className="text-2xl font-bold mt-1">{appliedCount}</p></div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search debit notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="All">Status: All</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="applied">Applied</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...</div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-danger">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Debit Note</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Reason</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Invoice Ref</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Amount</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((note) => (
                  <tr key={note.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4"><span className="text-sm font-medium text-primary">{note.debit_number}</span></td>
                    <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{fmtDate(note.date)}</span></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{note.reason || "—"}</span></td>
                    <td className="py-3 px-4 hidden xl:table-cell"><span className="text-sm text-primary">{note.invoice_id ? `INV-${note.invoice_id}` : "—"}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm font-semibold text-danger">{fmt(note.amount)}</span></td>
                    <td className="py-3 px-4"><StatusBadge status={note.status} variant={STATUS_VARIANT[note.status] || "muted"} /></td>
                    <td className="py-3 px-4 text-right"><button onClick={() => router.push(`/finance/debit-notes/${note.id}`)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t border-border"><p className="text-sm text-muted-foreground">Showing {filtered.length} of {notes.length} debit notes</p></div>
      </div>
    </div>
  );
}
