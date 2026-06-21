"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Puzzle,
  Search,
  ExternalLink,
  Check,
  X,
  MessageSquare,
  Mail,
  Phone,
  Video,
  Bell,
  Webhook,
  Slack,
  Bot,
} from "lucide-react";

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications to Slack channels and receive commands.",
    icon: MessageSquare,
    iconBg: "bg-[#4A154B]/10",
    iconColor: "text-[#4A154B]",
    status: "Connected",
    statusVariant: "success" as const,
    lastSync: "2 min ago",
    category: "Communication",
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Bot integration for alerts and customer support.",
    icon: Bot,
    iconBg: "bg-info/10",
    iconColor: "text-info",
    status: "Connected",
    statusVariant: "success" as const,
    lastSync: "15 min ago",
    category: "Communication",
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS and voice call integration for notifications.",
    icon: Phone,
    iconBg: "bg-danger/10",
    iconColor: "text-danger",
    status: "Not Connected",
    statusVariant: "muted" as const,
    lastSync: "-",
    category: "Communication",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Schedule and manage video meetings from the ERP.",
    icon: Video,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    status: "Connected",
    statusVariant: "success" as const,
    lastSync: "1 hour ago",
    category: "Meetings",
  },
  {
    id: "smtp",
    name: "Email (SMTP)",
    description: "Configure SMTP server for system email notifications.",
    icon: Mail,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    status: "Connected",
    statusVariant: "success" as const,
    lastSync: "Active",
    category: "Email",
  },
  {
    id: "webhooks",
    name: "Custom Webhooks",
    description: "Send real-time events to external endpoints.",
    icon: Webhook,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    status: "Not Connected",
    statusVariant: "muted" as const,
    lastSync: "-",
    category: "Developer",
  },
];

const integrationStats = [
  { label: "Total Integrations", value: "6", change: "Available" },
  { label: "Connected", value: "4", change: "Active" },
  { label: "Events Today", value: "1,247", change: "Synced" },
  { label: "Failed Events", value: "0", change: "All healthy" },
];

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIntegrations = integrations.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Integrations"
        description="Connect third-party services and manage system integrations."
        icon={<Puzzle className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Integrations" },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrationStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Communication">Communication</option>
          <option value="Email">Email</option>
          <option value="Meetings">Meetings</option>
          <option value="Developer">Developer</option>
        </select>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div key={integration.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${integration.iconBg}`}>
                  <Icon className={`h-6 w-6 ${integration.iconColor}`} />
                </div>
                <StatusBadge status={integration.status} variant={integration.statusVariant} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{integration.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</span>
                {integration.status === "Connected" ? (
                  <button className="border border-border bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-muted/80 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Disconnect
                  </button>
                ) : (
                  <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
