"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiPut } from "@/lib/api";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Shield,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface UserItem {
  id: number;
  email: string;
  full_name: string;
  role_name: string | null;
  role_id: number | null;
  status: string;
  last_login: string | null;
  created_at: string;
}

interface RoleItem {
  id: number;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [assigningRole, setAssigningRole] = useState<{ userId: number; roleId: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const perPage = 25;

  const fetchData = (p: number) => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiGet<{ items: UserItem[]; total: number; page: number; pages: number }>("/admin/users", {
        per_page: String(perPage),
        page: String(p),
        ...(searchTerm ? { search: searchTerm } : {}),
      }),
      apiGet<{ items: RoleItem[] }>("/admin/roles", { per_page: "100" }),
    ])
      .then(([usersRes, rolesRes]) => {
        setUsers(usersRes.items || []);
        setTotal(usersRes.total || 0);
        setPage(usersRes.page || p);
        setPages(usersRes.pages || 1);
        setRoles(rolesRes.items || []);
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [searchTerm]);

  const handleRoleChange = async (userId: number, roleId: number) => {
    setAssigningRole({ userId, roleId });
    setError(null);
    setSuccess(null);
    try {
      await apiPut(`/admin/users/${userId}/role?role_id=${roleId}`, {});
      setSuccess("User role updated!");
      fetchData(page);
    } catch {
      setError("Failed to update role");
    } finally {
      setAssigningRole(null);
    }
  };

  const activeUsers = users.filter((u) => u.status === "active").length;
  const roleFilters = ["All", ...roles.map((r) => r.name)];

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRoleFilter === "All" || u.role_name === selectedRoleFilter;
    return matchesRole;
  });

  const statusVariant = (s: string): "success" | "warning" | "muted" | "danger" => {
    if (s === "active") return "success";
    if (s === "inactive") return "muted";
    if (s === "suspended") return "danger";
    if (s === "pending") return "warning";
    return "muted";
  };

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
          <Link
            href="/admin/users/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Invite User
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold mt-1">{total}</p>
          <p className="text-xs text-muted-foreground mt-1">Across all branches</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold mt-1">{activeUsers}</p>
          <p className="text-xs text-success mt-1">{total > 0 ? Math.round((activeUsers / total) * 100) : 0}% active</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Available Roles</p>
          <p className="text-2xl font-bold mt-1">{roles.length}</p>
          <p className="text-xs text-primary mt-1">Ready to assign</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold mt-1">{users.filter((u) => u.status === "pending").length}</p>
          <p className="text-xs text-warning mt-1">Awaiting activation</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-sm text-green-600 flex items-center gap-2">
          <Check className="h-4 w-4" /> {success}
        </div>
      )}

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
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          {roleFilters.map((r) => (
            <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex items-center justify-center text-muted-foreground text-sm">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">User</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Role</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Last Login</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No users found.</td></tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {(user.full_name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role_name || ""}
                        onChange={(e) => {
                          const role = roles.find((r) => r.name === e.target.value);
                          if (role) handleRoleChange(user.id, role.id);
                        }}
                        disabled={assigningRole?.userId === user.id}
                        className="text-sm bg-muted border border-border rounded-lg px-2 py-1.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="">No Role</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                      {assigningRole?.userId === user.id && (
                        <Loader2 className="h-3 w-3 animate-spin ml-1 inline" />
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <StatusBadge status={user.status} variant={statusVariant(user.status)} />
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filteredUsers.length} of {total} users</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData(page - 1)}
              disabled={page <= 1}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
            <button
              onClick={() => fetchData(page + 1)}
              disabled={page >= pages}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
