"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { FileText, ArrowLeft, Save, Loader2, DollarSign } from "lucide-react";

interface Customer {
  id: number;
  name?: string;
  company_name?: string;
  [key: string]: unknown;
}

export default function NewCreditNotePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [creditNumber] = useState(`CN-${Date.now()}`);
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<{ items: Customer[] }>("/sales/customers")
      .then((res) => setCustomers(res.items || []))
      .catch(() => {});
  }, []);

  function fmt(n: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  }

  async function handleSubmit() {
    if (!selectedCustomer) return alert("Please select a customer");
    if (amount <= 0) return alert("Amount must be greater than zero");
    setSaving(true);
    try {
      await apiPost("/finance/credit-notes", {
        customer_id: parseInt(selectedCustomer),
        credit_number: creditNumber,
        amount,
        reason: reason || undefined,
        status,
        date: new Date().toISOString().split("T")[0],
      });
      router.push("/finance/credit-notes");
    } catch {
      alert("Failed to create credit note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => router.push("/finance/credit-notes")}
        >
          Credit Notes
        </span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          New Credit Note
        </span>
      </div>

      <PageHeader
        title="Create Credit Note"
        description="Issue a new credit note for customer adjustments."
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.push("/finance/credit-notes")}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Credit Note Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Customer *
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Select customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.company_name || `Customer #${c.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Credit Number
                </label>
                <input
                  type="text"
                  value={creditNumber}
                  readOnly
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Amount *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="applied">Applied</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Reason</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for this credit note..."
              rows={4}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" /> Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credit Number</span>
                <span className="font-medium">{creditNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{status}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold">Amount</span>
                  <span className="text-xl font-bold text-primary">
                    {fmt(amount)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-primary text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                Save Credit Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
