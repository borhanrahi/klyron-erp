"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  DollarSign,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PayrollRecord {
  id: number;
  employee_id: number;
  month: string;
  year: number;
  gross_salary: number;
  total_deductions: number;
  net_pay: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

interface PayrollListResponse {
  items: PayrollRecord[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

const payrollStatusVariant = (s: string): "success" | "warning" | "danger" | "muted" => {
  if (s === "paid") return "success";
  if (s === "processed" || s === "pending") return "warning";
  if (s === "failed") return "danger";
  return "muted";
};

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPayroll = (p: number) => {
    setLoading(true);
    apiGet<PayrollListResponse>("/hr/payroll", { page: String(p), per_page: "10" })
      .then((res) => {
        setPayrolls(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      })
      .catch(() => {
        setPayrolls([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayroll(1);
  }, []);

  const fmt = (n: number | null) => (n != null ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Payroll Management"
        description="Manage employee payroll and salary processing."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll" },
        ]}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Period</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Gross</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Deductions</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Net Pay</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">Loading payroll data...</td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No payroll records found.</td>
                </tr>
              ) : (
                payrolls.map((pay) => (
                  <tr key={pay.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          #{pay.employee_id}
                        </div>
                        <span className="text-sm font-medium">Employee #{pay.employee_id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{pay.month} {pay.year}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-right">
                      <span className="text-sm text-muted-foreground">{fmt(pay.gross_salary)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-right">
                      <span className="text-sm text-muted-foreground">{fmt(pay.total_deductions)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium">{fmt(pay.net_pay)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={pay.status} variant={payrollStatusVariant(pay.status)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {payrolls.length} of {total} records</p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchPayroll(page - 1)} disabled={page <= 1} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchPayroll(page + 1)} disabled={page >= pages} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
