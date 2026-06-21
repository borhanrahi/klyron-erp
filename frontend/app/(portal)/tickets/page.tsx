"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MessageSquare,
  Search,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Clock,
} from "lucide-react";

const tickets = [
  {
    id: "TKT-2024-045",
    subject: "Login issue after password reset",
    date: "Mar 24, 2024",
    lastUpdate: "2 hours ago",
    status: "Open",
    statusVariant: "info" as const,
    priority: "High",
  },
  {
    id: "TKT-2024-042",
    subject: "Feature request: Dark mode support",
    date: "Mar 20, 2024",
    lastUpdate: "1 day ago",
    status: "In Progress",
    statusVariant: "warning" as const,
    priority: "Medium",
  },
  {
    id: "TKT-2024-038",
    subject: "Data export not working",
    date: "Mar 15, 2024",
    lastUpdate: "3 days ago",
    status: "Resolved",
    statusVariant: "success" as const,
    priority: "High",
  },
  {
    id: "TKT-2024-035",
    subject: "How to integrate with Slack?",
    date: "Mar 10, 2024",
    lastUpdate: "5 days ago",
    status: "Closed",
    statusVariant: "muted" as const,
    priority: "Low",
  },
];

export default function PortalTicketsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get help from our support team
          </p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Ticket ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Subject
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Last Update
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Priority
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {ticket.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground md:hidden">
                      {ticket.lastUpdate}
                    </p>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ticket.lastUpdate}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <span
                      className={`text-sm ${
                        ticket.priority === "High"
                          ? "text-danger font-semibold"
                          : ticket.priority === "Medium"
                          ? "text-warning"
                          : "text-muted-foreground"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge
                      status={ticket.status}
                      variant={ticket.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-4 of 8 tickets
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
