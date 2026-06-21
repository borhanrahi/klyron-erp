"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  MessageSquare,
  FileText,
  ExternalLink,
  Send,
} from "lucide-react";
import Link from "next/link";

const lead = {
  name: "Sarah Johnson",
  title: "CTO",
  company: "TechStart Inc",
  email: "sarah.johnson@techstart.io",
  phone: "+1 (555) 234-5678",
  address: "789 Innovation Dr, Austin, TX 78701",
  source: "Webinar 2023 Campaign",
  status: "Qualified",
  statusVariant: "success" as const,
  score: 85,
  value: "$45,000",
  createdDate: "Mar 15, 2024",
  lastActivity: "2 hours ago",
  owner: "Mike Johnson",
};

const activities = [
  {
    id: 1,
    type: "call",
    title: "Discovery call completed",
    description: "Discussed requirements and budget",
    time: "2 hours ago",
    icon: Phone,
    color: "text-success",
  },
  {
    id: 2,
    type: "email",
    title: "Follow-up email sent",
    description: "Sent product demo scheduling link",
    time: "1 day ago",
    icon: Mail,
    color: "text-info",
  },
  {
    id: 3,
    type: "meeting",
    title: "Product demo scheduled",
    description: "Demo booked for Mar 28, 2024 at 2:00 PM",
    time: "2 days ago",
    icon: Calendar,
    color: "text-primary",
  },
  {
    id: 4,
    type: "note",
    title: "Internal note added",
    description: "Budget approved, decision by end of Q1",
    time: "3 days ago",
    icon: FileText,
    color: "text-warning",
  },
];

const dealPipeline = [
  { stage: "Prospecting", active: false },
  { stage: "Qualification", active: true },
  { stage: "Proposal", active: false },
  { stage: "Negotiation", active: false },
  { stage: "Closed Won", active: false },
];

export default function LeadDetailsPage() {
  const [newNote, setNewNote] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/sales"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to CRM
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Lead Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              SJ
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{lead.name}</h1>
                <StatusBadge
                  status={lead.status}
                  variant={lead.statusVariant}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {lead.title} at {lead.company}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {lead.email}
                </a>
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {lead.phone}
                </a>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lead.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Call
          </button>
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Convert to Deal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deal Pipeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Deal Pipeline</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {dealPipeline.map((stage, i) => (
                <div key={stage.stage} className="flex items-center">
                  <div
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      stage.active
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stage.stage}
                  </div>
                  {i < dealPipeline.length - 1 && (
                    <div className="w-8 h-px bg-border mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>

            {/* Quick Log */}
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log an activity or note..."
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
                      <Send className="h-3 w-3" />
                      Log Activity
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="relative pl-12">
                      <div className="absolute left-3.5 top-1 w-3 h-3 rounded-full bg-card border-2 border-border" />
                      <div className="p-4 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold">
                            {activity.title}
                          </h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Score */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Lead Intelligence</h3>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-primary">
                  {lead.score}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Lead Score</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Deal Value
                </span>
                <span className="text-sm font-semibold">{lead.value}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Source</span>
                <span className="text-sm font-medium">{lead.source}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Owner</span>
                <span className="text-sm font-medium">{lead.owner}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{lead.createdDate}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Last Activity
                </span>
                <span className="text-sm font-medium">{lead.lastActivity}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Enterprise", "SaaS", "Q1 Target", "Warm Lead"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create Proposal
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
