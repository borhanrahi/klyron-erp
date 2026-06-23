"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import {
  FileText,
  ArrowLeft,
  DollarSign,
  Calendar,
  Hash,
  Loader2,
  Trash2,
} from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  approved: "success", pending: "warning", draft: "muted", rejected: "danger", converted: "info",
};

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fmtDate(s?: string | null) { if (!s) return "—"; return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

interface EstimateItem { id: number; item_id: number; qty: number; price: number; total: number; }
interface Estimate {
  id: number;
  estimate_number: string;
  customer_id: number;
  date: string;
  expiry_date: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  converted_to_invoice_id: number | null;
  items: EstimateItem[];
}

export default function EstimateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "items">("details");

  useEffect(() => {
    apiGet<{ data: Estimate }>(`/finance/estimates/${params.id}`)
      .then((res) => setEstimate(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Delete this estimate?")) return;
    try {
      await apiDelete(`/finance/estimates/${params.id}`);
      router.push("/finance/estimates");
    } catch { alert("Failed to delete"); }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !estimate) return <div className="text-center py-20 text-danger">{error || "Estimate not found"}</div>;

  const statusLabel = estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/finance/estimates")}>Estimates</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">{estimate.estimate_number}</span>
      </div>

      <PageHeader
        title={estimate.estimate_number}
        description={`Estimate — ${fmtDate(estimate.date)}`}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/finance/estimates")} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button onClick={handleDelete} className="bg-danger/10 text-danger border border-danger/20 px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Total Amount</p></div>
          <p className="text-2xl font-bold">{fmt(estimate.total)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Hash className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Status</p></div>
          <div className="mt-1"><StatusBadge status={statusLabel} variant={STATUS_VARIANT[estimate.status] || "muted"} /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Expiry Date</p></div>
          <p className="text-2xl font-bold">{fmtDate(estimate.expiry_date)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><FileText className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Items</p></div>
          <p className="text-2xl font-bold">{estimate.items?.length || 0}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-border">
        {(["details", "items"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab === "items" ? "Line Items" : "Details"}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Estimate Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Status</span><StatusBadge status={statusLabel} variant={STATUS_VARIANT[estimate.status] || "muted"} /></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Estimate Number</span><span className="text-sm font-medium">{estimate.estimate_number}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Date</span><span className="text-sm font-medium">{fmtDate(estimate.date)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Expiry Date</span><span className="text-sm font-medium">{fmtDate(estimate.expiry_date)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Customer ID</span><span className="text-sm font-medium">{estimate.customer_id || "—"}</span></div>
              {estimate.converted_to_invoice_id && (
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Converted To Invoice</span><span className="text-sm font-medium text-success">Invoice #{estimate.converted_to_invoice_id}</span></div>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Amounts</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Subtotal</span><span className="text-sm font-medium">{fmt(estimate.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Tax</span><span className="text-sm font-medium">{fmt(estimate.tax)}</span></div>
              <div className="flex justify-between border-t border-border pt-3"><span className="text-base font-semibold">Total</span><span className="text-lg font-bold text-primary">{fmt(estimate.total)}</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "items" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Line Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2">Description</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-16">Qty</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">Price</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(estimate.items || []).map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-2 text-sm">{item.item_id || "—"}</td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{item.qty}</td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{fmt(item.price)}</td>
                    <td className="py-3 px-2 text-sm text-right font-medium">{fmt(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
