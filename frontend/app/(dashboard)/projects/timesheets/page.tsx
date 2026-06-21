"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Clock,
  Search,
  Plus,
  Eye,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";

const timesheets = [
  { id: "TS-001", employee: "Sarah Chen", avatar: "SC", project: "E-Commerce Redesign", task: "Project Planning", hours: 8, date: "Jun 21, 2024", status: "Approved", statusVariant: "success" as const },
  { id: "TS-002", employee: "Mike Johnson", avatar: "MJ", project: "E-Commerce Redesign", task: "User Auth Implementation", hours: 7.5, date: "Jun 21, 2024", status: "Pending", statusVariant: "warning" as const },
  { id: "TS-003", employee: "Emily Davis", avatar: "ED", project: "Mobile App v2.0", task: "UI Design - Home Screen", hours: 6, date: "Jun 21, 2024", status: "Pending", statusVariant: "warning" as const },
  { id: "TS-004", employee: "David Park", avatar: "DP", project: "E-Commerce Redesign", task: "Product Catalog API", hours: 8.5, date: "Jun 21, 2024", status: "Approved", statusVariant: "success" as const },
  { id: "TS-005", employee: "Alex Kim", avatar: "AK", project: "CI/CD Pipeline", task: "Docker Setup", hours: 4, date: "Jun 21, 2024", status: "Approved", statusVariant: "success" as const },
  { id: "TS-006", employee: "Omar Hassan", avatar: "OH", project: "E-Commerce Redesign", task: "Component Library", hours: 7, date: "Jun 20, 2024", status: "Approved", statusVariant: "success" as const },
  { id: "TS-007", employee: "Priya Patel", avatar: "PP", project: "Mobile App v2.0", task: "QA Testing - Login Flow", hours: 6.5, date: "Jun 20, 2024", status: "Rejected", statusVariant: "danger" as const },
  { id: "TS-008", employee: "Rachel Martinez", avatar: "RM", project: "Customer Portal", task: "Requirements Gathering", hours: 8, date: "Jun 20, 2024", status: "Pending", statusVariant: "warning" as const },
  { id: "TS-009", employee: "James Wilson", avatar: "JW", project: "Data Analytics", task: "Budget Analysis", hours: 5, date: "Jun 19, 2024", status: "Approved", statusVariant: "success" as const },
  { id: "TS-010", employee: "Sarah Chen", avatar: "SC", project: "Legacy Migration", task: "Data Mapping Review", hours: 3, date: "Jun 19, 2024", status: "Approved", statusVariant: "success" as const },
];

const timesheetStats = [
  { label: "Total Hours This Week", value: "320h", change: "40 avg/person" },
  { label: "Pending Approvals", value: "8", change: "3 awaiting review" },
  { label: "Approved", value: "42", change: "This month" },
  { label: "Utilization Rate", value: "87%", change: "+2% vs last week" },
];

export default function TimesheetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTimesheets = timesheets.filter((ts) => {
    const matchesSearch =
      ts.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ts.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || ts.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Timesheets"
        description="Track employee time and project hours."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Timesheets" },
        ]}
        icon={<Clock className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Log Time
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {timesheetStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by employee or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Employee
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Project
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Task
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Hours
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTimesheets.map((ts) => (
                <tr
                  key={ts.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {ts.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ts.employee}</p>
                        <p className="text-xs text-muted-foreground">{ts.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {ts.project}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {ts.task}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">{ts.hours}h</span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {ts.date}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={ts.status}
                      variant={ts.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/projects/timesheets/${ts.id}`}
                      className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground inline-flex"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTimesheets.length} of {timesheets.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
