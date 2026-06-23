"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { ArrowLeft, DollarSign, Calendar, Hash, FileText, Loader2 } from "lucide-react";

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fmtDate(s?: string | null) { if (!s) return "—"; return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

const TYPE_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  income: "success", revenue: "success", expense: "danger", transfer: "info", journal: "primary",
};

interface Transaction { id: number; account_id: number; type: string; amount: number; reference?: string; description?: string; date?: string; created_by?: string; created_at: string; }

export default function JournalEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: Transaction }>(`/finance/transactions/${params.id}`)
      .then((res) => setTx(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !tx) return <div className="text-center py-20 text-danger">{error || "Transaction not found"}</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/finance/journal")}>Journal Entries</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">TXN-{tx.id}</span>
      </div>

      <PageHeader
        title={`TXN-${tx.id}`}
        description={`Transaction — ${fmtDate(tx.date || tx.created_at)}`}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <button onClick={() => router.push("/finance/journal")} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Amount</p></div>
          <p className={`text-2xl font-bold ${tx.amount >= 0 ? "text-success" : "text-danger"}`}>{fmt(tx.amount)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Hash className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Type</p></div>
          <StatusBadge status={tx.type} variant={TYPE_VARIANT[tx.type] || "muted"} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><FileText className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Reference</p></div>
          <p className="text-2xl font-bold">{tx.reference || "—"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Date</p></div>
          <p className="text-2xl font-bold">{fmtDate(tx.date || tx.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Transaction Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Transaction ID</span><span className="text-sm font-medium">TXN-{tx.id}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Type</span><StatusBadge status={tx.type} variant={TYPE_VARIANT[tx.type] || "muted"} /></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Account ID</span><span className="text-sm font-medium">{tx.account_id}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Amount</span><span className={`text-sm font-bold ${tx.amount >= 0 ? "text-success" : "text-danger"}`}>{fmt(tx.amount)}</span></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Reference</span><span className="text-sm font-medium">{tx.reference || "—"}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Description</span><span className="text-sm font-medium">{tx.description || "—"}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Date</span><span className="text-sm font-medium">{fmtDate(tx.date)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Created By</span><span className="text-sm font-medium">{tx.created_by || "—"}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Created At</span><span className="text-sm font-medium">{fmtDate(tx.created_at)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
