"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Bug,
  Save,
  ArrowLeft,
  AlertTriangle,
  Users,
  FolderKanban,
  Paperclip,
  Flag,
} from "lucide-react";

const projects = [
  "E-Commerce Platform Redesign",
  "Mobile App v2.0",
  "Data Analytics Dashboard",
  "Customer Portal Upgrade",
  "Legacy System Migration",
];

const teamMembers = [
  "Sarah Chen",
  "Mike Johnson",
  "Emily Davis",
  "David Park",
  "Alex Kim",
  "Omar Hassan",
  "Priya Patel",
  "Rachel Martinez",
];

export default function NewBugPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Report a Bug"
        description="Document a new bug with reproduction steps."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Bugs", href: "/projects/bugs" },
          { label: "Report Bug" },
        ]}
        icon={<Bug className="h-6 w-6 text-danger" />}
        actions={
          <a
            href="/projects/bugs"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bugs
          </a>
        }
      />

      {/* Bug Information */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Bug Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Bug Title *
            </label>
            <input
              type="text"
              placeholder="Brief description of the bug"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Project *
            </label>
            <div className="relative">
              <FolderKanban className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Severity *
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="critical">Critical - System crash/data loss</option>
                <option value="high">High - Major feature broken</option>
                <option value="medium">Medium - Minor feature issue</option>
                <option value="low">Low - Cosmetic/typo</option>
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
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Environment
            </label>
            <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
              <option value="local">Local</option>
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Bug Details</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Steps to Reproduce *
            </label>
            <textarea
              rows={4}
              placeholder="1. Go to...&#10;2. Click on...&#10;3. Scroll down...&#10;4. See error..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Expected Behavior
            </label>
            <textarea
              rows={2}
              placeholder="What should happen?"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Actual Behavior
            </label>
            <textarea
              rows={2}
              placeholder="What actually happens?"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Screenshots / Attachments
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/projects/bugs"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </a>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Submit Bug Report
        </button>
      </div>
    </div>
  );
}
