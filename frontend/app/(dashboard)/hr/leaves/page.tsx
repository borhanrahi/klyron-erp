"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string | null;
  employee_code: string | null;
  leave_type_id: number | null;
  start_date: string;
  end_date: string;
  days: number | null;
  reason: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

interface LeaveListResponse {
  items: LeaveRequest[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

const leaveStatusVariant = (s: string): "success" | "warning" | "danger" | "info" | "muted" => {
  if (s === "approved") return "success";
  if (s === "pending") return "warning";
  if (s === "rejected") return "danger";
  return "muted";
};

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchLeaves = (p: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "10" };
    if (searchTerm) params.search = searchTerm;
    apiGet<LeaveListResponse>("/hr/leaves", params)
      .then((res) => {
        setLeaves(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      })
      .catch(() => {
        setLeaves([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves(1);
  }, []);

  const formatDate = (d: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return d;
    }
  };

  const filteredLeaves = selectedStatus === "All"
    ? leaves
    : leaves.filter((l) => l.status === selectedStatus.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Leave Requests"
        description="Manage and approve employee leave requests."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Leave Requests" },
        ]}
        icon={<Calendar className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leave requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLeaves(1)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => fetchLeaves(1)}
              className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Start</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">End</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Days</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">Loading leave requests...</td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">No leave requests found.</td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {(leave.employee_name || `#${leave.employee_id}`).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{leave.employee_name || `Employee #${leave.employee_id}`}</p>
                          <p className="text-xs text-muted-foreground">{leave.reason || "No reason provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">Leave Type #{leave.leave_type_id || "—"}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{formatDate(leave.start_date)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{formatDate(leave.end_date)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{leave.days || "—"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={leave.status} variant={leaveStatusVariant(leave.status)} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {leave.status === "pending" && (
                          <>
                            <button className="p-2 hover:bg-success/10 rounded-lg transition-colors text-success" title="Approve">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="p-2 hover:bg-danger/10 rounded-lg transition-colors text-danger" title="Reject">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {leaves.length} of {total} requests</p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchLeaves(page - 1)} disabled={page <= 1} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchLeaves(page + 1)} disabled={page >= pages} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
