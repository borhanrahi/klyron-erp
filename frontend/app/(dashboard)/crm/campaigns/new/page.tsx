"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Megaphone,
  ArrowLeft,
  Save,
  Mail,
  MessageSquare,
  Send,
  Users,
  Calendar,
  Target,
  FileText,
} from "lucide-react";

const campaignTypes = ["Email", "SMS", "Push Notification", "Social Media"];
const audiences = ["All Customers", "Active Subscribers", "Inactive Users", "New Users (30 days)", "VIP Customers", "Custom Segment"];

export default function NewCampaignPage() {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Create Campaign"
        description="Set up a new marketing campaign to reach your audience."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Campaigns", href: "/crm/campaigns" },
          { label: "New Campaign" },
        ]}
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        actions={
          <a
            href="/crm/campaigns"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </a>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "details", label: "Campaign Details" },
          { id: "audience", label: "Audience" },
          { id: "content", label: "Content" },
          { id: "schedule", label: "Schedule" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Campaign Details Tab */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Spring Product Launch"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                      Campaign Type *
                    </label>
                    <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="">Select type</option>
                      {campaignTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                      Budget
                    </label>
                    <input
                      type="text"
                      placeholder="$0.00"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the campaign..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Campaign Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Type", value: "Not selected" },
                  { label: "Audience", value: "Not selected" },
                  { label: "Budget", value: "$0.00" },
                  { label: "Schedule", value: "Not set" },
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
              Create Campaign
            </button>
          </div>
        </div>
      )}

      {/* Audience Tab */}
      {activeTab === "audience" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Select Target Audience</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {audiences.map((audience) => (
              <label
                key={audience}
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors"
              >
                <input type="radio" name="audience" className="accent-primary" />
                <div>
                  <p className="text-sm font-medium">{audience}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(Math.random() * 5000 + 1000).toLocaleString()} contacts
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Campaign Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Subject Line *
              </label>
              <input
                type="text"
                placeholder="Enter email subject line..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Preview Text
              </label>
              <input
                type="text"
                placeholder="Text shown after subject in inbox..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Message Body *
              </label>
              <textarea
                rows={10}
                placeholder="Write your campaign message..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Schedule Campaign</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Send Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <input type="checkbox" className="accent-primary" />
              <span className="text-sm">Send immediately after creation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
