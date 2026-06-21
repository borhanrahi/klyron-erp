"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Activity,
  ArrowRight,
  Calendar,
} from "lucide-react";

const reports = [
  {
    id: "pnl",
    title: "Profit & Loss Statement",
    description:
      "Revenue, expenses, and net income for the current period vs prior period.",
    icon: TrendingUp,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    period: "Q1 2024",
    metrics: [
      { label: "Revenue", value: "$557,900", change: "+12.3%", positive: true },
      { label: "Expenses", value: "$472,960", change: "+8.1%", positive: false },
      { label: "Net Income", value: "$84,940", change: "+24.6%", positive: true },
    ],
  },
  {
    id: "balance-sheet",
    title: "Balance Sheet",
    description:
      "Assets, liabilities, and equity position as of the reporting date.",
    icon: PieChart,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    period: "Mar 31, 2024",
    metrics: [
      { label: "Total Assets", value: "$931,430", change: "+5.2%", positive: true },
      { label: "Total Liabilities", value: "$103,210", change: "-3.1%", positive: true },
      { label: "Total Equity", value: "$789,220", change: "+6.8%", positive: true },
    ],
  },
  {
    id: "trial-balance",
    title: "Trial Balance",
    description:
      "Verify that total debits equal total credits across all ledger accounts.",
    icon: Activity,
    iconBg: "bg-info/10",
    iconColor: "text-info",
    period: "Mar 31, 2024",
    metrics: [
      { label: "Total Debits", value: "$1,247,830", change: "Balanced", positive: true },
      { label: "Total Credits", value: "$1,247,830", change: "Balanced", positive: true },
      { label: "Accounts", value: "156", change: "Active", positive: true },
    ],
  },
  {
    id: "cash-flow",
    title: "Cash Flow Statement",
    description:
      "Operating, investing, and financing cash flows for the period.",
    icon: DollarSign,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    period: "Q1 2024",
    metrics: [
      { label: "Operating", value: "$92,450", change: "+18.2%", positive: true },
      { label: "Investing", value: "($25,000)", change: "CapEx", positive: false },
      { label: "Financing", value: "($12,000)", change: "Loan repayment", positive: false },
    ],
  },
];

const quickStats = [
  { label: "Revenue YTD", value: "$557,900", change: "+12.3% vs last year", icon: TrendingUp },
  { label: "Net Profit Margin", value: "15.2%", change: "+2.1pp improvement", icon: PieChart },
  { label: "Current Ratio", value: "3.2x", change: "Healthy liquidity", icon: Activity },
  { label: "Cash Position", value: "$419,540", change: "+8.3% this month", icon: DollarSign },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q1 2024");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Reports
        </span>
      </div>

      <PageHeader
        title="Financial Reports"
        description="Generate and view comprehensive financial statements and reports."
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="Q1 2024">Q1 2024</option>
                <option value="Q4 2023">Q4 2023</option>
                <option value="Q3 2023">Q3 2023</option>
                <option value="FY 2023">FY 2023</option>
              </select>
            </div>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-success mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={`p-3 rounded-xl ${report.iconBg}`}>
                  <Icon className={`h-6 w-6 ${report.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {report.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        {metric.value}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          metric.positive ? "text-success" : "text-danger"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Period: {report.period}
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    View Full Report
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
