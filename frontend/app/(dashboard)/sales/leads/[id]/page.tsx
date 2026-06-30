"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  ArrowLeft,
  Save,
  Trash2,
  User,
  Mail,
  Phone,
  Star,
  FileText,
  Loader2,
  Building2,
  Globe,
  DollarSign,
  Tags,
  Clock,
  CheckCircle2,
  PlusCircle,
  Send,
  PhoneCall,
  Activity,
  ListTodo,
  UserCheck,
  Target,
  Calendar,
  MessageSquare,
  AlertCircle,
  X,
  Check,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPut, apiDelete, apiPost } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";

// ── Types ───────────────────────────────────────────────────────────────────

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  notes: string;
  title?: string;
  company_name?: string;
  industry?: string;
  website?: string;
  lead_value?: number;
  tags?: string[];
  assigned_to?: number;
  last_activity_at?: string;
  created_by?: number;
  created_at: string;
}

interface Activity {
  id: number;
  lead_id: number;
  activity_type: string;
  description: string;
  old_value?: string;
  new_value?: string;
  created_by?: number;
  created_at: string;
}

interface Task {
  id: number;
  lead_id: number;
  title: string;
  description?: string;
  assigned_to: number;
  due_date?: string;
  priority: string;
  status: string;
  completed_at?: string;
  created_by?: number;
  created_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapStatusVariant(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "qualified" || s === "won") return "success" as const;
  if (s === "contacted" || s === "proposal") return "warning" as const;
  if (s === "lost") return "danger" as const;
  if (s === "new") return "info" as const;
  return "primary" as const;
}

const SCORE_COLORS = [
  "bg-danger",
  "bg-danger",
  "bg-warning",
  "bg-warning",
  "bg-primary",
  "bg-success",
] as const;

function getScoreColor(score: number) {
  const idx = Math.min(Math.floor(score / 20), 5);
  return SCORE_COLORS[idx];
}

