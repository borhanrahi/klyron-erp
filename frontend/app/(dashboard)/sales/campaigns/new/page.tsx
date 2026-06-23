"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Megaphone,
  ArrowLeft,
  Save,
  Send,
  Calendar,
  Users,
  Mail,
  FileText,
  DollarSign,
  Target,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";

export default function NewCampaignPage() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    targetAudience: "",
    segment: "",
    subject: "",
    previewText: "",
    senderName: "",
    senderEmail: "",
    replyTo: "",
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
          href="/sales/campaigns"
          className="hover:text-foreground transition-colors"
        >
          Campaigns
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Campaign
        </span>
      </div>

      <PageHeader
        title="Create Campaign"
        description="Set up a new marketing campaign."
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/campaigns"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Campaign Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Basic campaign information
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Q2 Product Launch Campaign"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select type</option>
              <option value="email">Email Marketing</option>
              <option value="social">Social Media</option>
              <option value="event">Event / Webinar</option>
              <option value="referral">Referral Program</option>
              <option value="paid">Paid Advertising</option>
              <option value="content">Content Marketing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Start Date *
            </label>
            <DatePicker
              value={formData.startDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, startDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              End Date *
            </label>
            <DatePicker
              value={formData.endDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, endDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Describe the campaign goals and strategy..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Target Audience
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Define who will receive this campaign
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Segment
            </label>
            <select
              name="segment"
              value={formData.segment}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select segment</option>
              <option value="all">All Customers</option>
              <option value="active">Active Customers</option>
              <option value="leads">Leads</option>
              <option value="enterprise">Enterprise</option>
              <option value="smb">Small Business</option>
              <option value="trial">Trial Users</option>
              <option value="churned">Churned Customers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Target Audience
            </label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. CTOs and Engineering Managers"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Settings
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure email delivery settings
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Subject Line *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Enter email subject line"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Preview Text
            </label>
            <input
              type="text"
              name="previewText"
              value={formData.previewText}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Text shown after subject in inbox"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Sender Name
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Your Company"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Sender Email
            </label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="marketing@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Reply-To Email
            </label>
            <input
              type="email"
              name="replyTo"
              value={formData.replyTo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="support@company.com"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/sales/campaigns"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save as Draft
        </button>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Send className="h-4 w-4" />
          Launch Campaign
        </button>
      </div>
    </div>
  );
}
