"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  TrendingUp,
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  User,
  Send,
  Edit,
  Trash2,
  Target,
  Percent,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const deal = {
  id: "D-001",
  title: "Enterprise Platform Migration",
  company: "Acme Corp",
  value: "$125,000",
  stage: "Negotiation",
  stageVariant: "warning" as const,
  probability: 75,
  expectedClose: "Apr 15, 2024",
  owner: "Mike Johnson",
  created: "Feb 20, 2024",
  source: "Referral",
  contact: {
    name: "Robert Anderson",
    title: "VP of Engineering",
    email: "robert.anderson@acme.com",
    phone: "+1 (555) 123-4567",
  },
  description:
    "Full platform migration from legacy systems to cloud infrastructure. Includes data migration, custom integrations, and training for 200+ employees.",
};

const pipeline = [
  { stage: "Discovery", active: false, completed: true },
  { stage: "Qualification", active: false, completed: true },
  { stage: "Proposal", active: false, completed: true },
  { stage: "Negotiation", active: true, completed: false },
  { stage: "Closed Won", active: false, completed: false },
];

const activities = [
  {
    id: 1,
    type: "call",
    title: "Price negotiation call",
    description: "Discussed pricing tiers and payment terms",
    time: "3 hours ago",
    icon: Phone,
    color: "text-success",
  },
  {
    id: 2,
    type: "email",
    title: "Revised proposal sent",
    description: "Updated proposal with 10% discount for annual commitment",
    time: "1 day ago",
    icon: Mail,
    color: "text-info",
  },
  {
    id: 3,
    type: "meeting",
    title: "Technical review meeting",
    description: "Reviewed architecture with their engineering team",
    time: "3 days ago",
    icon: Calendar,
    color: "text-primary",
  },
  {
    id: 4,
    type: "note",
    title: "Budget confirmed",
    description: "Budget approved by CFO, ready to proceed with final terms",
    time: "5 days ago",
    icon: FileText,
    color: "text-warning",
  },
];

const tasks = [
  {
    id: 1,
    title: "Send final contract terms",
    due: "Tomorrow",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Schedule implementation kickoff",
    due: "Apr 16, 2024",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Follow up on security review",
    due: "Apr 10, 2024",
    priority: "high",
    completed: false,
  },
];

export default function DealDetailPage() {
  const [newNote, setNewNote] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      <Link
        href="/sales/deals"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Deals
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              <Target className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{deal.title}</h1>
                <StatusBadge
                  status={deal.stage}
                  variant={deal.stageVariant}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {deal.id} • {deal.company}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {deal.contact.name} ({deal.contact.title})
                </span>
                <a
                  href={`mailto:${deal.contact.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {deal.contact.email}
                </a>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {deal.contact.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Update Stage
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Pipeline Stage</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {pipeline.map((stage, i) => (
            <div key={stage.stage} className="flex items-center">
              <div
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  stage.active
                    ? "bg-primary text-white"
                    : stage.completed
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {stage.stage}
              </div>
              {i < pipeline.length - 1 && (
                <div className="w-8 h-px bg-border mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
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

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {deal.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Deal Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Deal Value
                </span>
                <span className="text-lg font-bold text-success">
                  {deal.value}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Probability
                </span>
                <span className="text-sm font-semibold">
                  {deal.probability}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Expected Close
                </span>
                <span className="text-sm font-medium">
                  {deal.expectedClose}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Owner</span>
                <span className="text-sm font-medium">{deal.owner}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Source</span>
                <span className="text-sm font-medium">{deal.source}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{deal.created}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Next Actions</h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-muted"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.due}
                    </p>
                  </div>
                  <StatusBadge
                    status={task.priority}
                    variant={
                      task.priority === "high"
                        ? "danger"
                        : task.priority === "medium"
                          ? "warning"
                          : "muted"
                    }
                  />
                </div>
              ))}
            </div>
            <button className="w-full mt-3 px-4 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              + Add Task
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create Quotation
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
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
