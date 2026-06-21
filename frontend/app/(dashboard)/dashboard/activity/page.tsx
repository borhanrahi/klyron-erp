"use client";

import { PageHeader } from "@/components/common/PageHeader";
import {
  Activity,
  UserPlus,
  ShoppingCart,
  FileText,
  Settings,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "user",
    title: "New team member joined",
    description: "Sarah Chen has been added to the Design team",
    time: "2 minutes ago",
    icon: UserPlus,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    type: "order",
    title: "New sales order created",
    description: "Order #SO-2024-001 from Acme Corp - $12,500",
    time: "15 minutes ago",
    icon: ShoppingCart,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 3,
    type: "document",
    title: "Invoice generated",
    description: "Invoice #INV-2024-045 ready for review",
    time: "1 hour ago",
    icon: FileText,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    id: 4,
    type: "system",
    title: "System update completed",
    description: "All modules updated to latest version",
    time: "2 hours ago",
    icon: Settings,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 5,
    type: "message",
    title: "New comment on task",
    description: "Mike Johnson commented on 'API integration'",
    time: "3 hours ago",
    icon: MessageSquare,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: 6,
    type: "task",
    title: "Task completed",
    description: "User onboarding flow finished by Emily Davis",
    time: "5 hours ago",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 7,
    type: "alert",
    title: "Inventory low stock alert",
    description: "Product SKU-001 below minimum threshold",
    time: "6 hours ago",
    icon: AlertCircle,
    color: "text-danger",
    bgColor: "bg-danger/10",
  },
];

const activityPulse = {
  eventsToday: 47,
  eventsThisWeek: 284,
  peakHour: "10:00 AM",
  avgResponseTime: "2.3 min",
};

const activeUsers = [
  { name: "Sarah Chen", activity: 12, status: "online", avatar: "SC" },
  { name: "Mike Johnson", activity: 8, status: "online", avatar: "MJ" },
  { name: "David Park", activity: 6, status: "away", avatar: "DP" },
  { name: "Emily Davis", activity: 4, status: "online", avatar: "ED" },
];

export default function ActivityFeedPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Dashboards</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Activity Feed
        </span>
      </div>

      <PageHeader
        title="Activity Feed"
        description="Real-time chronologies of system events across your ERP."
        icon={<Activity className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Timeline */}
        <div className="xl:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

            {/* Feed Items */}
            <div className="space-y-6">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div className={`absolute left-3.5 top-1 w-3 h-3 rounded-full ${activity.bgColor} border-2 border-card`} />
                    
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-xl ${activity.bgColor}`}>
                        <Icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold">{activity.title}</h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="xl:col-span-4 space-y-6">
          {/* Activity Pulse */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Activity Pulse</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-primary">{activityPulse.eventsToday}</p>
                <p className="text-xs text-muted-foreground mt-1">Events Today</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-success">{activityPulse.eventsThisWeek}</p>
                <p className="text-xs text-muted-foreground mt-1">This Week</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-warning">{activityPulse.peakHour}</p>
                <p className="text-xs text-muted-foreground mt-1">Peak Hour</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-accent">{activityPulse.avgResponseTime}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Response</p>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Active Users</h3>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {user.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                      user.status === "online" ? "bg-success" : "bg-warning"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.activity} actions today</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-success/10">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">All Systems Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">API Response: 45ms</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium">Uptime: 99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
