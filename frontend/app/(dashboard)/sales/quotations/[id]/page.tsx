"use client";

import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  ArrowLeft,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { useRouter } from "next/navigation";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";

interface QuotationItem {
  id: number;
  item_id: number;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

interface Quotation {
  id: number;
  quote_number: string;
  customer_id: number;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  expiry: string | null;
  created_at: string;
  items: QuotationItem[];
}

function mapStatusVariant(status: string): "success" | "warning" | "danger" | "info" | "primary" | "muted" {
  const s = (status || "").toLowerCase();
  if (s === "accepted" || s === "completed") return "success";
  if (s === "sent" || s === "pending") return "warning";
  if (s === "rejected" || s === "cancelled") return "danger";
  if (s === "expired") return "muted";
  return "info";
}

export default function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    quote_number: "",
    customer_id: 0,
    status: "",
    date: "",
    expiry: "",
  });
  const { confirm, state, handleClose } = useConfirm();

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const res = await apiGet<{ data: Quotation }>(`/sales/quotations/${id}`);
        const q = res.data;
        setQuotation(q);
        setForm({
          quote_number: q.quote_number,
          customer_id: q.customer_id,
          status: q.status,
          date: q.date,
          expiry: q.expiry ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch quotation:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotation();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await apiPut(`/sales/quotations/${id}`, form);
      setQuotation((prev) => (prev ? { ...prev, ...form } : prev));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update quotation:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const ok = await confirm("Are you sure you want to delete this quotation?");
    if (!ok) return;
    try {
      await apiDelete(`/sales/quotations/${id}`);
      router.push("/sales/quotations");
    } catch (err) {
      console.error("Failed to delete quotation:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading quotation...</span>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Quotation not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <Link
        href="/sales/quotations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Quotations
      </Link>

      <PageHeader
        title="Quotation Details"
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-danger/30 bg-danger/10 text-danger rounded-lg font-medium hover:bg-danger/20 transition-all flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold">{quotation.quote_number}</h2>
          <StatusBadge
            status={quotation.status}
            variant={mapStatusVariant(quotation.status)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Quote Number</label>
            {editing ? (
              <input
                type="text"
                value={form.quote_number}
                onChange={(e) => setForm((f) => ({ ...f, quote_number: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{quotation.quote_number}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Customer ID</label>
            {editing ? (
              <input
                type="number"
                value={form.customer_id || ""}
                onChange={(e) => setForm((f) => ({ ...f, customer_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{quotation.customer_id}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            {editing ? (
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            ) : (
              <StatusBadge
                status={quotation.status}
                variant={mapStatusVariant(quotation.status)}
              />
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Date</label>
            {editing ? (
              <DatePicker
                value={form.date}
                onChange={(d) => setForm((f) => ({ ...f, date: d }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{quotation.date}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Expiry Date</label>
            {editing ? (
              <DatePicker
                value={form.expiry}
                onChange={(d) => setForm((f) => ({ ...f, expiry: d }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{quotation.expiry ?? "N/A"}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Item ID
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Qty
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Price
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Tax
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(quotation.items ?? []).map((item) => (
                <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{item.item_id}</td>
                  <td className="py-3 px-4 text-right text-sm">{item.qty}</td>
                  <td className="py-3 px-4 text-right text-sm">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 text-right text-sm">${item.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border">
                <td colSpan={4} className="py-3 px-4 text-right text-sm text-muted-foreground">Subtotal</td>
                <td className="py-3 px-4 text-right text-sm font-semibold">${quotation.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right text-sm text-muted-foreground">Tax</td>
                <td className="py-3 px-4 text-right text-sm font-semibold">${quotation.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-t border-border bg-muted/30">
                <td colSpan={4} className="py-3 px-4 text-right text-sm font-bold">Total</td>
                <td className="py-3 px-4 text-right text-lg font-bold text-primary">${quotation.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
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
