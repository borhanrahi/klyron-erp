"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Shield,
  ArrowLeft,
  Save,
  Check,
  X,
  Users,
  Lock,
} from "lucide-react";

const modules = [
  {
    name: "Finance",
    permissions: ["View Invoices", "Create Invoices", "Edit Invoices", "Delete Invoices", "View Reports", "Manage Bank Accounts", "Journal Entries"],
  },
  {
    name: "HR",
    permissions: ["View Employees", "Create Employees", "Edit Employees", "Delete Employees", "Manage Payroll", "Manage Attendance", "Manage Leaves"],
  },
  {
    name: "Inventory",
    permissions: ["View Items", "Create Items", "Edit Items", "Delete Items", "Manage Stock", "View Reports"],
  },
  {
    name: "Sales",
    permissions: ["View Leads", "Create Leads", "Edit Leads", "Manage Pipeline", "View Reports", "Manage Campaigns"],
  },
  {
    name: "CRM",
    permissions: ["View Contacts", "Create Contacts", "Edit Contacts", "Manage Inquiries", "Manage Campaigns"],
  },
  {
    name: "POS",
    permissions: ["Process Sales", "View Transactions", "Manage Terminals", "View Reports"],
  },
  {
    name: "Admin",
    permissions: ["Manage Users", "Manage Roles", "Manage Branches", "View Audit Logs", "System Settings"],
  },
];

export default function NewRolePage() {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});

  const togglePermission = (module: string, permission: string) => {
    const key = `${module}:${permission}`;
    setSelectedPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleModule = (module: string, permissions: string[]) => {
    const allSelected = permissions.every((p) => selectedPermissions[`${module}:${p}`]);
    const updates: Record<string, boolean> = {};
    permissions.forEach((p) => {
      updates[`${module}:${p}`] = !allSelected;
    });
    setSelectedPermissions((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Create Role"
        description="Define a new role with specific permissions."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Roles", href: "/admin/roles" },
          { label: "New Role" },
        ]}
        icon={<Shield className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/admin/roles"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roles
          </a>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Role Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Role Name *</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g., Marketing Manager"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Brief description of this role..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Permission Matrix</h3>
            <div className="space-y-6">
              {modules.map((mod) => {
                const allSelected = mod.permissions.every((p) => selectedPermissions[`${mod.name}:${p}`]);
                return (
                  <div key={mod.name}>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleModule(mod.name, mod.permissions)}
                        className="accent-primary"
                      />
                      <h4 className="text-sm font-semibold">{mod.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                      {mod.permissions.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedPermissions[`${mod.name}:${perm}`]}
                            onChange={() => togglePermission(mod.name, perm)}
                            className="accent-primary"
                          />
                          <span className="text-sm">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Role Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Role Name</span>
                <span className="text-sm font-medium">{roleName || "Not set"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Permissions</span>
                <span className="text-sm font-medium">
                  {Object.values(selectedPermissions).filter(Boolean).length} selected
                </span>
              </div>
            </div>
          </div>

          <button className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-2">
            <Save className="h-4 w-4" />
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
}
