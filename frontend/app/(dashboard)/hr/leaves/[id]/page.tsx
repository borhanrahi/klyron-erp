"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  FileText,
} from "lucide-react";

const leaveRequest = {
  id: "LR-2024-001",
  employee: "Sarah Chen",
  avatar: "SC",
  email: "sarah.chen@klyron.com",
  department: "Engineering",
  designation: "Senior Developer",
  type: "Annual Leave",
  startDate: "Apr 1, 2024",
  endDate: "Apr 5, 2024",
  days: 5,
  reason:
    "Family vacation planned in advance. Need to take time off for family commitments.",
  status: "Pending",
  statusVariant: "warning" as const,
  appliedDate: "Mar 20, 2024",
  manager: "Emily Davis",
};

const timeline = [
  {
    date: "Mar 20, 2024 10:30 AM",
    action: "Leave request submitted",
    by: "Sarah Chen",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    date: "Mar 20, 2024 02:15 PM",
    action: "Request forwarded to manager",
    by: "System",
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  {
    date: "Mar 21, 2024 09:00 AM",
    action: "Request viewed by manager",
    by: "Emily Davis",
    icon: User,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    date: "Pending",
    action: "Awaiting approval",
    by: "Emily Davis",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export default function LeaveDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={`Leave Request ${leaveRequest.id}`}
        description={`Submitted by ${leaveRequest.employee}`}
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Leaves", href: "/hr/leaves" },
          { label: leaveRequest.id },
        ]}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/hr/leaves"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            {leaveRequest.status === "Pending" && (
              <>
                <button className="border border-danger bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
                <button className="bg-success text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-success/90 active:scale-95 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Leave Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                {leaveRequest.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {leaveRequest.employee}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {leaveRequest.designation} · {leaveRequest.department}
                </p>
                <p className="text-sm text-muted-foreground">
                  {leaveRequest.email}
                </p>
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Leave Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">
                  Leave Type
                </p>
                <p className="text-sm font-medium">{leaveRequest.type}</p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="text-sm font-medium">
                  {leaveRequest.startDate} - {leaveRequest.endDate}
                </p>
                <p className="text-xs text-muted-foreground">
                  {leaveRequest.days} working day{leaveRequest.days > 1 ? "s" : ""}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">
                  Applied Date
                </p>
                <p className="text-sm font-medium">
                  {leaveRequest.appliedDate}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">
                  Reporting Manager
                </p>
                <p className="text-sm font-medium">{leaveRequest.manager}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Reason</p>
              <p className="text-sm">{leaveRequest.reason}</p>
            </div>
          </div>

          {/* Comment */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Add Comment</h3>
            <textarea
              rows={3}
              placeholder="Add a comment or note..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none mb-3"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              Submit Comment
            </button>
          </div>
        </div>

        {/* Right Column - Status & Timeline */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Status
            </h3>
            <div className="text-center">
              <StatusBadge
                status={leaveRequest.status}
                variant={leaveRequest.statusVariant}
              />
              <p className="text-sm text-muted-foreground mt-3">
                Last updated: Mar 21, 2024
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Activity Timeline
            </h3>
            <div className="space-y-4">
              {timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full ${event.bgColor} flex items-center justify-center`}
                    >
                      <event.icon className={`h-4 w-4 ${event.color}`} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">{event.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.by} · {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
