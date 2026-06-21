"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MessageSquare,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  User,
  Send,
  Reply,
  Calendar,
  Tag,
  Globe,
  FileText,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const inquiryData = {
  id: "INQ-001",
  name: "James Wilson",
  email: "james.wilson@techcorp.com",
  phone: "+1 (555) 123-4567",
  company: "TechCorp Inc.",
  subject: "Enterprise Plan Pricing",
  source: "Web Form",
  date: "Apr 2, 2024",
  time: "10:32 AM",
  status: "New",
  statusVariant: "info" as const,
  priority: "High",
  message:
    "Hi, I'm interested in learning more about your Enterprise plan. We have a team of 50+ developers and need to understand the pricing structure, including any volume discounts. We're also interested in the API limits and dedicated support options. Could you schedule a call this week to discuss? Best regards, James Wilson, CTO at TechCorp Inc.",
  ipAddress: "192.168.1.45",
  userAgent: "Chrome 123.0 on Windows 11",
  referrer: "https://klyron.com/pricing",
};

const followUpActions = [
  { id: 1, action: "Send pricing brochure", assignedTo: "Sarah Chen", status: "Pending", statusVariant: "warning" as const, date: "Apr 2, 2024" },
  { id: 2, action: "Schedule demo call", assignedTo: "Mike Johnson", status: "Completed", statusVariant: "success" as const, date: "Apr 3, 2024" },
  { id: 3, action: "Follow up on proposal", assignedTo: "Sarah Chen", status: "Pending", statusVariant: "warning" as const, date: "Apr 5, 2024" },
];

const activityLog = [
  { time: "Apr 2, 2024 10:32 AM", action: "Inquiry submitted via web form", user: "System" },
  { time: "Apr 2, 2024 10:33 AM", action: "Auto-assigned to Sales team", user: "System" },
  { time: "Apr 2, 2024 11:15 AM", action: "Status changed to New", user: "Sarah Chen" },
  { time: "Apr 2, 2024 11:16 AM", action: "Note added: High priority - Enterprise inquiry", user: "Sarah Chen" },
];

export default function InquiryDetailPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [replyText, setReplyText] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={`Inquiry: ${inquiryData.subject}`}
        description={`From ${inquiryData.name} at ${inquiryData.company}`}
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Inquiries", href: "/crm/inquiries" },
          { label: inquiryData.id },
        ]}
        icon={<MessageSquare className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/crm/inquiries"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Reply className="h-4 w-4" />
              Reply
            </button>
          </div>
        }
      />

      {/* Inquiry Info Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {inquiryData.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{inquiryData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{inquiryData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{inquiryData.date} at {inquiryData.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{inquiryData.source}</span>
            </div>
          </div>
          <StatusBadge status={inquiryData.status} variant={inquiryData.statusVariant} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "details", label: "Message", icon: FileText },
          { id: "followup", label: "Follow-ups", icon: CheckCircle },
          { id: "activity", label: "Activity", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Message Tab */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Customer Message</h3>
            <div className="bg-muted/50 rounded-xl p-5">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {inquiryData.message}
              </p>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Quick Reply</h4>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
              <div className="flex justify-end mt-3">
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Name", value: inquiryData.name },
                  { label: "Email", value: inquiryData.email },
                  { label: "Phone", value: inquiryData.phone },
                  { label: "Company", value: inquiryData.company },
                  { label: "Priority", value: inquiryData.priority },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Technical Info</h3>
              <div className="space-y-3">
                {[
                  { label: "IP Address", value: inquiryData.ipAddress },
                  { label: "Browser", value: inquiryData.userAgent },
                  { label: "Referrer", value: inquiryData.referrer },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium truncate max-w-[150px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-ups Tab */}
      {activeTab === "followup" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Add Follow-up
            </button>
          </div>
          {followUpActions.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">Assigned to {item.assignedTo} · {item.date}</p>
                </div>
              </div>
              <StatusBadge status={item.status} variant={item.statusVariant} />
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
          <div className="space-y-4">
            {activityLog.map((log, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary" />
                  {i < activityLog.length - 1 && <div className="w-0.5 h-full bg-border" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.user} · {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
