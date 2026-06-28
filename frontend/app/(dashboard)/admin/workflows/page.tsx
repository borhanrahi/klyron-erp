"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import {
  GitBranch,
  Plus,
  Save,
  Trash2,
  ArrowRight,
  ArrowDown,
  Check,
  X,
  AlertCircle,
  Loader2,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface WorkflowStep {
  id?: number;
  step_order: number;
  name: string;
  approver_type: string;
  approver_id: number | null;
  min_amount: number | null;
  max_amount: number | null;
  action: string;
}

interface Workflow {
  id: number;
  name: string;
  entity_type: string;
  is_active: boolean;
  steps: WorkflowStep[];
  created_at: string;
}

const APPROVER_TYPES = [
  { value: "supervisor", label: "Direct Supervisor" },
  { value: "manager", label: "Department Manager" },
  { value: "role", label: "Specific Role" },
  { value: "hr", label: "HR Manager" },
  { value: "finance", label: "Finance Manager" },
];

const ENTITY_TYPES = [
  { value: "loan", label: "Loan Applications" },
  { value: "leave", label: "Leave Requests" },
  { value: "expense", label: "Expense Claims" },
  { value: "purchase", label: "Purchase Orders" },
  { value: "travel", label: "Travel Requests" },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    entity_type: "loan",
    is_active: true,
    steps: [] as Omit<WorkflowStep, "id">[],
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      apiGet<{ items: Workflow[] }>("/workflows/", { per_page: "100" }),
      apiGet<{ items: { id: number; name: string }[] }>("/admin/roles", { per_page: "100" }),
    ])
      .then(([wfRes, roleRes]) => {
        setWorkflows(wfRes.items || []);
        setRoles(roleRes.items || []);
      })
      .catch(() => setError("Failed to load workflows"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      entity_type: "loan",
      is_active: true,
      steps: [
        { step_order: 1, name: "Supervisor Approval", approver_type: "supervisor", approver_id: null, min_amount: null, max_amount: null, action: "approve" },
        { step_order: 2, name: "HR Review", approver_type: "role", approver_id: null, min_amount: null, max_amount: null, action: "approve" },
        { step_order: 3, name: "Finance Approval", approver_type: "role", approver_id: null, min_amount: null, max_amount: null, action: "approve" },
      ],
    });
  };

  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          step_order: prev.steps.length + 1,
          name: `Step ${prev.steps.length + 1}`,
          approver_type: "role",
          approver_id: null,
          min_amount: null,
          max_amount: null,
          action: "approve",
        },
      ],
    }));
  };

  const removeStep = (index: number) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, step_order: i + 1 })),
    }));
  };

  const updateStep = (index: number, field: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Workflow name is required");
      return;
    }
    if (form.steps.length === 0) {
      setError("At least one approval step is required");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // First create the workflow
      const wfRes = await apiPost<{ data: { id: number } }>("/workflows/", {
        name: form.name,
        entity_type: form.entity_type,
        is_active: form.is_active,
      });

      // Then create steps
      for (const step of form.steps) {
        await apiPost("/workflows/steps", {
          workflow_id: wfRes.data.id,
          step_order: step.step_order,
          name: step.name,
          approver_type: step.approver_type,
          approver_id: step.approver_id,
          min_amount: step.min_amount,
          max_amount: step.max_amount,
          action: step.action,
        });
      }

      setSuccess(`Workflow "${form.name}" created successfully!`);
      resetForm();
      setShowForm(false);
      fetchData();
    } catch {
      setError("Failed to create workflow");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (wf: Workflow) => {
    try {
      await apiPut(`/workflows/${wf.id}`, { is_active: !wf.is_active });
      fetchData();
    } catch {
      setError("Failed to toggle workflow");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this workflow? This action cannot be undone.")) return;
    try {
      await apiDelete(`/workflows/${id}`);
      fetchData();
    } catch {
      setError("Failed to delete workflow");
    }
  };

  const getEntityLabel = (type: string) => ENTITY_TYPES.find((e) => e.value === type)?.label || type;
  const getApproverLabel = (type: string) => APPROVER_TYPES.find((a) => a.value === type)?.label || type;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Workflow Builder"
        description="Configure multi-step approval workflows for various business processes."
        icon={<GitBranch className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Workflows" },
        ]}
        actions={
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); setError(null); }}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Workflow
          </button>
        }
      />

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

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Create Approval Workflow</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Workflow Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
                placeholder="e.g. Loan Approval"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Applies To</label>
              <select
                value={form.entity_type}
                onChange={(e) => setForm({ ...form, entity_type: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              >
                {ENTITY_TYPES.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>

          {/* Steps */}
          <h4 className="text-sm font-semibold mb-3">Approval Steps</h4>
          <div className="space-y-3">
            {form.steps.map((step, idx) => (
              <div key={idx} className="relative border border-border rounded-xl p-4 bg-muted/20">
                {idx > 0 && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-card border border-border rounded-full p-1 inline-flex">
                      <ArrowDown className="h-3 w-3 text-muted-foreground" />
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Step {step.step_order}
                  </span>
                  <button
                    onClick={() => removeStep(idx)}
                    className="p-1 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Step Name</label>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateStep(idx, "name", e.target.value)}
                      className="w-full mt-1 px-2.5 py-2 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Approver Type</label>
                    <select
                      value={step.approver_type}
                      onChange={(e) => updateStep(idx, "approver_type", e.target.value)}
                      className="w-full mt-1 px-2.5 py-2 rounded-lg border border-border bg-background text-sm"
                    >
                      {APPROVER_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {step.approver_type === "role" && (
                    <div>
                      <label className="text-xs text-muted-foreground">Select Role</label>
                      <select
                        value={step.approver_id || ""}
                        onChange={(e) => updateStep(idx, "approver_id", e.target.value ? Number(e.target.value) : null)}
                        className="w-full mt-1 px-2.5 py-2 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="">Select role...</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-muted-foreground">Min Amount (optional)</label>
                    <input
                      type="number"
                      value={step.min_amount ?? ""}
                      onChange={(e) => updateStep(idx, "min_amount", e.target.value ? Number(e.target.value) : null)}
                      className="w-full mt-1 px-2.5 py-2 rounded-lg border border-border bg-background text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addStep}
            className="mt-3 px-4 py-2 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors w-full"
          >
            + Add Approval Step
          </button>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Creating..." : "Create Workflow"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Workflow List */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Configured Workflows</h3>
        </div>
        {loading ? (
          <div className="py-12 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
          </div>
        ) : workflows.length === 0 ? (
          <div className="py-12 text-center">
            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No workflows configured yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Create a workflow to define approval processes for loans, leaves, and more.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-4 hover:bg-muted/5 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{wf.name}</h4>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{getEntityLabel(wf.entity_type)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${wf.is_active ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`}>
                        {wf.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{wf.steps?.length || 0} approval step(s)</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleToggleActive(wf)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Toggle active">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(wf.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-500" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Step Flow */}
                {wf.steps && wf.steps.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {wf.steps.sort((a, b) => a.step_order - b.step_order).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="bg-muted rounded-lg px-3 py-1.5 text-xs font-medium">
                          {step.name}
                          <span className="text-muted-foreground ml-1">({getApproverLabel(step.approver_type)})</span>
                        </div>
                        {idx < wf.steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
