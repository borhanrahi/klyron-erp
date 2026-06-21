"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DollarSign,
  ArrowLeft,
  Download,
  Printer,
  Building2,
  Calendar,
  User,
} from "lucide-react";

const payslipData = {
  id: "PAY-2024-06-001",
  employee: "Sarah Chen",
  avatar: "SC",
  email: "sarah.chen@klyron.com",
  department: "Engineering",
  designation: "Senior Developer",
  month: "June 2024",
  payDate: "June 30, 2024",
  status: "Paid",
  statusVariant: "success" as const,
  bankAccount: "****4567",
  gross: 8500,
  earnings: [
    { label: "Basic Salary", amount: 6500 },
    { label: "House Rent Allowance", amount: 1300 },
    { label: "Transport Allowance", amount: 400 },
    { label: "Medical Allowance", amount: 300 },
  ],
  deductions: [
    { label: "Federal Tax", amount: 1275 },
    { label: "Social Security", amount: 340 },
    { label: "Medicare", amount: 123 },
    { label: "Health Insurance", amount: 132 },
  ],
};

export default function PayslipDetailPage() {
  const totalDeductions = payslipData.deductions.reduce(
    (sum, d) => sum + d.amount,
    0
  );
  const netPay = payslipData.gross - totalDeductions;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={`Payslip - ${payslipData.month}`}
        description={`Payment for ${payslipData.employee}`}
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: payslipData.id },
        ]}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/hr/payroll"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        }
      />

      {/* Payslip Document */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold mb-1">Klyron ERP</h2>
            <p className="text-sm text-muted-foreground">
              123 Business Avenue, Suite 100
            </p>
            <p className="text-sm text-muted-foreground">
              San Francisco, CA 94105
            </p>
          </div>
          <div className="text-right">
            <StatusBadge
              status={payslipData.status}
              variant={payslipData.statusVariant}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Payslip ID: {payslipData.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Pay Date: {payslipData.payDate}
            </p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {payslipData.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold">{payslipData.employee}</p>
              <p className="text-xs text-muted-foreground">
                {payslipData.designation}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Department</p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {payslipData.department}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Bank Account
            </p>
            <p className="text-sm font-medium">{payslipData.bankAccount}</p>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Earnings */}
          <div>
            <h3 className="text-sm font-semibold text-success mb-4 uppercase tracking-wider">
              Earnings
            </h3>
            <div className="space-y-3">
              {payslipData.earnings.map((earning) => (
                <div
                  key={earning.label}
                  className="flex justify-between py-2 border-b border-border/50"
                >
                  <span className="text-sm text-muted-foreground">
                    {earning.label}
                  </span>
                  <span className="text-sm font-medium">
                    ${earning.amount.toLocaleString()}.00
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2 pt-3 border-t-2 border-border">
                <span className="text-sm font-semibold">Total Earnings</span>
                <span className="text-sm font-bold text-success">
                  ${payslipData.gross.toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-sm font-semibold text-danger mb-4 uppercase tracking-wider">
              Deductions
            </h3>
            <div className="space-y-3">
              {payslipData.deductions.map((deduction) => (
                <div
                  key={deduction.label}
                  className="flex justify-between py-2 border-b border-border/50"
                >
                  <span className="text-sm text-muted-foreground">
                    {deduction.label}
                  </span>
                  <span className="text-sm font-medium">
                    -${deduction.amount.toLocaleString()}.00
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2 pt-3 border-t-2 border-border">
                <span className="text-sm font-semibold">Total Deductions</span>
                <span className="text-sm font-bold text-danger">
                  -${totalDeductions.toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-muted/50 rounded-xl p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="text-3xl font-bold text-success">
                ${netPay.toLocaleString()}.00
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Payment Method: Bank Transfer
              </p>
              <p className="text-xs text-muted-foreground">
                Account: {payslipData.bankAccount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
