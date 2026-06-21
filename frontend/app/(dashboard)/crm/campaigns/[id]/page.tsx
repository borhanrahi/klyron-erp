"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Megaphone,
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Mail,
  BarChart3,
  Eye,
  MousePointerClick,
  DollarSign,
  Calendar,
  Target,
  Send,
  Pause,
  Play,
} from "lucide-react";

const campaignData = {
  id: "CMP-001",
  name: "Spring Product Launch",
  type: "Email",
  status: "Active",
  statusVariant: "success" as const,
  description: "Launch campaign for our new Spring product line featuring email outreach to our customer base.",
  startDate: "Mar 15, 2024",
  endDate: "Apr 15, 2024",
  budget: "$5,000",
  spent: "$3,200",
  audience: "Active Subscribers",
  audienceSize: 12450,
};

const metrics = [
  { label: "Sent", value: "12,450", icon: Send, change: "100% delivery", positive: true },
  { label: "Opened", value: "8,715", icon: Eye, change: "70.0% open rate", positive: true },
  { label: "Clicked", value: "3,240", icon: MousePointerClick, change: "26.1% CTR", positive: true },
  { label: "Conversions", value: "456", icon: Target, change: "3.7% conversion", positive: true },
];

const dailyStats = [
  { date: "Apr 2", sent: 1200, opened: 840, clicked: 312 },
  { date: "Apr 1", sent: 1100, opened: 770, clicked: 286 },
  { date: "Mar 31", sent: 980, opened: 686, clicked: 255 },
  { date: "Mar 30", sent: 1050, opened: 735, clicked: 273 },
  { date: "Mar 29", sent: 1150, opened: 805, clicked: 299 },
  { date: "Mar 28", sent: 1080, opened: 756, clicked: 281 },
  { date: "Mar 27", sent: 990, opened: 693, clicked: 257 },
];

export default function CampaignDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={campaignData.name}
        description={campaignData.type + " Campaign · " + campaignData.audience}
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Campaigns", href: "/crm/campaigns" },
          { label: campaignData.name },
        ]}
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/crm/campaigns"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
        }
      />

      {/* Campaign Info Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{campaignData.startDate} - {campaignData.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{campaignData.spent} / {campaignData.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{campaignData.audienceSize.toLocaleString()} contacts</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{campaignData.audience}</span>
            </div>
          </div>
          <StatusBadge status={campaignData.status} variant={campaignData.statusVariant} />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
            <p className={`text-xs mt-1 ${metric.positive ? "text-success" : "text-danger"}`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "recipients", label: "Recipients", icon: Users },
          { id: "content", label: "Content", icon: Mail },
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
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Sent</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Opened</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Clicked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {dailyStats.map((stat) => (
                  <tr key={stat.date} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{stat.date}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{stat.sent.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{stat.opened.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{stat.clicked.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recipients Tab */}
      {activeTab === "recipients" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recipient Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Recipients", value: "12,450", color: "text-primary" },
              { label: "Delivered", value: "12,201", color: "text-success" },
              { label: "Bounced", value: "249", color: "text-danger" },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-muted/50 rounded-xl text-center">
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Campaign Content</h3>
          <div className="bg-muted/50 rounded-xl p-5">
            <p className="text-sm text-muted-foreground mb-2">Subject: Introducing Our Spring Collection</p>
            <p className="text-sm leading-relaxed">
              Dear Valued Customer,

              We are excited to announce the launch of our new Spring product line! 
              This season brings fresh designs, innovative features, and special launch pricing 
              exclusively for our loyal customers.

              Explore the collection today and enjoy early-bird discounts of up to 20% off.

              Best regards,
              The Klyron Team
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
