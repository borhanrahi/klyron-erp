"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MessageSquare,
  Search,
  Download,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Send,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";

interface InquiryItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  source: string;
  status: string;
  priority: string;
  message: string;
  created_at: string;
  statusVariant: "info" | "warning" | "success" | "muted" | "danger";
  priorityVariant: "danger" | "warning" | "info" | "muted";
}

const statusVariantMap: Record<string, InquiryItem["statusVariant"]> = {
  new: "info",
  contacted: "warning",
  qualified: "success",
  resolved: "success",
  closed: "muted",
};

const priorityVariantMap: Record<string, InquiryItem["priorityVariant"]> = {
  high: "danger",
  medium: "warning",
  low: "muted",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function capitalize(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const PER_PAGE = 10;

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [mailModal, setMailModal] = useState<{ open: boolean; inquiry: InquiryItem | null }>({ open: false, inquiry: null });
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        per_page: String(PER_PAGE),
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== "All") params.status = selectedStatus;
      const res = await apiGet<any>("/sales/inquiries", params);
      const items = (res.items ?? []).map((item: any) => ({
        ...item,
        statusVariant: statusVariantMap[item.status] || "info",
        priorityVariant: priorityVariantMap[item.priority] || "info",
      }));
      setInquiries(items);
      setTotal(res.total ?? items.length);
      setTotalPages(res.pages ?? 1);
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedStatus]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);
  useEffect(() => { setPage(1); }, [searchTerm, selectedStatus]);

  function openMail(inq: InquiryItem) {
    setMailTo(inq.email || "");
    setMailSubject(`Re: Inquiry #${inq.id}`);
    setMailBody("");
    setSendResult(null);
    setMailModal({ open: true, inquiry: inq });
  }

  async function handleSendEmail() {
    if (!mailModal.inquiry || !mailTo || !mailSubject || !mailBody) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await apiPost<any>(`/sales/inquiries/${mailModal.inquiry.id}/send-email`, {
        to_email: mailTo,
        subject: mailSubject,
        body: mailBody,
      });
      setSendResult(res.message || "Email sent successfully");
      setTimeout(() => setMailModal({ open: false, inquiry: null }), 1500);
    } catch (err: any) {
      setSendResult(err?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  }

  async function handleExport() {
    try {
      const XLSX = await import("xlsx");
      let allItems: any[] = [];
      let pg = 1;
      while (true) {
        const res = await apiGet<any>("/sales/inquiries", { page: String(pg), per_page: "100" });
        allItems = allItems.concat(res.items ?? []);
        if (pg >= (res.pages ?? 1)) break;
        pg++;
      }
      const data = allItems.map((i: any) => ({
        ID: i.id,
        Name: i.name,
        Email: i.email,
        Phone: i.phone,
        Source: i.source,
        Status: i.status,
        Message: i.message,
        Date: i.created_at ? new Date(i.created_at).toLocaleDateString() : "",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inquiries");
      XLSX.writeFile(wb, "inquiries.xlsx");
    } catch (err) {
      console.error("Export failed:", err);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Customer Inquiries"
        description="Manage incoming customer inquiries from web forms and contact submissions."
        icon={<MessageSquare className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Inquiries" },
        ]}
        actions={
          <button
            onClick={handleExport}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </button>
        }
      />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option value="All">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading inquiries...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground text-sm">No inquiries found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Customer</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Phone</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Source</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Date</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                            {getInitials(inquiry.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{inquiry.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{inquiry.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{inquiry.phone}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground capitalize">{inquiry.source}</span>
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <span className="text-sm text-muted-foreground">{formatDate(inquiry.created_at)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={capitalize(inquiry.status)} variant={inquiry.statusVariant} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/crm/inquiries/${inquiry.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => openMail(inquiry)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                            title="Send email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {total > 0 ? `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, total)} of ${total}` : "No results"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === page ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Email Modal */}
      {mailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Send Email</h3>
              <button onClick={() => setMailModal({ open: false, inquiry: null })} className="p-1 hover:bg-muted rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input
                  type="email"
                  value={mailTo}
                  onChange={(e) => setMailTo(e.target.value)}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Body</label>
                <textarea
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Type your email..."
                />
              </div>
            </div>
            {sendResult && (
              <p className="text-sm text-primary">{sendResult}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMailModal({ open: false, inquiry: null })}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sending || !mailTo || !mailSubject || !mailBody}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
