"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  HelpCircle,
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm } from "@/components/common/ConfirmModal";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "primary" | "muted";
  created_at: string;
}

function mapStatusVariant(status: string): Inquiry["statusVariant"] {
  const s = (status || "").toLowerCase();
  if (s === "qualified" || s === "won" || s === "resolved") return "success";
  if (s === "contacted" || s === "in_progress") return "warning";
  if (s === "closed" || s === "rejected" || s === "lost") return "muted";
  if (s === "new" || s === "open") return "info";
  return "primary";
}

function mapInquiry(raw: any): Inquiry {
  const status = raw.status ?? "new";
  return {
    id: String(raw.id ?? ""),
    name: raw.name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    message: raw.message ?? "",
    source: raw.source ?? "",
    status: status,
    statusVariant: mapStatusVariant(status),
    created_at: raw.created_at ?? "",
  };
}

const PER_PAGE = 10;

export default function InquiriesListPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, newCount: 0, contactedCount: 0, resolvedCount: 0 });
  const confirm = useConfirm();

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
      const items = (res.items ?? res.data ?? []).map(mapInquiry);
      setInquiries(items);
      setTotal(res.total ?? items.length);
      setTotalPages(res.pages ?? 1);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedStatus]);

  const fetchStats = useCallback(async () => {
    try {
      const [totalRes, newRes, contactedRes, resolvedRes] = await Promise.all([
        apiGet<any>("/sales/inquiries", { page: "1", per_page: "1" }),
        apiGet<any>("/sales/inquiries", { page: "1", per_page: "1", status: "new" }),
        apiGet<any>("/sales/inquiries", { page: "1", per_page: "1", status: "contacted" }),
        apiGet<any>("/sales/inquiries", { page: "1", per_page: "1", status: "resolved" }),
      ]);
      setStats({
        total: totalRes.total ?? 0,
        newCount: newRes.total ?? 0,
        contactedCount: contactedRes.total ?? 0,
        resolvedCount: resolvedRes.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedStatus]);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Inquiry",
      message: "Are you sure you want to delete this inquiry?",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await apiDelete(`/sales/inquiries/${id}`);
      fetchInquiries();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const statCards = [
    { label: "Total Inquiries", value: stats.total, icon: <HelpCircle className="h-5 w-5 text-primary" /> },
    { label: "New", value: stats.newCount, icon: <MessageSquare className="h-5 w-5 text-blue-500" /> },
    { label: "Contacted", value: stats.contactedCount, icon: <Phone className="h-5 w-5 text-amber-500" /> },
    { label: "Resolved", value: stats.resolvedCount, icon: <Mail className="h-5 w-5 text-emerald-500" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Inquiries</span>
      </div>

      <PageHeader
        title="Inquiries"
        description="Manage customer inquiries and support requests."
        icon={<HelpCircle className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="All">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

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
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Contact</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Phone</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Message</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Source</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Date</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                            {(inquiry.name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
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
                      <td className="py-3 px-4">
                        <span className="text-sm line-clamp-1 max-w-[200px]">{inquiry.message}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground capitalize">{inquiry.source}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={inquiry.status} variant={inquiry.statusVariant} />
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : ""}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/sales/inquiries/${inquiry.id}`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
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
    </div>
  );
}
