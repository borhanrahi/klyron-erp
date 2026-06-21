"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Briefcase,
  Search,
  Plus,
  Eye,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Filter,
} from "lucide-react";

const candidates = [
  {
    id: 1,
    name: "John Smith",
    avatar: "JS",
    role: "Senior Frontend Developer",
    stage: "Interview",
    stageVariant: "info" as const,
    experience: "5 years",
    location: "San Francisco, CA",
    appliedDate: "Jun 10, 2024",
    salary: "$120K - $150K",
  },
  {
    id: 2,
    name: "Maria Garcia",
    avatar: "MG",
    role: "Backend Developer",
    stage: "Applied",
    stageVariant: "primary" as const,
    experience: "3 years",
    location: "Remote",
    appliedDate: "Jun 12, 2024",
    salary: "$90K - $110K",
  },
  {
    id: 3,
    name: "David Lee",
    avatar: "DL",
    role: "DevOps Engineer",
    stage: "Offer",
    stageVariant: "warning" as const,
    experience: "7 years",
    location: "New York, NY",
    appliedDate: "May 28, 2024",
    salary: "$140K - $170K",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    avatar: "SW",
    role: "Product Manager",
    stage: "Hired",
    stageVariant: "success" as const,
    experience: "6 years",
    location: "Austin, TX",
    appliedDate: "May 15, 2024",
    salary: "$130K - $160K",
  },
  {
    id: 5,
    name: "Alex Chen",
    avatar: "AC",
    role: "UI/UX Designer",
    stage: "Interview",
    stageVariant: "info" as const,
    experience: "4 years",
    location: "Seattle, WA",
    appliedDate: "Jun 8, 2024",
    salary: "$100K - $130K",
  },
  {
    id: 6,
    name: "Emily Brown",
    avatar: "EB",
    role: "Data Scientist",
    stage: "Applied",
    stageVariant: "primary" as const,
    experience: "2 years",
    location: "Boston, MA",
    appliedDate: "Jun 14, 2024",
    salary: "$95K - $120K",
  },
];

const pipelineStages = [
  { name: "Applied", count: 24, color: "bg-primary", candidates: candidates.filter((c) => c.stage === "Applied") },
  { name: "Interview", count: 12, color: "bg-info", candidates: candidates.filter((c) => c.stage === "Interview") },
  { name: "Offer", count: 5, color: "bg-warning", candidates: candidates.filter((c) => c.stage === "Offer") },
  { name: "Hired", count: 8, color: "bg-success", candidates: candidates.filter((c) => c.stage === "Hired") },
];

const recruitmentStats = [
  { label: "Open Positions", value: "14", change: "3 urgent" },
  { label: "Total Candidates", value: "156", change: "+28 this week" },
  { label: "Interviews Scheduled", value: "12", change: "This week" },
  { label: "Offers Extended", value: "5", change: "3 pending" },
];

export default function RecruitmentPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <a
              href="/hr/recruitment/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Post New Job
            </a>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recruitmentStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineStages.map((stage) => (
          <div
            key={stage.name}
            className="rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <h3 className="text-sm font-semibold">{stage.name}</h3>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {stage.count}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-3 min-h-[200px]">
              {stage.candidates.map((candidate) => (
                <a
                  key={candidate.id}
                  href={`/hr/recruitment/${candidate.id}`}
                  className="block p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {candidate.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {candidate.experience}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {candidate.location}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {candidate.appliedDate}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
