"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  HandCoins,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface LoanRecord {
  id: number;
  employee_id: number;
  type: string;
  amount: number;
  remaining: number;
  installment_amount: number;
  monthly_deduction: number;
  status: string;
  reason: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

interface LoanListResponse {
  items: LoanRecord[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

const statusVariant = (s: string): "success" | "warning" | "danger" | "muted" => {
  if (s === "active") return "success";
  if (s === "pending") return "warning";
  if (s === "overdue") return "danger";
  return "muted";
};

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLoans = (p: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "10" };
    if (search) params.search = search;
    apiGet<LoanListResponse>("/hr/loans", params)
      .then((res) => { setLoans(res.items); setTotal(res.total); setPage(res.page); setPages(res.pages); })
      .catch(() => { setLoans([]); setTotal(0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLoans(1); }, []);

  const fmt = (n: number | null) => (n != null ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—");

  const totalLent = loans.reduce((s, l) => s + (l.amount || 0), 0);
  const totalOutstanding = loans.reduce((s, l) => s + (l.remaining || 0), 0);
  const activeCount = loans.filter((l) => l.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loans & Advances"
        description="Manage employee loans, salary advances, and repayments."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Loans" },
        ]}
        icon={<HandCoins className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Lent</p>
          <p className="text-2xl font-bold mt-1">{fmt(totalLent)}</p>
          <p className="text-xs text-muted-foreground mt-1">{activeCount} active loans</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="text-2xl font-bold mt-1 text-warning">{fmt(totalOutstanding)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Records</p>
          <p className="text-2xl font-bold mt-1">{total}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search loans by status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLoans(1)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">ID</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Amount</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Remaining</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">EMI</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading loans...
                  </div>
                </td></tr>
              ) : loans.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">No loans found.</td></tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4"><span className="text-sm font-medium text-primary">LN-{String(loan.id).padStart(3, "0")}</span></td>
                    <td className="py-3 px-4"><span className="text-sm font-medium">Employee #{loan.employee_id}</span></td>
                    <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{loan.type}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm font-medium">{fmt(loan.amount)}</span></td>
                    <td className="py-3 px-4 text-right hidden lg:table-cell"><span className="text-sm text-muted-foreground">{fmt(loan.remaining)}</span></td>
                    <td className="py-3 px-4 text-right hidden xl:table-cell"><span className="text-sm text-muted-foreground">{fmt(loan.monthly_deduction)}/mo</span></td>
                    <td className="py-3 px-4"><StatusBadge status={loan.status} variant={statusVariant(loan.status)} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {loans.length} of {total} loans</p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchLoans(page - 1)} disabled={page <= 1} className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors">Previous</button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchLoans(page + 1)} disabled={page >= pages} className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
