"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MessageSquare,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle,
  Calendar,
  Globe,
  FileText,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost, apiPut } from "@/lib/api";

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

interface FollowUp {
  id: number;
  inquiry_id: number;
  title: string;
  due_date: string | null;
  status: string;
  created_at: string;
}

interface EmailLog {
  id: number;
  inquiry_id: number;
  to_email: string;
  subject: string;
  body: string | null;
  status: string;
  created_at: string;
}

const statusVariantMap: Record<string, "info" | "warning" | "success" | "muted" | "danger"> = {
  new: "info",
  in_progress: "warning",
  replied: "success",
  closed: "muted",
  open: "danger",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function capitalize(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [followUpTitle, setFollowUpTitle] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchInquiry = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet<any>(`/sales/inquiries/${id}`);
      setInquiry(res.data);
    } catch {
      setInquiry(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchFollowUps = useCallback(async () => {
    try {
      const res = await apiGet<any>(`/sales/inquiries/${id}/follow-ups`);
      setFollowUps(res.data ?? []);
    } catch { /* empty */ }
  }, [id]);

  const fetchEmails = useCallback(async () => {
    try {
      const res = await apiGet<any>(`/sales/inquiries/${id}/emails`);
      setEmailLogs(res.data ?? []);
    } catch { /* empty */ }
  }, [id]);

  useEffect(() => { fetchInquiry(); }, [fetchInquiry]);
  useEffect(() => { if (activeTab === "followup") fetchFollowUps(); }, [activeTab, fetchFollowUps]);
  useEffect(() => { if (activeTab === "activity") fetchEmails(); }, [activeTab, fetchEmails]);

  async function handleAddFollowUp() {
    if (!followUpTitle.trim()) return;
    setSavingFollowUp(true);
    try {
      await apiPost(`/sales/inquiries/${id}/follow-ups`, {
        title: followUpTitle,
        due_date: followUpDate || null,
      });
      setFollowUpTitle("");
      setFollowUpDate("");
      setShowFollowUpForm(false);
      fetchFollowUps();
    } catch { /* empty */ }
    setSavingFollowUp(false);
  }

  async function handleSendReply() {
    if (!replyText.trim() || !inquiry?.email) return;
    setSending(true);
    try {
      await apiPost(`/sales/inquiries/${id}/send-email`, {
        to_email: inquiry.email,
        subject: `Re: Inquiry #${inquiry.id}`,
        body: replyText,
      });
      setReplyText("");
      fetchEmails();
    } catch { /* empty */ }
    setSending(false);
  }

  async function handleMarkComplete(followUpId: number) {
    try {
      await apiPut(`/sales/inquiries/${id}/follow-ups/${followUpId}`, { status: "completed" });
      fetchFollowUps();
    } catch { /* empty */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <Link href="/crm/inquiries" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Inquiries
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">Inquiry not found</p>
        </div>
      </div>
    );
  }

  const variant = statusVariantMap[inquiry.status] || "info";

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      <Link href="/crm/inquiries" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Inquiries
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{inquiry.name}</h1>
            <StatusBadge status={capitalize(inquiry.status)} variant={variant} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            #{inquiry.id} &bull; Submitted on {formatDate(inquiry.created_at)} at {formatTime(inquiry.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${inquiry.email}`}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href={`tel:${inquiry.phone}`}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "details", label: "Message", icon: FileText },
          { id: "followup", label: "Follow-ups", icon: CheckCircle },
          { id: "activity", label: "Email History", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {/* Message Tab */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Customer Message</h3>
            <div className="bg-muted/50 rounded-xl p-5">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Quick Reply</h4>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Name", value: inquiry.name },
                  { label: "Email", value: inquiry.email },
                  { label: "Phone", value: inquiry.phone },
                  { label: "Source", value: inquiry.source },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/sales/leads/new" className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Create Lead
                </Link>
                <Link href="/sales/deals/new" className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Create Deal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-ups Tab */}
      {activeTab === "followup" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowFollowUpForm(!showFollowUpForm)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {showFollowUpForm ? "Cancel" : "Add Follow-up"}
            </button>
          </div>

          {showFollowUpForm && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={followUpTitle}
                  onChange={(e) => setFollowUpTitle(e.target.value)}
                  placeholder="e.g. Follow up on pricing inquiry"
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date (optional)</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddFollowUp}
                  disabled={savingFollowUp || !followUpTitle.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {savingFollowUp ? "Saving..." : "Save Follow-up"}
                </button>
              </div>
            </div>
          )}

          {followUps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No follow-ups yet</p>
          ) : (
            followUps.map((fu) => (
              <div key={fu.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className={`h-5 w-5 ${fu.status === "completed" ? "text-success" : "text-primary"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${fu.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{fu.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {fu.due_date ? `Due ${formatDate(fu.due_date)}` : "No due date"} &bull; {formatDate(fu.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={fu.status}
                    variant={fu.status === "completed" ? "success" : "warning"}
                  />
                  {fu.status !== "completed" && (
                    <button
                      onClick={() => handleMarkComplete(fu.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Email History Tab */}
      {activeTab === "activity" && (
        <div className="space-y-4">
          {emailLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No emails sent yet</p>
          ) : (
            emailLogs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{log.subject}</span>
                  </div>
                  <StatusBadge
                    status={log.status}
                    variant={log.status === "sent" ? "success" : log.status === "queued" ? "warning" : "danger"}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  To: {log.to_email} &bull; {formatDate(log.created_at)} at {formatTime(log.created_at)}
                </p>
                {log.body && (
                  <div className="bg-muted/50 rounded-xl p-3 text-sm whitespace-pre-wrap">{log.body}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
