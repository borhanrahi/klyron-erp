"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calculator,
} from "lucide-react";

const payrollData = [
  {
    id: "PAY-2024-06-001",
    employee: "Sarah Chen",
    avatar: "SC",
    department: "Engineering",
    month: "June 2024",
    gross: "$8,500.00",
    deductions: "$1,870.00",
    netPay: "$6,630.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "PAY-2024-06-002",
    employee: "Mike Johnson",
    avatar: "MJ",
    department: "Marketing",
    month: "June 2024",
    gross: "$7,200.00",
    deductions: "$1,584.00",
    netPay: "$5,616.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "PAY-2024-06-003",
    employee: "Emily Davis",
    avatar: "ED",
    department: "Product",
    month: "June 2024",
    gross: "$9,800.00",
    deductions: "$2,156.00",
    netPay: "$7,644.00",
    status: "Processing",
    statusVariant: "info" as const,
  },
  {
    id: "PAY-2024-06-004",
    employee: "David Park",
    avatar: "DP",
    department: "Engineering",
    month: "June 2024",
    gross: "$7,800.00",
    deductions: "$1,716.00",
    netPay: "$6,084.00",
    status: "Pending",
    statusVariant: "warning" as const,
  },
  {
    id: "PAY-2024-06-005",
    employee: "Alex Kim",
    avatar: "AK",
    department: "DevOps",
    month: "June 2024",
    gross: "$8,200.00",
    deductions: "$1,804.00",
    netPay: "$6,396.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "PAY-2024-06-006",
    employee: "Rachel Martinez",
    avatar: "RM",
    department: "HR",
    month: "June 2024",
    gross: "$6,800.00",
    deductions: "$1,496.00",
    netPay: "$5,304.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
  {
    id: "PAY-2024-06-007",
    employee: "James Wilson",
    avatar: "JW",
    department: "Finance",
    month: "June 2024",
    gross: "$7,500.00",
    deductions: "$1,650.00",
    netPay: "$5,850.00",
    status: "Processing",
    statusVariant: "info" as const,
  },
  {
    id: "PAY-2024-06-008",
    employee: "Lisa Thompson",
    avatar: "LT",
    department: "Design",
    month: "June 2024",
    gross: "$7,000.00",
    deductions: "$1,540.00",
    netPay: "$5,460.00",
    status: "Paid",
    statusVariant: "success" as const,
  },
];

const payrollStats = [
  { label: "Total Payroll", value: "$1.2M", change: "June 2024" },
  { label: "Processed", value: "$892K", change: "74.3% complete" },
  { label: "Pending", value: "$156K", change: "8 payments" },
  { label: "Avg. Net Pay", value: "$6,123", change: "+3.2% vs May" },
];

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("June 2024");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredPayroll = payrollData.filter((record) => {
    const matchesSearch =
      record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Payroll Management"
        description="Process payroll, manage salaries, and generate payslips."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll" },
        ]}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Run Payroll
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {payrollStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by employee or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option>June 2024</option>
                <option>May 2024</option>
                <option>April 2024</option>
                <option>March 2024</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Paid">Paid</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Payslip ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Month</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Gross Pay</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Deductions</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Net Pay</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredPayroll.map((record) => (
                <tr key={record.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">{record.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {record.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{record.employee}</p>
                        <p className="text-xs text-muted-foreground">{record.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{record.month}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{record.gross}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{record.deductions}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-success">{record.netPay}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={record.status} variant={record.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/hr/payroll/${record.id}`}
                      className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground inline-flex"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPayroll.length} of {payrollData.length} payslips
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">2</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
