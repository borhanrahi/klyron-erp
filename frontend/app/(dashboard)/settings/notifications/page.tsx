"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Bell,
  Save,
  Mail,
  Smartphone,
  Monitor,
  Check,
} from "lucide-react";

const notificationModules = [
  {
    module: "Finance",
    notifications: [
      { name: "Invoice created", description: "When a new invoice is generated" },
      { name: "Payment received", description: "When a customer makes a payment" },
      { name: "Invoice overdue", description: "When an invoice passes its due date" },
    ],
  },
  {
    module: "HR",
    notifications: [
      { name: "Leave request", description: "When an employee submits a leave request" },
      { name: "Payroll processed", description: "When monthly payroll is completed" },
      { name: "New employee joined", description: "When a new hire is onboarded" },
    ],
  },
  {
    module: "Sales",
    notifications: [
      { name: "New lead assigned", description: "When a lead is assigned to you" },
      { name: "Deal closed", description: "When a deal is marked as won" },
      { name: "Pipeline update", description: "When a deal moves stages" },
    ],
  },
  {
    module: "Inventory",
    notifications: [
      { name: "Low stock alert", description: "When item stock falls below minimum" },
      { name: "Stock received", description: "When inventory is restocked" },
      { name: "Order shipped", description: "When a customer order is dispatched" },
    ],
  },
  {
    module: "CRM",
    notifications: [
      { name: "New inquiry", description: "When a customer submits an inquiry" },
      { name: "Campaign completed", description: "When a campaign finishes running" },
      { name: "Follow-up due", description: "When a scheduled follow-up is due" },
    ],
  },
  {
    module: "System",
    notifications: [
      { name: "Security alerts", description: "Suspicious activity or failed logins" },
      { name: "Backup completed", description: "When system backup finishes" },
      { name: "System updates", description: "When new features or patches are released" },
    ],
  },
];

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState<Record<string, { email: boolean; push: boolean; inApp: boolean }>>({});

  const getPref = (key: string) => preferences[key] || { email: true, push: true, inApp: true };

  const togglePref = (key: string, channel: "email" | "push" | "inApp") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: {
        ...getPref(key),
        [channel]: !getPref(key)[channel],
      },
    }));
  };

  const toggleModule = (module: string, notifications: { name: string }[], channel: "email" | "push" | "inApp") => {
    const updates: Record<string, { email: boolean; push: boolean; inApp: boolean }> = {};
    const allEnabled = notifications.every((n) => getPref(`${module}:${n.name}`)[channel]);
    notifications.forEach((n) => {
      updates[`${module}:${n.name}`] = {
        ...getPref(`${module}:${n.name}`),
        [channel]: !allEnabled,
      };
    });
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Notification Preferences"
        description="Control how and when you receive notifications across modules."
        icon={<Bell className="h-6 w-6 text-primary" />}
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Notifications" },
        ]}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        }
      />

      {/* Global Toggles */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Global Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { channel: "email" as const, label: "Email Notifications", icon: Mail, description: "Receive notifications via email" },
            { channel: "push" as const, label: "Push Notifications", icon: Smartphone, description: "Browser and mobile push alerts" },
            { channel: "inApp" as const, label: "In-App Notifications", icon: Monitor, description: "Notifications within the app" },
          ].map((item) => {
            const allEnabled = notificationModules.every((mod) =>
              mod.notifications.every((n) => getPref(`${mod.module}:${n.name}`)[item.channel])
            );
            return (
              <label
                key={item.channel}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${allEnabled ? "bg-primary" : "bg-muted"} relative cursor-pointer`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${allEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Per-Module Notifications */}
      {notificationModules.map((mod) => (
        <div key={mod.module} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{mod.module}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Notification</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </div>
                  </th>
                  <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      Push
                    </div>
                  </th>
                  <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Monitor className="h-3 w-3" />
                      In-App
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {mod.notifications.map((notification) => {
                  const key = `${mod.module}:${notification.name}`;
                  const pref = getPref(key);
                  return (
                    <tr key={notification.name} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium">{notification.name}</p>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                      </td>
                      {(["email", "push", "inApp"] as const).map((channel) => (
                        <td key={channel} className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePref(key, channel)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              pref[channel]
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {pref[channel] && <Check className="h-4 w-4" />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