function getActivityIcon(type: string) {
  switch (type) {
    case "system": return <Zap className="h-4 w-4 text-muted-foreground" />;
    case "status_change": return <Activity className="h-4 w-4 text-warning" />;
    case "assignment": return <UserCheck className="h-4 w-4 text-primary" />;
    case "note": return <MessageSquare className="h-4 w-4 text-info" />;
    case "call": return <PhoneCall className="h-4 w-4 text-success" />;
    case "email": return <Send className="h-4 w-4 text-primary" />;
    case "task_created": return <PlusCircle className="h-4 w-4 text-warning" />;
    case "task_completed": return <CheckCircle2 className="h-4 w-4 text-success" />;
    default: return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
}

function getPriorityColor(p: string) {
  switch (p) {
    case "urgent": return "text-danger border-danger/30 bg-danger/10";
    case "high": return "text-warning border-warning/30 bg-warning/10";
    case "medium": return "text-primary border-primary/30 bg-primary/10";
    case "low": return "text-muted-foreground border-border bg-muted";
    default: return "text-muted-foreground border-border bg-muted";
  }
}

function formatDate(d: string | undefined | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(d: string | undefined | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Component ────────────────────────────────────────────────────────────────

type Tab = "info" | "activity" | "tasks" | "notes";

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  // Activity state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // New activity form
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [newActivityType, setNewActivityType] = useState("note");
  const [newActivityDesc, setNewActivityDesc] = useState("");

  // New task form
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assigned_to: 0, due_date: "", priority: "medium" });

  // Team members
  const [teamMembers, setTeamMembers] = useState<{ id: number; name: string }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "",
    score: 0,
    notes: "",
    title: "",
    company_name: "",
    industry: "",
    website: "",
    lead_value: 0,
    tags: "",
  });
  const { confirm, state, handleClose } = useConfirm();

  useEffect(() => {
    async function fetchLead() {
      try {
        const data = await apiGet<{ data: Lead }>(`/sales/leads/${id}`);
        const ld = data.data;
        setLead(ld);
        setFormData({
          name: ld.name ?? "",
          email: ld.email ?? "",
          phone: ld.phone ?? "",
          source: ld.source ?? "",
          status: ld.status ?? "",
          score: ld.score ?? 0,
          notes: ld.notes ?? "",
          title: ld.title ?? "",
          company_name: ld.company_name ?? "",
          industry: ld.industry ?? "",
          website: ld.website ?? "",
          lead_value: ld.lead_value ?? 0,
          tags: Array.isArray(ld.tags) ? ld.tags.join(", ") : "",
        });
      } catch (err) {
        console.error("Failed to fetch lead:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [id]);

  // Fetch team members
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await apiGet<any>("/hr/employees", { per_page: "100" });
        const items = res.items ?? res.data ?? [];
        setTeamMembers(items.map((e: any) => ({ id: e.user_id ?? e.id, name: e.name ?? e.full_name ?? `User ${e.id}` })));
      } catch {
        try {
          const res = await apiGet<any>("/users");
          const items = res.items ?? res.data ?? [];
          setTeamMembers(items.map((u: any) => ({ id: u.id, name: u.name ?? u.email ?? `User ${u.id}` })));
        } catch {}
      }
    }
    fetchTeam();
  }, []);

  // Fetch activities when tab changes
  useEffect(() => {
    if (activeTab === "activity" && activities.length === 0) {
      fetchActivities();
    }
  }, [activeTab]);

  // Fetch tasks when tab changes
  useEffect(() => {
    if (activeTab === "tasks" && tasks.length === 0) {
      fetchTasks();
    }
  }, [activeTab]);

  async function fetchActivities() {
    setLoadingActivities(true);
    try {
      const res = await apiGet<{ data: Activity[] }>(`/sales/leads/${id}/activities`);
      setActivities(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoadingActivities(false);
    }
  }

  async function fetchTasks() {
    setLoadingTasks(true);
    try {
      const res = await apiGet<{ data: Task[] }>(`/sales/leads/${id}/tasks`);
      setTasks(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoadingTasks(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" || name === "lead_value" ? Number(value) : value,
    }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      await apiPut(`/sales/leads/${id}`, payload);
      setLead({ ...lead!, ...payload } as any);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update lead:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const ok = await confirm("Are you sure you want to delete this lead?");
    if (!ok) return;
    try {
      await apiDelete(`/sales/leads/${id}`);
      router.push("/sales/leads");
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  }

  async function handleAddActivity(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost(`/sales/leads/${id}/activities`, {
        activity_type: newActivityType,
        description: newActivityDesc,
      });
      setNewActivityDesc("");
      setShowNewActivity(false);
      fetchActivities();
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost(`/sales/leads/${id}/tasks`, {
        ...newTask,
        due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null,
      });
      setNewTask({ title: "", description: "", assigned_to: 0, due_date: "", priority: "medium" });
      setShowNewTask(false);
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  }

  async function handleCompleteTask(taskId: number) {
    try {
      await apiPost(`/sales/leads/${id}/tasks/${taskId}/complete`, {});
      fetchTasks();
      fetchActivities();
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  }

  async function handleAssign(userId: number) {
    try {
      await apiPost(`/sales/leads/${id}/assign`, { assigned_to: userId, assignment_type: "manual" });
      const res = await apiGet<{ data: Lead }>(`/sales/leads/${id}`);
      setLead(res.data);
    } catch (err) {
      console.error("Failed to assign lead:", err);
    }
  }

  async function handleConvertToDeal() {
    try {
      const res = await apiPost<{ data: any }>(`/sales/leads/${id}/convert-to-deal`, {});
      router.push(`/sales/deals/${res.data.id}`);
    } catch (err) {
      console.error("Failed to convert lead:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading lead...</span>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20 text-muted-foreground">Lead not found.</div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "info", label: "Information", icon: <User className="h-4 w-4" /> },
    { key: "activity", label: "Activity", icon: <Activity className="h-4 w-4" /> },
    { key: "tasks", label: "Tasks", icon: <ListTodo className="h-4 w-4" /> },
    { key: "notes", label: "Notes", icon: <FileText className="h-4 w-4" /> },
  ];

  const content = () => {
    if (!lead) return null;
    switch (activeTab) {
      case "info": return renderInfoTab();
      case "activity": return renderActivityTab();
      case "tasks": return renderTasksTab();
      case "notes": return renderNotesTab();
    }
  };

  // ── Info Tab ───────────────────────────────────────────────────────────────

  function renderInfoTab() {
    if (!lead) return null;
    if (editing) return renderEditForm();
    return (
      <div className="space-y-6">
        {/* Lead Header Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold">{lead.name}</h2>
                <StatusBadge status={lead.status} variant={mapStatusVariant(lead.status)} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Created: {formatDateShort(lead.created_at)}</span>
                {lead.last_activity_at && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last activity: {formatDateShort(lead.last_activity_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm truncate">{lead.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{lead.phone || "No phone"}</span>
              </div>
              {lead.website && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{lead.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Company
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Company</span>
                <span className="text-sm font-medium">{lead.company_name || "—"}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Title</span>
                <span className="text-sm font-medium capitalize">{lead.title || "—"}</span>
              </div>
              {lead.industry && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Industry</span>
                  <span className="text-sm font-medium capitalize">{lead.industry}</span>
                </div>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Source</span>
                <span className="text-sm font-medium capitalize">{lead.source || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreColor(lead.score)}`}
                      style={{ width: `${Math.min(lead.score, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{lead.score}</span>
                </div>
              </div>
              {(lead.lead_value ?? 0) > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Est. Value</span>
                  <span className="text-sm font-medium">${(lead.lead_value ?? 0).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags and Assignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tags className="h-4 w-4 text-primary" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {lead.tags && lead.tags.length > 0 ? (
                lead.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              Assignment
            </h3>
            {lead.assigned_to ? (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium">Assigned to User #{lead.assigned_to}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val) handleAssign(val);
                    }}
                    className="flex-1 px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary outline-none"
                    value=""
                  >
                    <option value="">Assign to...</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleConvertToDeal}
                    className="px-3 py-2 bg-success/10 text-success border border-success/30 rounded-lg text-sm font-medium hover:bg-success/20 transition-colors"
                  >
                    <Target className="h-4 w-4 inline mr-1" />
                    Convert to Deal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Edit Form ─────────────────────────────────────────────────────────────

  function renderEditForm() {
    if (!lead) return null;
    return (
      <form onSubmit={handleSave}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary" />
            Edit Lead
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name <span className="text-danger">*</span></label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title / Position</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., CEO, Manager"
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://"
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Est. Value ($)</label>
              <input type="number" name="lead_value" min="0" value={formData.lead_value} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Source</label>
              <select name="source" value={formData.source} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select source</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="cold_call">Cold Call</option>
                <option value="social">Social</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email_campaign">Email Campaign</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Score (0-100)</label>
              <input type="number" name="score" min="0" max="100" value={formData.score} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="hot, vip, tech"
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-primary" />
            Notes
          </h3>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pb-8">
          <button type="button" onClick={() => { setEditing(false); }}
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50">
            {saving ? <span className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </form>
    );
  }

  // ── Activity Tab ───────────────────────────────────────────────────────────

  function renderActivityTab() {
    if (!lead) return null;
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Timeline
            </h3>
            <button
              onClick={() => setShowNewActivity(!showNewActivity)}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Log Activity
            </button>
          </div>

          {showNewActivity && (
            <form onSubmit={handleAddActivity} className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex gap-3 mb-3">
                <select
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value)}
                  className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary outline-none"
                >
                  <option value="note">Note</option>
                  <option value="call">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <textarea
                value={newActivityDesc}
                onChange={(e) => setNewActivityDesc(e.target.value)}
                placeholder="Describe the activity..."
                required
                rows={2}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none resize-none mb-3"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewActivity(false)}
                  className="px-3 py-1.5 border border-border bg-muted rounded-lg text-xs font-medium hover:bg-muted/80">
                  Cancel
                </button>
                <button type="submit"
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-hover">
                  Save
                </button>
              </div>
            </form>
          )}

          {loadingActivities ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No activities logged yet</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-0">
                {activities.map((a) => (
                  <div key={a.id} className="relative pl-10 pb-6 last:pb-0">
                    {/* Timeline dot */}
                    <div className="absolute left-2.5 top-0.5 w-3 h-3 rounded-full bg-card border-2 border-border flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        {getActivityIcon(a.activity_type)}
                        <span className="text-xs font-medium capitalize text-muted-foreground">
                          {a.activity_type.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDate(a.created_at)}
                        </span>
                      </div>
                      <p className="text-sm">{a.description}</p>
                      {(a.old_value || a.new_value) && a.activity_type === "status_change" && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="px-1.5 py-0.5 rounded bg-danger/10 text-danger">{a.old_value}</span>
                          <span>→</span>
                          <span className="px-1.5 py-0.5 rounded bg-success/10 text-success">{a.new_value}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Tasks Tab ──────────────────────────────────────────────────────────────

  function renderTasksTab() {
    if (!lead) return null;
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              Tasks
            </h3>
            <button
              onClick={() => setShowNewTask(!showNewTask)}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Add Task
            </button>
          </div>

          {showNewTask && (
            <form onSubmit={handleCreateTask} className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                    placeholder="What needs to be done?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Assign To</label>
                  <select
                    value={newTask.assigned_to}
                    onChange={(e) => setNewTask({ ...newTask, assigned_to: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary outline-none"
                  >
                    <option value={0}>Select...</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none"
                    placeholder="Optional details..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewTask(false)}
                  className="px-3 py-1.5 border border-border bg-muted rounded-lg text-xs font-medium hover:bg-muted/80">
                  Cancel
                </button>
                <button type="submit"
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-hover">
                  Create Task
                </button>
              </div>
            </form>
          )}

          {loadingTasks ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tasks yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === "completed"
                      ? "border-success/20 bg-success/5 opacity-70"
                      : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => task.status !== "completed" && handleCompleteTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        task.status === "completed"
                          ? "bg-success border-success text-white"
                          : "border-muted-foreground hover:border-primary"
                      }`}
                    >
                      {task.status === "completed" && <Check className="h-3 w-3" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.status === "completed" ? (
                          <span className="text-xs text-success flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Done
                          </span>
                        ) : task.status === "in_progress" ? (
                          <span className="text-xs text-warning">In Progress</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pending</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {task.assigned_to && <span>Assigned to #{task.assigned_to}</span>}
                        {task.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {formatDateShort(task.due_date)}
                          </span>
                        )}
                        {task.description && <span className="truncate">{task.description}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Notes Tab ──────────────────────────────────────────────────────────────

  function renderNotesTab() {
    if (!lead) return null;
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Notes
        </h3>
        {lead.notes ? (
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <p className="text-sm whitespace-pre-wrap text-foreground/80 leading-relaxed">{lead.notes}</p>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No notes</p>
          </div>
        )}
      </div>
    );
  }

  // ── Main Layout ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span>/</span>
        <Link href="/sales/leads" className="hover:text-foreground transition-colors">Leads</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          {lead.name}
        </span>
      </div>

      {/* Page Header */}
      <PageHeader
        title={lead.name}
        description="View and manage lead information, activities, and tasks."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/sales/leads"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            {!editing && activeTab === "info" && (
              <button onClick={() => setEditing(true)}
                className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80">
                Edit
              </button>
            )}
            <button onClick={handleDelete}
              className="border border-danger/30 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {content()}

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
