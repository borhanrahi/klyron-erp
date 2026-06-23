"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import {
  DollarSign,
  Search,
  Plus,
  Eye,
  Loader2,
} from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

interface Budget {
  id: string | number;
  department_id?: number;
  fiscal_year: number;
  allocated: number;
  spent: number;
  remaining: number;
  created_at?: string;
}

export default function BudgetsPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiGet<{ items: Budget[] }>("/finance/budgets")
      .then((res) => setBudgets(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = budgets.filter((b) =>
    b.fiscal_year.toString().includes(searchTerm)
  );

  const totalAllocated = budgets.reduce((s, b) => s + (b.allocated || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);
  const totalRemaining = budgets.reduce((s, b) => s + (b.remaining || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Budgets
        </span>
      </div>

      <PageHeader
        title="Budgets"
        description="Manage department budgets and track spending against allocations."
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.push("/finance/budgets/new")}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Budget
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Budgets</p>
          <p className="text-2xl font-bold mt-1">{budgets.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Allocated</p>
          <p className="text-2xl font-bold mt-1">{fmt(totalAllocated)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold mt-1">{fmt(totalSpent)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Remaining</p>
          <p className="text-2xl font-bold mt-1 text-success">{fmt(totalRemaining)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by fiscal year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading budgets...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-danger">
              {error}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    ID
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Department
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Fiscal Year
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Allocated
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Spent
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Remaining
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Usage %
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((b) => {
                  const usage = b.allocated > 0 ? Math.min((b.spent / b.allocated) * 100, 100) : 0;
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-primary">
                          #{b.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {b.department_id || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{b.fiscal_year}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium">{fmt(b.allocated)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm">{fmt(b.spent)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-success font-medium">
                          {fmt(b.remaining)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                            <div
                              className={`h-full rounded-full transition-all ${
                                usage > 90
                                  ? "bg-danger"
                                  : usage > 70
                                  ? "bg-warning"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${usage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">
                            {usage.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/finance/budgets/${b.id}`); }} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {budgets.length} budgets
          </p>
        </div>
      </div>
    </div>
  );
}
