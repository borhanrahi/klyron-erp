"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  Download,
  Play,
  Search,
} from "lucide-react";
import Link from "next/link";

interface PayrollRecord {
  id: number;
  employee_id: number;
  employee_name: string | null;
  employee_code: string | null;
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
  created_at: string;
}

interface PayrollListResponse {
  items: PayrollRecord[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const payrollStatusVariant = (s: string): "success" | "warning" | "danger" | "muted" | "info" => {
  if (s === "paid") return "success";
  if (s === "processed" || s === "pending") return "warning";
  if (s === "failed") return "danger";
  if (s === "processing") return "info";
  return "muted";
};

export default function PayrollOverviewPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalPayroll: 0,
    totalPaid: 0,
    totalPending: 0,
    totalDraft: 0,
    avgNetPay: 0,
    employeeCount: 0,
  });

  const fetchPayroll = (p: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "15" };
    if (search) params.search = search;
    apiGet<PayrollListResponse>("/hr/payroll", params)
      .then((res) => {
        setPayrolls(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);

        // Compute stats from all records
        let totalPay = 0;
        let paidPay = 0;
        let pendingPay = 0;
        let draftPay = 0;
        const empSet = new Set<number>();
        res.items.forEach((p) => {
          totalPay += p.net_pay || 0;
          empSet.add(p.employee_id);
          if (p.status === "paid") paidPay += p.net_pay || 0;
          else if (p.status === "pending" || p.status === "processed") pendingPay += p.net_pay || 0;
          else if (p.status === "draft") draftPay += p.net_pay || 0;
        });
        setStats({
          totalPayroll: totalPay,
          totalPaid: paidPay,
          totalPending: pendingPay,
          totalDraft: draftPay,
          avgNetPay: res.items.length ? totalPay / res.items.length : 0,
          employeeCount: empSet.size,
        });
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

  const handleSearch = () => {
    fetchPayroll(1);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/hr/payroll-actions/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const fmt = (n: number | null) => (n != null ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—");

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Payroll</p>
              <p className="text-2xl font-bold mt-1">{fmt(stats.totalPayroll)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Current period</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold mt-1 text-success">{fmt(stats.totalPaid)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3 w-3 text-success" />
            <span className="text-xs text-success">
              {total > 0 ? Math.round((stats.totalPaid / (stats.totalPayroll || 1)) * 100) : 0}% processed
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-1 text-warning">{fmt(stats.totalPending)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
          </div>
          <p className="text-xs text-warning mt-2">Awaiting approval</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Records</p>
              <p className="text-2xl font-bold mt-1">{total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-info" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Payroll entries</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/hr/payroll/run"
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Run Payroll</p>
              <p className="text-xs text-muted-foreground">Generate monthly payroll</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
          </div>
        </Link>

        <Link
          href="/hr/payroll/bulk-upload"
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
              <Download className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm font-semibold">Bulk Upload</p>
              <p className="text-xs text-muted-foreground">Import bonuses & adjustments</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-info transition-colors" />
          </div>
        </Link>

        <Link
          href="/hr/payroll/payslips"
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
              <Calendar className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold">View Payslips</p>
              <p className="text-xs text-muted-foreground">Download & send payslips</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-success transition-colors" />
          </div>
        </Link>
      </div>

      {/* Payroll Records Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h3 className="text-sm font-semibold">Payroll Records</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 border border-border bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Period</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Base Salary</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Allowances</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Deductions</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Bonus</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Net Pay</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading payroll data...
                    </div>
                  </td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-sm">
                    No payroll records found. Run payroll to generate records.
                  </td>
                </tr>
              ) : (
                payrolls.map((pay) => (
                  <tr key={pay.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {(pay.employee_name || `#${pay.employee_id}`).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pay.employee_name || `Employee #${pay.employee_id}`}</p>
                          <p className="text-xs text-muted-foreground">{pay.employee_code || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{monthNames[pay.month] || pay.month} {pay.year}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-right">
                      <span className="text-sm text-muted-foreground">{fmt(pay.base_salary)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-right">
                      <span className="text-sm text-success">{fmt(pay.allowances)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-right">
                      <span className="text-sm text-danger">{fmt(pay.deductions + (pay.tax || 0))}</span>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell text-right">
                      <span className="text-sm text-info">{fmt(pay.bonus)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-bold">{fmt(pay.net_pay)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={pay.status} variant={payrollStatusVariant(pay.status)} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/hr/payroll/${pay.id}`} className="text-sm text-primary hover:underline">
                        View
                      </Link>
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
            <button
              onClick={() => fetchPayroll(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button
              onClick={() => fetchPayroll(page + 1)}
              disabled={page >= pages}
              className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
