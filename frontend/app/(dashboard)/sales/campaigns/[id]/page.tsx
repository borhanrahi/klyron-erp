"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Megaphone,
  ArrowLeft,
  Edit,
  BarChart3,
  Users,
  Mail,
  MousePointerClick,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Clock,
  Eye,
  Send,
  Pause,
  Play,
} from "lucide-react";
import Link from "next/link";

const campaign = {
  id: "CMP-001",
  name: "Q1 Product Launch",
  type: "Email",
  status: "Active",
  statusVariant: "success" as const,
  startDate: "Jan 15, 2024",
  endDate: "Mar 31, 2024",
  description:
    "Multi-touch email campaign to announce our new product features and drive upgrades from free to paid tier.",
  budget: "$15,000",
  spent: "$12,400",
  targetSegment: "Active Free Users",
  targetCount: 12500,
};

const stats = {
  sent: 12500,
  delivered: 12375,
  opened: 4375,
  clicked: 1062,
  conversions: 85,
  unsubscribed: 24,
  bounced: 125,
  revenue: "$42,500",
};

const timeline = [
  {
    id: 1,
    date: "Jan 15, 2024",
    event: "Campaign launched",
    details: "Initial email sent to 12,500 contacts",
  },
  {
    id: 2,
    date: "Jan 22, 2024",
    event: "Follow-up sequence started",
    details: "Second email to non-openers",
  },
  {
    id: 3,
    date: "Feb 1, 2024",
    event: "A/B test results",
    details: "Version B outperformed by 23%",
  },
  {
    id: 4,
    date: "Feb 15, 2024",
    event: "Mid-campaign optimization",
    details: "Adjusted send time based on engagement data",
  },
  {
    id: 5,
    date: "Mar 1, 2024",
    event: "Final push started",
    details: "Last email series to remaining non-converters",
  },
];

export default function CampaignDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      <Link
        href="/sales/campaigns"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <StatusBadge
              status={campaign.status}
              variant={campaign.statusVariant}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {campaign.id} • {campaign.type} Campaign • {campaign.startDate} —{" "}
            {campaign.endDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View Report
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <Pause className="h-4 w-4" />
            Pause
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Next Email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Send className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Sent</span>
          </div>
          <p className="text-xl font-bold">{stats.sent.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Delivered</span>
          </div>
          <p className="text-xl font-bold">
            {stats.delivered.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-info" />
            <span className="text-xs text-muted-foreground">Opened</span>
          </div>
          <p className="text-xl font-bold">{stats.opened.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {((stats.opened / stats.delivered) * 100).toFixed(1)}% rate
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground">Clicked</span>
          </div>
          <p className="text-xl font-bold">{stats.clicked.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {((stats.clicked / stats.opened) * 100).toFixed(1)}% rate
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Conversions</span>
          </div>
          <p className="text-xl font-bold text-success">
            {stats.conversions}
          </p>
          <p className="text-xs text-muted-foreground">
            {((stats.conversions / stats.clicked) * 100).toFixed(1)}% rate
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <p className="text-xl font-bold">{stats.revenue}</p>
          <p className="text-xs text-success">
            {((parseFloat(stats.revenue.replace(/[$,]/g, "")) /
              parseFloat(campaign.spent.replace(/[$,]/g, ""))) *
              100)
              .toFixed(0)}
            % ROI
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Budget</span>
          </div>
          <p className="text-xl font-bold">
            {campaign.spent} / {campaign.budget}
          </p>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-primary rounded-full"
              style={{
                width: `${
                  (parseFloat(campaign.spent.replace(/[$,]/g, "")) /
                    parseFloat(campaign.budget.replace(/[$,]/g, ""))) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Campaign Overview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {campaign.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Target Segment</p>
                <p className="text-sm font-medium mt-1">
                  {campaign.targetSegment}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  Target Audience Size
                </p>
                <p className="text-sm font-medium mt-1">
                  {campaign.targetCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Engagement Funnel</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    label: "Sent",
                    value: stats.sent,
                    color: "bg-primary",
                  },
                  {
                    label: "Delivered",
                    value: stats.delivered,
                    color: "bg-info",
                  },
                  {
                    label: "Opened",
                    value: stats.opened,
                    color: "bg-success",
                  },
                  {
                    label: "Clicked",
                    value: stats.clicked,
                    color: "bg-warning",
                  },
                  {
                    label: "Converted",
                    value: stats.conversions,
                    color: "bg-success",
                  },
                ].map((step) => (
                  <div key={step.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        {step.label}
                      </span>
                      <span className="text-sm font-medium">
                        {step.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${step.color} rounded-full`}
                        style={{
                          width: `${(step.value / stats.sent) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Campaign Timeline</h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {timeline.map((event) => (
                  <div key={event.id} className="relative pl-12">
                    <div className="absolute left-3.5 top-1 w-3 h-3 rounded-full bg-card border-2 border-primary" />
                    <div className="p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{event.event}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.date}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Test Email
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Users className="h-4 w-4" />
                View Recipients
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
