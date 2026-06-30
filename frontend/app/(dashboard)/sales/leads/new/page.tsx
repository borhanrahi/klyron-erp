"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Users,
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Star,
  FileText,
  Building2,
  Globe,
  DollarSign,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function NewLeadPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "new",
    score: 0,
    notes: "",
    title: "",
    company_name: "",
    industry: "",
    website: "",
    lead_value: 0,
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" || name === "lead_value" ? Number(value) : value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      await apiPost("/sales/leads", payload);
      router.push("/sales/leads");
    } catch (err) {
      console.error("Failed to create lead:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span>/</span>
        <Link href="/sales/leads" className="hover:text-foreground transition-colors">Leads</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">New Lead</span>
      </div>

      <PageHeader
        title="Add Lead"
        description="Capture a new lead and add them to your sales pipeline."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <Link href="/sales/leads"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name <span className="text-danger">*</span></label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Enter lead name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="email@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title / Position</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g., CEO, Marketing Manager" />
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-primary" />
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Company name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g., Technology, Healthcare" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Est. Deal Value ($)</label>
              <input type="number" name="lead_value" min="0" value={formData.lead_value} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="0" />
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-primary" />
            Lead Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Source</label>
              <select name="source" value={formData.source} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Select source</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="cold_call">Cold Call</option>
                <option value="social">Social</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email_campaign">Email Campaign</option>
                <option value="event">Event / Conference</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Score (0-100)</label>
              <input type="number" name="score" min="0" max="100" value={formData.score} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Auto-calculated if left as 0" />
              <p className="text-xs text-muted-foreground mt-1">Leave as 0 for auto-calculation based on data quality</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Tags className="h-3.5 w-3.5 inline mr-1" />
                Tags (comma separated)
              </label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="hot, vip, tech, decision-maker" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-primary" />
            Notes
          </h3>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            placeholder="Add notes about this lead..." />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-8 mt-6">
          <Link href="/sales/leads"
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50">
            {saving ? (
              <span className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Create Lead
          </button>
        </div>
      </form>
    </div>
  );
}
