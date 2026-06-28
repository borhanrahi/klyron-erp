"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { RequirePermission } from "@/components/common/RequirePermission";
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

interface TicketItem {
  id: string;
  subject: string;
  priority: string;
  priorityVariant: "danger" | "warning" | "info" | "muted";
  status: string;
  statusVariant: "danger" | "warning" | "info" | "success" | "muted";
  assignee: string;
  assigneeAvatar: string;
  customer: string;
  created: string;
  updated: string;
}

const priorityVariantMap: Record<string, TicketItem["priorityVariant"]> = {
  Critical: "danger",
  High: "warning",
  Medium: "info",
  Low: "muted",
};

const statusVariantMap: Record<string, TicketItem["statusVariant"]> = {
  Open: "danger",
  "In Progress": "info",
  Resolved: "success",
  Closed: "muted",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SupportTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ items: TicketItem[] }>("/support/tickets")
      .then((res) =>
        setTickets(
          res.items.map((t) => ({
            ...t,
            priorityVariant: priorityVariantMap[t.priority] || "info",
            statusVariant: statusVariantMap[t.status] || "info",
            assigneeAvatar: t.assigneeAvatar || getInitials(t.assignee || "NA"),
          }))
        )
      )
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const ticketStats = [
    { label: "Open Tickets", value: String(tickets.filter((t) => t.status === "Open").length), change: `${tickets.filter((t) => t.priority === "Critical" && t.status === "Open").length} Critical`, color: "text-danger" },
    { label: "In Progress", value: String(tickets.filter((t) => t.status === "In Progress").length), change: "Avg 2.1h response", color: "text-info" },
    { label: "Resolved Today", value: String(tickets.filter((t) => t.status === "Resolved").length), change: "92% satisfaction", color: "text-success" },
    { label: "Avg Response Time", value: "1.8h", change: "-0.3h vs last week", color: "text-primary" },
  ];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <RequirePermission module="support.tickets">
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
    </RequirePermission>
  );
}
