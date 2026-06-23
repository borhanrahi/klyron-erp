"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { BookOpen, Search, Filter, Plus, Eye, Loader2 } from "lucide-react";

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fmtDate(s?: string | null) { if (!s) return "—"; return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

const TYPE_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  income: "success", revenue: "success", payment: "success",
  expense: "danger", transfer: "info", adjustment: "warning", journal: "primary",
};

interface Transaction { id: number; account_id: number; type: string; amount: number; reference?: string; description?: string; date: string; created_at: string; }

export default function JournalEntriesPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    apiGet<{ items: Transaction[] }>("/finance/transactions")
      .then((res) => setEntries(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter((e) => {
    const matchSearch = !searchTerm || (e.description || "").toLowerCase().includes(searchTerm.toLowerCase()) || (e.reference || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "All" || e.type === selectedType;
    return matchSearch && matchType;
  });

  const totalDebits = entries.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const totalCredits = entries.filter((e) => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Journal Entries</span>
      </div>

      <PageHeader
        title="Journal Entries"
        description="Record and manage manual journal entries and adjustments."
        icon={<BookOpen className="h-6 w-6 text-primary" />}
        actions={
          <button onClick={() => router.push("/finance/transactions")} className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Entry
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Entries</p>
          <p className="text-2xl font-bold mt-1">{entries.length}</p>
          <p className="text-xs text-success mt-1">All time</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Debits</p>
          <p className="text-2xl font-bold mt-1">{fmt(totalDebits)}</p>
          <p className="text-xs text-success mt-1">Income & receipts</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Credits</p>
          <p className="text-2xl font-bold mt-1">{fmt(totalCredits)}</p>
          <p className="text-xs text-info mt-1">Expenses & payments</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Net Balance</p>
          <p className="text-2xl font-bold mt-1">{fmt(totalDebits - totalCredits)}</p>
          <p className={`text-xs mt-1 ${totalDebits >= totalCredits ? "text-success" : "text-danger"}`}>{totalDebits >= totalCredits ? "Positive" : "Negative"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search entries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="All">Type: All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
              <option value="journal">Journal</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading entries...</div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-danger">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">ID</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Description</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Reference</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Amount</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4"><span className="text-sm font-medium text-primary">TXN-{entry.id}</span></td>
                    <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{fmtDate(entry.date)}</span></td>
                    <td className="py-3 px-4"><p className="text-sm font-medium">{entry.description || "—"}</p></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{entry.reference || "—"}</span></td>
                    <td className="py-3 px-4 text-right"><span className={`text-sm font-semibold ${entry.amount >= 0 ? "text-success" : "text-danger"}`}>{fmt(entry.amount)}</span></td>
                    <td className="py-3 px-4"><StatusBadge status={entry.type} variant={TYPE_VARIANT[entry.type] || "muted"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {entries.length} entries</p>
        </div>
      </div>
    </div>
  );
}
