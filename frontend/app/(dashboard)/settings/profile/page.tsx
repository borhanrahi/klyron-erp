"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  User,
  Save,
  Upload,
  Mail,
  Phone,
  Lock,
  Bell,
  Globe,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Profile Settings"
        description="Manage your personal account settings and preferences."
        icon={<User className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Profile" },
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
          {/* Avatar */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                  SC
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Sarah Chen</p>
                <button className="border border-border bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">First Name *</label>
                <input type="text" defaultValue="Sarah" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Last Name *</label>
                <input type="text" defaultValue="Chen" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email *</label>
                <input type="email" defaultValue="sarah.chen@klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
                <input type="tel" defaultValue="+1 (555) 234-5678" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Job Title</label>
                <input type="text" defaultValue="Admin" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    defaultValue="••••••••"
                    className="w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Confirm Password</label>
                <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Update Password
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Summary */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <div className="space-y-3">
              {[
                { label: "User ID", value: "USR-001" },
                { label: "Role", value: "Admin" },
                { label: "Branch", value: "Headquarters" },
                { label: "Joined", value: "Jan 15, 2022" },
                { label: "Last Login", value: "Jun 21, 2024" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <div className="space-y-3">
              {[
                { label: "Language", value: "English" },
                { label: "Timezone", value: "Pacific Time" },
                { label: "Date Format", value: "MM/DD/YYYY" },
                { label: "Time Format", value: "12-hour" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
