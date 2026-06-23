"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  Calendar,
  DollarSign,
  Building2,
  Bell,
  Loader2,
  FileSignature,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPut, apiDelete } from "@/lib/api";

interface Contract {
  id: number;
  title: string;
  customer_id: number;
  value: number;
  status: string;
  start_date: string;
  end_date: string;
  renewal_reminder: boolean;
  created_at: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function mapStatusVariant(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "success" as const;
  if (s === "pending" || s === "draft") return "warning" as const;
  if (s === "expired" || s === "cancelled" || s === "terminated") return "danger" as const;
  return "info" as const;
}

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    customer_id: 0,
    value: 0,
    status: "",
    start_date: "",
    end_date: "",
    renewal_reminder: false,
  });

  useEffect(() => {
    async function fetchContract() {
      try {
        const res = await apiGet<{ data: Contract }>(`/sales/contracts/${id}`);
        const c = res.data;
        setContract(c);
        setFormData({
          title: c.title ?? "",
          customer_id: c.customer_id ?? 0,
          value: c.value ?? 0,
          status: c.status ?? "",
          start_date: c.start_date?.slice(0, 10) ?? "",
          end_date: c.end_date?.slice(0, 10) ?? "",
          renewal_reminder: c.renewal_reminder ?? false,
        });
      } catch (err) {
        console.error("Failed to fetch contract:", err);
        setError("Failed to load contract details.");
      } finally {
        setLoading(false);
      }
    }
    fetchContract();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "value" || name === "customer_id"
            ? Number(value)
            : value,
    }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPut(`/sales/contracts/${id}`, formData);
      setContract({ ...contract!, ...formData });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update contract:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this contract?")) return;
    try {
      await apiDelete(`/sales/contracts/${id}`);
      router.push("/sales/contracts");
    } catch (err) {
      console.error("Failed to delete contract:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="space-y-4 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
        <Link
          href="/sales/contracts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contracts
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <FileSignature className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{error || "Contract not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-5xl mx-auto">
      <Link
        href="/sales/contracts"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contracts
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {editing ? (
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-muted border border-border rounded-lg px-3 py-1 text-2xl font-bold w-full"
                />
              ) : (
                contract.title
              )}
            </h1>
            <StatusBadge
              status={editing ? formData.status : contract.status}
              variant={mapStatusVariant(editing ? formData.status : contract.status)}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Contract #{contract.id} • Customer #{contract.customer_id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="border border-danger/30 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Contract Value</p>
          <p className="text-2xl font-bold mt-1">
            {editing ? (
              <input
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                className="bg-muted border border-border rounded-lg px-3 py-1 text-2xl font-bold w-full"
              />
            ) : (
              formatCurrency(contract.value)
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Customer ID</p>
          <p className="text-2xl font-bold mt-1">
            {editing ? (
              <input
                name="customer_id"
                type="number"
                value={formData.customer_id}
                onChange={handleChange}
                className="bg-muted border border-border rounded-lg px-3 py-1 text-2xl font-bold w-full"
              />
            ) : (
              contract.customer_id
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Start Date</p>
          <p className="text-2xl font-bold mt-1">
            {editing ? (
              <DatePicker
                value={formData.start_date}
                onChange={(d) => setFormData((prev) => ({ ...prev, start_date: d }))}
                className="bg-muted border border-border rounded-lg px-3 py-1 text-2xl font-bold w-full"
              />
            ) : (
              formatDate(contract.start_date)
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">End Date</p>
          <p className="text-2xl font-bold mt-1">
            {editing ? (
              <DatePicker
                value={formData.end_date}
                onChange={(d) => setFormData((prev) => ({ ...prev, end_date: d }))}
                className="bg-muted border border-border rounded-lg px-3 py-1 text-2xl font-bold w-full"
              />
            ) : (
              formatDate(contract.end_date)
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contract Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {contract.customer_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contract Period</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(contract.start_date)} — {formatDate(contract.end_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Value</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(contract.value)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">Renewal Reminder</p>
                    <p className="text-xs text-muted-foreground">
                      {contract.renewal_reminder ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  {editing && (
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                      <input
                        name="renewal_reminder"
                        type="checkbox"
                        checked={formData.renewal_reminder}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted border border-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  )}
                </div>
              </div>
              {editing && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <FileSignature className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Status</p>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 w-full bg-card border border-border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract ID</span>
                <span className="font-medium">#{contract.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(contract.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge
                  status={contract.status}
                  variant={mapStatusVariant(contract.status)}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Value</span>
                <span className="font-medium">{formatCurrency(contract.value)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
