"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  HelpCircle,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Clock,
  MessageSquare,
  Send,
  User,
  FileText,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";

const inquiry = {
  id: "INQ-001",
  name: "Michael Chen",
  title: "CTO",
  email: "michael.chen@startup.io",
  phone: "+1 (555) 111-2233",
  company: "Startup Ventures",
  subject: "Enterprise Plan Pricing",
  message:
    "Hi, I'm interested in your enterprise plan for our growing team. We currently have 500+ users and need to understand the pricing structure, volume discounts, and any custom features available. Could you also share information about your SLA and support options?",
  source: "Website Form",
  status: "New",
  statusVariant: "info" as const,
  date: "Mar 24, 2024",
  time: "10:30 AM",
  priority: "High",
  assignedTo: "Mike Johnson",
  page: "/pricing",
  referrer: "Google Search",
};

const responseTemplates = [
  { id: 1, name: "Pricing Information", subject: "Enterprise Pricing Details" },
  { id: 2, name: "Demo Scheduling", subject: "Schedule a Product Demo" },
  { id: 3, name: "Follow Up", subject: "Following Up on Your Inquiry" },
];

export default function InquiryDetailPage() {
  const [response, setResponse] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      <Link
        href="/sales/inquiries"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inquiries
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{inquiry.subject}</h1>
            <StatusBadge
              status={inquiry.status}
              variant={inquiry.statusVariant}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {inquiry.id} • Submitted on {inquiry.date} at {inquiry.time}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <X className="h-4 w-4" />
            Reject
          </button>
          <Link
            href="/sales/leads/new"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Convert to Lead
          </Link>
          <button className="bg-success text-white px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Mark as Qualified
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Inquiry Details</h3>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Respond</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Quick Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">Select a template...</option>
                {responseTemplates.map((template) => (
                  <option key={template.id} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Type your response..."
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Save Draft
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Response
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Activity History</h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                <div className="relative pl-12">
                  <div className="absolute left-3.5 top-1 w-3 h-3 rounded-full bg-card border-2 border-border" />
                  <div className="p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold">
                        Inquiry received
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {inquiry.date} {inquiry.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Form submission from {inquiry.page}
                    </p>
                  </div>
                </div>
                <div className="relative pl-12">
                  <div className="absolute left-3.5 top-1 w-3 h-3 rounded-full bg-card border-2 border-border" />
                  <div className="p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold">
                        Assigned to {inquiry.assignedTo}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {inquiry.date} 10:35 AM
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Auto-assigned based on round-robin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  MC
                </div>
                <div>
                  <p className="font-medium">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.title}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {inquiry.email}
                </a>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {inquiry.phone}
                </a>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {inquiry.company}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Inquiry Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Source</span>
                <span className="text-sm font-medium">{inquiry.source}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">Priority</span>
                <StatusBadge
                  status={inquiry.priority}
                  variant={
                    inquiry.priority === "High"
                      ? "danger"
                      : inquiry.priority === "Medium"
                        ? "warning"
                        : "muted"
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Assigned To
                </span>
                <span className="text-sm font-medium">
                  {inquiry.assignedTo}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Referrer
                </span>
                <span className="text-sm font-medium">{inquiry.referrer}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/sales/leads/new"
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Create Lead
              </Link>
              <Link
                href="/sales/deals/new"
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Create Deal
              </Link>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Log Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
