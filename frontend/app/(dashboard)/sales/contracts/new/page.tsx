"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FileSignature,
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/date-picker";
import { apiPost, apiGet } from "@/lib/api";

interface CustomerOption {
  id: number;
  name: string;
}

export default function NewContractPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    customer_id: 0,
    value: 0,
    status: "draft",
    start_date: "",
    end_date: "",
    renewal_reminder: true,
  });

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await apiGet<any>("/sales/customers", { per_page: "100" });
        setCustomers((res.items ?? res.data ?? []).map((c: any) => ({ id: c.id, name: c.name })));
      } catch (err) {
        console.error("Failed to load customers:", err);
      }
    }
    loadCustomers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiPost("/sales/contracts", formData);
      router.push("/sales/contracts");
    } catch (err) {
      console.error("Failed to create contract:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span>/</span>
        <Link href="/sales/contracts" className="hover:text-foreground transition-colors">Contracts</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">New Contract</span>
      </div>

      <PageHeader
        title="Create Contract"
        description="Draft a new contract for your customer."
        icon={<FileSignature className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/contracts"
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contracts
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              Contract Details
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Contract Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Enterprise Platform License Agreement"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Customer *</label>
              <select
                name="customer_id"
                required
                value={formData.customer_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contract Value ($)</label>
              <input
                type="number"
                name="value"
                min={0}
                step={0.01}
                value={formData.value || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <DatePicker
                value={formData.start_date}
                onChange={(d) => setFormData((prev) => ({ ...prev, start_date: d }))}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <DatePicker
                value={formData.end_date}
                onChange={(d) => setFormData((prev) => ({ ...prev, end_date: d }))}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  name="renewal_reminder"
                  type="checkbox"
                  checked={formData.renewal_reminder}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted border border-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <span className="text-sm font-medium">Renewal Reminder</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <Link
            href="/sales/contracts"
            className="border border-border bg-muted text-foreground px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-muted/80"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Contract
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
