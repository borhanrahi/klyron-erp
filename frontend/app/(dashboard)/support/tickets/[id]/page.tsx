"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Ticket,
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Building2,
  MessageSquare,
  Paperclip,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle,
  Forward,
  Tag,
} from "lucide-react";

const ticketData = {
  id: "TKT-001",
  subject: "Cannot access dashboard after password reset",
  description:
    "Customer reports they are unable to access the main dashboard after resetting their password. They receive a 'Session Expired' error immediately after logging in with the new password. They have tried clearing cache and using a different browser, but the issue persists.",
  customer: "Acme Corp",
  contactEmail: "admin@acmecorp.com",
  category: "Account Issue",
  priority: "High",
  priorityVariant: "warning" as const,
  status: "Open",
  statusVariant: "danger" as const,
  assignee: { name: "Sarah Chen", avatar: "SC" },
  reporter: "Customer Portal",
  created: "Jun 21, 2024 10:30 AM",
  updated: "Jun 21, 2024 02:15 PM",
  slaDue: "Jun 22, 2024 10:30 AM",
  attachments: [
    { name: "error-screenshot.png", size: "312 KB" },
    { name: "browser-console.log", size: "18 KB" },
  ],
  timeline: [
    {
      type: "message",
      author: "Customer Portal",
      authorEmail: "admin@acmecorp.com",
      text: "I reset my password through the 'Forgot Password' link but now I can't access the dashboard. Every time I try to open it, I get a 'Session Expired' error. Please help!",
      time: "Jun 21, 2024 10:30 AM",
      isCustomer: true,
    },
    {
      type: "status",
      text: "Ticket created and assigned to Sarah Chen",
      time: "Jun 21, 2024 10:31 AM",
    },
    {
      type: "message",
      author: "Sarah Chen",
      authorAvatar: "SC",
      text: "Hi there! I'm sorry to hear about the issue. I've looked into your account and it seems like the password reset token wasn't properly invalidated. Let me fix that on our end.",
      time: "Jun 21, 2024 11:15 AM",
      isCustomer: false,
    },
    {
      type: "internal",
      author: "Sarah Chen",
      authorAvatar: "SC",
      text: "Note: This seems to be a recurring issue with the password reset flow. Need to flag this to the dev team for investigation.",
      time: "Jun 21, 2024 11:20 AM",
    },
    {
      type: "message",
      author: "Customer Portal",
      authorEmail: "admin@acmecorp.com",
      text: "Thank you Sarah! I can now access the dashboard. Is there anything I need to do to prevent this from happening again?",
      time: "Jun 21, 2024 01:45 PM",
      isCustomer: true,
    },
  ],
};

export default function TicketDetailPage() {
  const [activeTab, setActiveTab] = useState("conversation");
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={ticketData.subject}
        description={ticketData.id}
        breadcrumbs={[
          { label: "Support", href: "/support" },
          { label: "Tickets", href: "/support/tickets" },
          { label: ticketData.id },
        ]}
        icon={<Ticket className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/support/tickets"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Forward className="h-4 w-4" />
              Forward
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
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
              { id: "conversation", label: "Conversation" },
              { id: "details", label: "Details" },
              { id: "notes", label: "Internal Notes" },
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

          {/* Conversation Tab */}
          {activeTab === "conversation" && (
            <div className="space-y-4">
              {ticketData.timeline.map((item, i) => {
                if (item.type === "status") {
                  return (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="h-px flex-1 bg-border" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.text} · {item.time}
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  );
                }

                const isInternal = item.type === "internal";
                const isCustomer = item.isCustomer;

                return (
                  <div
                    key={i}
                    className={`rounded-2xl border p-4 shadow-sm ${
                      isInternal
                        ? "border-warning/30 bg-warning/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                          isInternal
                            ? "bg-warning/10 text-warning"
                            : isCustomer
                            ? "bg-info/10 text-info"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {isCustomer
                          ? item.authorEmail?.charAt(0).toUpperCase()
                          : item.authorAvatar || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">
                            {isCustomer ? item.authorEmail : item.author}
                          </span>
                          {isInternal && (
                            <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded">
                              Internal Note
                            </span>
                          )}
                          {isCustomer && (
                            <span className="text-[10px] bg-info/10 text-info px-1.5 py-0.5 rounded">
                              Customer
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Reply */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    SC
                  </div>
                  <div className="flex-1">
                    <textarea
                      rows={3}
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          Attach
                        </button>
                        <label className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-border text-warning focus:ring-warning"
                          />
                          Internal Note
                        </label>
                      </div>
                      <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-hover transition-colors">
                        <Send className="h-3.5 w-3.5" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Ticket Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Description
                  </label>
                  <p className="text-sm leading-relaxed">
                    {ticketData.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Category", value: ticketData.category },
                    { label: "Reporter", value: ticketData.reporter },
                    { label: "Created", value: ticketData.created },
                    { label: "SLA Due", value: ticketData.slaDue },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="py-2 border-b border-border/50"
                    >
                      <span className="text-xs text-muted-foreground block">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                {/* Attachments */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Attachments
                  </label>
                  <div className="space-y-2">
                    {ticketData.attachments.map((file, i) => (
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
            </div>
          )}

          {/* Internal Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <textarea
                  rows={3}
                  placeholder="Add an internal note (only visible to team)..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-warning text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-colors">
                    <Tag className="h-3.5 w-3.5" />
                    Add Note
                  </button>
                </div>
              </div>
              {ticketData.timeline
                .filter((item) => item.type === "internal")
                .map((note, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-warning/30 bg-warning/5 p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-xs font-semibold text-warning shrink-0">
                        {note.authorAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">
                            {note.author}
                          </span>
                          <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded">
                            Internal Note
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {note.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {note.text}
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
          {/* Status & Priority */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Status
              </label>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={ticketData.status}
                  variant={ticketData.statusVariant}
                />
                <select className="px-2 py-1 bg-muted border border-border rounded text-xs focus:border-primary outline-none">
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Priority
              </label>
              <StatusBadge
                status={ticketData.priority}
                variant={ticketData.priorityVariant}
              />
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Customer
              </label>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {ticketData.customer}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 ml-6">
                {ticketData.contactEmail}
              </p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                  {ticketData.assignee.avatar}
                </div>
                <span className="text-sm">{ticketData.assignee.name}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                SLA Due
              </label>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-warning" />
                <span className="text-sm text-warning font-medium">
                  {ticketData.slaDue}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Created
              </label>
              <span className="text-sm">{ticketData.created}</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Last Updated
              </label>
              <span className="text-sm">{ticketData.updated}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full bg-success text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <CheckCircle className="h-4 w-4" />
                Mark Resolved
              </button>
              <button className="w-full border border-border bg-muted text-foreground py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors">
                <Forward className="h-4 w-4" />
                Escalate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
