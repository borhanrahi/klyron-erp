"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";

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
}

interface PayrollListResponse {
  items: PayrollRecord[];
  total: number;
}

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function PayrollReportsPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    apiGet<PayrollListResponse>("/hr/payroll", { per_page: "200" })
      .then((res) => setPayrolls(res.items.filter((p) => p.year === selectedYear)))
      .catch(() => setPayrolls([]))
      .finally(() => setLoading(false));
  }, [selectedYear]);

  // Compute monthly summaries
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthPayrolls = payrolls.filter((p) => p.month === i + 1);
    const totalGross = monthPayrolls.reduce((sum, p) => sum + (p.base_salary || 0) + (p.allowances || 0) + (p.bonus || 0), 0);
    const totalDeductions = monthPayrolls.reduce((sum, p) => sum + (p.deductions || 0) + (p.tax || 0), 0);
    const totalNet = monthPayrolls.reduce((sum, p) => sum + (p.net_pay || 0), 0);
    return {
      month: i + 1,
      label: monthNames[i + 1],
      count: monthPayrolls.length,
      gross: totalGross,
      deductions: totalDeductions,
      net: totalNet,
    };
  });

  const totalYearGross = monthlyData.reduce((s, m) => s + m.gross, 0);
  const totalYearNet = monthlyData.reduce((s, m) => s + m.net, 0);
  const totalYearDeductions = monthlyData.reduce((s, m) => s + m.deductions, 0);
  const avgMonthly = monthlyData.filter((m) => m.count > 0).length > 0
    ? totalYearNet / monthlyData.filter((m) => m.count > 0).length
    : 0;

  // Max net for chart scaling
  const maxNet = Math.max(...monthlyData.map((m) => m.net), 1);

  const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Reports"
        description="Annual payroll summary and monthly breakdown."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Reports" },
        ]}
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {[selectedYear - 1, selectedYear, selectedYear + 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Annual KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Gross (Annual)</p>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-1">{fmt(totalYearGross)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Deductions</p>
            <BarChart3 className="h-4 w-4 text-danger" />
          </div>
          <p className="text-2xl font-bold mt-1 text-danger">{fmt(totalYearDeductions)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Net Pay</p>
            <DollarSign className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold mt-1 text-success">{fmt(totalYearNet)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Monthly Net</p>
            <Users className="h-4 w-4 text-info" />
          </div>
          <p className="text-2xl font-bold mt-1">{fmt(avgMonthly)}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-sm font-semibold mb-6">Monthly Payroll Trend</h3>
        <div className="flex items-end gap-2 h-48">
          {monthlyData.map((m) => {
            const height = maxNet > 0 ? (m.net / maxNet) * 100 : 0;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center justify-end flex-1">
                  {m.net > 0 && (
                    <span className="text-[10px] text-muted-foreground mb-1">{fmt(m.net)}</span>
                  )}
                  <div
                    className="w-full bg-primary rounded-t-md transition-all duration-500 hover:bg-primary/80 min-h-[2px]"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Month</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employees</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Gross</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Deductions</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Net Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {monthlyData.map((m) => (
                <tr key={m.month} className={`hover:bg-muted/5 transition-colors ${m.count === 0 ? "opacity-40" : ""}`}>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{m.label} {selectedYear}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">{m.count}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">{fmt(m.gross)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-danger">{fmt(m.deductions)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-bold text-success">{fmt(m.net)}</span>
                  </td>
                </tr>
              ))}
              {/* Year Total */}
              <tr className="bg-muted/30 font-semibold">
                <td className="py-3 px-4 text-sm">Total {selectedYear}</td>
                <td className="py-3 px-4 text-right text-sm">{payrolls.length}</td>
                <td className="py-3 px-4 text-right text-sm">{fmt(totalYearGross)}</td>
                <td className="py-3 px-4 text-right text-sm text-danger">{fmt(totalYearDeductions)}</td>
                <td className="py-3 px-4 text-right text-sm text-success">{fmt(totalYearNet)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
