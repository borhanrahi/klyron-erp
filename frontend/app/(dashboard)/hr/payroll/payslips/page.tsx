"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Send,
} from "lucide-react";

const payslips = [
  { id: "PS-2024-06-001", employee: "Sarah Chen", avatar: "SC", department: "Engineering", month: "June 2024", gross: "$8,500", deductions: "$1,870", net: "$6,630", status: "Paid", statusVariant: "success" as const, date: "Jun 30, 2024" },
  { id: "PS-2024-06-002", employee: "Mike Johnson", avatar: "MJ", department: "Marketing", month: "June 2024", gross: "$7,200", deductions: "$1,584", net: "$5,616", status: "Paid", statusVariant: "success" as const, date: "Jun 30, 2024" },
  { id: "PS-2024-06-003", employee: "Emily Davis", avatar: "ED", department: "Product", month: "June 2024", gross: "$9,800", deductions: "$2,156", net: "$7,644", status: "Processing", statusVariant: "info" as const, date: "Jun 28, 2024" },
  { id: "PS-2024-06-004", employee: "David Park", avatar: "DP", department: "Engineering", month: "June 2024", gross: "$7,800", deductions: "$1,716", net: "$6,084", status: "Pending", statusVariant: "warning" as const, date: "Jun 28, 2024" },
  { id: "PS-2024-06-005", employee: "Alex Kim", avatar: "AK", department: "DevOps", month: "June 2024", gross: "$8,200", deductions: "$1,804", net: "$6,396", status: "Paid", statusVariant: "success" as const, date: "Jun 30, 2024" },
  { id: "PS-2024-05-001", employee: "Sarah Chen", avatar: "SC", department: "Engineering", month: "May 2024", gross: "$8,500", deductions: "$1,870", net: "$6,630", status: "Paid", statusVariant: "success" as const, date: "May 31, 2024" },
  { id: "PS-2024-05-002", employee: "Mike Johnson", avatar: "MJ", department: "Marketing", month: "May 2024", gross: "$7,200", deductions: "$1,584", net: "$5,616", status: "Paid", statusVariant: "success" as const, date: "May 31, 2024" },
  { id: "PS-2024-05-003", employee: "Emily Davis", avatar: "ED", department: "Product", month: "May 2024", gross: "$9,800", deductions: "$2,156", net: "$7,644", status: "Paid", statusVariant: "success" as const, date: "May 31, 2024" },
];

export default function PayslipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const filtered = payslips.filter((p) => {
    const matchesSearch = p.employee.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === "All" || p.month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Payslips"
        description="View and manage employee payslips."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Payslips" },
        ]}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download All
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search payslips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="All">All Months</option>
              <option value="June 2024">June 2024</option>
              <option value="May 2024">May 2024</option>
              <option value="April 2024">April 2024</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">ID <ArrowUpDown className="h-3 w-3" /></button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Month</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Gross</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Deductions</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Net Pay</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((payslip) => (
                <tr key={payslip.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4"><span className="text-sm font-medium text-primary">{payslip.id}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{payslip.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{payslip.employee}</p>
                        <p className="text-xs text-muted-foreground">{payslip.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{payslip.month}</span></td>
                  <td className="py-3 px-4"><span className="text-sm font-medium">{payslip.gross}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{payslip.deductions}</span></td>
                  <td className="py-3 px-4"><span className="text-sm font-semibold text-success">{payslip.net}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={payslip.status} variant={payslip.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"><Send className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {payslips.length} payslips</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
