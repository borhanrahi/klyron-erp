"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Building2,
  ArrowLeft,
  Save,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";

export default function NewBranchPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Add New Branch"
        description="Set up a new office location or branch."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Branches", href: "/admin/branches" },
          { label: "New Branch" },
        ]}
        icon={<Building2 className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/admin/branches"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Branches
          </a>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Branch Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Branch Name *</label>
                <input type="text" placeholder="e.g., West Coast Office" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Branch Code *</label>
                <input type="text" placeholder="e.g., WCO" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Manager</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select manager</option>
                  <option value="sarah">Sarah Chen</option>
                  <option value="mike">Mike Johnson</option>
                  <option value="emma">Emma Wilson</option>
                  <option value="david">David Kim</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                <input type="email" placeholder="branch@klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Street Address *</label>
                <input type="text" placeholder="123 Main Street" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">City *</label>
                <input type="text" placeholder="San Francisco" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">State / Province</label>
                <input type="text" placeholder="California" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Postal Code</label>
                <input type="text" placeholder="94105" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Country *</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="SG">Singapore</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Branch Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Status", value: "Active" },
                { label: "Employees", value: "0 (initial)" },
                { label: "Timezone", value: "Local" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-2">
            <Save className="h-4 w-4" />
            Create Branch
          </button>
        </div>
      </div>
    </div>
  );
}
