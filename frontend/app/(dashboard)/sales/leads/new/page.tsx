"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Users,
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Tag,
  FileText,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function NewLeadPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    source: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
    tags: "",
    owner: "",
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
          href="/sales/leads"
          className="hover:text-foreground transition-colors"
        >
          Sales
        </Link>
        <span>/</span>
        <Link
          href="/sales/leads"
          className="hover:text-foreground transition-colors"
        >
          Leads
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Lead
        </span>
      </div>

      <PageHeader
        title="Add New Lead"
        description="Capture a new lead and add them to your sales pipeline."
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/leads"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Contact Information
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Basic details about the lead
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="email@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. CTO"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="https://company.com"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Company Information
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Company and source details
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Lead Source *
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
              <option value="cold-call">Cold Call</option>
              <option value="social-media">Social Media</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ZIP</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="ZIP"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Lead Owner
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
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Comma-separated tags"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Additional Notes
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Any additional context about this lead
          </p>
        </div>
        <div className="p-6">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            placeholder="Add notes about this lead..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/sales/leads"
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
          <Save className="h-4 w-4" />
          Create Lead
        </button>
      </div>
    </div>
  );
}
