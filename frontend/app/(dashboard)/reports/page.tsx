"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Download,
  Clock,
  Eye,
  ChevronRight,
  FileText,
  PieChart,
  Activity,
  DollarSign,
  Calendar,
} from "lucide-react";

const reportTypes = [
  {
    id: "finance",
    title: "Finance Reports",
    description: "P&L statements, balance sheets, cash flow, and trial balance.",
    icon: DollarSign,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    count: 12,
    href: "/finance/reports",
  },
  {
    id: "hr",
    title: "HR Reports",
    description: "Employee analytics, attendance, payroll, and recruitment metrics.",
    icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    count: 8,
    href: "/hr",
  },
  {
    id: "sales",
    title: "Sales Reports",
    description: "Revenue trends, pipeline analysis, and team performance.",
    icon: TrendingUp,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    count: 10,
    href: "/sales",
  },
  {
    id: "inventory",
    title: "Inventory Reports",
    description: "Stock levels, movements, valuation, and reorder alerts.",
    icon: Package,
    iconBg: "bg-info/10",
    iconColor: "text-info",
    count: 6,
    href: "/inventory",
  },
  {
    id: "pos",
    title: "POS Reports",
    description: "Sales by terminal, payment methods, and daily summaries.",
    icon: ShoppingCart,
    iconBg: "bg-danger/10",
    iconColor: "text-danger",
    count: 5,
    href: "/pos",
  },
];

const recentReports = [
  {
    id: "rpt-001",
    name: "Q1 2024 Profit & Loss",
    type: "Finance",
    generatedBy: "Sarah Chen",
    date: "Apr 2, 2024",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "rpt-002",
    name: "Monthly Payroll Summary",
    type: "HR",
    generatedBy: "System",
    date: "Apr 1, 2024",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "rpt-003",
    name: "Sales Pipeline Report",
    type: "Sales",
    generatedBy: "Mike Johnson",
    date: "Mar 31, 2024",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "rpt-004",
    name: "Inventory Valuation",
    type: "Inventory",
    generatedBy: "Emily Davis",
    date: "Mar 30, 2024",
    status: "Processing",
    statusVariant: "warning" as const,
  },
  {
    id: "rpt-005",
    name: "Daily POS Summary - Mar 29",
    type: "POS",
    generatedBy: "System",
    date: "Mar 29, 2024",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "rpt-006",
    name: "Balance Sheet - FY2024",
    type: "Finance",
    generatedBy: "Sarah Chen",
    date: "Mar 28, 2024",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    id: "rpt-007",
    name: "Employee Attendance - March",
    type: "HR",
    generatedBy: "System",
    date: "Mar 27, 2024",
    status: "Failed",
    statusVariant: "danger" as const,
  },
];

const exportFormats = [
  { label: "PDF", description: "Formatted report document" },
  { label: "Excel", description: "Spreadsheet with raw data" },
  { label: "CSV", description: "Comma-separated values" },
  { label: "JSON", description: "Structured data format" },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Reports"
        description="Generate, view, and export business reports across all modules."
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: "41", change: "Across all modules", icon: FileText },
          { label: "Generated This Month", value: "18", change: "+23% vs last month", icon: Calendar },
          { label: "Scheduled Reports", value: "7", change: "Active automations", icon: Clock },
          { label: "Last Generated", value: "2h ago", change: "Q1 P&L Statement", icon: Activity },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Report Types Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Report Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <a
                key={report.id}
                href={report.href}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${report.iconBg}`}>
                    <Icon className={`h-6 w-6 ${report.iconColor}`} />
                  </div>
                  <StatusBadge status={`${report.count} reports`} variant="muted" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-primary mt-4 font-medium">
                  View Reports
                  <ChevronRight className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "overview", label: "Recent Reports", icon: Clock },
          { id: "export", label: "Export Center", icon: Download },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Recent Reports Tab */}
      {activeTab === "overview" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Report Name
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                    Generated By
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{report.type}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{report.generatedBy}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{report.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={report.status} variant={report.statusVariant} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Center Tab */}
      {activeTab === "export" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {exportFormats.map((format) => (
            <div key={format.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{format.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
