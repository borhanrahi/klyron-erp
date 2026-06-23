"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiPost } from "@/lib/api";
import {
  DollarSign,
  ArrowLeft,
  Save,
  Loader2,
  Calculator,
} from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function NewBudgetPage() {
  const router = useRouter();
  const [departmentId, setDepartmentId] = useState("");
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());
  const [allocated, setAllocated] = useState("");
  const [saving, setSaving] = useState(false);

  const allocatedNum = parseFloat(allocated) || 0;

  async function handleSubmit() {
    if (!fiscalYear || allocatedNum <= 0) return alert("Please fill in fiscal year and allocated amount.");
    setSaving(true);
    try {
      await apiPost("/finance/budgets", {
        department_id: departmentId ? parseInt(departmentId) : undefined,
        fiscal_year: parseInt(fiscalYear),
        allocated: allocatedNum,
        spent: 0,
        remaining: allocatedNum,
      });
      router.push("/finance/budgets");
    } catch {
      alert("Failed to create budget.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => router.push("/finance/budgets")}
        >
          Budgets
        </span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Budget
        </span>
      </div>

      <PageHeader
        title="Create Budget"
        description="Set up a new department budget for a fiscal year."
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.push("/finance/budgets")}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Budget Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Fiscal Year *
                </label>
                <input
                  type="number"
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Department ID
                </label>
                <input
                  type="number"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Allocated Amount *
                </label>
                <input
                  type="number"
                  value={allocated}
                  onChange={(e) => setAllocated(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" /> Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fiscal Year</span>
                <span className="font-medium">{fiscalYear || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{departmentId || "All"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Allocated</span>
                <span className="font-medium">{fmt(allocatedNum)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">{fmt(0)}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold">Remaining</span>
                  <span className="text-xl font-bold text-primary">
                    {fmt(allocatedNum)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving || !fiscalYear || allocatedNum <= 0}
              className="w-full mt-6 bg-primary text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
