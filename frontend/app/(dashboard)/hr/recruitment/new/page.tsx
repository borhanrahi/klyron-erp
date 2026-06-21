"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Briefcase,
  ArrowLeft,
  Save,
  Plus,
  X,
  MapPin,
  DollarSign,
  Users,
  FileText,
} from "lucide-react";

const departments = [
  "Engineering",
  "Marketing",
  "Product",
  "Design",
  "HR",
  "Finance",
  "Sales",
  "DevOps",
];

export default function NewJobPage() {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibility, setNewResponsibility] = useState("");

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setResponsibilities([...responsibilities, newResponsibility.trim()]);
      setNewResponsibility("");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Post New Job"
        description="Create a new job opening and start hiring."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Recruitment", href: "/hr/recruitment" },
          { label: "New Job" },
        ]}
        icon={<Briefcase className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/hr/recruitment"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recruitment
          </a>
        }
      />

      {/* Job Details */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Department *
            </label>
            <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Employment Type *
            </label>
            <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Salary Range
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g. $100K - $140K"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Number of Positions
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="1"
                defaultValue={1}
                min={1}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Job Description *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the role, team, and what the candidate will be working on..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Requirements</h3>
        <div className="space-y-3 mb-4">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{req}</span>
              <button
                onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))}
                className="p-1 hover:bg-muted/80 rounded transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRequirement()}
            placeholder="Add a requirement..."
            className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <button
            onClick={addRequirement}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Responsibilities</h3>
        <div className="space-y-3 mb-4">
          {responsibilities.map((resp, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{resp}</span>
              <button
                onClick={() => setResponsibilities(responsibilities.filter((_, idx) => idx !== i))}
                className="p-1 hover:bg-muted/80 rounded transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addResponsibility()}
            placeholder="Add a responsibility..."
            className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <button
            onClick={addResponsibility}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/hr/recruitment"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </a>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Publish Job
        </button>
      </div>
    </div>
  );
}
