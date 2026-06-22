"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  HandCoins,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

const loans = [
  { id: "LN-001", employee: "Sarah Chen", avatar: "SC", type: "Personal Loan", amount: "$15,000", paid: "$9,000", remaining: "$6,000", emi: "$625", startDate: "Jan 1, 2024", endDate: "Dec 31, 2024", status: "Active", statusVariant: "success" as const },
  { id: "LN-002", employee: "Mike Johnson", avatar: "MJ", type: "Salary Advance", amount: "$5,000", paid: "$4,167", remaining: "$833", emi: "$833", startDate: "Mar 1, 2024", endDate: "Sep 30, 2024", status: "Active", statusVariant: "success" as const },
  { id: "LN-003", employee: "Emily Davis", avatar: "ED", type: "Emergency Loan", amount: "$3,000", paid: "$3,000", remaining: "$0", emi: "$500", startDate: "Jan 15, 2024", endDate: "Jun 30, 2024", status: "Closed", statusVariant: "muted" as const },
  { id: "LN-004", employee: "David Park", avatar: "DP", type: "Personal Loan", amount: "$20,000", paid: "$4,000", remaining: "$16,000", emi: "$833", startDate: "Apr 1, 2024", endDate: "Mar 31, 2026", status: "Active", statusVariant: "success" as const },
  { id: "LN-005", employee: "Alex Kim", avatar: "AK", type: "Salary Advance", amount: "$2,500", paid: "$0", remaining: "$2,500", emi: "$2,500", startDate: "Jun 1, 2024", endDate: "Jun 30, 2024", status: "Overdue", statusVariant: "danger" as const },
  { id: "LN-006", employee: "Rachel Martinez", avatar: "RM", type: "Education Loan", amount: "$25,000", paid: "$12,500", remaining: "$12,500", emi: "$694", startDate: "Jul 1, 2023", endDate: "Jun 30, 2026", status: "Active", statusVariant: "success" as const },
];

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = loans.filter((l) =>
    l.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Loans & Advances"
        description="Manage employee loans, salary advances, and repayments."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Loans" },
        ]}
        icon={<HandCoins className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Loan
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Lent</p>
          <p className="text-2xl font-bold mt-1">$70,500</p>
          <p className="text-xs text-muted-foreground mt-1">6 active loans</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Collected</p>
          <p className="text-2xl font-bold mt-1 text-success">$32,667</p>
          <p className="text-xs text-success mt-1">46.3% recovered</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="text-2xl font-bold mt-1 text-warning">$37,833</p>
          <p className="text-xs text-danger mt-1">1 overdue</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Amount</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Paid</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Remaining</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">EMI</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((loan) => (
                <tr key={loan.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4"><span className="text-sm font-medium text-primary">{loan.id}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{loan.avatar}</div>
                      <span className="text-sm font-medium">{loan.employee}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{loan.type}</span></td>
                  <td className="py-3 px-4"><span className="text-sm font-medium">{loan.amount}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-success">{loan.paid}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{loan.remaining}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell"><span className="text-sm text-muted-foreground">{loan.emi}/mo</span></td>
                  <td className="py-3 px-4"><StatusBadge status={loan.status} variant={loan.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {loans.length} loans</p>
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
