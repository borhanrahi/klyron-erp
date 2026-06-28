"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { HandCoins, CheckCircle2, XCircle, Search } from "lucide-react";

interface Loan {
  id: number;
  employee_name?: string;
  employee_id?: number;
  reason: string;
  amount: number;
  total_amount?: number;
  status: string;
  created_at: string;
  repayment_months?: number;
}

export default function LoanApprovals() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  async function fetchLoans() {
    try {
      setLoading(true);
      const params = new URLSearchParams({ per_page: "50" });
      if (filter !== "all") params.set("status", filter);
      if (search) params.set("search", search);
      const res = await apiGet<any>(`/hr/loans?${params.toString()}`);
      const items = res.items || res.data?.items || [];
      setLoans(items);
    } catch {
      setLoans([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: number, action: "approved" | "rejected") {
    try {
      setProcessing(id);
      await apiPut(`/hr/loans/${id}`, { status: action });
      setLoans((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      console.error("Failed to update loan:", e);
    } finally {
      setProcessing(null);
    }
  }

  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(() => fetchLoans(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loan Approvals"
        description="Review and approve/reject loan applications from your team"
      />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background text-sm w-48"
          />
        </div>
      </div>

      {/* Loan List */}
      <div className="rounded-xl bg-card border border-border">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <HandCoins className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="font-medium">No {filter} loan requests</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {loans.map((loan) => (
              <div key={loan.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-emerald-500/10">
                    <HandCoins className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{loan.employee_name || `Employee #${loan.employee_id}`}</p>
                    <p className="text-xs text-muted-foreground">
                      ${(loan.amount || loan.total_amount || 0).toLocaleString()}
                      {loan.repayment_months ? ` &middot; ${loan.repayment_months} months` : ""}
                    </p>
                    {loan.reason && (
                      <p className="text-xs text-muted-foreground mt-0.5">{loan.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={loan.status} />
                  {loan.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAction(loan.id, "approved")}
                        disabled={processing === loan.id}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction(loan.id, "rejected")}
                        disabled={processing === loan.id}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
