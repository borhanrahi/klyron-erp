"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Clock,
  ArrowLeft,
  Edit,
  Calendar,
  User,
  FolderKanban,
  ListTodo,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
} from "lucide-react";

const timesheetData = {
  id: "TS-002",
  employee: "Mike Johnson",
  employeeAvatar: "MJ",
  email: "mike.j@klyron.com",
  project: "E-Commerce Platform Redesign",
  task: "User Auth Implementation",
  date: "Jun 21, 2024",
  hours: 7.5,
  status: "Pending",
  statusVariant: "warning" as const,
  description:
    "Implemented JWT token infrastructure, login endpoint with rate limiting, and started on registration flow. Fixed the token refresh mechanism to handle edge cases.",
  created: "Jun 21, 2024 05:30 PM",
  updated: "Jun 21, 2024 05:30 PM",
  weeklyLog: [
    { date: "Mon, Jun 17", hours: 8, task: "JWT Infrastructure Setup" },
    { date: "Tue, Jun 18", hours: 7, task: "Login Endpoint" },
    { date: "Wed, Jun 19", hours: 8, task: "Rate Limiting Implementation" },
    { date: "Thu, Jun 20", hours: 7.5, task: "Registration Flow" },
    { date: "Fri, Jun 21", hours: 7.5, task: "Token Refresh & Edge Cases" },
  ],
  comments: [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "SC",
      text: "Great progress this week! The rate limiting implementation looks solid.",
      time: "Jun 21, 2024 06:00 PM",
    },
  ],
};

export default function TimesheetDetailPage() {
  const totalWeekHours = timesheetData.weeklyLog.reduce(
    (sum, day) => sum + day.hours,
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={`Timesheet ${timesheetData.id}`}
        description={`${timesheetData.employee} · ${timesheetData.date}`}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Timesheets", href: "/projects/timesheets" },
          { label: timesheetData.id },
        ]}
        icon={<Clock className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/projects/timesheets"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Entry
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timesheet Details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Entry Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Employee</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                    {timesheetData.employeeAvatar}
                  </div>
                  <span className="text-sm font-medium">
                    {timesheetData.employee}
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">
                  {timesheetData.date}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Project</span>
                <span className="text-sm font-medium">
                  {timesheetData.project}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Hours</span>
                <span className="text-sm font-bold text-primary">
                  {timesheetData.hours}h
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Task</span>
                <span className="text-sm font-medium">
                  {timesheetData.task}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge
                  status={timesheetData.status}
                  variant={timesheetData.statusVariant}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Work Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {timesheetData.description}
            </p>
          </div>

          {/* Weekly Summary */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">This Week&apos;s Log</h3>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-primary">{totalWeekHours}h</span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Task
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {timesheetData.weeklyLog.map((log, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-muted/5 transition-colors ${
                        log.date.includes("Jun 21") ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-sm">{log.date}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {log.task}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-semibold">
                        {log.hours}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4">Review Actions</h4>
            <div className="space-y-2">
              <button className="w-full bg-success text-white py-2.5 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
              <button className="w-full bg-danger text-white py-2.5 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4">
              Comments ({timesheetData.comments.length})
            </h4>
            <div className="space-y-3">
              {timesheetData.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-semibold text-primary">
                      {comment.avatar}
                    </div>
                    <span className="text-xs font-medium">{comment.author}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Add comment..."
                className="flex-1 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Created
              </label>
              <span className="text-sm">{timesheetData.created}</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Last Updated
              </label>
              <span className="text-sm">{timesheetData.updated}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
