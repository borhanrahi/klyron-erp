"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import { usePermissions } from "@/hooks/usePermissions";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CalendarCheck, CheckCircle2, XCircle, Search } from "lucide-react";

interface Leave {
  id: number;
  employee_name?: string;
  employee_id?: number;
  leave_type?: string;
  reason: string;
  start_date: string;
  end_date: string;
  days: number;
  status: string;
  created_at: string;
}

export default function LeaveApprovals() {
  const { profile } = usePermissions();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  async function fetchLeaves() {
    try {
      setLoading(true);
      const params = new URLSearchParams({ per_page: "50" });
      if (filter !== "all") params.set("status", filter);
      if (search) params.set("search", search);
      const res = await apiGet<any>(`/hr/leaves?${params.toString()}`);
      const items = res.items || res.data?.items || [];
      setLeaves(items);
    } catch {
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: number, action: "approved" | "rejected") {
    try {
      setProcessing(id);
      await apiPut(`/hr/leaves/${id}`, { status: action });
      setLeaves((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      console.error("Failed to update leave:", e);
    } finally {
      setProcessing(null);
    }
  }

  useEffect(() => {
    if (search) {
      const timer = setTimeout(() => fetchLeaves(), 300);
      return () => clearTimeout(timer);
    }
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Approvals"
        description="Review and approve/reject leave requests from your team"
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

      {/* Leave List */}
      <div className="rounded-xl bg-card border border-border">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarCheck className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="font-medium">No {filter} leave requests</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {leaves.map((leave) => (
              <div key={leave.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-amber-500/10">
                    <CalendarCheck className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{leave.employee_name || `Employee #${leave.employee_id}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.leave_type || "Leave"} &middot; {leave.days} day{leave.days > 1 ? "s" : ""}
                      &middot; {leave.start_date} to {leave.end_date}
                    </p>
                    {leave.reason && (
                      <p className="text-xs text-muted-foreground mt-0.5">{leave.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={leave.status} />
                  {leave.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAction(leave.id, "approved")}
                        disabled={processing === leave.id}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction(leave.id, "rejected")}
                        disabled={processing === leave.id}
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
