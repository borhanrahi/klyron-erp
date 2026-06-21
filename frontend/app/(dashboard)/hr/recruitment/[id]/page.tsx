"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

const candidateData = {
  id: 1,
  name: "John Smith",
  avatar: "JS",
  email: "john.smith@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  role: "Senior Frontend Developer",
  stage: "Interview",
  stageVariant: "info" as const,
  experience: "5 years",
  currentCompany: "TechCorp Inc.",
  currentRole: "Frontend Developer",
  expectedSalary: "$130,000",
  appliedDate: "Jun 10, 2024",
  resume: "john_smith_resume.pdf",
  linkedin: "linkedin.com/in/johnsmith",
};

const timeline = [
  {
    date: "Jun 10, 2024 09:15 AM",
    action: "Application submitted",
    description: "Applied for Senior Frontend Developer position",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    date: "Jun 11, 2024 10:00 AM",
    action: "Resume reviewed",
    description: "Resume reviewed by HR team - shortlisted",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    date: "Jun 12, 2024 02:30 PM",
    action: "Phone screen scheduled",
    description: "Initial phone screen with HR - 30 minutes",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    date: "Jun 14, 2024 11:00 AM",
    action: "Phone screen completed",
    description: "Passed phone screen - moving to technical interview",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    date: "Jun 18, 2024 03:00 PM",
    action: "Technical interview scheduled",
    description: "Technical interview with engineering team",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const interviewNotes = [
  {
    interviewer: "Sarah Chen",
    date: "Jun 14, 2024",
    rating: 4,
    notes: "Strong communication skills. Good understanding of React ecosystem. Experience with large-scale applications.",
  },
];

export default function CandidateDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={candidateData.name}
        description={`Applying for ${candidateData.role}`}
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Recruitment", href: "/hr/recruitment" },
          { label: candidateData.name },
        ]}
        icon={<User className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/hr/recruitment"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Resume
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95">
              Move to Next Stage
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidate Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3">
                {candidateData.avatar}
              </div>
              <h3 className="text-lg font-semibold">{candidateData.name}</h3>
              <p className="text-sm text-muted-foreground">
                {candidateData.currentRole}
              </p>
              <div className="mt-2">
                <StatusBadge
                  status={candidateData.stage}
                  variant={candidateData.stageVariant}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.experience} experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Applied {candidateData.appliedDate}</span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "Current Company", value: candidateData.currentCompany },
                { label: "Current Role", value: candidateData.currentRole },
                { label: "Expected Salary", value: candidateData.expectedSalary },
                { label: "Position", value: candidateData.role },
              ].map((item) => (
                <div key={item.label} className="py-2 border-b border-border/50 last:border-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Documents
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidateData.resume}</span>
                </div>
                <button className="text-primary text-sm hover:underline flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">LinkedIn Profile</span>
                </div>
                <button className="text-primary text-sm hover:underline flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Application Timeline</h3>
            <div className="space-y-4">
              {timeline.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full ${event.bgColor} flex items-center justify-center`}
                    >
                      <div className={`w-2 h-2 rounded-full ${event.color.replace("text-", "bg-")}`} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{event.action}</p>
                      <span className="text-xs text-muted-foreground">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Notes */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Interview Notes</h3>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                Add Note
              </button>
            </div>
            {interviewNotes.map((note, i) => (
              <div key={i} className="p-4 bg-muted rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {note.interviewer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {note.interviewer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {note.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 rounded ${
                          star <= note.rating
                            ? "bg-warning"
                            : "bg-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {note.notes}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                Schedule Interview
              </button>
              <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                Send Email
              </button>
              <button className="border border-warning bg-warning/10 text-warning px-4 py-2 rounded-lg text-sm font-medium hover:bg-warning/20 transition-colors">
                Hold
              </button>
              <button className="border border-danger bg-danger/10 text-danger px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger/20 transition-colors">
                Reject
              </button>
              <button className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors">
                Extend Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
