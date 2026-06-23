"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPut } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FolderKanban,
  Save,
  ArrowLeft,
  Calendar,
  DollarSign,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const STATUSES = ["planning", "in progress", "on hold", "completed", "cancelled"];
const PRIORITIES = ["low", "medium", "high", "critical"];
const BILLING_TYPES = ["fixed", "hourly", "milestone", "retainer"];

interface Project {
  id: number;
  code: string;
  name: string;
  client_id: number | null;
  manager_id: number | null;
  budget: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  priority: string;
  progress_pct: number;
  billing_type: string | null;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("planning");
  const [priority, setPriority] = useState("medium");
  const [billingType, setBillingType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [managerId, setManagerId] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await apiGet<{ data: Project }>(`/projects/${projectId}`);
        if (cancelled) return;
        const p = res.data;
        setCode(p.code);
        setName(p.name);
        setStatus(p.status);
        setPriority(p.priority);
        setBillingType(p.billing_type ?? "");
        setStartDate(p.start_date ? p.start_date.slice(0, 10) : "");
        setEndDate(p.end_date ? p.end_date.slice(0, 10) : "");
        setBudget(p.budget?.toString() ?? "");
        setManagerId(p.manager_id?.toString() ?? "");
        setClientId(p.client_id?.toString() ?? "");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load project");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError("Code and name are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await apiPut(`/projects/${projectId}`, {
        code: code.trim(),
        name: name.trim(),
        status,
        priority,
        billing_type: billingType || null,
        start_date: startDate || null,
        end_date: endDate || null,
        budget: budget ? parseFloat(budget) : 0,
        manager_id: managerId ? parseInt(managerId) : null,
        client_id: clientId ? parseInt(clientId) : null,
      });
      router.push(`/projects/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Project Not Found"
          icon={<FolderKanban className="h-6 w-6 text-primary" />}
          actions={
            <button
              onClick={() => router.back()}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          }
        />
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={`Edit ${name}`}
        description={`Editing project ${code}`}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Projects", href: "/projects/projects" },
          { label: name, href: `/projects/projects/${projectId}` },
          { label: "Edit" },
        ]}
        icon={<FolderKanban className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.back()}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      {error && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Project Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Billing Type</label>
              <select
                value={billingType}
                onChange={(e) => setBillingType(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">None</option>
                {BILLING_TYPES.map((b) => (
                  <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Manager ID</label>
              <input
                type="number"
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                placeholder="Employee ID"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Client ID</label>
              <input
                type="number"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Customer ID"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Timeline & Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Budget ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
