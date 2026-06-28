"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import {
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  ArrowUpDown,
  Lock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RoleItem {
  id: number;
  name: string;
  description: string;
  is_system: boolean;
  user_count: number;
  permissions_json: Record<string, Record<string, boolean>>;
  created_at: string;
}

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = () => {
    setLoading(true);
    apiGet<{ items: RoleItem[]; total: number }>("/admin/roles", { per_page: "100" })
      .then((res) => {
        setRoles(res.items || []);
        setError(null);
      })
      .catch(() => setError("Failed to load roles. Is the backend running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (roleId: number, roleName: string) => {
    if (!confirm(`Delete role "${roleName}"? This action cannot be undone.`)) return;
    try {
      await apiDelete(`/admin/roles/${roleId}`);
      fetchRoles();
    } catch {
      alert("Failed to delete role. System roles cannot be deleted.");
    }
  };

  const totalUsers = roles.reduce((s, r) => s + r.user_count, 0);
  const systemRoles = roles.filter((r) => r.is_system).length;
  const customRoles = roles.filter((r) => !r.is_system).length;
  const permCount = (role: RoleItem) => {
    return Object.values(role.permissions_json || {}).filter((actions) =>
      Object.values(actions).some(Boolean)
    ).length;
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Link
            href="/admin/roles/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Role
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Roles</p>
          <p className="text-2xl font-bold mt-1">{roles.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{systemRoles} system, {customRoles} custom</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Users Assigned</p>
          </div>
          <p className="text-2xl font-bold mt-1">{totalUsers}</p>
          <p className="text-xs text-muted-foreground mt-1">Across all roles</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-warning" />
            <p className="text-sm text-muted-foreground">System Roles</p>
          </div>
          <p className="text-2xl font-bold mt-1">{systemRoles}</p>
          <p className="text-xs text-muted-foreground mt-1">Cannot be deleted</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-success" />
            <p className="text-sm text-muted-foreground">Custom Roles</p>
          </div>
          <p className="text-2xl font-bold mt-1">{customRoles}</p>
          <p className="text-xs text-muted-foreground mt-1">Created by admins</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-sm text-warning flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

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
        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">Loading roles...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Role</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Users</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Permissions</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Type</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredRoles.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No roles found.</td></tr>
                ) : filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {role.is_system ? (
                            <Lock className="h-5 w-5 text-primary" />
                          ) : (
                            <Shield className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{role.name}</p>
                          <p className="text-xs text-muted-foreground max-w-[250px] truncate">
                            {role.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{role.user_count}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{permCount(role)} modules</span>
                    </td>
                    <td className="py-3 px-4">
                      {role.is_system ? (
                        <StatusBadge status="System" variant="primary" />
                      ) : (
                        <StatusBadge status="Custom" variant="success" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/roles/${role.id}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Shield className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(role.id, role.name)}
                          disabled={role.is_system}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          title={role.is_system ? "System roles cannot be deleted" : "Delete role"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRoles.length} of {roles.length} roles
          </p>
        </div>
      </div>
    </div>
  );
}
