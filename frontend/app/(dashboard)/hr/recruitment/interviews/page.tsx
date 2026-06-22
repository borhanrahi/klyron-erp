"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calendar,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  MapPin,
} from "lucide-react";

const interviews = [
  { id: 1, candidate: "John Smith", avatar: "JS", role: "Senior Frontend Developer", interviewer: "Sarah Chen", date: "Jun 20, 2024", time: "10:00 AM", duration: "60 min", type: "Technical", typeVariant: "primary" as const, status: "Scheduled", statusVariant: "info" as const, location: "Zoom" },
  { id: 2, candidate: "Maria Garcia", avatar: "MG", role: "Backend Developer", interviewer: "Mike Johnson", date: "Jun 21, 2024", time: "02:00 PM", duration: "45 min", type: "HR Screen", typeVariant: "muted" as const, status: "Scheduled", statusVariant: "info" as const, location: "Office" },
  { id: 3, candidate: "Alex Chen", avatar: "AC", role: "UI/UX Designer", interviewer: "Lisa Thompson", date: "Jun 19, 2024", time: "11:00 AM", duration: "60 min", type: "Portfolio Review", typeVariant: "warning" as const, status: "Completed", statusVariant: "success" as const, location: "Zoom" },
  { id: 4, candidate: "Emily Brown", avatar: "EB", role: "Data Scientist", interviewer: "James Wilson", date: "Jun 22, 2024", time: "09:00 AM", duration: "90 min", type: "Technical", typeVariant: "primary" as const, status: "Scheduled", statusVariant: "info" as const, location: "Zoom" },
  { id: 5, candidate: "Michael Davis", avatar: "MD", role: "Marketing Manager", interviewer: "Rachel Martinez", date: "Jun 18, 2024", time: "03:00 PM", duration: "45 min", type: "Final Round", typeVariant: "success" as const, status: "Completed", statusVariant: "success" as const, location: "Office" },
  { id: 6, candidate: "David Lee", avatar: "DL", role: "DevOps Engineer", interviewer: "Alex Kim", date: "Jun 20, 2024", time: "04:00 PM", duration: "60 min", type: "Technical", typeVariant: "primary" as const, status: "Cancelled", statusVariant: "danger" as const, location: "Zoom" },
];

export default function InterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filtered = interviews.filter((i) => {
    const matchesSearch = i.candidate.toLowerCase().includes(searchTerm.toLowerCase()) || i.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || i.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Interview Schedule"
        description="Manage and track candidate interviews."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Recruitment", href: "/hr/recruitment" },
          { label: "Interviews" },
        ]}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Interview
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
                placeholder="Search interviews..."
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
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Candidate</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Role</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Interviewer</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Date & Time</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Location</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((interview) => (
                <tr key={interview.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{interview.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{interview.candidate}</p>
                        <p className="text-xs text-muted-foreground">{interview.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{interview.role}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{interview.interviewer}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div>
                      <p className="text-sm">{interview.date}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {interview.time} · {interview.duration}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <StatusBadge status={interview.type} variant={interview.typeVariant} />
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1">
                      {interview.location === "Zoom" ? <Video className="h-3 w-3 text-muted-foreground" /> : <MapPin className="h-3 w-3 text-muted-foreground" />}
                      <span className="text-sm text-muted-foreground">{interview.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={interview.status} variant={interview.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {interviews.length} interviews</p>
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
