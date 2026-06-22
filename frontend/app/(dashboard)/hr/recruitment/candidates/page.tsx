"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  Search,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MapPin,
  Clock,
} from "lucide-react";

const candidates = [
  { id: 1, name: "John Smith", avatar: "JS", email: "john.smith@email.com", phone: "+1 (555) 111-2222", role: "Senior Frontend Developer", department: "Engineering", stage: "Interview", stageVariant: "info" as const, experience: "5 years", location: "San Francisco, CA", appliedDate: "Jun 10, 2024", source: "LinkedIn" },
  { id: 2, name: "Maria Garcia", avatar: "MG", email: "maria.g@email.com", phone: "+1 (555) 222-3333", role: "Backend Developer", department: "Engineering", stage: "Applied", stageVariant: "primary" as const, experience: "3 years", location: "Remote", appliedDate: "Jun 12, 2024", source: "Referral" },
  { id: 3, name: "David Lee", avatar: "DL", email: "david.lee@email.com", phone: "+1 (555) 333-4444", role: "DevOps Engineer", department: "DevOps", stage: "Offer", stageVariant: "warning" as const, experience: "7 years", location: "New York, NY", appliedDate: "May 28, 2024", source: "Indeed" },
  { id: 4, name: "Sarah Wilson", avatar: "SW", email: "sarah.w@email.com", phone: "+1 (555) 444-5555", role: "Product Manager", department: "Product", stage: "Hired", stageVariant: "success" as const, experience: "6 years", location: "Austin, TX", appliedDate: "May 15, 2024", source: "LinkedIn" },
  { id: 5, name: "Alex Chen", avatar: "AC", email: "alex.c@email.com", phone: "+1 (555) 555-6666", role: "UI/UX Designer", department: "Design", stage: "Interview", stageVariant: "info" as const, experience: "4 years", location: "Seattle, WA", appliedDate: "Jun 8, 2024", source: "Website" },
  { id: 6, name: "Emily Brown", avatar: "EB", email: "emily.b@email.com", phone: "+1 (555) 666-7777", role: "Data Scientist", department: "Engineering", stage: "Applied", stageVariant: "primary" as const, experience: "2 years", location: "Boston, MA", appliedDate: "Jun 14, 2024", source: "Referral" },
  { id: 7, name: "Michael Davis", avatar: "MD", email: "michael.d@email.com", phone: "+1 (555) 777-8888", role: "Marketing Manager", department: "Marketing", stage: "Screening", stageVariant: "muted" as const, experience: "8 years", location: "Chicago, IL", appliedDate: "Jun 15, 2024", source: "LinkedIn" },
  { id: 8, name: "Jessica Taylor", avatar: "JT", email: "jessica.t@email.com", phone: "+1 (555) 888-9999", role: "Sales Executive", department: "Sales", stage: "Rejected", stageVariant: "danger" as const, experience: "3 years", location: "Miami, FL", appliedDate: "Jun 5, 2024", source: "Indeed" },
];

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");

  const filtered = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === "All" || c.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Candidates"
        description="View and manage all job applicants."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Recruitment", href: "/hr/recruitment" },
          { label: "Candidates" },
        ]}
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Candidate
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="All">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">Candidate <ArrowUpDown className="h-3 w-3" /></button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Role</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Experience</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Location</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Source</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Stage</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{candidate.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div>
                      <p className="text-sm font-medium">{candidate.role}</p>
                      <p className="text-xs text-muted-foreground">{candidate.department}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{candidate.experience}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{candidate.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <span className="text-sm text-muted-foreground">{candidate.source}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={candidate.stage} variant={candidate.stageVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {candidates.length} candidates</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
