"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import {
  HandCoins,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Banknote,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface LoanRecord {
  id: number;
  loan_type: string;
  amount: number;
  reason: string | null;
  status: string;
  created_at: string | null;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: "Pending",
    icon: <Clock className="h-3 w-3" />,
    className: "bg-yellow-500/10 text-yellow-500",
  },
  active: {
    label: "Active",
    icon: <CheckCircle className="h-3 w-3" />,
    className: "bg-blue-500/10 text-blue-500",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="h-3 w-3" />,
    className: "bg-green-500/10 text-green-500",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="h-3 w-3" />,
    className: "bg-red-500/10 text-red-500",
  },
  closed: {
    label: "Closed",
    icon: <XCircle className="h-3 w-3" />,
    className: "bg-gray-500/10 text-gray-500",
  },
};

const defaultStatus = {
  label: "Unknown",
  icon: <AlertCircle className="h-3 w-3" />,
  className: "bg-gray-500/10 text-gray-500",
};

const LOAN_TYPES = [
  "Personal Loan",
  "Salary Advance",
  "Emergency Loan",
  "Education Loan",
  "Medical Loan",
  "Home Renovation Loan",
  "Vehicle Loan",
  "Other",
];

export default function ESSLoansPage() {
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    loan_type: LOAN_TYPES[0],
    amount: "",
    reason: "",
    repayment_months: "6",
  });

  const fetchLoans = () => {
    apiGet<{ data: LoanRecord[] }>("/ess/requests/history")
      .then((res) => setLoans(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleSubmit = async () => {
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid loan amount." });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      await apiPost("/ess/requests/loan", {
        loan_type: form.loan_type,
        amount: amount,
        reason: form.reason || null,
        repayment_months: parseInt(form.repayment_months) || 6,
      });
      setMessage({ type: "success", text: "Loan request submitted successfully! It will be reviewed by HR." });
      setShowForm(false);
      setForm({
        loan_type: LOAN_TYPES[0],
        amount: "",
        reason: "",
        repayment_months: "6",
      });
      fetchLoans();
    } catch {
      setMessage({ type: "error", text: "Failed to submit loan request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const totalApproved = loans
    .filter((l) => l.status === "active" || l.status === "approved")
    .reduce((s, l) => s + (l.amount || 0), 0);
  const pendingCount = loans.filter((l) => l.status === "pending").length;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Apply for Loan"
        description="Request a salary advance, personal loan, or other financial assistance."
        icon={<HandCoins className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => {
              setShowForm(!showForm);
              setMessage(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancel" : "New Loan Request"}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Banknote className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Approved</p>
              <p className="text-xl font-bold">৳{totalApproved.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-warning/10 rounded-xl">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Requests</p>
              <p className="text-xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-info/10 rounded-xl">
              <HandCoins className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Requests</p>
              <p className="text-xl font-bold">{loans.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-600"
              : "bg-red-500/10 border-red-500/30 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Loan Application Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-1">New Loan Application</h3>
          <p className="text-xs text-muted-foreground mb-5">
            Fill in the details below to submit a loan request for HR review.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Loan Type</label>
              <select
                value={form.loan_type}
                onChange={(e) => setForm({ ...form, loan_type: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {LOAN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Amount (৳)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. 50000"
                min="1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Repayment Period (months)</label>
              <select
                value={form.repayment_months}
                onChange={(e) => setForm({ ...form, repayment_months: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {[3, 6, 9, 12, 18, 24].map((m) => (
                  <option key={m} value={m}>
                    {m} months
                  </option>
                ))}
              </select>
            </div>
            <div />
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Reason / Purpose</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={3}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Briefly describe the purpose of this loan..."
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.amount || parseFloat(form.amount) <= 0}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Loan Request <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loan History */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Loan Request History</h3>
          <Link
            href="/hr/payroll/loans"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">Loading...</div>
        ) : loans.length === 0 ? (
          <div className="py-12 text-center">
            <HandCoins className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No loan requests yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Click &quot;New Loan Request&quot; above to apply.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Reason</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loans.map((loan) => {
                  const sc = statusConfig[loan.status] || defaultStatus;
                  return (
                    <tr key={loan.id} className="hover:bg-muted/5 transition-colors">
                      <td className="p-3 font-medium">{loan.loan_type}</td>
                      <td className="p-3 font-semibold">৳{loan.amount?.toLocaleString()}</td>
                      <td className="p-3 text-muted-foreground text-xs hidden sm:table-cell max-w-[200px] truncate">
                        {loan.reason || "—"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.className}`}
                        >
                          {sc.icon}
                          {sc.label}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs hidden md:table-cell">
                        {loan.created_at
                          ? new Date(loan.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
