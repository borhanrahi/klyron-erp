"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import { DollarSign, Download, Eye } from "lucide-react";

interface Payslip {
  id: number;
  month: number;
  year: number;
  base_salary: number;
  allowances: number;
  deductions: number;
  tax: number;
  bonus: number;
  net_pay: number;
  status: string;
  paid_at: string | null;
}

export default function ESSPayrollPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    apiGet<{ data: Payslip[]; total: number }>(`/ess/payroll/history?page=${page}&per_page=10`)
      .then((res) => { setPayslips(res.data); setTotal(res.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div className="p-6 text-muted-foreground">Loading payroll...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Payroll"
        description="View your payslips and salary history."
        icon={<DollarSign className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 text-xs font-medium text-muted-foreground">Period</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Base Salary</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Allowances</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Deductions</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Tax</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Net Pay</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Paid Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {payslips.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No payslips found</td></tr>
              ) : payslips.map((p) => (
                <tr key={p.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-medium">{["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][p.month] || p.month} {p.year}</td>
                  <td className="p-3">৳{p.base_salary?.toLocaleString()}</td>
                  <td className="p-3 text-green-500">+৳{p.allowances?.toLocaleString()}</td>
                  <td className="p-3 text-red-500">-৳{p.deductions?.toLocaleString()}</td>
                  <td className="p-3 text-red-500">-৳{p.tax?.toLocaleString()}</td>
                  <td className="p-3 font-bold">৳{p.net_pay?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "paid" ? "bg-green-500/10 text-green-500" :
                      p.status === "processed" ? "bg-blue-500/10 text-blue-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 10 && (
          <div className="p-3 border-t border-border flex justify-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-xs rounded-lg border border-border hover:bg-muted disabled:opacity-50">Prev</button>
            <span className="px-3 py-1 text-xs text-muted-foreground">Page {page}</span>
            <button onClick={() => setPage(page + 1)} disabled={page * 10 >= total} className="px-3 py-1 text-xs rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
