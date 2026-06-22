"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
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

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  attendees: string[];
  attendeeCount: number;
  organizer: string;
  status: string;
  statusVariant: "info" | "success" | "warning" | "danger" | "primary" | "muted";
  project: string;
  link: string;
}

const statusVariantMap: Record<string, Meeting["statusVariant"]> = {
  Scheduled: "info",
  Completed: "success",
  Cancelled: "danger",
};

export default function MeetingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ items: Meeting[] }>("/support/meetings")
      .then((res) =>
        setMeetings(
          res.items.map((m) => ({
            ...m,
            statusVariant: statusVariantMap[m.status] || "info",
            attendees: Array.isArray(m.attendees) ? m.attendees : [],
            attendeeCount: m.attendeeCount || (Array.isArray(m.attendees) ? m.attendees.length : 0),
          }))
        )
      )
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  const meetingStats = [
    { label: "Today's Meetings", value: String(meetings.filter((m) => m.status === "Scheduled").length), change: "Next: 10:00 AM" },
    { label: "This Week", value: String(meetings.length), change: `${meetings.filter((m) => m.status === "Completed").length} completed` },
    { label: "Upcoming", value: String(meetings.filter((m) => m.status === "Scheduled").length), change: "Next 7 days" },
    { label: "Total Hours Booked", value: "14h", change: "This week" },
  ];

  const filteredMeetings = meetings.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
