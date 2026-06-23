"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import {
  FileText,
  ArrowLeft,
  Trash2,
  DollarSign,
  Calendar,
  FileCheck,
  Loader2,
} from "lucide-react";

const STATUS_VARIANT: Record<
  string,
  "success" | "warning" | "danger" | "info" | "primary" | "muted"
> = {
  applied: "success",
  pending: "warning",
  draft: "muted",
  rejected: "danger",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function fmtDate(s?: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface CreditNote {
  id: number;
  credit_number: string;
  customer_id?: number;
  invoice_id?: number;
  amount: number;
  status: string;
  reason?: string;
  date: string;
  created_at: string;
}

export default function CreditNoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<CreditNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "info">("details");

  useEffect(() => {
    apiGet<{ data: CreditNote }>(`/finance/credit-notes/${params.id}`)
      .then((res) => setNote(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Delete this credit note?")) return;
    try {
      await apiDelete(`/finance/credit-notes/${params.id}`);
      router.push("/finance/credit-notes");
    } catch {
      alert("Failed to delete");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  if (error || !note)
    return (
      <div className="text-center py-20 text-danger">
        {error || "Credit note not found"}
      </div>
    );

  const statusLabel =
    note.status.charAt(0).toUpperCase() + note.status.slice(1);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => router.push("/finance/credit-notes")}
        >
          Credit Notes
        </span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          {note.credit_number}
        </span>
      </div>

      <PageHeader
        title={note.credit_number}
        description={`Credit Note — ${fmtDate(note.date)}`}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/finance/credit-notes")}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleDelete}
              className="border border-danger/50 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Amount</p>
          </div>
          <p className="text-2xl font-bold">{fmt(note.amount)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
          <StatusBadge
            status={statusLabel}
            variant={STATUS_VARIANT[note.status] || "muted"}
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Invoice Ref</p>
          </div>
          <p className="text-2xl font-bold">
            {note.invoice_id ? `INV-${note.invoice_id}` : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Date</p>
          </div>
          <p className="text-2xl font-bold">{fmtDate(note.date)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-border">
        {(["details", "info"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "details" ? "Details" : "Info"}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Credit Note Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge
                  status={statusLabel}
                  variant={STATUS_VARIANT[note.status] || "muted"}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Credit Number
                </span>
                <span className="text-sm font-medium">
                  {note.credit_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">
                  {fmtDate(note.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Customer ID
                </span>
                <span className="text-sm font-medium">
                  {note.customer_id || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Invoice Ref
                </span>
                <span className="text-sm font-medium">
                  {note.invoice_id ? `INV-${note.invoice_id}` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {fmtDate(note.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-base font-semibold">Amount</span>
                <span className="text-lg font-bold text-primary">
                  {fmt(note.amount)}
                </span>
              </div>
              {note.reason && (
                <div className="pt-3">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Reason
                  </span>
                  <p className="text-sm">{note.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "info" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Amounts</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Credit Amount
              </span>
              <span className="text-sm font-medium">{fmt(note.amount)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-base font-semibold">Total</span>
              <span className="text-lg font-bold text-primary">
                {fmt(note.amount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
