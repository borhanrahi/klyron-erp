"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import {
  GitBranch,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  X,
  UserCheck,
  Building2,
  ArrowUpDown,
  Check,
} from "lucide-react";
import Link from "next/link";

interface Team {
  id: number;
  name: string;
  description: string | null;
  lead_id: number | null;
  lead_name: string | null;
  department_id: number | null;
  department_name: string | null;
  is_active: boolean;
  member_count: number;
  members: TeamMember[] | null;
  created_at: string | null;
}

interface TeamMember {
  employee_id: number;
  employee_name: string | null;
  employee_code: string | null;
  designation: string | null;
  role: string;
  joined_at: string | null;
}

interface Employee {
  id: number;
  full_name: string | null;
  employee_code: string;
  department_name: string | null;
  designation: string | null;
}

interface Department {
  id: number;
  name: string;
}

interface TeamFormData {
  name: string;
  description: string;
  lead_id: number | null;
  department_id: number | null;
  is_active: boolean;
  member_ids: number[];
  member_roles: string[];
}

const emptyForm: TeamFormData = {
  name: "",
  description: "",
  lead_id: null,
  department_id: null,
  is_active: true,
  member_ids: [],
  member_roles: [],
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [form, setForm] = useState<TeamFormData>(emptyForm);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [saving, setSaving] = useState(false);
  const [viewTeam, setViewTeam] = useState<Team | null>(null);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState("member");
  const { confirm, state, handleClose } = useConfirm();

  const fetchTeams = (p: number, search?: string) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "10" };
    if (search) params.search = search;
    apiGet<{ items: Team[]; total: number; page: number; per_page: number; pages: number }>("/hr/teams", params)
      .then((res) => {
        setTeams(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      })
      .catch(() => { setTeams([]); setTotal(0); })
      .finally(() => setLoading(false));
  };

  const fetchEmployees = async () => {
    try {
      const res = await apiGet<{ items: Employee[] }>("/hr/employee-directory", { per_page: "200", status: "active" });
      setEmployees(res.items || []);
    } catch { setEmployees([]); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await apiGet<{ items: Department[] }>("/master-data/departments", { per_page: "100" });
      setDepartments(res.items || []);
    } catch { setDepartments([]); }
  };

  useEffect(() => {
    fetchTeams(1);
    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleSearch = () => fetchTeams(1, searchTerm || undefined);

  const openCreateModal = () => {
    setEditingTeam(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setForm({
      name: team.name,
      description: team.description || "",
      lead_id: team.lead_id,
      department_id: team.department_id,
      is_active: team.is_active,
      member_ids: [],
      member_roles: [],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingTeam) {
        await apiPut(`/hr/teams/${editingTeam.id}`, form);
      } else {
        await apiPost("/hr/teams", form);
      }
      setShowModal(false);
      fetchTeams(page, searchTerm || undefined);
    } catch (e) {
      console.error("Failed to save team", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm("Delete this team? Members will be unassigned.");
    if (!ok) return;
    await apiDelete(`/hr/teams/${id}`);
    fetchTeams(page, searchTerm || undefined);
  };

  const viewTeamDetails = async (team: Team) => {
    try {
      const res = await apiGet<{ data: Team }>(`/hr/teams/${team.id}`);
      setViewTeam(res.data);
    } catch {
      setViewTeam(team);
    }
  };

  const handleAddMember = async () => {
    if (!selectedEmployeeId || !viewTeam) return;
    try {
      await apiPost(`/hr/teams/${viewTeam.id}/members`, {
        employee_id: selectedEmployeeId,
        role: selectedRole,
      });
      setAddingMember(false);
      setSelectedEmployeeId(null);
      setSelectedRole("member");
      viewTeamDetails(viewTeam);
    } catch (e) {
      console.error("Failed to add member", e);
    }
  };

  const handleRemoveMember = async (employeeId: number) => {
    if (!viewTeam) return;
    const ok = await confirm("Remove this member from the team?");
    if (!ok) return;
    await apiDelete(`/hr/teams/${viewTeam.id}/members/${employeeId}`);
    viewTeamDetails(viewTeam);
  };

  const toggleMemberSelection = (id: number) => {
    setForm((prev) => ({
      ...prev,
      member_ids: prev.member_ids.includes(id)
        ? prev.member_ids.filter((m) => m !== id)
        : [...prev.member_ids, id],
      member_roles: prev.member_ids.includes(id)
        ? prev.member_roles
        : [...prev.member_roles, "member"],
    }));
  };

  // Available employees (not already in team members list for edit)
  const availableEmployees = employees.filter(
    (e) => !viewTeam?.members?.some((m) => m.employee_id === e.id)
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Teams"
        description="Manage teams, assign leads, and organize your workforce."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Teams" },
        ]}
        icon={<GitBranch className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={openCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Team
          </button>
        }
      />

      {/* Search & Filter */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="p-4">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="py-12 text-center">
              <GitBranch className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">No teams found. Create your first team.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer bg-card"
                  onClick={() => viewTeamDetails(team)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <GitBranch className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{team.name}</h3>
                        <p className="text-xs text-muted-foreground">{team.department_name || "No Department"}</p>
                      </div>
                    </div>
                    <StatusBadge
                      status={team.is_active ? "Active" : "Inactive"}
                      variant={team.is_active ? "success" : "muted"}
                    />
                  </div>
                  {team.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{team.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{team.member_count} member{team.member_count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>{team.lead_name || "No lead"}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3 pt-2 border-t border-border/30">
                    <button
                      onClick={(e) => { e.stopPropagation(); viewTeamDetails(team); }}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground flex items-center justify-center gap-1"
                    >
                      <Eye className="h-3 w-3" /> View
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(team); }}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground flex items-center justify-center gap-1"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(team.id); }}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-muted hover:bg-danger/10 transition-colors text-muted-foreground hover:text-danger flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {teams.length} of {total} teams</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTeams(page - 1, searchTerm || undefined)}
              disabled={page <= 1}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button
              onClick={() => fetchTeams(page + 1, searchTerm || undefined)}
              disabled={page >= pages}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl border border-border shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h2 className="text-lg font-semibold">{editingTeam ? "Edit Team" : "Create Team"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Team Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Frontend Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Team purpose and goals..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Team Lead</label>
                  <select
                    value={form.lead_id || ""}
                    onChange={(e) => setForm({ ...form, lead_id: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">No Lead</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name || emp.employee_code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Department</label>
                  <select
                    value={form.department_id || ""}
                    onChange={(e) => setForm({ ...form, department_id: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">No Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Member Selection */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Initial Members</label>
                <div className="border border-border rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
                  {employees.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-2">No employees available</p>
                  ) : (
                    employees.map((emp) => (
                      <label
                        key={emp.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={form.member_ids.includes(emp.id)}
                          onChange={() => toggleMemberSelection(emp.id)}
                          className="rounded border-border text-primary focus:ring-primary/20"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{emp.full_name || emp.employee_code}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {emp.designation || ""}{emp.department_name ? ` · ${emp.department_name}` : ""}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{form.member_ids.length} member(s) selected</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || saving}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {saving ? "Saving..." : editingTeam ? "Update Team" : "Create Team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Team Details Modal */}
      {viewTeam && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setViewTeam(null); setAddingMember(false); }}>
          <div className="bg-card rounded-2xl border border-border shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">{viewTeam.name}</h2>
                <p className="text-sm text-muted-foreground">{viewTeam.department_name || "No Department"} · {viewTeam.member_count} member{viewTeam.member_count !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => { setViewTeam(null); setAddingMember(false); }} className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Team Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Team Lead</p>
                  <p className="text-sm font-medium">{viewTeam.lead_name || "Not assigned"}</p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={viewTeam.is_active ? "Active" : "Inactive"} variant={viewTeam.is_active ? "success" : "muted"} />
                </div>
              </div>
              {viewTeam.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{viewTeam.description}</p>
                </div>
              )}

              {/* Members Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Team Members</h3>
                  <button
                    onClick={() => setAddingMember(!addingMember)}
                    className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add Member
                  </button>
                </div>

                {addingMember && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-xl">
                    <select
                      value={selectedEmployeeId || ""}
                      onChange={(e) => setSelectedEmployeeId(e.target.value ? Number(e.target.value) : null)}
                      className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:border-primary outline-none"
                    >
                      <option value="">Select employee...</option>
                      {availableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name || emp.employee_code} - {emp.department_name || "N/A"}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:border-primary outline-none"
                    >
                      <option value="member">Member</option>
                      <option value="lead">Lead</option>
                      <option value="co-lead">Co-Lead</option>
                    </select>
                    <button
                      onClick={handleAddMember}
                      disabled={!selectedEmployeeId}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {(!viewTeam.members || viewTeam.members.length === 0) ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No members in this team yet.</p>
                  ) : (
                    viewTeam.members.map((member) => (
                      <div key={member.employee_id} className="flex items-center justify-between p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {(member.employee_name || member.employee_code || "??").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{member.employee_name || member.employee_code}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.designation || ""}
                              {member.role !== "member" ? ` · ${member.role}` : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(member.employee_id)}
                          className="p-1.5 hover:bg-danger/10 rounded-lg transition-colors text-muted-foreground hover:text-danger cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
