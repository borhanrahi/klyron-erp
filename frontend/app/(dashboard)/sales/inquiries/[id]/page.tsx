"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Send,
  FileText,
  ExternalLink,
  Check,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
}

const responseTemplates = [
  { id: 1, name: "Pricing Information", subject: "Enterprise Pricing Details" },
  { id: 2, name: "Demo Scheduling", subject: "Schedule a Product Demo" },
  { id: 3, name: "Follow Up", subject: "Following Up on Your Inquiry" },
];

const statusVariantMap: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  new: "info",
  contacted: "primary",
  qualified: "success",
  unqualified: "muted",
  spam: "danger",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [response, setResponse] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { confirm, state, handleClose } = useConfirm();

  const fetchInquiry = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet<{ data: Inquiry }>(`/sales/inquiries/${id}`);
      setInquiry(res.data);
      setEditStatus(res.data.status);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load inquiry");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInquiry();
  }, [fetchInquiry]);

  async function handleSaveStatus() {
    if (!inquiry) return;
    try {
      setSaving(true);
      const res = await apiPut<{ data: Inquiry }>(`/sales/inquiries/${id}`, {
        status: editStatus,
      });
      setInquiry(res.data);
      setEditing(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const ok = await confirm("Are you sure you want to delete this inquiry?");
    if (!ok) return;
    try {
      setDeleting(true);
      await apiDelete(`/sales/inquiries/${id}`);
      router.push("/sales/inquiries");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <Link
          href="/sales/inquiries"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inquiries
        </Link>
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-center">
          <p className="text-danger font-medium">{error}</p>
          <button
            onClick={fetchInquiry}
            className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!inquiry) return null;

  const variant = statusVariantMap[inquiry.status] || "info";

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      <Link
        href="/sales/inquiries"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inquiries
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{inquiry.name}</h1>
            <StatusBadge status={inquiry.status} variant={variant} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            #{inquiry.id} &bull; Submitted on {formatDate(inquiry.created_at)} at{" "}
            {formatTime(inquiry.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="border border-danger/30 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Inquiry Details</h3>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Respond</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Quick Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">Select a template...</option>
                {responseTemplates.map((template) => (
                  <option key={template.id} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Type your response..."
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Save Draft
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Response
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {getInitials(inquiry.name)}
                </div>
                <div>
                  <p className="font-medium">{inquiry.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {inquiry.email}
                </a>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {inquiry.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Inquiry Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Source</span>
                <span className="text-sm font-medium">{inquiry.source}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Status</span>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="px-2 py-1 bg-muted text-foreground border border-border rounded text-sm focus:border-primary outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="unqualified">Unqualified</option>
                      <option value="spam">Spam</option>
                    </select>
                    <button
                      onClick={handleSaveStatus}
                      disabled={saving}
                      className="p-1 rounded hover:bg-success/20 text-success transition-colors disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditStatus(inquiry.status);
                      }}
                      className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                  >
                    <StatusBadge
                      status={inquiry.status}
                      variant={variant}
                    />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {formatDate(inquiry.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/sales/leads/new"
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Create Lead
              </Link>
              <Link
                href="/sales/deals/new"
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Create Deal
              </Link>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Log Call
              </button>
            </div>
          </div>
        </div>
      </div>
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
