"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Ticket,
  Search,
  Plus,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  User,
  ArrowUpDown,
} from "lucide-react";

const tickets = [
  { id: "TKT-001", subject: "Cannot access dashboard after password reset", priority: "High", priorityVariant: "warning" as const, status: "Open", statusVariant: "danger" as const, assignee: "Sarah Chen", assigneeAvatar: "SC", customer: "Acme Corp", created: "Jun 21, 2024 10:30 AM", updated: "Jun 21, 2024 02:15 PM" },
  { id: "TKT-002", subject: "Invoice PDF generation shows blank page", priority: "Critical", priorityVariant: "danger" as const, status: "In Progress", statusVariant: "info" as const, assignee: "Mike Johnson", assigneeAvatar: "MJ", customer: "TechStart Inc", created: "Jun 20, 2024 04:20 PM", updated: "Jun 21, 2024 11:00 AM" },
  { id: "TKT-003", subject: "How to export inventory data to CSV?", priority: "Low", priorityVariant: "muted" as const, status: "Resolved", statusVariant: "success" as const, assignee: "Emily Davis", assigneeAvatar: "ED", customer: "Global Retail", created: "Jun 19, 2024 09:15 AM", updated: "Jun 19, 2024 03:45 PM" },
  { id: "TKT-004", subject: "Integration with QuickBooks failing", priority: "High", priorityVariant: "warning" as const, status: "Open", statusVariant: "danger" as const, assignee: "David Park", assigneeAvatar: "DP", customer: "SmallBiz LLC", created: "Jun 18, 2024 01:30 PM", updated: "Jun 20, 2024 10:20 AM" },
  { id: "TKT-005", subject: "User roles not saving correctly", priority: "Medium", priorityVariant: "info" as const, status: "In Progress", statusVariant: "info" as const, assignee: "Omar Hassan", assigneeAvatar: "OH", customer: "DataFlow Systems", created: "Jun 17, 2024 11:45 AM", updated: "Jun 19, 2024 04:30 PM" },
  { id: "TKT-006", subject: "Feature request: Bulk import customers", priority: "Low", priorityVariant: "muted" as const, status: "Closed", statusVariant: "muted" as const, assignee: "Emily Davis", assigneeAvatar: "ED", customer: "Wholesale Direct", created: "Jun 15, 2024 08:00 AM", updated: "Jun 18, 2024 02:15 PM" },
  { id: "TKT-007", subject: "Mobile app crashes on Android 14", priority: "Critical", priorityVariant: "danger" as const, status: "Open", statusVariant: "danger" as const, assignee: "Unassigned", assigneeAvatar: "UA", customer: "FieldWorks", created: "Jun 14, 2024 03:45 PM", updated: "Jun 16, 2024 09:00 AM" },
  { id: "TKT-008", subject: "Payment gateway timeout errors", priority: "High", priorityVariant: "warning" as const, status: "Resolved", statusVariant: "success" as const, assignee: "Mike Johnson", assigneeAvatar: "MJ", customer: "ShopEasy", created: "Jun 12, 2024 02:10 PM", updated: "Jun 15, 2024 11:30 AM" },
];

const ticketStats = [
  { label: "Open Tickets", value: "18", change: "4 Critical", color: "text-danger" },
  { label: "In Progress", value: "12", change: "Avg 2.1h response", color: "text-info" },
  { label: "Resolved Today", value: "8", change: "92% satisfaction", color: "text-success" },
  { label: "Avg Response Time", value: "1.8h", change: "-0.3h vs last week", color: "text-primary" },
];

export default function SupportTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      selectedPriority === "All" || t.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === "All" || t.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Support Tickets"
        description="Manage customer support requests and inquiries."
        breadcrumbs={[
          { label: "Support", href: "/support" },
          { label: "Tickets" },
        ]}
        icon={<Ticket className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/support/tickets/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ticketStats.map((stat) => (
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
                placeholder="Search tickets by subject, #, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Priority: All</option>
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
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
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
                  Ticket
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Priority
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
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">
                          {ticket.id}
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-0.5 max-w-[280px] truncate">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 lg:hidden">
                        {ticket.priority}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {ticket.customer}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <StatusBadge
                      status={ticket.priority}
                      variant={ticket.priorityVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                        {ticket.assigneeAvatar}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {ticket.assignee}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {ticket.updated}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={ticket.status}
                      variant={ticket.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/support/tickets/${ticket.id}`}
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
            Showing {filteredTickets.length} of {tickets.length} tickets
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
