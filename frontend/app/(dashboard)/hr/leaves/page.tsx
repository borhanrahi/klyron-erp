"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  CalendarDays,
} from "lucide-react";

const leaveRequests = [
  {
    id: "LR-2024-001",
    employee: "Sarah Chen",
    role: "Lead Designer",
    avatar: "SC",
    type: "Annual Leave",
    startDate: "Apr 1, 2024",
    endDate: "Apr 5, 2024",
    days: 5,
    reason: "Family vacation",
    status: "Pending",
    statusVariant: "warning" as const,
    appliedDate: "Mar 20, 2024",
  },
  {
    id: "LR-2024-002",
    employee: "Mike Johnson",
    role: "Backend Developer",
    avatar: "MJ",
    type: "Sick Leave",
    startDate: "Mar 28, 2024",
    endDate: "Mar 29, 2024",
    days: 2,
    reason: "Medical appointment",
    status: "Approved",
    statusVariant: "success" as const,
    appliedDate: "Mar 25, 2024",
  },
  {
    id: "LR-2024-003",
    employee: "David Park",
    role: "Full Stack Developer",
    avatar: "DP",
    type: "Personal Leave",
    startDate: "Apr 10, 2024",
    endDate: "Apr 12, 2024",
    days: 3,
    reason: "Personal matter",
    status: "Pending",
    statusVariant: "warning" as const,
    appliedDate: "Mar 22, 2024",
  },
  {
    id: "LR-2024-004",
    employee: "Emily Davis",
    role: "Product Manager",
    avatar: "ED",
    type: "Annual Leave",
    startDate: "Mar 15, 2024",
    endDate: "Mar 15, 2024",
    days: 1,
    reason: "Day off",
    status: "Approved",
    statusVariant: "success" as const,
    appliedDate: "Mar 12, 2024",
  },
  {
    id: "LR-2024-005",
    employee: "Alex Kim",
    role: "DevOps Engineer",
    avatar: "AK",
    type: "Annual Leave",
    startDate: "Apr 15, 2024",
    endDate: "Apr 19, 2024",
    days: 5,
    reason: "Travel",
    status: "Rejected",
    statusVariant: "danger" as const,
    appliedDate: "Mar 18, 2024",
  },
];

const leaveStats = [
  { label: "Pending Requests", value: "8", change: "3 urgent" },
  { label: "Approved This Month", value: "24", change: "+5 vs last month" },
  { label: "Total Leave Days", value: "156", change: "Q1 2024" },
  { label: "Average Leave Balance", value: "12", change: "per employee" },
];

export default function LeaveApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || request.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>HRM</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Leave Approvals
        </span>
      </div>

      <PageHeader
        title="Leave Approvals"
        description="Review and manage team time-off requests."
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveStats.map((stat) => (
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Employee Info */}
              <div className="flex items-center gap-3 lg:w-64">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {request.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{request.employee}</p>
                  <p className="text-xs text-muted-foreground">{request.role}</p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Leave Type</p>
                  <p className="text-sm font-medium">{request.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-sm font-medium">
                    {request.startDate} - {request.endDate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.days} day{request.days > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm font-medium">{request.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Applied</p>
                  <p className="text-sm font-medium">{request.appliedDate}</p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 lg:w-48">
                <StatusBadge
                  status={request.status}
                  variant={request.statusVariant}
                />
                {request.status === "Pending" && (
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredRequests.length} of {leaveRequests.length} requests
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
            2
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
