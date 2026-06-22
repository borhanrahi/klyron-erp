"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calculator,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowRight,
} from "lucide-react";

const payrollRun = {
  month: "June 2024",
  totalEmployees: 132,
  processed: 120,
  pending: 12,
  totalGross: "$1,182,400",
  totalDeductions: "$260,128",
  totalNet: "$922,272",
  status: "In Progress",
  statusVariant: "info" as const,
};

const processingSteps = [
  { step: 1, name: "Gather Attendance Data", status: "completed", icon: <CheckCircle className="h-5 w-5" /> },
  { step: 2, name: "Calculate Base Salary", status: "completed", icon: <CheckCircle className="h-5 w-5" /> },
  { step: 3, name: "Apply Overtime & Bonuses", status: "completed", icon: <CheckCircle className="h-5 w-5" /> },
  { step: 4, name: "Calculate Deductions", status: "current", icon: <Calculator className="h-5 w-5" /> },
  { step: 5, name: "Generate Payslips", status: "pending", icon: <AlertCircle className="h-5 w-5" /> },
  { step: 6, name: "Process Payments", status: "pending", icon: <AlertCircle className="h-5 w-5" /> },
];

const pendingEmployees = [
  { id: "EMP-003", name: "Emily Davis", avatar: "ED", department: "Product", gross: "$9,800", status: "Pending Review", statusVariant: "warning" as const },
  { id: "EMP-007", name: "James Wilson", avatar: "JW", department: "Finance", gross: "$7,500", status: "Pending Review", statusVariant: "warning" as const },
  { id: "EMP-011", name: "Tom Brown", avatar: "TB", department: "Sales", gross: "$6,200", status: "Awaiting Approval", statusVariant: "muted" as const },
  { id: "EMP-015", name: "Nina Patel", avatar: "NP", department: "Engineering", gross: "$8,400", status: "Awaiting Approval", statusVariant: "muted" as const },
];

export default function PayrollRunPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Payroll Run"
        description="Process monthly payroll for all employees."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Run Payroll" },
        ]}
        icon={<Calculator className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-success text-white px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Continue Processing
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Employees</p>
          <p className="text-2xl font-bold mt-1">{payrollRun.totalEmployees}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Processed</p>
          <p className="text-2xl font-bold mt-1 text-success">{payrollRun.processed}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold mt-1 text-warning">{payrollRun.pending}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Net Pay</p>
          <p className="text-2xl font-bold mt-1">{payrollRun.totalNet}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Processing Steps</h3>
          <div className="space-y-4">
            {processingSteps.map((step) => (
              <div key={step.step} className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${
                  step.status === "completed" ? "bg-success/10 text-success" :
                  step.status === "current" ? "bg-primary/10 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${step.status === "pending" ? "text-muted-foreground" : ""}`}>
                    {step.name}
                  </p>
                </div>
                <StatusBadge
                  status={step.status === "completed" ? "Done" : step.status === "current" ? "Current" : "Pending"}
                  variant={step.status === "completed" ? "success" : step.status === "current" ? "primary" : "muted"}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Payroll Summary</h3>
          <div className="space-y-4">
            {[
              { label: "Total Gross Pay", value: payrollRun.totalGross, color: "" },
              { label: "Total Deductions", value: payrollRun.totalDeductions, color: "text-danger" },
              { label: "Total Net Pay", value: payrollRun.totalNet, color: "text-success" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{Math.round((payrollRun.processed / payrollRun.totalEmployees) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(payrollRun.processed / payrollRun.totalEmployees) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Pending Review</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Gross Pay</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pendingEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{emp.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{emp.department}</span></td>
                  <td className="py-3 px-4"><span className="text-sm font-medium">{emp.gross}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={emp.status} variant={emp.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-sm text-primary hover:underline flex items-center gap-1 justify-end">
                      Review <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
