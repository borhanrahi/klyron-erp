"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calendar,
  ArrowLeft,
  Edit,
  Clock,
  Users,
  Video,
  MapPin,
  ExternalLink,
  FileText,
  MessageSquare,
  Send,
  Copy,
  CheckCircle,
} from "lucide-react";

const meetingData = {
  id: "MTG-001",
  title: "Sprint Planning - Week 26",
  description:
    "Review sprint backlog, estimate stories, and plan the work for Week 26. Focus on the checkout flow and payment integration tasks.",
  date: "Jun 24, 2024",
  time: "10:00 AM - 11:30 AM",
  duration: "1h 30m",
  type: "Zoom",
  status: "Scheduled",
  statusVariant: "info" as const,
  organizer: { name: "Sarah Chen", avatar: "SC" },
  project: "E-Commerce Platform Redesign",
  link: "https://zoom.us/j/1234567890",
  password: "klyron2024",
  attendees: [
    { name: "Sarah Chen", avatar: "SC", role: "Project Manager", status: "Accepted" },
    { name: "Mike Johnson", avatar: "MJ", role: "Lead Developer", status: "Accepted" },
    { name: "Emily Davis", avatar: "ED", role: "UI/UX Designer", status: "Accepted" },
    { name: "David Park", avatar: "DP", role: "Backend Developer", status: "Pending" },
    { name: "Omar Hassan", avatar: "OH", role: "Frontend Developer", status: "Accepted" },
  ],
  agenda: [
    "Sprint goals review (10 min)",
    "Backlog grooming and estimation (30 min)",
    "Task assignment for checkout flow (20 min)",
    "Payment integration discussion (15 min)",
    "Action items and next steps (15 min)",
  ],
  notes: "",
  attachments: [
    { name: "Sprint-Backlog-Week26.pdf", size: "1.2 MB" },
    { name: "Velocity-Chart.png", size: "456 KB" },
  ],
};

export default function MeetingDetailPage() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(meetingData.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={meetingData.title}
        description={meetingData.id}
        breadcrumbs={[
          { label: "Support", href: "/support" },
          { label: "Meetings", href: "/support/meetings" },
          { label: meetingData.id },
        ]}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/support/meetings"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Meeting
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meeting Info Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{meetingData.title}</h3>
                <StatusBadge
                  status={meetingData.status}
                  variant={meetingData.statusVariant}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{meetingData.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium">{meetingData.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <Video className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">{meetingData.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <FileText className="h-5 w-5 text-info" />
                <div>
                  <p className="text-xs text-muted-foreground">Project</p>
                  <p className="text-sm font-medium">{meetingData.project}</p>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <div className="flex items-center gap-3">
              <a
                href={meetingData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-success text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Join Meeting
                <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={copyLink}
                className="border border-border bg-muted text-foreground px-4 py-3 rounded-xl font-medium text-sm transition-all hover:bg-muted/80 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
            {meetingData.password && (
              <p className="text-xs text-muted-foreground mt-2 ml-1">
                Password: <span className="font-mono">{meetingData.password}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {meetingData.description}
            </p>
          </div>

          {/* Agenda */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Agenda</h3>
            <div className="space-y-3">
              {meetingData.agenda.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-muted rounded-xl"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Meeting Notes</h3>
            <textarea
              rows={5}
              placeholder="Take notes during the meeting..."
              defaultValue={meetingData.notes}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
            <div className="flex justify-end mt-3">
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-hover transition-colors">
                <Save className="h-4 w-4" />
                Save Notes
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Attachments</h3>
            <div className="space-y-2">
              {meetingData.attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <button className="text-sm text-primary hover:underline">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Attendees */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Attendees ({meetingData.attendees.length})
            </h4>
            <div className="space-y-3">
              {meetingData.attendees.map((attendee) => (
                <div key={attendee.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {attendee.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attendee.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {attendee.role}
                    </p>
                  </div>
                  <StatusBadge
                    status={attendee.status}
                    variant={
                      attendee.status === "Accepted"
                        ? "success"
                        : attendee.status === "Declined"
                        ? "danger"
                        : "muted"
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-3">Organizer</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {meetingData.organizer.avatar}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {meetingData.organizer.name}
                </p>
                <p className="text-xs text-muted-foreground">Organizer</p>
              </div>
            </div>
          </div>

          {/* Meeting Details */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-semibold">Meeting Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-xs text-muted-foreground">Duration</span>
                <span className="text-xs font-medium">
                  {meetingData.duration}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs font-medium">
                  {meetingData.type}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">
                  Recurring
                </span>
                <span className="text-xs font-medium">Weekly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Save(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}
