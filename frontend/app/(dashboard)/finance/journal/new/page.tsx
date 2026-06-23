"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiPost } from "@/lib/api";
import { BookOpen, ArrowLeft, Save, Loader2, DollarSign, Calculator } from "lucide-react";

const TYPE_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  income: "success", expense: "danger", transfer: "info", journal: "primary",
};

interface Account { id: number; name?: string; code?: string; type?: string; }

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState("journal");
  const [amount, setAmount] = useState<number>(0);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<{ items: Account[] }>("/finance/chart-of-accounts")
      .then((res) => setAccounts(res.items || []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId) return alert("Please select an account");
    if (amount <= 0) return alert("Amount must be greater than zero");
    setSaving(true);
    try {
      await apiPost("/finance/transactions", {
        account_id: parseInt(accountId),
        type,
        amount,
        reference: reference || undefined,
        description: description || undefined,
      });
      router.push("/finance/journal");
    } catch { alert("Failed to create journal entry"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/finance/journal")}>Journal Entries</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">New Entry</span>
      </div>

      <PageHeader
        title="Create Journal Entry"
        description="Record a new transaction in the journal."
        icon={<BookOpen className="h-6 w-6 text-primary" />}
        actions={
          <button onClick={() => router.push("/finance/journal")} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Account *</label>
                <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">Select account...</option>
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.code ? `${a.code} — ` : ""}{a.name || `Account #${a.id}`}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Type *</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                  <option value="journal">Journal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Amount *</label>
                <input type="number" step="0.01" min="0" value={amount || ""} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Reference</label>
                <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. INV-001, receipt number..." className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description for this transaction..." rows={3} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Type</span><StatusBadge status={type} variant={TYPE_VARIANT[type] || "muted"} /></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-medium">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Account</span><span className="font-medium">{accounts.find((a) => String(a.id) === accountId)?.name || "—"}</span></div>
              {reference && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Reference</span><span className="font-medium">{reference}</span></div>}
            </div>
            <div className="mt-6">
              <button type="submit" disabled={saving} className="w-full bg-primary text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Entry
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
