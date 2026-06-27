"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import {
  Briefcase,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  Building2,
  DollarSign,
  Hash,
} from "lucide-react";

interface Designation {
  id: number;
  name: string;
  company_id: number | null;
  department_id: number | null;
  department_name?: string;
  grade_level: string | null;
  min_salary: number | null;
  max_salary: number | null;
  is_active: boolean;
  created_at: string | null;
}

interface Department {
  id: number;
  name: string;
}

interface DesignationForm {
  name: string;
  department_id: number | null;
  grade_level: string;
  min_salary: string;
  max_salary: string;
  is_active: boolean;
}

const emptyForm: DesignationForm = {
  name: "",
  department_id: null,
  grade_level: "",
  min_salary: "",
  max_salary: "",
  is_active: true,
};

const gradeLevels = [
  "Entry", "Junior", "Mid", "Senior", "Lead",
  "Manager", "Senior Manager", "Director", "VP", "C-Level",
];

export default function DesignationsPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDes, setEditingDes] = useState<Designation | null>(null);
  const [form, setForm] = useState<DesignationForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { confirm, state, handleClose } = useConfirm();

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const res = await apiGet<{ items: Designation[] }>("/master-data/designations", { per_page: "100" });
      const items = res.items || [];

      // Fetch department names
      try {
        const deptRes = await apiGet<{ items: Department[] }>("/master-data/departments", { per_page: "100" });
        const depts = deptRes.items || [];
        setDepartments(depts);
        const deptMap = new Map(depts.map((d: Department) => [d.id, d.name]));
        setDesignations(items.map((d: Designation) => ({
          ...d,
          department_name: d.department_id ? deptMap.get(d.department_id) || "—" : "—",
        })));
      } catch {
        setDesignations(items);
      }
    } catch {
      setDesignations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const filtered = designations.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.department_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.grade_level || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingDes(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (des: Designation) => {
    setEditingDes(des);
    setForm({
      name: des.name,
      department_id: des.department_id,
      grade_level: des.grade_level || "",
      min_salary: des.min_salary?.toString() || "",
      max_salary: des.max_salary?.toString() || "",
      is_active: des.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        department_id: form.department_id,
        grade_level: form.grade_level || null,
        min_salary: form.min_salary ? parseFloat(form.min_salary) : null,
        max_salary: form.max_salary ? parseFloat(form.max_salary) : null,
        is_active: form.is_active,
      };
      if (editingDes) {
        await apiPut(`/master-data/designations/${editingDes.id}`, payload);
      } else {
        await apiPost("/master-data/designations", payload);
      }
      setShowModal(false);
      fetchDesignations();
    } catch (e) {
      console.error("Failed to save designation", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm("Delete this designation?");
    if (!ok) return;
    await apiDelete(`/master-data/designations/${id}`);
    fetchDesignations();
  };

  const formatSalary = (val: number | null) => {
    if (val === null || val === undefined) return "—";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Designations"
        description="Manage job titles, grade levels, and salary ranges."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Organization" },
          { label: "Designations" },
        ]}
        icon={<Briefcase className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={openCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Designation
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, department, or grade level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    Designation <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Grade Level</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Min Salary</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Max Salary</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No designations found.</td></tr>
              ) : (
                filtered.map((des) => (
                  <tr key={des.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg"><Briefcase className="h-4 w-4 text-primary" /></div>
                        <span className="text-sm font-medium">{des.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{des.department_name || "—"}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {des.grade_level ? (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{des.grade_level}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <span className="text-sm text-muted-foreground">{formatSalary(des.min_salary)}</span>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <span className="text-sm text-muted-foreground">{formatSalary(des.max_salary)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={des.is_active ? "Active" : "Inactive"}
                        variant={des.is_active ? "success" : "muted"}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(des)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(des.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {designations.length} designations</p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl border border-border shadow-xl max-w-xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h2 className="text-lg font-semibold">{editingDes ? "Edit Designation" : "Add Designation"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Designation Title *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Department</label>
                  <select
                    value={form.department_id || ""}
                    onChange={(e) => setForm({ ...form, department_id: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                  >
                    <option value="">No Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Grade Level</label>
                  <select
                    value={form.grade_level}
                    onChange={(e) => setForm({ ...form, grade_level: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                  >
                    <option value="">Select Grade</option>
                    {gradeLevels.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Min Salary (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={form.min_salary}
                      onChange={(e) => setForm({ ...form, min_salary: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                      placeholder="50000"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Max Salary (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={form.max_salary}
                      onChange={(e) => setForm({ ...form, max_salary: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                      placeholder="120000"
                      min="0"
                    />
                  </div>
                </div>
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
                {saving ? "Saving..." : editingDes ? "Update" : "Create"}
              </button>
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
