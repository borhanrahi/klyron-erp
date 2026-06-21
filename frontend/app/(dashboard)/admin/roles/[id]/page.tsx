"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Shield,
  ArrowLeft,
  Edit,
  Users,
  Check,
  X,
  Lock,
} from "lucide-react";

const roleData = {
  id: "ROLE-003",
  name: "Manager",
  description: "Manager-level access for team leads with expanded permissions.",
  users: 12,
  status: "Active",
  statusVariant: "success" as const,
  createdAt: "Jan 15, 2024",
  updatedAt: "Mar 20, 2024",
};

const permissionGroups = [
  {
    module: "Finance",
    permissions: [
      { name: "View Invoices", granted: true },
      { name: "Create Invoices", granted: true },
      { name: "Edit Invoices", granted: true },
      { name: "Delete Invoices", granted: false },
      { name: "View Reports", granted: true },
      { name: "Manage Bank Accounts", granted: false },
      { name: "Journal Entries", granted: false },
    ],
  },
  {
    module: "HR",
    permissions: [
      { name: "View Employees", granted: true },
      { name: "Create Employees", granted: true },
      { name: "Edit Employees", granted: true },
      { name: "Delete Employees", granted: false },
      { name: "Manage Payroll", granted: false },
      { name: "Manage Attendance", granted: true },
      { name: "Manage Leaves", granted: true },
    ],
  },
  {
    module: "Inventory",
    permissions: [
      { name: "View Items", granted: true },
      { name: "Create Items", granted: true },
      { name: "Edit Items", granted: true },
      { name: "Delete Items", granted: false },
      { name: "Manage Stock", granted: true },
      { name: "View Reports", granted: true },
    ],
  },
  {
    module: "Sales",
    permissions: [
      { name: "View Leads", granted: true },
      { name: "Create Leads", granted: true },
      { name: "Edit Leads", granted: true },
      { name: "Manage Pipeline", granted: true },
      { name: "View Reports", granted: true },
      { name: "Manage Campaigns", granted: false },
    ],
  },
  {
    module: "CRM",
    permissions: [
      { name: "View Contacts", granted: true },
      { name: "Create Contacts", granted: true },
      { name: "Edit Contacts", granted: true },
      { name: "Manage Inquiries", granted: true },
      { name: "Manage Campaigns", granted: false },
    ],
  },
  {
    module: "POS",
    permissions: [
      { name: "Process Sales", granted: true },
      { name: "View Transactions", granted: true },
      { name: "Manage Terminals", granted: false },
      { name: "View Reports", granted: true },
    ],
  },
  {
    module: "Admin",
    permissions: [
      { name: "Manage Users", granted: false },
      { name: "Manage Roles", granted: false },
      { name: "Manage Branches", granted: false },
      { name: "View Audit Logs", granted: true },
      { name: "System Settings", granted: false },
    ],
  },
];

export default function RoleDetailPage() {
  const [activeTab, setActiveTab] = useState("permissions");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={roleData.name}
        description={roleData.description}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Roles", href: "/admin/roles" },
          { label: roleData.name },
        ]}
        icon={<Shield className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/admin/roles"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Role
            </button>
          </div>
        }
      />

      {/* Role Info Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Users Assigned</p>
              <p className="text-lg font-bold">{roleData.users}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-lg font-bold">{roleData.createdAt}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-lg font-bold">{roleData.updatedAt}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={roleData.status} variant={roleData.statusVariant} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "permissions", label: "Permissions", icon: Lock },
          { id: "users", label: "Assigned Users", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          {permissionGroups.map((group) => (
            <div key={group.module} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">{group.module}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.permissions.map((perm) => (
                  <div
                    key={perm.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      perm.granted
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    {perm.granted ? (
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`text-sm ${perm.granted ? "text-foreground" : "text-muted-foreground"}`}>
                      {perm.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">User</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Branch</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { name: "Sarah Chen", email: "sarah.chen@klyron.com", branch: "HQ", status: "Active" },
                  { name: "Mike Johnson", email: "mike.j@klyron.com", branch: "ECO", status: "Active" },
                  { name: "Emma Wilson", email: "emma.w@klyron.com", branch: "EUH", status: "Active" },
                  { name: "David Kim", email: "david.k@klyron.com", branch: "APAC", status: "Active" },
                ].map((user, i) => (
                  <tr key={i} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <StatusBadge status={user.branch} variant="muted" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={user.status} variant="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
