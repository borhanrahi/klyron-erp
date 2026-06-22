"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Settings,
  Save,
  Clock,
  Calendar,
  DollarSign,
  Shield,
  Bell,
} from "lucide-react";

const tabs = [
  { id: "attendance", label: "Attendance Policy", icon: Clock },
  { id: "leave", label: "Leave Types", icon: Calendar },
  { id: "payroll", label: "Payroll Policy", icon: DollarSign },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const leaveTypes = [
  { name: "Annual Leave", days: 20, carryForward: true, maxCarry: 5, paid: true },
  { name: "Sick Leave", days: 10, carryForward: false, maxCarry: 0, paid: true },
  { name: "Personal Leave", days: 5, carryForward: false, maxCarry: 0, paid: true },
  { name: "Maternity Leave", days: 90, carryForward: false, maxCarry: 0, paid: true },
  { name: "Paternity Leave", days: 14, carryForward: false, maxCarry: 0, paid: true },
  { name: "Bereavement Leave", days: 5, carryForward: false, maxCarry: 0, paid: true },
  { name: "Unpaid Leave", days: 0, carryForward: false, maxCarry: 0, paid: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="HR Settings"
        description="Configure attendance, payroll, and leave policies."
        icon={<Settings className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        }
      />

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {activeTab === "attendance" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Attendance Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Work Hours Per Day</label>
              <input type="number" defaultValue={8} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Work Days Per Week</label>
              <input type="number" defaultValue={5} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Grace Period (minutes)</label>
              <input type="number" defaultValue={15} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Half Day Threshold (hours)</label>
              <input type="number" defaultValue={4} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Overtime Rate Multiplier</label>
              <input type="number" step="0.1" defaultValue={1.5} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Max Overtime Hours/Week</label>
              <input type="number" defaultValue={20} className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm">Enable biometric attendance tracking</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm">Allow remote check-in/out</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === "leave" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold">Leave Types</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <span className="text-lg">+</span> Add Leave Type
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Leave Type</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Days/Year</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Carry Forward</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Max Carry</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Paid</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {leaveTypes.map((leave) => (
                  <tr key={leave.name} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{leave.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{leave.days || "Unlimited"}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`text-sm ${leave.carryForward ? 'text-success' : 'text-muted-foreground'}`}>
                        {leave.carryForward ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{leave.maxCarry} days</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${leave.paid ? 'text-success' : 'text-danger'}`}>
                        {leave.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-sm text-primary hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "payroll" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Payroll Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Pay Frequency</label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Monthly</option>
                <option>Bi-Weekly</option>
                <option>Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Pay Day</label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Last working day of month</option>
                <option>1st of every month</option>
                <option>15th of every month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Currency</label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Tax Method</label>
              <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Progressive</option>
                <option>Flat Rate</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm">Auto-generate payslips on payroll completion</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm">Send payslip emails to employees</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Require 2FA for HR admin access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <p className="text-sm font-medium">Data Encryption</p>
                <p className="text-xs text-muted-foreground">Encrypt sensitive employee data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <p className="text-sm font-medium">Audit Logging</p>
                <p className="text-xs text-muted-foreground">Log all HR data access and changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <p className="text-sm font-medium">Session Timeout</p>
                <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <select className="px-3 py-2 bg-card text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>4 hours</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Notification Settings</h3>
          <div className="space-y-4">
            {[
              { label: "Leave request notifications", description: "Notify managers when leave requests are submitted" },
              { label: "Attendance alerts", description: "Alert when employees are absent or late" },
              { label: "Payroll completion", description: "Notify when payroll processing is complete" },
              { label: "Birthday reminders", description: "Send birthday wishes to employees" },
              { label: "Work anniversary", description: "Celebrate employee work anniversaries" },
              { label: "Certification expiry", description: "Alert before certifications expire" },
              { label: "Review reminders", description: "Remind managers about upcoming reviews" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
