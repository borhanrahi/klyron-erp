"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Users,
  Search,
  Mail,

  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
} from "lucide-react";
import Link from "next/link";

interface TeamMember {
  id: number;
  full_name: string | null;
  email: string | null;
  employee_code: string;
  department_name: string | null;
  designation: string;
  status: string;
  phone: string | null;
  joining_date: string | null;
}

const statusVariant = (s: string): "success" | "warning" | "muted" | "danger" => {
  if (s === "active") return "success";
  if (s === "on_leave") return "warning";
  if (s === "resigned" || s === "terminated") return "danger";
  return "muted";
};

export default function MyTeam() {
  const { profile } = usePermissions();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMyTeam = (p: number) => {
    if (!profile?.employee_id) return;
    setLoading(true);
    const params: Record<string, string> = {
      page: String(p),
      per_page: "10",
      reporting_to: String(profile.employee_id),
      status: "active",
    };
    if (search) params.search = search;
    apiGet<{ items: TeamMember[]; total: number; page: number; pages: number }>(
      "/hr/employee-directory",
      params
    )
      .then((res) => {
        setMembers(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      })
      .catch(() => {
        setMembers([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (profile) fetchMyTeam(1);
  }, [profile]);

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Stats
  const activeCount = members.filter((m) => m.status === "active").length;
  const onLeaveCount = members.filter((m) => m.status === "on_leave").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Team"
        description={`Team members reporting to you (${total} total)`}
      />

      {/* Stats */}
      {!loading && members.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Members</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-2xl font-bold text-success">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-2xl font-bold text-warning">{onLeaveCount}</p>
            <p className="text-xs text-muted-foreground mt-1">On Leave</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-2xl font-bold text-muted-foreground">{total > 0 ? `${(total - members.filter(m => m.status === 'active').length - members.filter(m => m.status === 'on_leave').length)}` : 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Other</p>
          </div>
        </div>
      )}

      {/* Search & Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchMyTeam(1)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Name</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Designation</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Department</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Email</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full inline-block mr-2" />
                    Loading team...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    {search ? "No members match your search." : "You don't have any direct reports yet."}
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {getInitials(member.full_name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.full_name || member.employee_code}</p>
                          <p className="text-xs text-muted-foreground">{member.employee_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-sm text-muted-foreground">{member.designation || "\u2014"}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-sm text-muted-foreground">{member.department_name || "\u2014"}</td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      {member.email ? (
                        <a href={`mailto:${member.email}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">\u2014</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={member.status} variant={statusVariant(member.status)} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/hr/employees/${member.id}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Edit className="h-4 w-4" />
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
            Showing {members.length} of {total} members
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchMyTeam(page - 1)} disabled={page <= 1} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchMyTeam(page + 1)} disabled={page >= pages} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
