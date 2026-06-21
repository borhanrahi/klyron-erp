"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Shield,
  Building2,
  Clock,
} from "lucide-react";

const users = [
  { id: "USR-001", name: "Sarah Chen", email: "sarah.chen@klyron.com", role: "Admin", branch: "HQ", status: "Active", statusVariant: "success" as const, lastLogin: "2 min ago", avatar: "SC" },
  { id: "USR-002", name: "Mike Johnson", email: "mike.j@klyron.com", role: "Manager", branch: "ECO", status: "Active", statusVariant: "success" as const, lastLogin: "1 hour ago", avatar: "MJ" },
  { id: "USR-003", name: "Emma Wilson", email: "emma.w@klyron.com", role: "Sales Rep", branch: "EUH", status: "Active", statusVariant: "success" as const, lastLogin: "3 hours ago", avatar: "EW" },
  { id: "USR-004", name: "David Kim", email: "david.k@klyron.com", role: "Accountant", branch: "APAC", status: "Active", statusVariant: "success" as const, lastLogin: "1 day ago", avatar: "DK" },
  { id: "USR-005", name: "Emily Davis", email: "emily.d@klyron.com", role: "HR Specialist", branch: "HQ", status: "Active", statusVariant: "success" as const, lastLogin: "5 hours ago", avatar: "ED" },
  { id: "USR-006", name: "James Wilson", email: "james.w@klyron.com", role: "Viewer", branch: "ECO", status: "Inactive", statusVariant: "muted" as const, lastLogin: "2 weeks ago", avatar: "JW" },
  { id: "USR-007", name: "Maria Garcia", email: "maria.g@klyron.com", role: "Manager", branch: "HQ", status: "Active", statusVariant: "success" as const, lastLogin: "30 min ago", avatar: "MG" },
  { id: "USR-008", name: "Robert Taylor", email: "robert.t@klyron.com", role: "Sales Rep", branch: "ECO", status: "Suspended", statusVariant: "danger" as const, lastLogin: "5 days ago", avatar: "RT" },
];

const userStats = [
  { label: "Total Users", value: "42", change: "Across all branches" },
  { label: "Active Users", value: "38", change: "90.5% active" },
  { label: "Online Now", value: "12", change: "Currently logged in" },
  { label: "Pending Invites", value: "3", change: "Awaiting acceptance" },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="User Management"
        description="Manage system users, roles, and access permissions."
        icon={<Users className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users" },
        ]}
        actions={
          <a
            href="/admin/users/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Invite User
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat) => (
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Accountant">Accountant</option>
          <option value="HR Specialist">HR Specialist</option>
          <option value="Sales Rep">Sales Rep</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    User
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Role
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Branch
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Last Login
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <StatusBadge status={user.role} variant="muted" />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{user.branch}</span>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={user.status} variant={user.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/admin/users/${user.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </a>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
