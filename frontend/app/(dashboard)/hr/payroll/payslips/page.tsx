"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  FileText,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
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

const statusVariant = (s: string): "success" | "warning" | "danger" | "muted" | "info" => {
  if (s === "paid") return "success";
  if (s === "processed") return "info";
  if (s === "pending") return "warning";
  if (s === "failed") return "danger";
  return "muted";
};

export default function PayslipsPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchPayslips = (p: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "10" };
    if (search) params.search = search;
    apiGet<PayrollListResponse>("/hr/payroll", params)
      .then((res) => {
        let items = res.items;
        if (filterStatus !== "all") {
          items = items.filter((i) => i.status === filterStatus);
        }
        setPayrolls(items);
        setTotal(filterStatus !== "all" ? items.length : res.total);
        setPage(res.page);
        setPages(res.pages);
      })
      .catch(() => { setPayrolls([]); setTotal(0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayslips(1); }, [filterStatus]);

  const handleSearch = () => fetchPayslips(1);

  const fmt = (n: number | null) => (n != null ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payslips"
        description="View and manage employee payslips."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Payslips" },
        ]}
        icon={<FileText className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by employee or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="draft">Draft</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Period</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Gross</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Deductions</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Net Pay</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading payslips...
                    </div>
                  </td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">No payslips found.</td>
                </tr>
              ) : (
                payrolls.map((p) => {
                  const gross = (p.base_salary || 0) + (p.allowances || 0) + (p.bonus || 0);
                  const ded = (p.deductions || 0) + (p.tax || 0);
                  const initials = (p.employee_name || `#${p.employee_id}`).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <tr key={p.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{initials}</div>
                          <div>
                            <p className="text-sm font-medium">{p.employee_name || `Employee #${p.employee_id}`}</p>
                            <p className="text-xs text-muted-foreground">{p.employee_code || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{monthNames[p.month] || p.month} {p.year}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-muted-foreground">{fmt(gross)}</span>
                      </td>
                      <td className="py-3 px-4 text-right hidden lg:table-cell">
                        <span className="text-sm text-danger">{fmt(ded)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-bold">{fmt(p.net_pay)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={p.status} variant={statusVariant(p.status)} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/hr/payroll/${p.id}`} className="text-sm text-primary hover:underline flex items-center gap-1 justify-end">
                          <Eye className="h-3 w-3" /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {payrolls.length} of {total} payslips</p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchPayslips(page - 1)} disabled={page <= 1} className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors">Previous</button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchPayslips(page + 1)} disabled={page >= pages} className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
