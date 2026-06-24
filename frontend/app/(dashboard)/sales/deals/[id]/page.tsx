"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  TrendingUp,
  ArrowLeft,
  Save,
  Trash2,
  Target,
  DollarSign,
  Percent,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";

interface Deal {
  id: number;
  title: string;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expected_close: string | null;
  status: string;
  created_at: string;
}

function mapStageVariant(stage: string) {
  const s = (stage || "").toLowerCase();
  if (s === "closed_won" || s === "won") return "success" as const;
  if (s === "negotiation" || s === "proposal") return "warning" as const;
  if (s === "closed_lost" || s === "lost") return "danger" as const;
  if (s === "qualification") return "muted" as const;
  return "primary" as const;
}

function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}`;
  }
}

export default function DealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    value: 0,
    currency: "USD",
    stage: "",
    probability: 0,
    expected_close: "",
    status: "",
  });
  const { confirm, state, handleClose } = useConfirm();

  useEffect(() => {
    async function fetchDeal() {
      try {
        const data = await apiGet<{ data: Deal }>(`/sales/deals/${id}`);
        const dealData = data.data;
        setDeal(dealData);
        setFormData({
          title: dealData.title ?? "",
          value: dealData.value ?? 0,
          currency: dealData.currency ?? "USD",
          stage: dealData.stage ?? "",
          probability: dealData.probability ?? 0,
          expected_close: dealData.expected_close ?? "",
          status: dealData.status ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch deal:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeal();
  }, [id]);

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPut(`/sales/deals/${id}`, formData);
      setDeal({ ...deal!, ...formData });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update deal:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const ok = await confirm("Are you sure you want to delete this deal?");
    if (!ok) return;
    try {
      await apiDelete(`/sales/deals/${id}`);
      router.push("/sales/deals");
    } catch (err) {
      console.error("Failed to delete deal:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading deal...</span>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-20 text-muted-foreground">Deal not found.</div>
    );
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
          Deal Details
        </span>
      </div>

      <PageHeader
        title="Deal Details"
        description="View and manage deal information."
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/sales/deals"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Deals
            </Link>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="border border-danger/30 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />

      {editing ? (
        <form onSubmit={handleSave}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-primary" />
              Edit Deal
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

          <div className="flex items-center justify-end gap-3 mt-6 pb-8">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormData({
                  title: deal.title,
                  value: deal.value,
                  currency: deal.currency,
                  stage: deal.stage,
                  probability: deal.probability,
                  expected_close: deal.expected_close ?? "",
                  status: deal.status,
                });
              }}
              className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
            >
              Cancel
            </button>
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
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{deal.title}</h2>
                  <StatusBadge
                    status={deal.stage.replace(/_/g, " ")}
                    variant={mapStageVariant(deal.stage)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Created: {deal.created_at ? new Date(deal.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Deal Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Value</span>
                  <span className="text-lg font-bold text-success">
                    {formatCurrency(deal.value, deal.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Probability</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{deal.probability}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Currency</span>
                  <span className="text-sm font-medium">{deal.currency}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge
                    status={deal.status}
                    variant={
                      deal.status === "won"
                        ? "success"
                        : deal.status === "lost"
                          ? "danger"
                          : "info"
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm text-muted-foreground">Expected Close</span>
                  <span className="text-sm font-medium">
                    {deal.expected_close
                      ? new Date(deal.expected_close).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
