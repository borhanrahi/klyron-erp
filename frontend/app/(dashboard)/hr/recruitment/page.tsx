"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Briefcase,
  Search,
  Plus,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Loader2,
  CalendarCheck,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  rating: number | null;
  applied_date: string;
  created_at: string;
}

const stageVariantMap: Record<string, "info" | "primary" | "warning" | "success" | "muted"> = {
  applied: "primary",
  screening: "info",
  interview: "info",
  offer: "warning",
  hired: "success",
  rejected: "muted",
};

const stageOrder = ["applied", "screening", "interview", "offer", "hired"];
const stageColors: Record<string, string> = {
  applied: "bg-primary",
  screening: "bg-info",
  interview: "bg-info",
  offer: "bg-warning",
  hired: "bg-success",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [scheduledInterviews, setScheduledInterviews] = useState(0);
  const [pendingOffers, setPendingOffers] = useState(0);
  const [hiredCount, setHiredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [candRes, intRes, offRes] = await Promise.all([
        apiGet<any>("/hr/candidates", { page: "1", per_page: "100" }),
        apiGet<any>("/hr/interviews", { page: "1", per_page: "100" }),
        apiGet<any>("/hr/offer-letters", { page: "1", per_page: "100" }),
      ]);

      const allCandidates: Candidate[] = candRes.items ?? [];
      setCandidates(allCandidates);
      setTotalCandidates(candRes.total ?? allCandidates.length);

      const allInterviews = intRes.items ?? [];
      setScheduledInterviews(allInterviews.filter((i: any) => i.status === "scheduled").length);

      const allOffers = offRes.items ?? [];
      setPendingOffers(allOffers.filter((o: any) => o.status === "sent" || o.status === "draft").length);

      setHiredCount(allCandidates.filter((c) => c.stage === "hired").length);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredCandidates = candidates.filter((c) =>
    !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = stageOrder.reduce((acc, stage) => {
    acc[stage] = filteredCandidates.filter((c) => c.stage === stage);
    return acc;
  }, {} as Record<string, Candidate[]>);

  const stats = [
    { label: "Total Candidates", value: totalCandidates, icon: <Users className="h-5 w-5 text-primary" /> },
    { label: "Scheduled Interviews", value: scheduledInterviews, icon: <CalendarCheck className="h-5 w-5 text-blue-500" /> },
    { label: "Pending Offers", value: pendingOffers, icon: <FileText className="h-5 w-5 text-amber-500" /> },
    { label: "Hired", value: hiredCount, icon: <Briefcase className="h-5 w-5 text-emerald-500" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Recruitment Pipeline"
        description="Track candidates through the hiring process."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Recruitment" },
        ]}
        icon={<Briefcase className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/hr/recruitment/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Candidate
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stageOrder.map((stage) => (
            <div key={stage} className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stageColors[stage]}`} />
                    <h3 className="text-sm font-semibold capitalize">{stage}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {grouped[stage]?.length ?? 0}
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-3 min-h-[200px] max-h-[400px] overflow-y-auto">
                {(grouped[stage] ?? []).map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/hr/recruitment/${candidate.id}`}
                    className="block p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {getInitials(candidate.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground capitalize">{candidate.source || "Unknown"}</span>
                      {candidate.rating && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${i < candidate.rating! ? "bg-primary" : "bg-muted"}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
