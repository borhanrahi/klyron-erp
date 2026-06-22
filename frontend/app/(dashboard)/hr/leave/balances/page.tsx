"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  CalendarDays,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const leaveBalances = [
  { employee: "Sarah Chen", avatar: "SC", department: "Engineering", annual: { total: 20, used: 8, balance: 12 }, sick: { total: 10, used: 2, balance: 8 }, personal: { total: 5, used: 1, balance: 4 }, unpaid: { used: 0 } },
  { employee: "Mike Johnson", avatar: "MJ", department: "Marketing", annual: { total: 20, used: 12, balance: 8 }, sick: { total: 10, used: 4, balance: 6 }, personal: { total: 5, used: 2, balance: 3 }, unpaid: { used: 0 } },
  { employee: "Emily Davis", avatar: "ED", department: "Product", annual: { total: 20, used: 15, balance: 5 }, sick: { total: 10, used: 1, balance: 9 }, personal: { total: 5, used: 3, balance: 2 }, unpaid: { used: 1 } },
  { employee: "David Park", avatar: "DP", department: "Engineering", annual: { total: 20, used: 6, balance: 14 }, sick: { total: 10, used: 0, balance: 10 }, personal: { total: 5, used: 0, balance: 5 }, unpaid: { used: 0 } },
  { employee: "Alex Kim", avatar: "AK", department: "DevOps", annual: { total: 20, used: 10, balance: 10 }, sick: { total: 10, used: 3, balance: 7 }, personal: { total: 5, used: 2, balance: 3 }, unpaid: { used: 2 } },
  { employee: "Rachel Martinez", avatar: "RM", department: "HR", annual: { total: 20, used: 7, balance: 13 }, sick: { total: 10, used: 1, balance: 9 }, personal: { total: 5, used: 1, balance: 4 }, unpaid: { used: 0 } },
  { employee: "James Wilson", avatar: "JW", department: "Finance", annual: { total: 20, used: 5, balance: 15 }, sick: { total: 10, used: 0, balance: 10 }, personal: { total: 5, used: 0, balance: 5 }, unpaid: { used: 0 } },
  { employee: "Lisa Thompson", avatar: "LT", department: "Design", annual: { total: 20, used: 18, balance: 2 }, sick: { total: 10, used: 5, balance: 5 }, personal: { total: 5, used: 4, balance: 1 }, unpaid: { used: 3 } },
];

export default function LeaveBalancesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = leaveBalances.filter((b) =>
    b.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Leave Balances"
        description="View employee leave balances and entitlements."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Leave", href: "/hr/leaves" },
          { label: "Balances" },
        ]}
        icon={<CalendarDays className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by employee or department..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4" colSpan={3}>Annual Leave</th>
                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4" colSpan={3}>Sick Leave</th>
                <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4" colSpan={2}>Personal</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Unpaid</th>
              </tr>
              <tr className="border-b border-border">
                <th></th>
                <th className="hidden md:table-cell"></th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Used</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Balance</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Total</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Used</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Balance</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Total</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Used</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Balance</th>
                <th className="text-center text-[10px] font-medium text-muted-foreground py-2 px-2">Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((b) => (
                <tr key={b.employee} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{b.avatar}</div>
                      <span className="text-sm font-medium">{b.employee}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{b.department}</span>
                  </td>
                  <td className="py-3 px-4 text-center"><span className="text-sm">{b.annual.used}</span></td>
                  <td className="py-3 px-4 text-center"><span className={`text-sm font-medium ${b.annual.balance <= 3 ? 'text-danger' : 'text-success'}`}>{b.annual.balance}</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-sm text-muted-foreground">{b.annual.total}</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-sm">{b.sick.used}</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-sm font-medium text-success">{b.sick.balance}</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-sm text-muted-foreground">{b.sick.total}</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-sm">{b.personal.used}</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-sm font-medium text-success">{b.personal.balance}</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-sm text-muted-foreground">{b.unpaid.used}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {leaveBalances.length} employees</p>
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
