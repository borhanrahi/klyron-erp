"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Bug,
  Search,
  Plus,
  Eye,
  Edit,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowUpDown,
} from "lucide-react";

const bugs = [
  { id: "BUG-001", title: "Payment checkout crashes on invalid card", severity: "Critical", severityVariant: "danger" as const, status: "Open", statusVariant: "danger" as const, reporter: "Priya Patel", assignee: "Mike Johnson", project: "E-Commerce Redesign", created: "Jun 20, 2024", updated: "Jun 21, 2024" },
  { id: "BUG-002", title: "Product images not loading on mobile", severity: "High", severityVariant: "warning" as const, status: "In Progress", statusVariant: "info" as const, reporter: "Emily Davis", assignee: "Omar Hassan", project: "E-Commerce Redesign", created: "Jun 19, 2024", updated: "Jun 21, 2024" },
  { id: "BUG-003", title: "Search results duplicate items", severity: "Medium", severityVariant: "info" as const, status: "Open", statusVariant: "danger" as const, reporter: "David Park", assignee: "Unassigned", project: "E-Commerce Redesign", created: "Jun 18, 2024", updated: "Jun 18, 2024" },
  { id: "BUG-004", title: "User profile avatar upload fails silently", severity: "Medium", severityVariant: "info" as const, status: "In Review", statusVariant: "warning" as const, reporter: "Sarah Chen", assignee: "David Park", project: "Mobile App v2.0", created: "Jun 17, 2024", updated: "Jun 20, 2024" },
  { id: "BUG-005", title: "Dashboard charts display wrong data range", severity: "Low", severityVariant: "muted" as const, status: "Resolved", statusVariant: "success" as const, reporter: "James Wilson", assignee: "Mike Johnson", project: "Data Analytics", created: "Jun 15, 2024", updated: "Jun 19, 2024" },
  { id: "BUG-006", title: "Email notifications sent twice", severity: "High", severityVariant: "warning" as const, status: "Open", statusVariant: "danger" as const, reporter: "Rachel Martinez", assignee: "Alex Kim", project: "Customer Portal", created: "Jun 14, 2024", updated: "Jun 16, 2024" },
  { id: "BUG-007", title: "Session timeout not working correctly", severity: "High", severityVariant: "warning" as const, status: "In Progress", statusVariant: "info" as const, reporter: "Mike Johnson", assignee: "Sarah Chen", project: "E-Commerce Redesign", created: "Jun 13, 2024", updated: "Jun 20, 2024" },
  { id: "BUG-008", title: "Currency conversion rounding error", severity: "Medium", severityVariant: "info" as const, status: "Resolved", statusVariant: "success" as const, reporter: "James Wilson", assignee: "David Park", project: "E-Commerce Redesign", created: "Jun 12, 2024", updated: "Jun 18, 2024" },
];

const bugStats = [
  { label: "Open Bugs", value: "12", change: "3 Critical", color: "text-danger" },
  { label: "In Progress", value: "5", change: "2 High", color: "text-info" },
  { label: "Resolved", value: "28", change: "This month", color: "text-success" },
  { label: "Avg. Resolution", value: "2.3d", change: "-0.5d vs last month", color: "text-primary" },
];

export default function BugsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredBugs = bugs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      selectedSeverity === "All" || b.severity === selectedSeverity;
    const matchesStatus =
      selectedStatus === "All" || b.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Bug Tracker"
        description="Track and manage bugs across your projects."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Bugs" },
        ]}
        icon={<Bug className="h-6 w-6 text-danger" />}
        actions={
          <a
            href="/projects/bugs/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Report Bug
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bugStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
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
                placeholder="Search bugs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Severity: All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
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
                  Bug
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Severity
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Reporter
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Assignee
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Updated
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
              {filteredBugs.map((bug) => (
                <tr
                  key={bug.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {bug.id}
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-0.5">{bug.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {bug.project}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <StatusBadge
                      status={bug.severity}
                      variant={bug.severityVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {bug.reporter}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span
                      className={`text-sm ${
                        bug.assignee === "Unassigned"
                          ? "text-muted-foreground italic"
                          : ""
                      }`}
                    >
                      {bug.assignee}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {bug.updated}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={bug.status}
                      variant={bug.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/projects/bugs/${bug.id}`}
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
            Showing {filteredBugs.length} of {bugs.length} bugs
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
