"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPut } from "@/lib/api";
import {
  Megaphone,
  ArrowLeft,
  Save,
  Users,
  Target,
  Loader2,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  target_audience: string;
}

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
  });

  useEffect(() => {
    apiGet<{ data: Campaign }>(`/sales/campaigns/${id}`)
      .then((res) => {
        const c = res.data;
        setFormData({
          name: c.name ?? "",
          type: c.type ?? "",
          budget: c.budget ? String(c.budget) : "",
          startDate: c.start_date ?? "",
          endDate: c.end_date ?? "",
          targetAudience: c.target_audience ?? "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) return;
    setSaving(true);
    try {
      await apiPut(`/sales/campaigns/${id}`, {
        name: formData.name,
        type: formData.type,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        target_audience: formData.targetAudience,
      });
      router.push(`/sales/campaigns/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span>/</span>
        <Link href="/sales/campaigns" className="hover:text-foreground transition-colors">Campaigns</Link>
        <span>/</span>
        <Link href={`/sales/campaigns/${id}`} className="hover:text-foreground transition-colors">#{id}</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Edit</span>
      </div>

      <PageHeader
        title="Edit Campaign"
        description="Update campaign details."
        icon={<Megaphone className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href={`/sales/campaigns/${id}`}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{error}</div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Campaign Details
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Campaign Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">Select type</option>
              <option value="email">Email Marketing</option>
              <option value="social">Social Media</option>
              <option value="event">Event / Webinar</option>
              <option value="referral">Referral Program</option>
              <option value="paid">Paid Advertising</option>
              <option value="banner">Banner / Display</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              min="0"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <DatePicker
              value={formData.startDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, startDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <DatePicker
              value={formData.endDate}
              onChange={(d) => setFormData((prev) => ({ ...prev, endDate: d }))}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href={`/sales/campaigns/${id}`}
          className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          disabled={saving || !formData.name || !formData.type}
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
