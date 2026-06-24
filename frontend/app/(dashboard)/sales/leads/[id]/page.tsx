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
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPut, apiDelete } from "@/lib/api";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  notes: string;
  created_at: string;
}

function mapStatusVariant(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "qualified" || s === "won") return "success" as const;
  if (s === "contacted" || s === "proposal") return "warning" as const;
  if (s === "lost") return "danger" as const;
  if (s === "new") return "info" as const;
  return "primary" as const;
}

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "",
    score: 0,
    notes: "",
  });

  useEffect(() => {
    async function fetchLead() {
      try {
        const data = await apiGet<{ data: Lead }>(`/sales/leads/${id}`);
        const leadData = data.data;
        setLead(leadData);
        setFormData({
          name: leadData.name ?? "",
          email: leadData.email ?? "",
          phone: leadData.phone ?? "",
          source: leadData.source ?? "",
          status: leadData.status ?? "",
          score: leadData.score ?? 0,
          notes: leadData.notes ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch lead:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" ? Number(value) : value,
    }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPut(`/sales/leads/${id}`, formData);
      setLead({ ...lead!, ...formData });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update lead:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await apiDelete(`/sales/leads/${id}`);
      router.push("/sales/leads");
    } catch (err) {
      console.error("Failed to delete lead:", err);
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

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span>/</span>
        <Link href="/sales/leads" className="hover:text-foreground transition-colors">
          Leads
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Lead Details
        </span>
      </div>

      <PageHeader
        title="Lead Details"
        description="View and manage lead information."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/sales/leads"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leads
            </Link>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="border border-danger/30 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />

      {editing ? (
        <form onSubmit={handleSave}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              Edit Lead
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Select source</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Score</label>
                <input
                  type="number"
                  name="score"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              Notes
            </h3>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pb-8">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: lead.name,
                  email: lead.email,
                  phone: lead.phone,
                  source: lead.source,
                  status: lead.status,
                  score: lead.score,
                  notes: lead.notes,
                });
              }}
              className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <span className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{lead.name}</h2>
                  <StatusBadge
                    status={lead.status}
                    variant={mapStatusVariant(lead.status)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Created: {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.phone || "No phone"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Lead Details</h3>
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
                        className={`h-full rounded-full ${
                          lead.score >= 70 ? "bg-success" : lead.score >= 40 ? "bg-warning" : "bg-danger"
                        }`}
                        style={{ width: `${Math.min(lead.score, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{lead.score}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {lead.notes && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
