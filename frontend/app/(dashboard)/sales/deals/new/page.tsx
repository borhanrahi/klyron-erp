"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  TrendingUp,
  ArrowLeft,
  Save,
  Target,
  DollarSign,
  Percent,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function NewDealPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    value: 0,
    currency: "USD",
    stage: "prospecting",
    probability: 0,
    expected_close: "",
    status: "open",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value" || name === "probability" ? Number(value) : value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/sales/deals", formData);
      router.push("/sales/deals");
    } catch (err) {
      console.error("Failed to create deal:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span>/</span>
        <Link href="/sales/deals" className="hover:text-foreground transition-colors">
          Deals
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Deal
        </span>
      </div>

      <PageHeader
        title="Add Deal"
        description="Add a new opportunity to your sales pipeline."
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/deals"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Deals
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-primary" />
            Deal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Enterprise Platform Migration"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type="number"
                name="value"
                min="0"
                value={formData.value}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="prospecting">Prospecting</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Probability (%)</label>
              <input
                type="number"
                name="probability"
                min="0"
                max="100"
                value={formData.probability}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expected Close Date</label>
              <DatePicker
                value={formData.expected_close}
                onChange={(d) => setFormData((prev) => ({ ...prev, expected_close: d }))}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="open">Open</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-8 mt-6">
          <Link
            href="/sales/deals"
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Create Deal
          </button>
        </div>
      </form>
    </div>
  );
}
