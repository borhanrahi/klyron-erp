"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPut, apiPost } from "@/lib/api";
import {
  Shield,
  Save,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  Loader2,
  Users,
} from "lucide-react";
import Link from "next/link";

interface PermissionModule {
  id: string;
  label: string;
}

interface PermissionGroup {
  group: string;
  modules: PermissionModule[];
}

interface PermissionsConfig {
  groups: PermissionGroup[];
  actions: string[];
}

interface RoleData {
  id: number;
  name: string;
  description: string;
  is_system: boolean;
  permissions_json: Record<string, Record<string, boolean>>;
  user_count: number;
}

const ACTION_LABELS: Record<string, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
};

const ACTION_COLORS: Record<string, string> = {
  view: "bg-blue-500/10 text-blue-600 border-blue-200",
  create: "bg-green-500/10 text-green-600 border-green-200",
  edit: "bg-amber-500/10 text-amber-600 border-amber-200",
  delete: "bg-red-500/10 text-red-600 border-red-200",
  approve: "bg-purple-500/10 text-purple-600 border-purple-200",
};

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  const isNew = roleId === "new";

  const [role, setRole] = useState<RoleData | null>(null);
  const [config, setConfig] = useState<PermissionsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configRes = await apiGet<{ data: PermissionsConfig }>("/admin/permissions-config");
        setConfig(configRes.data);

        if (!isNew) {
          const roleRes = await apiGet<{ data: RoleData }>(`/admin/roles/${roleId}`);
          setRole(roleRes.data);
          setName(roleRes.data.name);
          setDescription(roleRes.data.description || "");
          setPermissions(roleRes.data.permissions_json || {});
        } else {
          // Default: all false
          const defaultPerms: Record<string, Record<string, boolean>> = {};
          for (const group of configRes.data.groups) {
            for (const mod of group.modules) {
              defaultPerms[mod.id] = {};
              for (const action of configRes.data.actions) {
                defaultPerms[mod.id][action] = false;
              }
            }
          }
          setPermissions(defaultPerms);
        }
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roleId, isNew]);

  const togglePermission = (moduleId: string, action: string) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [action]: !(prev[moduleId]?.[action] ?? false),
      },
    }));
  };

  const setAllForModule = (moduleId: string, value: boolean) => {
    setPermissions((prev) => {
      const updated = { ...(prev[moduleId] || {}) };
      for (const action of config?.actions || []) {
        updated[action] = value;
      }
      return { ...prev, [moduleId]: updated };
    });
  };

  const setAllForGroup = (groupName: string, value: boolean) => {
    const group = config?.groups.find((g) => g.group === groupName);
    if (!group) return;
    const updated = { ...permissions };
    for (const mod of group.modules) {
      const modPerms = { ...(updated[mod.id] || {}) };
      for (const action of config?.actions || []) {
        modPerms[action] = value;
      }
      updated[mod.id] = modPerms;
    }
    setPermissions(updated);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Role name is required");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (isNew) {
        await apiPost("/admin/roles", { name, description, permissions_json: permissions });
        setSuccess("Role created successfully!");
        setTimeout(() => router.push("/admin/roles"), 1000);
      } else {
        await apiPut(`/admin/roles/${roleId}`, { name, description, permissions_json: permissions });
        setSuccess("Role updated successfully!");
      }
    } catch {
      setError("Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  const totalPerms = (modId: string) => {
    const p = permissions[modId];
    if (!p) return 0;
    return Object.values(p).filter(Boolean).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={isNew ? "Create Role" : `Role: ${role?.name || ""}`}
        description={isNew ? "Define a new role with custom permissions" : "Edit role permissions and details"}
        icon={<Shield className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Roles", href: "/admin/roles" },
          { label: isNew ? "New Role" : role?.name || "" },
        ]}
      />

      {/* Error/Success Messages */}
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

      {/* Role Details */}
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-sm font-semibold mb-4">Role Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Role Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Sales Manager"
              disabled={role?.is_system}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Brief description of this role"
              disabled={role?.is_system}
            />
          </div>
        </div>
        {role && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {role.user_count} user(s) assigned to this role
            {role.is_system && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                System Role
              </span>
            )}
          </div>
        )}
      </div>

      {/* Permission Matrix */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Permission Matrix</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Module count:</span>
            {config?.groups.map((g) => (
              <span key={g.group} className="text-xs text-muted-foreground">
                {g.group}: {g.modules.filter((m) => totalPerms(m.id) > 0).length}/{g.modules.length}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* Action Headers */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[180px] shrink-0" />
            <div className="flex-1 flex gap-1">
              {config?.actions.map((action) => (
                <div
                  key={action}
                  className={`flex-1 text-center text-xs font-medium py-1.5 rounded-md border ${ACTION_COLORS[action] || "bg-muted"}`}
                >
                  {ACTION_LABELS[action] || action}
                </div>
              ))}
            </div>
          </div>

          {/* Permission Groups */}
          {config?.groups.map((group) => (
            <div key={group.group} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[180px] shrink-0">
                  <button
                    onClick={() => setAllForGroup(group.group, true)}
                    className="text-xs font-semibold text-primary hover:underline mr-2"
                  >
                    {group.group}
                  </button>
                  <button
                    onClick={() => setAllForGroup(group.group, false)}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    (clear)
                  </button>
                </div>
              </div>
              <div className="space-y-0.5">
                {group.modules.map((mod) => (
                  <div key={mod.id} className="flex items-center gap-2 py-1.5 hover:bg-muted/30 rounded-lg px-1 transition-colors">
                    <div className="w-[180px] shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => setAllForModule(mod.id, !(totalPerms(mod.id) > 0))}
                        className="text-xs text-muted-foreground hover:text-foreground truncate"
                        title={mod.label}
                      >
                        {mod.label}
                      </button>
                      <span className="text-[10px] text-muted-foreground/50">{totalPerms(mod.id)}/{config.actions.length}</span>
                    </div>
                    <div className="flex-1 flex gap-1">
                      {config.actions.map((action) => {
                        const checked = permissions[mod.id]?.[action] ?? false;
                        return (
                          <label
                            key={action}
                            className={`flex-1 flex items-center justify-center py-2 rounded-md border cursor-pointer transition-all ${
                              checked
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-muted/30 border-transparent hover:bg-muted/60 text-muted-foreground"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(mod.id, action)}
                              className="sr-only"
                            />
                            {checked ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <X className="h-3.5 w-3.5 opacity-30" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || role?.is_system}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : isNew ? "Create Role" : "Save Changes"}
        </button>
        <Link
          href="/admin/roles"
          className="px-5 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roles
        </Link>
      </div>
    </div>
  );
}
