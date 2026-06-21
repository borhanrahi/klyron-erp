"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  ListTodo,
  Save,
  ArrowLeft,
  Calendar,
  Users,
  Flag,
  FolderKanban,
  Tag,
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

const tags = ["Backend", "Frontend", "Design", "DevOps", "Docs", "Testing", "Marketing", "Finance"];

export default function NewTaskPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Create New Task"
        description="Add a new task to track work items."
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Tasks", href: "/projects/tasks" },
          { label: "New Task" },
        ]}
        icon={<ListTodo className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/projects/tasks"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </a>
        }
      />

      {/* Task Information */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Task Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the task details and requirements..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
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
              Assignee *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select assignee</option>
                {teamMembers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Due Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Tags
            </label>
            <div className="grid grid-cols-4 gap-2">
              {tags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/projects/tasks"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </a>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Create Task
        </button>
      </div>
    </div>
  );
}
