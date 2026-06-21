"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  TrendingUp,
  ArrowLeft,
  Save,
  Building2,
  DollarSign,
  Calendar,
  User,
  FileText,
  Target,
  Percent,
} from "lucide-react";
import Link from "next/link";

export default function NewDealPage() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    value: "",
    stage: "",
    probability: "",
    expectedClose: "",
    owner: "",
    description: "",
    source: "",
    contactName: "",
    contactEmail: "",
    priority: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link
          href="/sales"
          className="hover:text-foreground transition-colors"
        >
          Sales
        </Link>
        <span>/</span>
        <Link
          href="/sales/deals"
          className="hover:text-foreground transition-colors"
        >
          Deals
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Deal
        </span>
      </div>

      <PageHeader
        title="Create New Deal"
        description="Add a new opportunity to your sales pipeline."
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/deals"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Deals
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Deal Information
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Core details about this opportunity
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Enterprise Platform Migration"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Company *
            </label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select company</option>
              <option value="acme">Acme Corp</option>
              <option value="techstart">TechStart Inc</option>
              <option value="global">Global Industries</option>
              <option value="creative">Creative Solutions</option>
              <option value="dataflow">DataFlow Systems</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Deal Value *
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Pipeline Stage *
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select stage</option>
              <option value="discovery">Discovery</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Win Probability (%)
            </label>
            <input
              type="number"
              name="probability"
              value={formData.probability}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="0-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Expected Close Date *
            </label>
            <input
              type="date"
              name="expectedClose"
              value={formData.expectedClose}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Lead Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select source</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="webinar">Webinar</option>
              <option value="trade-show">Trade Show</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Deal Owner
            </label>
            <select
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Assign to...</option>
              <option value="mike-johnson">Mike Johnson</option>
              <option value="emily-davis">Emily Davis</option>
              <option value="sarah-wilson">Sarah Wilson</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Contact Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Primary contact for this deal
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Name
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="email@company.com"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Description
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Additional context about this deal
          </p>
        </div>
        <div className="p-6">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            placeholder="Describe the deal opportunity..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/sales/deals"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Create Deal
        </button>
      </div>
    </div>
  );
}
