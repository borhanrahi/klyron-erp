"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { Package, ArrowLeft, Loader2, Calendar, Hash, MapPin, FileText } from "lucide-react";

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

interface GRNData {
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

export default function GRNDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [grn, setGrn] = useState<GRNData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: GRNData }>(`/procurement/grn/${params.id}`)
      .then((res) => setGrn(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !grn) return <div className="text-center py-20 text-danger">{error || "GRN not found"}</div>;

  const items = grn.items || [];
  const totalReceived = items.reduce((s, i) => s + i.received_qty, 0);
  const totalAccepted = items.reduce((s, i) => s + i.accepted_qty, 0);
  const totalRejected = items.reduce((s, i) => s + i.rejected_qty, 0);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/procurement/grn")}>GRN</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">{grn.grn_number}</span>
      </div>

      <PageHeader
        title={grn.grn_number}
        description={`PO Reference: ${grn.po_id ? `PO-${grn.po_id}` : "N/A"}`}
        icon={<Package className="h-6 w-6 text-primary" />}
        actions={
          <button onClick={() => router.push("/procurement/grn")} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to GRNs
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">GRN Number</p><p className="text-sm font-medium">{grn.grn_number}</p></div></div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={grn.status} variant={STATUS_VARIANT[grn.status] || "muted"} /></div></div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Date</p><p className="text-sm">{fmtDate(grn.date || grn.created_at)}</p></div></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Warehouse ID</p><p className="text-sm">{grn.warehouse_id || "—"}</p></div></div>
          </div>
          {grn.notes && <div><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm">{grn.notes}</p></div>}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-xl"><p className="text-xs text-muted-foreground">Total Received</p><p className="text-xl font-bold mt-1">{totalReceived}</p></div>
            <div className="text-center p-3 bg-muted rounded-xl"><p className="text-xs text-muted-foreground">Accepted</p><p className="text-xl font-bold mt-1 text-success">{totalAccepted}</p></div>
            <div className="text-center p-3 bg-muted rounded-xl"><p className="text-xs text-muted-foreground">Rejected</p><p className="text-xl font-bold mt-1 text-danger">{totalRejected}</p></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Items</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Item</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Received Qty</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Accepted Qty</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Rejected Qty</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4"><span className="text-sm font-medium">Item #{item.po_item_id || item.id}</span></td>
                  <td className="py-3 px-4 text-right"><span className="text-sm font-semibold">{item.received_qty}</span></td>
                  <td className="py-3 px-4 text-right"><span className="text-sm text-success font-semibold">{item.accepted_qty}</span></td>
                  <td className="py-3 px-4 text-right"><span className="text-sm text-danger font-semibold">{item.rejected_qty}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{item.reason || "—"}</span></td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No items</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
