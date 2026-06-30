"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Building2,
  UserCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiDelete, apiPost } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";

const PER_PAGE = 10;

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  notes: string;
  company_name?: string;
  title?: string;
  industry?: string;
  lead_value?: number;
  tags?: string[];
  assigned_to?: number;
  last_activity_at?: string;
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

function mapLead(raw: any): Lead {
  return {
    id: raw.id ?? raw.ID ?? 0,
    name: raw.name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    source: raw.source ?? "",
    status: raw.status ?? "new",
    score: raw.score ?? 0,
    notes: raw.notes ?? "",
    company_name: raw.company_name ?? "",
    title: raw.title ?? "",
    industry: raw.industry ?? "",
    lead_value: raw.lead_value ?? 0,
    tags: raw.tags ?? [],
    assigned_to: raw.assigned_to ?? null,
    last_activity_at: raw.last_activity_at ?? "",
    created_at: raw.created_at ?? "",
  };
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

export default function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [teamMembers, setTeamMembers] = useState<{ id: number; name: string }[]>([]);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLeadId, setAssignLeadId] = useState<number | null>(null);
  const [assignTarget, setAssignTarget] = useState("");
  const { confirm, state, handleClose } = useConfirm();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        per_page: String(PER_PAGE),
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== "All") params.status = selectedStatus;
      if (selectedSource !== "All") params.source = selectedSource;
      const res = await apiGet<any>("/sales/leads", params);
      const items = (res.items ?? res.data ?? []).map(mapLead);
      setLeads(items);
      setTotal(res.total ?? 0);
      setTotalPages(res.pages ?? 1);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedStatus, selectedSource]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedStatus, selectedSource]);

  // Fetch team members for assignment
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await apiGet<any>("/hr/employees", { per_page: "100" });
        const items = res.items ?? res.data ?? [];
        setTeamMembers(items.map((e: any) => ({ id: e.user_id ?? e.id, name: e.name ?? e.full_name ?? `User ${e.id}` })));
      } catch {
        // If HR endpoint not available, try users endpoint
        try {
          const res = await apiGet<any>("/users");
          const items = res.items ?? res.data ?? [];
          setTeamMembers(items.map((u: any) => ({ id: u.id, name: u.name ?? u.email ?? `User ${u.id}` })));
        } catch {}
      }
    }
    fetchTeam();
  }, []);

  async function handleDelete(id: number) {
    const ok = await confirm("Are you sure you want to delete this lead?");
    if (!ok) return;
    try {
      await apiDelete(`/sales/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  }

  async function handleQuickAssign(leadId: number, userId: number) {
    try {
      await apiPost(`/sales/leads/${leadId}/assign`, {
        assigned_to: userId,
        assignment_type: "manual",
      });
      fetchLeads();
    } catch (err) {
      console.error("Failed to assign lead:", err);
    }
  }

  function openAssignModal(leadId: number) {
    setAssignLeadId(leadId);
    setAssignTarget("");
    setShowAssignModal(true);
  }

  async function confirmAssign() {
    if (!assignLeadId || !assignTarget) return;
    const userId = parseInt(assignTarget);
    if (isNaN(userId)) return;
    await handleQuickAssign(assignLeadId, userId);
    setShowAssignModal(false);
  }

  // Stats summary
  const statusCounts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    won: leads.filter((l) => l.status === "won").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Leads
        </span>
      </div>

      <PageHeader
        title="Leads"
        description="Track and manage your sales leads through the pipeline."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/sales/leads/assignment-rules"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Rules</span>
            </Link>
            <Link
              href="/sales/leads/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </Link>
          </div>
        }
      />

      {/* Pipeline summary cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "New", count: statusCounts.new, color: "bg-info" },
          { label: "Contacted", count: statusCounts.contacted, color: "bg-warning" },
          { label: "Qualified", count: statusCounts.qualified, color: "bg-primary" },
          { label: "Won", count: statusCounts.won, color: "bg-success" },
          { label: "Lost", count: statusCounts.lost, color: "bg-danger" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <div className={`w-2 h-2 rounded-full ${s.color} mx-auto mb-1`} />
            <div className="text-lg font-bold">{s.count}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
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
                placeholder="Search by name, email, phone, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Source: All</option>
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
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading leads...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Lead
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Contact
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Company
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Score
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                      Assigned
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p>No leads found</p>
                        <Link href="/sales/leads/new" className="text-primary text-sm hover:underline mt-2 inline-block">
                          Add your first lead
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-muted/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                              {lead.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div>
                              <span className="text-sm font-medium block">{lead.name}</span>
                              {lead.title && (
                                <span className="text-xs text-muted-foreground">{lead.title}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="text-sm">
                            {lead.email && <div className="truncate max-w-[160px]">{lead.email}</div>}
                            {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm">{lead.company_name || "—"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge
                            status={lead.status}
                            variant={mapStatusVariant(lead.status)}
                          />
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getScoreColor(lead.score)}`}
                                style={{ width: `${Math.min(lead.score, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-6">{lead.score}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <div className="flex items-center gap-1">
                            {lead.assigned_to ? (
                              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                #{lead.assigned_to}
                              </span>
                            ) : (
                              <button
                                onClick={() => openAssignModal(lead.id)}
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                              >
                                <UserCircle className="h-3.5 w-3.5" />
                                Assign
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {lead.assigned_to ? null : (
                              <button
                                onClick={() => openAssignModal(lead.id)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                                title="Assign lead"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                            <Link
                              href={`/sales/leads/${lead.id}`}
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"
                              title="Delete"
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
              <p className="text-sm text-muted-foreground">
                {total > 0
                  ? `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, total)} of ${total}`
                  : "No results"}
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
                        pageNum === page
                          ? "bg-primary text-white"
                          : "hover:bg-muted text-muted-foreground"
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

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Assign Lead</h3>
            <p className="text-sm text-muted-foreground mb-4">Select a team member to assign this lead to.</p>
            <select
              value={assignTarget}
              onChange={(e) => setAssignTarget(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none mb-4"
            >
              <option value="">Select team member...</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-border bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssign}
                disabled={!assignTarget}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
              >
                Assign
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
