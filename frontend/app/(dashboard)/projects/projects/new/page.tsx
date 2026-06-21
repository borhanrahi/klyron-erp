"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FolderKanban,
  Save,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Target,
  FileText,
} from "lucide-react";

const teamMembers = [
  "Sarah Chen",
  "Mike Johnson",
  "Emily Davis",
  "David Park",
  "Rachel Martinez",
  "Alex Kim",
  "James Wilson",
  "Omar Hassan",
];

export default function NewProjectPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Create New Project"
        description="Set up a new project with details and milestones."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Projects", href: "/projects/projects" },
          { label: "New Project" },
        ]}
        icon={<FolderKanban className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/projects/projects"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </a>
        }
      />

      {/* Project Information */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Project Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Project Name *
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Project ID
            </label>
            <input
              type="text"
              value="PRJ-009"
              readOnly
              className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Project Manager *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select manager</option>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Priority
            </label>
            <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Status
            </label>
            <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the project objectives and scope..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Timeline & Budget */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Timeline & Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Start Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              End Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Budget ($) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Currency
            </label>
            <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Assignment */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Team Assignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Team Members
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/projects/projects"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </a>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Create Project
        </button>
      </div>
    </div>
  );
}
