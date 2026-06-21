"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Settings,
  Save,
  Globe,
  DollarSign,
  Clock,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="System Settings"
        description="Configure global system settings and preferences."
        icon={<Settings className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings" },
        ]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "general", label: "General", icon: Globe },
          { id: "email", label: "Email (SMTP)", icon: Mail },
          { id: "security", label: "Security", icon: Shield },
          { id: "backup", label: "Backup", icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Regional Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Default Currency</label>
                <select defaultValue="USD" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Timezone</label>
                <select defaultValue="America/Los_Angeles" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">GMT / London</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Language</label>
                <select defaultValue="en" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Fiscal Year Start</label>
                <select defaultValue="january" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="january">January</option>
                  <option value="april">April</option>
                  <option value="july">July</option>
                  <option value="october">October</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Time Format</label>
                <select defaultValue="12h" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Items Per Page</label>
                <select defaultValue="25" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Default Landing Page</label>
                <select defaultValue="dashboard" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="dashboard">Dashboard</option>
                  <option value="finance">Finance</option>
                  <option value="hr">HR</option>
                  <option value="sales">Sales</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === "email" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">SMTP Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">SMTP Host *</label>
              <input type="text" defaultValue="smtp.klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Port *</label>
              <input type="number" defaultValue={587} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Encryption</label>
              <select defaultValue="tls" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Username *</label>
              <input type="text" defaultValue="noreply@klyron.com" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Password *</label>
              <input type="password" defaultValue="••••••••" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">From Name</label>
              <input type="text" defaultValue="Klyron ERP" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            {[
              { label: "Enforce Two-Factor Authentication", description: "Require all users to enable 2FA", enabled: true },
              { label: "Session Timeout", description: "Auto logout after inactivity", enabled: true },
              { label: "IP Whitelisting", description: "Restrict access to specific IPs", enabled: false },
              { label: "Password Complexity", description: "Require strong passwords", enabled: true },
              { label: "Login Attempt Limit", description: "Lock account after 5 failed attempts", enabled: true },
            ].map((setting) => (
              <label key={setting.label} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-medium">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? "bg-primary" : "bg-muted"} relative`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${setting.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Backup Tab */}
      {activeTab === "backup" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Backup & Recovery</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-xs text-muted-foreground">Jun 21, 2024 3:00 AM (Automatic)</p>
              </div>
              <StatusBadge status="Success" variant="success" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="text-sm font-medium">Backup Schedule</p>
                <p className="text-xs text-muted-foreground">Daily at 3:00 AM UTC</p>
              </div>
              <select defaultValue="daily" className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="text-sm font-medium">Retention Period</p>
                <p className="text-xs text-muted-foreground">Keep backups for 30 days</p>
              </div>
              <select defaultValue="30" className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Create Backup Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
