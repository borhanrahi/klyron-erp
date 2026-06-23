"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowLeft,
  Loader2,
} from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function fmtDate(s?: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Budget {
  id: number;
  department_id?: number;
  fiscal_year: number;
  allocated: number;
  spent: number;
  remaining: number;
  created_at?: string;
}

export default function BudgetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: Budget }>(`/finance/budgets/${params.id}`)
      .then((res) => setBudget(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  if (error || !budget)
    return (
      <div className="text-center py-20 text-danger">{error || "Budget not found"}</div>
    );

  const usage = budget.allocated > 0 ? Math.min((budget.spent / budget.allocated) * 100, 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => router.push("/finance/budgets")}
        >
          Budgets
        </span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Budget #{budget.id}
        </span>
      </div>

      <PageHeader
        title={`Budget #${budget.id}`}
        description={`Fiscal Year ${budget.fiscal_year}`}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.push("/finance/budgets")}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Allocated</p>
          </div>
          <p className="text-2xl font-bold">{fmt(budget.allocated)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Spent</p>
          </div>
          <p className="text-2xl font-bold">{fmt(budget.spent)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
          <p className="text-2xl font-bold text-success">{fmt(budget.remaining)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Usage %</p>
          </div>
          <p className={`text-2xl font-bold ${usage > 90 ? "text-danger" : usage > 70 ? "text-warning" : "text-primary"}`}>
            {usage.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Budget Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Budget ID</span>
            <span className="text-sm font-medium">#{budget.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Department ID</span>
            <span className="text-sm font-medium">{budget.department_id || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Fiscal Year</span>
            <span className="text-sm font-medium">{budget.fiscal_year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm font-medium">{fmtDate(budget.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Budget Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Spent / Allocated</span>
              <span className="font-medium">{fmt(budget.spent)} / {fmt(budget.allocated)}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usage > 90 ? "bg-danger" : usage > 70 ? "bg-warning" : "bg-primary"
                }`}
                style={{ width: `${usage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Allocated</p>
              <p className="text-sm font-semibold">{fmt(budget.allocated)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="text-sm font-semibold">{fmt(budget.spent)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-sm font-semibold text-success">{fmt(budget.remaining)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
