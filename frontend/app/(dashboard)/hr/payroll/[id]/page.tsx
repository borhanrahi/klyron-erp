"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  DollarSign,
  ArrowLeft,
  Download,
} from "lucide-react";
import Link from "next/link";

interface PayrollItem {
  id: number;
  payroll_id: number;
  component_id: number | null;
  type: string;
  name: string;
  amount: number;
}

interface PayrollDetail {
  id: number;
  company_id: number;
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
  loan_deduction: number;
  net_pay: number;
  status: string;
  payslip_url: string | null;
  paid_at: string | null;
  created_at: string;
  items: PayrollItem[];
}

interface ApiResponse {
  data: PayrollDetail;
}

const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const statusVariant = (s: string): "success" | "warning" | "danger" | "muted" | "info" => {
  if (s === "paid") return "success";
  if (s === "processed") return "info";
  if (s === "pending") return "warning";
  if (s === "failed") return "danger";
  return "muted";
};

export default function PayslipDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [payroll, setPayroll] = useState<PayrollDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiGet<ApiResponse>(`/hr/payroll/${id}`)
      .then((res) => setPayroll(res.data))
      .catch((err) => setError(err.message || "Failed to load payroll"))
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (n: number | null | undefined) => (n != null ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00");

  const handleDownloadPDF = async () => {
    if (!id) return;
    setDownloading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/hr/payroll-actions/${id}/payslip-pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${payroll?.employee_code || id}_${payroll?.year || ""}_${String(payroll?.month || "").padStart(2, "0")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("PDF download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-3">Loading payslip...</p>
        </div>
      </div>
    );
  }

  if (error || !payroll) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-danger">{error || "Payroll not found"}</p>
          <Link href="/hr/payroll" className="text-sm text-primary hover:underline mt-2 inline-block">Back to Payroll</Link>
        </div>
      </div>
    );
  }

  const earnings = [
    { label: "Base Salary", amount: payroll.base_salary },
    ...(payroll.allowances > 0 ? [{ label: "Allowances", amount: payroll.allowances }] : []),
    ...(payroll.bonus > 0 ? [{ label: "Bonus", amount: payroll.bonus }] : []),
    ...(payroll.items || []).filter((i) => i.type === "earning").map((i) => ({ label: i.name, amount: i.amount })),
  ];

  const deductionItems = [
    ...(payroll.deductions > 0 ? [{ label: "Deductions", amount: payroll.deductions }] : []),
    ...(payroll.tax > 0 ? [{ label: "Tax", amount: payroll.tax }] : []),
    ...(payroll.loan_deduction > 0 ? [{ label: "Loan Deduction", amount: payroll.loan_deduction }] : []),
    ...(payroll.items || []).filter((i) => i.type === "deduction").map((i) => ({ label: i.name, amount: i.amount })),
  ];

  const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0);
  const totalDeductions = deductionItems.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Payslip - ${monthNames[payroll.month]} ${payroll.year}`}
        description={`Payment for ${payroll.employee_name || `Employee #${payroll.employee_id}`}`}
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: `PAY-${String(payroll.id).padStart(3, "0")}` },
        ]}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/hr/payroll" className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        }
      />

      {/* Payslip Document */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm print:shadow-none print:border-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold mb-1">Klyron ERP</h2>
            <p className="text-sm text-muted-foreground">123 Business Avenue, Suite 100</p>
            <p className="text-sm text-muted-foreground">San Francisco, CA 94105</p>
          </div>
          <div className="text-right">
            <StatusBadge status={payroll.status} variant={statusVariant(payroll.status)} />
            <p className="text-sm text-muted-foreground mt-2">Payslip ID: PAY-{String(payroll.id).padStart(3, "0")}</p>
            {payroll.paid_at && <p className="text-sm text-muted-foreground">Paid: {new Date(payroll.paid_at).toLocaleDateString()}</p>}
          </div>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {(payroll.employee_name || `E${payroll.employee_id}`).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{payroll.employee_name || `Employee #${payroll.employee_id}`}</p>
              <p className="text-xs text-muted-foreground">{payroll.employee_code || ""}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Period</p>
            <p className="text-sm font-medium">{monthNames[payroll.month]} {payroll.year}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Employee ID</p>
            <p className="text-sm font-medium">{payroll.employee_code || `#${payroll.employee_id}`}</p>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          <div>
            <h3 className="text-sm font-semibold text-success mb-4 uppercase tracking-wider">Earnings</h3>
            <div className="space-y-3">
              {earnings.map((earning) => (
                <div key={earning.label} className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{earning.label}</span>
                  <span className="text-sm font-medium">{fmt(earning.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 pt-3 border-t-2 border-border">
                <span className="text-sm font-semibold">Total Earnings</span>
                <span className="text-sm font-bold text-success">{fmt(totalEarnings)}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-danger mb-4 uppercase tracking-wider">Deductions</h3>
            <div className="space-y-3">
              {deductionItems.length === 0 && <p className="text-sm text-muted-foreground">No deductions</p>}
              {deductionItems.map((deduction) => (
                <div key={deduction.label} className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{deduction.label}</span>
                  <span className="text-sm font-medium">-{fmt(deduction.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 pt-3 border-t-2 border-border">
                <span className="text-sm font-semibold">Total Deductions</span>
                <span className="text-sm font-bold text-danger">-{fmt(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-muted/50 rounded-xl p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="text-3xl font-bold text-success">{fmt(payroll.net_pay)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Payment Method: Bank Transfer</p>
              <p className="text-xs text-muted-foreground">Period: {monthNames[payroll.month]} {payroll.year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
