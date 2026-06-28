"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { RequirePermission } from "@/components/common/RequirePermission";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

const TYPE_VARIANT_MAP: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "muted"> = {
  asset: "info",
  liability: "warning",
  equity: "primary",
  revenue: "success",
  expense: "danger",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

interface LedgerItem {
  id: string | number;
  account_code?: string;
  code?: string;
  name?: string;
  account_type?: string;
  type?: string;
  sub_type?: string;
  subType?: string;
  balance?: number;
  debit?: number;
  credit?: number;
  [key: string]: unknown;
}

export default function LedgerPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [accounts, setAccounts] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ items: LedgerItem[] }>("/finance/chart-of-accounts")
      .then((res) => setAccounts(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalAssets = accounts.filter((a) => (a.account_type || a.type || "").toLowerCase() === "asset").reduce((s, a) => s + (a.balance || 0), 0);
  const totalLiabilities = accounts.filter((a) => (a.account_type || a.type || "").toLowerCase() === "liability").reduce((s, a) => s + (a.balance || 0), 0);
  const totalEquity = accounts.filter((a) => (a.account_type || a.type || "").toLowerCase() === "equity").reduce((s, a) => s + (a.balance || 0), 0);
  const accountStats = [
    { label: "Total Assets", value: formatCurrency(totalAssets), change: `${accounts.filter((a) => (a.account_type || a.type || "").toLowerCase() === "asset").length} accounts`, icon: ArrowUpRight },
    { label: "Total Liabilities", value: formatCurrency(totalLiabilities), change: `${accounts.filter((a) => (a.account_type || a.type || "").toLowerCase() === "liability").length} accounts`, icon: ArrowDownRight },
    { label: "Total Equity", value: formatCurrency(totalEquity), change: `${accounts.filter((a) => (a.account_type || a.type || "").toLowerCase() === "equity").length} accounts`, icon: ArrowUpRight },
    { label: "Total Accounts", value: `${accounts.length}`, change: "All active", icon: BookOpen },
  ];

  const filteredAccounts = accounts.filter((account) => {
    const code = (account.account_code || account.code || "").toString();
    const name = (account.name || "").toLowerCase();
    const accountType = (account.account_type || account.type || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm);
    const matchesType =
      selectedType === "All" || accountType === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <RequirePermission module="finance.ledger">
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Chart of Accounts
        </span>
      </div>

      <PageHeader
        title="Chart of Accounts"
        description="Manage your general ledger accounts, balances, and classifications."
        icon={<BookOpen className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button onClick={() => router.push("/finance/banking/new")} className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Account
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accountStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-success mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search accounts by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Type: All</option>
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading accounts...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-danger">
              {error}
            </div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Code
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Account Name
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Sub-Type
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Debit
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Credit
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Balance
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAccounts.map((account) => {
                const code = (account.account_code || account.code || "").toString();
                const accountType = (account.account_type || account.type || "");
                const typeLabel = accountType.charAt(0).toUpperCase() + accountType.slice(1);
                return (
                <tr
                  key={account.id || code}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono font-medium text-primary">
                      {code}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{account.name || "—"}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <StatusBadge
                      status={typeLabel}
                      variant={TYPE_VARIANT_MAP[accountType.toLowerCase()] || "muted"}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {account.sub_type || account.subType || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(account.debit || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(account.credit || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">{formatCurrency(account.balance || 0)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => router.push(`/finance/banking/${account.id}`)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              2
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </RequirePermission>
  );
}
