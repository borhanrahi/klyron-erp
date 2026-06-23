"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Calendar,
  Save,
  ArrowLeft,
  Clock,
  Users,
  Video,
  MapPin,
  FolderKanban,
  FileText,
  Repeat,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

const teamMembers = [
  "Sarah Chen",
  "Mike Johnson",
  "Emily Davis",
  "David Park",
  "Alex Kim",
  "Omar Hassan",
  "Priya Patel",
  "Rachel Martinez",
  "James Wilson",
];

const projects = [
  "E-Commerce Platform Redesign",
  "Mobile App v2.0",
  "Data Analytics Dashboard",
  "Customer Portal Upgrade",
];

const meetingTypes = [
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
  "In-Person",
  "Phone Call",
];

export default function NewMeetingPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Schedule Meeting"
        description="Create a new meeting or scheduled call."
        breadcrumbs={[
          { label: "Support", href: "/support" },
          { label: "Meetings", href: "/support/meetings" },
          { label: "New Meeting" },
        ]}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/support/meetings"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Meetings
          </a>
        }
      />

      {/* Meeting Information */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Meeting Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Meeting Title *
            </label>
            <input
              type="text"
              placeholder="Enter meeting title"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Description / Agenda
            </label>
            <textarea
              rows={3}
              placeholder="Meeting agenda and talking points..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Meeting Type *
            </label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                {meetingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Project
            </label>
            <div className="relative">
              <FolderKanban className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select project (optional)</option>
                {projects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <DatePicker
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Time *
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="time"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="relative flex-1">
                <input
                  type="time"
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Recurring
            </label>
            <div className="relative">
              <Repeat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="none">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              placeholder="https://zoom.us/j/..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Attendees */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Attendees</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {teamMembers.map((member) => (
            <label
              key={member}
              className="flex items-center gap-2 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
            >
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm">{member}</span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            External Attendees (email)
          </label>
          <input
            type="text"
            placeholder="Enter email addresses, separated by commas"
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/support/meetings"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </a>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Schedule Meeting
        </button>
      </div>
    </div>
  );
}
