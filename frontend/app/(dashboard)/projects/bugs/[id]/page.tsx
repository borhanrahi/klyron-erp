"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Bug,
  ArrowLeft,
  Edit,
  Calendar,
  User,
  AlertTriangle,
  FolderKanban,
  MessageSquare,
  Paperclip,
  Clock,
  Send,
} from "lucide-react";

const bugData = {
  id: "BUG-001",
  title: "Payment checkout crashes on invalid card",
  description:
    "When a user enters an invalid credit card number and clicks 'Pay Now', the entire checkout page crashes with a white screen. The error seems to originate from the payment gateway integration module.",
  project: "E-Commerce Platform Redesign",
  projectId: "PRJ-001",
  severity: "Critical",
  severityVariant: "danger" as const,
  status: "Open",
  statusVariant: "danger" as const,
  reporter: "Priya Patel",
  reporterAvatar: "PP",
  assignee: { name: "Mike Johnson", avatar: "MJ" },
  environment: "Production",
  created: "Jun 20, 2024 10:30 AM",
  updated: "Jun 21, 2024 02:15 PM",
  stepsToReproduce: [
    "1. Navigate to the checkout page with items in cart",
    "2. Enter invalid card number: 4242 4242 4242 4243",
    "3. Enter any future expiry date and CVC",
    "4. Click the 'Pay Now' button",
    "5. Page crashes with white screen",
  ],
  expectedBehavior: "Show an error message 'Invalid card details. Please try again.'",
  actualBehavior: "White screen crash. Console shows 'Unhandled Promise Rejection' in paymentService.ts",
  attachments: [
    { name: "checkout-crash-screenshot.png", size: "245 KB", type: "image" },
    { name: "console-error-log.txt", size: "12 KB", type: "text" },
  ],
  comments: [
    {
      id: 1,
      author: "Priya Patel",
      avatar: "PP",
      text: "This is blocking all checkout testing. Users are encountering this in production as well.",
      time: "Jun 20, 2024 10:45 AM",
    },
    {
      id: 2,
      author: "Mike Johnson",
      avatar: "MJ",
      text: "Investigating now. Looks like the payment gateway response isn't being handled when validation fails. The error handling middleware isn't catching the rejection.",
      time: "Jun 20, 2024 02:30 PM",
    },
    {
      id: 3,
      author: "Sarah Chen",
      avatar: "SC",
      text: "This is a P0. Let's prioritize this fix. @Mike can you have a fix ready by EOD?",
      time: "Jun 20, 2024 03:00 PM",
    },
  ],
};

export default function BugDetailPage() {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={bugData.title}
        description={bugData.id}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Bugs", href: "/projects/bugs" },
          { label: bugData.id },
        ]}
        icon={<Bug className="h-6 w-6 text-danger" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/projects/bugs"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Bug
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {[
              { id: "details", label: "Details" },
              { id: "comments", label: `Comments (${bugData.comments.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bugData.description}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Steps to Reproduce
                </h3>
                <div className="font-mono text-sm text-muted-foreground space-y-1 bg-muted p-4 rounded-xl">
                  {bugData.stepsToReproduce.map((step, i) => (
                    <p key={i}>{step}</p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-success/20 bg-success/5 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-success mb-3">
                    Expected Behavior
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {bugData.expectedBehavior}
                  </p>
                </div>
                <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-danger mb-3">
                    Actual Behavior
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {bugData.actualBehavior}
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                <div className="space-y-2">
                  {bugData.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size}
                        </p>
                      </div>
                      <button className="text-sm text-primary hover:underline">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              {/* Comment Input */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    SC
                  </div>
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      placeholder="Write a comment..."
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-hover transition-colors">
                        <Send className="h-3.5 w-3.5" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {bugData.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">
                          {comment.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status & Severity */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Status
              </label>
              <StatusBadge
                status={bugData.status}
                variant={bugData.statusVariant}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Severity
              </label>
              <StatusBadge
                status={bugData.severity}
                variant={bugData.severityVariant}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Project
              </label>
              <a
                href={`/projects/projects/${bugData.projectId}`}
                className="text-sm text-primary hover:underline"
              >
                {bugData.project}
              </a>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Reporter
              </label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {bugData.reporterAvatar}
                </div>
                <span className="text-sm">{bugData.reporter}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {bugData.assignee.avatar}
                </div>
                <span className="text-sm">{bugData.assignee.name}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Environment
              </label>
              <span className="text-sm">{bugData.environment}</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Created
              </label>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{bugData.created}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Last Updated
              </label>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{bugData.updated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
