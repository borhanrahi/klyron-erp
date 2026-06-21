"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Building2,
  Save,
  Upload,
  MapPin,
  Mail,
  Phone,
  Globe,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";

export default function CompanyPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Company Profile"
        description="Manage your company information and branding settings."
        icon={<Building2 className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Company" },
        ]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Company Name *</label>
                <input type="text" defaultValue="Klyron Technologies" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Legal Name</label>
                <input type="text" defaultValue="Klyron Technologies Inc." className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Tax ID / EIN</label>
                <input type="text" defaultValue="12-3456789" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Registration Number</label>
                <input type="text" defaultValue="REG-2021-00456" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Industry</label>
                <input type="text" defaultValue="Technology / Software" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                <input type="email" defaultValue="info@klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
                <input type="tel" defaultValue="+1 (555) 100-2000" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Website</label>
                <input type="url" defaultValue="https://klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Support Email</label>
                <input type="email" defaultValue="support@klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Street Address</label>
                <input type="text" defaultValue="123 Innovation Drive" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">City</label>
                <input type="text" defaultValue="San Francisco" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">State / Province</label>
                <input type="text" defaultValue="California" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Postal Code</label>
                <input type="text" defaultValue="94105" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Country</label>
                <select defaultValue="US" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Logo */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
            <div className="w-32 h-32 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <button className="w-full border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Logo
            </button>
          </div>

          {/* Regional Settings */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Regional Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Timezone</label>
                <select defaultValue="America/Los_Angeles" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="Europe/London">GMT / London</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Date Format</label>
                <select defaultValue="MM/DD/YYYY" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Fiscal Year Start</label>
                <select defaultValue="January" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="January">January</option>
                  <option value="April">April</option>
                  <option value="July">July</option>
                  <option value="October">October</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
