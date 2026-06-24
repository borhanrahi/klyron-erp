"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Megaphone,
  ArrowLeft,
  Save,
  Send,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { apiPost } from "@/lib/api";

export default function NewCampaignPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    targetAudience: "",
    segment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (status: "draft" | "active") => {
    if (!formData.name || !formData.type) return;
    setSaving(true);
    try {
      await apiPost("/sales/campaigns", {
        name: formData.name,
        type: formData.type,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        target_audience: formData.targetAudience || formData.segment || "",
        status,
      });
      router.push("/sales/campaigns");
    } catch (err) {
      console.error("Failed to create campaign:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span>/</span>
        <Link href="/sales/campaigns" className="hover:text-foreground transition-colors">Campaigns</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">New Campaign</span>
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
          <p className="text-sm text-muted-foreground mt-1">Basic campaign information</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Campaign Name *</label>
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
            <label className="block text-sm font-medium mb-2">Campaign Type *</label>
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
              <option value="banner">Banner / Display</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="0.00"
              min="0"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <DatePicker
              value={formData.startDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, startDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <DatePicker
              value={formData.endDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, endDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
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
          <p className="text-sm text-muted-foreground mt-1">Define who will receive this campaign</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Target Segment</label>
            <select
              name="segment"
              value={formData.segment}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select segment</option>
              <option value="All customers">All Customers</option>
              <option value="Active customers">Active Customers</option>
              <option value="Leads">Leads</option>
              <option value="Enterprise">Enterprise</option>
              <option value="SME">Small Business</option>
              <option value="Trial users">Trial Users</option>
              <option value="Churned customers">Churned Customers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
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

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/sales/campaigns"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button
          onClick={() => handleSubmit("draft")}
          disabled={saving || !formData.name || !formData.type}
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save as Draft"}
        </button>
        <button
          onClick={() => handleSubmit("active")}
          disabled={saving || !formData.name || !formData.type}
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          {saving ? "Launching..." : "Launch Campaign"}
        </button>
      </div>
    </div>
  );
}
