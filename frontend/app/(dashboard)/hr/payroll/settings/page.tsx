"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import {
  Settings,
  Save,
  Calculator,
  Shield,
  Clock,
} from "lucide-react";

interface PayrollPolicy {
  id?: number;
  name: string;
  pay_frequency: string;
  pay_day: number;
  tax_calculation: string;
  overtime_rate_multiplier: number;
  pf_enabled: boolean;
  pf_percentage: number;
  is_active: boolean;
}

interface PolicyListResponse {
  items: PayrollPolicy[];
  total: number;
}

export default function PayrollSettingsPage() {
  const [policy, setPolicy] = useState<PayrollPolicy>({
    name: "Default Policy",
    pay_frequency: "monthly",
    pay_day: 1,
    tax_calculation: "auto",
    overtime_rate_multiplier: 1.5,
    pf_enabled: false,
    pf_percentage: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<PolicyListResponse>("/hr/payroll-policies", { per_page: "1" })
      .then((res) => {
        if (res.items && res.items.length > 0) {
          setPolicy(res.items[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (policy.id) {
        await apiPut(`/hr/payroll-policies/${policy.id}`, policy);
      } else {
        await apiPost("/hr/payroll-policies", policy);
      }
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
            disabled={saving || loading}
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
              <label className="block text-sm font-medium mb-1.5">Policy Name</label>
              <input
                type="text"
                value={policy.name}
                onChange={(e) => setPolicy({ ...policy, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Pay Frequency</label>
              <select
                value={policy.pay_frequency}
                onChange={(e) => setPolicy({ ...policy, pay_frequency: e.target.value })}
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
                value={policy.pay_day}
                onChange={(e) => setPolicy({ ...policy, pay_day: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tax Calculation</label>
              <select
                value={policy.tax_calculation}
                onChange={(e) => setPolicy({ ...policy, tax_calculation: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="auto">Automatic</option>
                <option value="manual">Manual</option>
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
                value={policy.overtime_rate_multiplier}
                onChange={(e) => setPolicy({ ...policy, overtime_rate_multiplier: Number(e.target.value) })}
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
                checked={policy.pf_enabled}
                onChange={(e) => setPolicy({ ...policy, pf_enabled: e.target.checked })}
                className="rounded border-border"
              />
              <div>
                <p className="text-sm font-medium">Enable Provident Fund Deduction</p>
                <p className="text-xs text-muted-foreground">Automatically deduct PF from employee salary</p>
              </div>
            </label>

            {policy.pf_enabled && (
              <div className="pl-6">
                <label className="block text-sm font-medium mb-1.5">PF Percentage (%)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  value={policy.pf_percentage}
                  onChange={(e) => setPolicy({ ...policy, pf_percentage: Number(e.target.value) })}
                  className="w-48 px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
