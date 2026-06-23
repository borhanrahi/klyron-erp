"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Landmark,
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
  CreditCard,
  Building2,
  Loader2,
} from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface BankAccountItem {
  id: string | number;
  name?: string;
  bank_name?: string;
  bank?: string;
  account_number?: string;
  accountNumber?: string;
  balance?: number;
  available_balance?: number;
  availableBalance?: number;
  type?: string;
  status?: string;
  currency?: string;
  [key: string]: unknown;
}

interface TransactionItem {
  id: string | number;
  transaction_id?: string;
  date?: string;
  description?: string;
  account_name?: string;
  account?: string;
  type?: string;
  amount?: number;
  balance?: number;
  running_balance?: number;
  [key: string]: unknown;
}

export default function BankingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<{ items: BankAccountItem[] }>("/finance/bank-accounts"),
      apiGet<{ items: TransactionItem[] }>("/finance/transactions"),
    ])
      .then(([bankRes, txnRes]) => {
        setBankAccounts(bankRes.items || []);
        setRecentTransactions(txnRes.items || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalBalance = bankAccounts.reduce((s, b) => s + (b.balance || 0), 0);
  const incoming = recentTransactions.filter((t) => (t.amount || 0) > 0).reduce((s, t) => s + (t.amount || 0), 0);
  const outgoing = recentTransactions.filter((t) => (t.amount || 0) < 0).reduce((s, t) => s + Math.abs(t.amount || 0), 0);
  const bankStats = [
    { label: "Total Balance", value: formatCurrency(totalBalance), change: `${bankAccounts.length} accounts`, icon: Landmark },
    { label: "Incoming (All)", value: formatCurrency(incoming), change: `${recentTransactions.filter((t) => (t.amount || 0) > 0).length} credits`, icon: ArrowDownRight },
    { label: "Outgoing (All)", value: formatCurrency(outgoing), change: `${recentTransactions.filter((t) => (t.amount || 0) < 0).length} debits`, icon: ArrowUpRight },
    { label: "Accounts", value: `${bankAccounts.length}`, change: `${new Set(bankAccounts.map((b) => b.bank_name || b.bank)).size} banks`, icon: Building2 },
  ];

  const filteredTransactions = recentTransactions.filter((txn) => {
    const desc = (txn.description || "").toLowerCase();
    const txnId = (txn.transaction_id || txn.id || "").toString().toLowerCase();
    const account = (txn.account_name || txn.account || "").toLowerCase();
    const matchesSearch =
      desc.includes(searchTerm.toLowerCase()) ||
      txnId.includes(searchTerm.toLowerCase());
    const matchesAccount =
      selectedAccount === "All" || account === selectedAccount.toLowerCase();
    return matchesSearch && matchesAccount;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Finance</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Banking
        </span>
      </div>

      <PageHeader
        title="Banking"
        description="Manage bank accounts, view balances, and reconcile transactions."
        icon={<Landmark className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Account
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bankStats.map((stat) => {
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

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading banking data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 text-danger">
          {error}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bankAccounts.map((account) => {
          const acctNum = (account.account_number || account.accountNumber || "").toString();
          return (
          <div
            key={account.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium">{account.name || "—"}</p>
                <p className="text-xs text-muted-foreground">{account.bank_name || account.bank || "—"}</p>
              </div>
              <StatusBadge
                status={account.status || "Active"}
                variant="success"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Balance</span>
                <span className="text-lg font-bold">{formatCurrency(account.balance || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Available
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {formatCurrency(account.available_balance || account.availableBalance || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs text-muted-foreground">
                  {account.type || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Account
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {acctNum}
                </span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">Account: All</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.name || ""}>
                    {account.name || "Account"}
                  </option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Transaction ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Description
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Account
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Type
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Amount
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Balance
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTransactions.map((txn) => {
                const txnId = (txn.transaction_id || txn.id || "").toString();
                const type = (txn.type || "").toLowerCase();
                const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                const amt = txn.amount || 0;
                return (
                <tr
                  key={txn.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary font-mono">
                      {txnId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">
                      {txn.description || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(txn.date)}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {txn.account_name || txn.account || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={typeLabel}
                      variant={type === "credit" ? "success" : type === "debit" ? "danger" : "muted"}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        type === "credit" ? "text-success" : "text-danger"
                      }`}
                    >
                      {type === "debit" ? `(${formatCurrency(Math.abs(amt))})` : formatCurrency(amt)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(txn.running_balance || txn.balance || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of{" "}
            {recentTransactions.length} transactions
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
            <button className="px-3 py-1 hover:bg-muted rounded-lg text-sm text-muted-foreground transition-colors">
              3
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
