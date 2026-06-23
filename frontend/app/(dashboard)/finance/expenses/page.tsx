"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Receipt,
  Search,
  Plus,
  Eye,
  DollarSign,
  Hash,
  CheckCircle,
  Clock,
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
  created_at?: string;
}

export default function ExpensesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ items: Expense[] }>("/finance/expenses")
      .then((res) => setExpenses(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedCount = expenses.filter((e) => e.approved_by).length;
  const pendingCount = expenses.length - approvedCount;

  const filtered = expenses.filter((e) =>
    e.vendor?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Expenses
        </span>
      </div>

      <PageHeader
        title="Expenses"
        description="Track and manage business expenses and approvals."
        icon={<Receipt className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.push("/finance/expenses/new")}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Expense
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Expenses</p>
          </div>
          <p className="text-2xl font-bold">{fmt(totalExpenses)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Expense Count</p>
          </div>
          <p className="text-2xl font-bold">{expenses.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Approved</p>
          </div>
          <p className="text-2xl font-bold text-success">{approvedCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <p className="text-2xl font-bold text-warning">{pendingCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading expenses...
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
                    Vendor
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((expense) => {
                  const isApproved = !!expense.approved_by;
                  return (
                    <tr
                      key={expense.id}
                      className="hover:bg-muted/5 transition-colors cursor-pointer"
                      onClick={() => router.push(`/finance/expenses/${expense.id}`)}
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-primary">
                          #{expense.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium">{expense.vendor}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                          {expense.description || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold">{fmt(expense.amount)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={isApproved ? "Approved" : "Pending"}
                          variant={isApproved ? "success" : "warning"}
                        />
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {fmtDate(expense.date)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/finance/expenses/${expense.id}`);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
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
            Showing {filtered.length} of {expenses.length} expenses
          </p>
        </div>
      </div>
    </div>
  );
}
