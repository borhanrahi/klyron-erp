"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  UserPlus,
  ArrowLeft,
  Save,
  Mail,
  Shield,
  Building2,
  Send,
} from "lucide-react";

const roles = ["Admin", "Manager", "Accountant", "HR Specialist", "Sales Rep", "Viewer"];
const branches = ["Headquarters (HQ)", "East Coast Office (ECO)", "European Hub (EUH)", "Asia Pacific (APAC)", "Remote Office (REM)"];

export default function NewUserPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Invite User"
        description="Send an invitation to a new team member."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "Invite User" },
        ]}
        icon={<UserPlus className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/admin/users"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </a>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">First Name *</label>
                <input type="text" placeholder="John" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Last Name *</label>
                <input type="text" placeholder="Doe" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email Address *</label>
                <input type="email" placeholder="john.doe@klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Role *</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Branch *</label>
                <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Invitation Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <div>
                  <p className="text-sm font-medium">Send welcome email</p>
                  <p className="text-xs text-muted-foreground">Send an email with login instructions</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <div>
                  <p className="text-sm font-medium">Require password change on first login</p>
                  <p className="text-xs text-muted-foreground">User must set their own password</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <input type="checkbox" className="accent-primary" />
                <div>
                  <p className="text-sm font-medium">Enable two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Require 2FA setup during onboarding</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Name", value: "Not set" },
                { label: "Email", value: "Not set" },
                { label: "Role", value: "Not set" },
                { label: "Branch", value: "Not set" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
