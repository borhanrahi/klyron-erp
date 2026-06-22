"use client";

import { useEffect, useState, useMemo } from "react";
import { apiGet } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Activity,
  UserPlus,
  FileText,
  Settings,
  AlertCircle,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface ActivityItem {
  id: number;
  action: string;
  entity: string;
  entity_id: number;
  user_id: number;
  timestamp: string;
  icon: string;
  color: string;
  details: Record<string, unknown>;
}

interface Pulse {
  events_today: number;
  events_this_week: number;
}

interface ActiveUser {
  id: number;
  name: string;
  activity_count: number;
}

interface ActivityResponse {
  data: {
    activities: ActivityItem[];
    pulse: Pulse;
    active_users: ActiveUser[];
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plus: UserPlus,
  edit: FileText,
  trash: AlertCircle,
  "log-in": Settings,
  activity: Activity,
};

const colorMap: Record<string, { text: string; bg: string }> = {
  success: { text: "text-success", bg: "bg-success/10" },
  info: { text: "text-info", bg: "bg-info/10" },
  danger: { text: "text-danger", bg: "bg-danger/10" },
  primary: { text: "text-primary", bg: "bg-primary/10" },
  muted: { text: "text-muted-foreground", bg: "bg-muted" },
};

const verbMap: Record<string, string> = {
  create: "Created",
  edit: "Updated",
  delete: "Deleted",
  "log-in": "Logged in",
  activity: "Activity on",
};

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs} seconds ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pulse, setPulse] = useState<Pulse>({ events_today: 0, events_this_week: 0 });
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<ActivityResponse>("/dashboard/activity")
      .then((res) => {
        setActivities(res.data.activities);
        setPulse(res.data.pulse);
        setActiveUsers(res.data.active_users);
      })
      .catch((err) => setError(err?.message ?? "Failed to load activity"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading activity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-danger">
        <AlertTriangle className="h-6 w-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
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
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {activities.map((item) => {
                const Icon = iconMap[item.icon] ?? Activity;
                const c = colorMap[item.color] ?? colorMap.muted;
                const verb = verbMap[item.action] ?? item.action;

                return (
                  <div key={item.id} className="relative pl-12">
                    <div className={`absolute left-3.5 top-1 w-3 h-3 rounded-full ${c.bg} border-2 border-card`} />

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-xl ${c.bg}`}>
                        <Icon className={`h-5 w-5 ${c.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold">
                            {verb} {item.entity} #{item.entity_id}
                          </h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relativeTime(item.timestamp)}
                          </span>
                        </div>
                        {Boolean(item.details?.seeded) && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Seeded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          {/* Activity Pulse */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Activity Pulse</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-primary">{pulse.events_today}</p>
                <p className="text-xs text-muted-foreground mt-1">Events Today</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-success">{pulse.events_this_week}</p>
                <p className="text-xs text-muted-foreground mt-1">This Week</p>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Active Users</h3>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {getInitials(user.name)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card bg-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.activity_count} actions today</p>
                  </div>
                </div>
              ))}
              {activeUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No active users</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
