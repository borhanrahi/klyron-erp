"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import {
  FileText,
  Download,
  Send,
  Printer,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Mail,
  DollarSign,
  Calendar,
  Loader2,
  Trash2,
} from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  paid: "success", pending: "warning", partial: "info", overdue: "danger", draft: "muted", cancelled: "danger", sent: "info",
};

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fmtDate(s?: string | null) { if (!s) return "—"; return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

interface InvoiceItem { id: number; description?: string; quantity: number; unit_price: number; tax: number; total: number; }
interface Invoice { id: number; invoice_number: string; customer_id?: number; date: string; due_date?: string; subtotal: number; tax: number; total: number; paid_amount: number; balance_due: number; status: string; notes?: string; items: InvoiceItem[]; }

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "items">("details");
  const { confirm, state, handleClose } = useConfirm();

  useEffect(() => {
    apiGet<{ data: Invoice }>(`/finance/invoices/${params.id}`)
      .then((res) => setInvoice(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    const ok = await confirm("Delete this invoice?");
    if (!ok) return;
    try {
      await apiDelete(`/finance/invoices/${params.id}`);
      router.push("/finance/invoices");
    } catch { alert("Failed to delete"); }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !invoice) return <div className="text-center py-20 text-danger">{error || "Invoice not found"}</div>;

  const statusLabel = invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/finance/invoices")}>Invoices</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">{invoice.invoice_number}</span>
      </div>

      <PageHeader
        title={invoice.invoice_number}
        description={`Invoice — ${fmtDate(invoice.date)}`}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/finance/invoices")} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button onClick={handleDelete} className="border border-danger/50 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Total Amount</p></div>
          <p className="text-2xl font-bold">{fmt(invoice.total)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><CreditCard className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Amount Paid</p></div>
          <p className="text-2xl font-bold text-success">{fmt(invoice.paid_amount)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Balance Due</p></div>
          <p className={`text-2xl font-bold ${invoice.balance_due > 0 ? "text-danger" : "text-success"}`}>{fmt(invoice.balance_due)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Due Date</p></div>
          <p className="text-2xl font-bold">{fmtDate(invoice.due_date)}</p>
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
            <h3 className="text-lg font-semibold mb-4">Invoice Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Status</span><StatusBadge status={statusLabel} variant={STATUS_VARIANT[invoice.status] || "muted"} /></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Invoice Number</span><span className="text-sm font-medium">{invoice.invoice_number}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Date</span><span className="text-sm font-medium">{fmtDate(invoice.date)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Due Date</span><span className="text-sm font-medium">{fmtDate(invoice.due_date)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Customer ID</span><span className="text-sm font-medium">{invoice.customer_id || "—"}</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Amounts</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Subtotal</span><span className="text-sm font-medium">{fmt(invoice.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Tax</span><span className="text-sm font-medium">{fmt(invoice.tax)}</span></div>
              <div className="flex justify-between border-t border-border pt-3"><span className="text-base font-semibold">Total</span><span className="text-lg font-bold text-primary">{fmt(invoice.total)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Paid</span><span className="text-sm font-medium text-success">{fmt(invoice.paid_amount)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Balance Due</span><span className="text-sm font-bold text-danger">{fmt(invoice.balance_due)}</span></div>
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
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">Unit Price</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">Tax</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-2 w-24">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(invoice.items || []).map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-2 text-sm">{item.description || "—"}</td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{fmt(item.unit_price)}</td>
                    <td className="py-3 px-2 text-sm text-right text-muted-foreground">{fmt(item.tax)}</td>
                    <td className="py-3 px-2 text-sm text-right font-medium">{fmt(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {invoice.notes && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </div>
      )}
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
