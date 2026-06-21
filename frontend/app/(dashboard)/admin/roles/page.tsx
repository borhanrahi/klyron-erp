"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Shield,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Lock,
  Check,
} from "lucide-react";

const roles = [
  { id: "ROLE-001", name: "Super Admin", users: 2, permissions: "Full Access", description: "Complete system access with all permissions", status: "System", statusVariant: "primary" as const },
  { id: "ROLE-002", name: "Admin", users: 5, permissions: "24 permissions", description: "Administrative access to most modules", status: "Active", statusVariant: "success" as const },
  { id: "ROLE-003", name: "Manager", users: 12, permissions: "18 permissions", description: "Manager-level access for team leads", status: "Active", statusVariant: "success" as const },
  { id: "ROLE-004", name: "Accountant", users: 8, permissions: "12 permissions", description: "Finance and accounting module access", status: "Active", statusVariant: "success" as const },
  { id: "ROLE-005", name: "HR Specialist", users: 4, permissions: "14 permissions", description: "HR module and employee management access", status: "Active", statusVariant: "success" as const },
  { id: "ROLE-006", name: "Sales Rep", users: 15, permissions: "10 permissions", description: "Sales pipeline and CRM access", status: "Active", statusVariant: "success" as const },
  { id: "ROLE-007", name: "Viewer", users: 23, permissions: "6 permissions", description: "Read-only access to all modules", status: "Active", statusVariant: "success" as const },
];

const roleStats = [
  { label: "Total Roles", value: "7", change: "2 system, 5 custom" },
  { label: "Total Users Assigned", value: "69", change: "Across all roles" },
  { label: "Custom Roles", value: "5", change: "Created by admins" },
  { label: "Permission Groups", value: "8", change: "Module categories" },
];

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and control access to system modules."
        icon={<Shield className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Roles" },
        ]}
        actions={
          <a
            href="/admin/roles/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Roles Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Role
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Users
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Permissions
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
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{role.name}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{role.users}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <StatusBadge status={role.permissions} variant="muted" />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={role.status} variant={role.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/admin/roles/${role.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
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
      </div>
    </div>
  );
}
