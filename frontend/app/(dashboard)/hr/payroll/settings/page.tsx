"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Settings,
  Save,
  Calculator,
  Shield,
  Clock,
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";

export default function PayrollSettingsPage() {
  const [settings, setSettings] = useState({
    payFrequency: "monthly",
    payDay: 1,
    taxCalculation: "auto",
    overtimeRate: 1.5,
    pfEnabled: false,
    pfPercentage: 0,
    autoGenerate: false,
    currency: "USD",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app this would save to the backend
      await new Promise((r) => setTimeout(r, 500));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Settings"
        description="Configure payroll policies, tax calculations, and processing rules."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Settings" },
        ]}
        icon={<Settings className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        }
      />

      {/* General Settings */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            General Settings
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Pay Frequency</label>
              <select
                value={settings.payFrequency}
                onChange={(e) => setSettings({ ...settings, payFrequency: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Pay Day (Day of Month)</label>
              <input
                type="number"
                min={1}
                max={31}
                value={settings.payDay}
                onChange={(e) => setSettings({ ...settings, payDay: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tax Calculation</label>
              <select
                value={settings.taxCalculation}
                onChange={(e) => setSettings({ ...settings, taxCalculation: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="auto">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BDT">BDT (৳)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overtime Settings */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Overtime Settings
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Overtime Rate Multiplier</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="3"
                value={settings.overtimeRate}
                onChange={(e) => setSettings({ ...settings, overtimeRate: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">e.g., 1.5 = 150% of hourly rate for OT hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Provident Fund */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Provident Fund / Retirement
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pfEnabled}
                onChange={(e) => setSettings({ ...settings, pfEnabled: e.target.checked })}
                className="rounded border-border"
              />
              <div>
                <p className="text-sm font-medium">Enable Provident Fund Deduction</p>
                <p className="text-xs text-muted-foreground">Automatically deduct PF from employee salary</p>
              </div>
            </label>

            {settings.pfEnabled && (
              <div className="pl-6">
                <label className="block text-sm font-medium mb-1.5">PF Percentage (%)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  value={settings.pfPercentage}
                  onChange={(e) => setSettings({ ...settings, pfPercentage: Number(e.target.value) })}
                  className="w-48 px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-generation */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Automation</h3>
        </div>
        <div className="p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoGenerate}
              onChange={(e) => setSettings({ ...settings, autoGenerate: e.target.checked })}
              className="rounded border-border"
            />
            <div>
              <p className="text-sm font-medium">Auto-generate payroll on pay day</p>
              <p className="text-xs text-muted-foreground">Automatically run payroll calculation on the configured pay day each month</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
