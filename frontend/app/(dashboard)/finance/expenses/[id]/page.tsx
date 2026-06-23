"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import {
  Receipt,
  ArrowLeft,
  DollarSign,
  Store,
  CheckCircle,
  Clock,
  Calendar,
  Trash2,
  FileText,
  Hash,
  Loader2,
} from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function fmtDate(s?: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Expense {
  id: number;
  category_id?: number;
  amount: number;
  vendor: string;
  description?: string;
  date?: string;
  approved_by?: string | null;
  receipt_url?: string;
  created_at?: string;
}

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: Expense }>(`/finance/expenses/${params.id}`)
      .then((res) => setExpense(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Delete this expense?")) return;
    try {
      await apiDelete(`/finance/expenses/${params.id}`);
      router.push("/finance/expenses");
    } catch {
      alert("Failed to delete expense");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="text-center py-20 text-danger">
        {error || "Expense not found"}
      </div>
    );
  }

  const isApproved = !!expense.approved_by;
  const statusLabel = isApproved ? "Approved" : "Pending";

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => router.push("/finance/expenses")}
        >
          Expenses
        </span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Expense #{expense.id}
        </span>
      </div>

      <PageHeader
        title={`Expense #${expense.id}`}
        description={`${expense.vendor} — ${fmtDate(expense.date)}`}
        icon={<Receipt className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/finance/expenses")}
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
            <p className="text-sm text-muted-foreground">Amount</p>
          </div>
          <p className="text-2xl font-bold">{fmt(expense.amount)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Vendor</p>
          </div>
          <p className="text-2xl font-bold">{expense.vendor}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {isApproved ? (
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
          <StatusBadge status={statusLabel} variant={isApproved ? "success" : "warning"} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Date</p>
          </div>
          <p className="text-2xl font-bold">{fmtDate(expense.date)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Expense Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">ID</span>
            <span className="text-sm font-medium">#{expense.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Vendor</span>
            <span className="text-sm font-medium">{expense.vendor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-sm font-bold text-primary">{fmt(expense.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Description</span>
            <span className="text-sm font-medium text-right max-w-xs">
              {expense.description || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Category ID</span>
            <span className="text-sm font-medium">{expense.category_id ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm font-medium">{fmtDate(expense.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={statusLabel} variant={isApproved ? "success" : "warning"} />
          </div>
          {expense.approved_by && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Approved By</span>
              <span className="text-sm font-medium">{expense.approved_by}</span>
            </div>
          )}
          {expense.receipt_url && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Receipt</span>
              <a
                href={expense.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View Receipt
              </a>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created At</span>
            <span className="text-sm font-medium">{fmtDate(expense.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
