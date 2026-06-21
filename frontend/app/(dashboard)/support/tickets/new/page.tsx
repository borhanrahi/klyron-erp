"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Ticket,
  Save,
  ArrowLeft,
  AlertTriangle,
  Users,
  FolderKanban,
  Paperclip,
  Flag,
  Building2,
} from "lucide-react";

const teamMembers = [
  "Sarah Chen",
  "Mike Johnson",
  "Emily Davis",
  "David Park",
  "Alex Kim",
  "Omar Hassan",
];

const categories = [
  "Bug Report",
  "Feature Request",
  "How To",
  "Account Issue",
  "Billing",
  "Integration",
  "Performance",
  "Other",
];

export default function NewTicketPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Create Support Ticket"
        description="Log a new support request for a customer."
        breadcrumbs={[
          { label: "Support", href: "/support" },
          { label: "Tickets", href: "/support/tickets" },
          { label: "New Ticket" },
        ]}
        icon={<Ticket className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/support/tickets"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </a>
        }
      />

      {/* Ticket Information */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Ticket Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Subject *
            </label>
            <input
              type="text"
              placeholder="Brief description of the issue"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Customer / Company *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Customer or company name"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Category *
            </label>
            <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Priority *
            </label>
            <div className="relative">
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Assign To
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Description *
            </label>
            <textarea
              rows={5}
              placeholder="Detailed description of the issue, including any error messages, steps to reproduce, etc."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/support/tickets"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </a>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Create Ticket
        </button>
      </div>
    </div>
  );
}
