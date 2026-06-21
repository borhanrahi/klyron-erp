"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Shield,
  Building2,
  Clock,
  Activity,
  Key,
  LogIn,
  Settings,
  FileText,
} from "lucide-react";

const userData = {
  id: "USR-001",
  name: "Sarah Chen",
  email: "sarah.chen@klyron.com",
  phone: "+1 (555) 234-5678",
  role: "Admin",
  branch: "Headquarters",
  status: "Active",
  statusVariant: "success" as const,
  joinDate: "Jan 15, 2022",
  lastLogin: "2 min ago",
  avatar: "SC",
  timezone: "America/Los_Angeles",
  language: "English",
  twoFactor: true,
};

const activityLog = [
  { time: "Jun 21, 2024 10:32 AM", action: "Logged in", icon: LogIn, details: "IP: 192.168.1.45" },
  { time: "Jun 21, 2024 10:35 AM", action: "Updated company settings", icon: Settings, details: "Modified timezone" },
  { time: "Jun 20, 2024 4:15 PM", action: "Created new user invitation", icon: Users, details: "Invited james.w@klyron.com" },
  { time: "Jun 20, 2024 2:00 PM", action: "Exported finance report", icon: FileText, details: "Q1 2024 P&L" },
  { time: "Jun 19, 2024 9:00 AM", action: "Logged in", icon: LogIn, details: "IP: 192.168.1.45" },
  { time: "Jun 18, 2024 3:30 PM", action: "Changed password", icon: Key, details: "Security update" },
];

export default function UserDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={userData.name}
        description={`${userData.role} · ${userData.branch}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: userData.name },
        ]}
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/admin/users"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit User
            </button>
          </div>
        }
      />

      {/* User Info Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {userData.avatar}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userData.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userData.branch}</span>
            </div>
          </div>
          <StatusBadge status={userData.status} variant={userData.statusVariant} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "overview", label: "Overview", icon: Users },
          { id: "activity", label: "Activity Log", icon: Activity },
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: userData.name },
                { label: "Email", value: userData.email },
                { label: "Phone", value: userData.phone },
                { label: "Timezone", value: userData.timezone },
                { label: "Language", value: userData.language },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <div className="space-y-4">
              {[
                { label: "User ID", value: userData.id },
                { label: "Role", value: userData.role },
                { label: "Branch", value: userData.branch },
                { label: "Joined", value: userData.joinDate },
                { label: "Last Login", value: userData.lastLogin },
                { label: "2FA Enabled", value: userData.twoFactor ? "Yes" : "No" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activityLog.map((log, i) => {
              const Icon = log.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {i < activityLog.length - 1 && <div className="w-0.5 h-full bg-border" />}
                  </div>
                  <div className="pb-4 flex-1">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
