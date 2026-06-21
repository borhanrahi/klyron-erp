"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calendar,
  Search,
  Plus,
  Eye,
  Video,
  ExternalLink,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Link,
} from "lucide-react";

const meetings = [
  {
    id: "MTG-001",
    title: "Sprint Planning - Week 26",
    date: "Jun 24, 2024",
    time: "10:00 AM - 11:30 AM",
    type: "Zoom",
    attendees: ["Sarah Chen", "Mike Johnson", "Emily Davis", "David Park"],
    attendeeCount: 4,
    organizer: "Sarah Chen",
    status: "Scheduled",
    statusVariant: "info" as const,
    project: "E-Commerce Redesign",
    link: "https://zoom.us/j/1234567890",
  },
  {
    id: "MTG-002",
    title: "Client Demo - Acme Corp",
    date: "Jun 25, 2024",
    time: "2:00 PM - 3:00 PM",
    type: "Zoom",
    attendees: ["Sarah Chen", "Emily Davis", "External: John Smith"],
    attendeeCount: 3,
    organizer: "Sarah Chen",
    status: "Scheduled",
    statusVariant: "info" as const,
    project: "E-Commerce Redesign",
    link: "https://zoom.us/j/0987654321",
  },
  {
    id: "MTG-003",
    title: "Daily Standup",
    date: "Jun 21, 2024",
    time: "9:00 AM - 9:15 AM",
    type: "Google Meet",
    attendees: ["Entire Engineering Team"],
    attendeeCount: 12,
    organizer: "Mike Johnson",
    status: "Completed",
    statusVariant: "success" as const,
    project: "All Projects",
    link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "MTG-004",
    title: "Design Review - Checkout Flow",
    date: "Jun 26, 2024",
    time: "11:00 AM - 12:00 PM",
    type: "In-Person",
    attendees: ["Emily Davis", "Sarah Chen", "Omar Hassan"],
    attendeeCount: 3,
    organizer: "Emily Davis",
    status: "Scheduled",
    statusVariant: "info" as const,
    project: "E-Commerce Redesign",
    link: "",
  },
  {
    id: "MTG-005",
    title: "Budget Review Q2",
    date: "Jun 20, 2024",
    time: "3:00 PM - 4:00 PM",
    type: "Zoom",
    attendees: ["James Wilson", "Sarah Chen", "Rachel Martinez"],
    attendeeCount: 3,
    organizer: "James Wilson",
    status: "Completed",
    statusVariant: "success" as const,
    project: "All Projects",
    link: "https://zoom.us/j/1122334455",
  },
  {
    id: "MTG-006",
    title: "API Architecture Discussion",
    date: "Jun 27, 2024",
    time: "1:00 PM - 2:30 PM",
    type: "Zoom",
    attendees: ["Mike Johnson", "David Park", "Omar Hassan", "Alex Kim"],
    attendeeCount: 4,
    organizer: "Mike Johnson",
    status: "Scheduled",
    statusVariant: "info" as const,
    project: "E-Commerce Redesign",
    link: "https://zoom.us/j/5566778899",
  },
];

const meetingStats = [
  { label: "Today's Meetings", value: "2", change: "Next: 10:00 AM" },
  { label: "This Week", value: "8", change: "3 completed" },
  { label: "Upcoming", value: "5", change: "Next 7 days" },
  { label: "Total Hours Booked", value: "14h", change: "This week" },
];

export default function MeetingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const filteredMeetings = meetings.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Meetings"
        description="Schedule and manage meetings and calls."
        breadcrumbs={[
          { label: "Support", href: "/support" },
          { label: "Meetings" },
        ]}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/support/meetings/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Meeting
          </a>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {meetingStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {["list", "calendar"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                    viewMode === mode
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-3">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">{meeting.title}</h4>
                  <StatusBadge
                    status={meeting.status}
                    variant={meeting.statusVariant}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meeting.date} · {meeting.time}
                  </span>
                  <span className="flex items-center gap-1">
                    {meeting.type === "Zoom" || meeting.type === "Google Meet" ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <MapPin className="h-3 w-3" />
                    )}
                    {meeting.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meeting.attendeeCount} attendees
                  </span>
                  <span className="text-primary">{meeting.project}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  {meeting.attendees.slice(0, 3).map((attendee, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-semibold text-primary"
                      title={attendee}
                    >
                      {attendee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  ))}
                  {meeting.attendeeCount > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{meeting.attendeeCount - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {meeting.link && (
                  <a
                    href={meeting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                  >
                    <Video className="h-4 w-4" />
                  </a>
                )}
                <a
                  href={`/support/meetings/${meeting.id}`}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
