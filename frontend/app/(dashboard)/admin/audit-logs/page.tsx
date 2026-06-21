"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  FileText,
  Shield,
  Globe,
} from "lucide-react";

const auditLogs = [
  { id: "LOG-001", timestamp: "Jun 21, 2024 10:32 AM", user: "Sarah Chen", action: "User Login", entity: "Authentication", details: "Successful login from 192.168.1.45", ip: "192.168.1.45", actionVariant: "success" as const },
  { id: "LOG-002", timestamp: "Jun 21, 2024 10:35 AM", user: "Sarah Chen", action: "Settings Updated", entity: "Company", details: "Changed timezone to Pacific Time", ip: "192.168.1.45", actionVariant: "info" as const },
  { id: "LOG-003", timestamp: "Jun 20, 2024 4:15 PM", user: "Mike Johnson", action: "Record Created", entity: "Invoice", details: "Created invoice INV-2024-0089", ip: "10.0.0.123", actionVariant: "info" as const },
  { id: "LOG-004", timestamp: "Jun 20, 2024 2:00 PM", user: "Sarah Chen", action: "Data Exported", entity: "Finance Report", details: "Exported Q1 2024 P&L statement", ip: "192.168.1.45", actionVariant: "warning" as const },
  { id: "LOG-005", timestamp: "Jun 20, 2024 11:30 AM", user: "System", action: "Backup Completed", entity: "System", details: "Daily database backup completed successfully", ip: "-", actionVariant: "success" as const },
  { id: "LOG-006", timestamp: "Jun 19, 2024 3:45 PM", user: "Emma Wilson", action: "Record Deleted", entity: "Lead", details: "Deleted lead LEAD-00342 (duplicate)", ip: "172.16.0.55", actionVariant: "danger" as const },
  { id: "LOG-007", timestamp: "Jun 19, 2024 1:00 PM", user: "David Kim", action: "Permission Changed", entity: "Role", details: "Updated Manager role permissions", ip: "10.1.1.88", actionVariant: "warning" as const },
  { id: "LOG-008", timestamp: "Jun 19, 2024 9:00 AM", user: "Sarah Chen", action: "User Login", entity: "Authentication", details: "Successful login from 192.168.1.45", ip: "192.168.1.45", actionVariant: "success" as const },
  { id: "LOG-009", timestamp: "Jun 18, 2024 5:30 PM", user: "Emily Davis", action: "Record Updated", entity: "Employee", details: "Updated employee EMP-0045 salary details", ip: "10.0.0.200", actionVariant: "info" as const },
  { id: "LOG-010", timestamp: "Jun 18, 2024 2:15 PM", user: "Robert Taylor", action: "Login Failed", entity: "Authentication", details: "Failed login attempt - invalid password", ip: "203.0.113.42", actionVariant: "danger" as const },
];

const logStats = [
  { label: "Total Events", value: "1,247", change: "Last 30 days" },
  { label: "Today", value: "23", change: "Events logged" },
  { label: "Failed Logins", value: "3", change: "This week" },
  { label: "Active Users", value: "38", change: "Unique users" },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("All");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "All" || log.action.includes(selectedAction);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Audit Logs"
        description="Track all system activities, changes, and security events."
        icon={<ScrollText className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Audit Logs" },
        ]}
        actions={
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {logStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option value="All">All Actions</option>
          <option value="Login">Login</option>
          <option value="Created">Created</option>
          <option value="Updated">Updated</option>
          <option value="Deleted">Deleted</option>
          <option value="Exported">Exported</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Timestamp
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Action
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Entity
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Details
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  IP Address
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm font-medium">{log.user}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={log.action} variant={log.actionVariant} />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{log.entity}</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground truncate max-w-[200px] block">{log.details}</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm font-mono text-muted-foreground">{log.ip}</span>
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
            Showing {filteredLogs.length} of {auditLogs.length} logs
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">2</button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">3</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
