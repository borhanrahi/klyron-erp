"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
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
} from "lucide-react";

const bankAccounts = [
  {
    id: "BA-001",
    name: "Business Checking",
    bank: "Chase Bank",
    accountNumber: "****4521",
    balance: "$245,890.00",
    availableBalance: "$243,200.00",
    type: "Checking",
    status: "Active",
    statusVariant: "success" as const,
    currency: "USD",
  },
  {
    id: "BA-002",
    name: "Business Savings",
    bank: "Chase Bank",
    accountNumber: "****7832",
    balance: "$125,400.00",
    availableBalance: "$125,400.00",
    type: "Savings",
    status: "Active",
    statusVariant: "success" as const,
    currency: "USD",
  },
  {
    id: "BA-003",
    name: "Payroll Account",
    bank: "Bank of America",
    accountNumber: "****3398",
    balance: "$48,250.00",
    availableBalance: "$48,250.00",
    type: "Checking",
    status: "Active",
    statusVariant: "success" as const,
    currency: "USD",
  },
  {
    id: "BA-004",
    name: "Euro Operating",
    bank: "Deutsche Bank",
    accountNumber: "****6714",
    balance: "€82,300.00",
    availableBalance: "€82,300.00",
    type: "Checking",
    status: "Active",
    statusVariant: "success" as const,
    currency: "EUR",
  },
];

const recentTransactions = [
  {
    id: "TXN-892345",
    date: "Mar 24, 2024",
    description: "Invoice Payment - Acme Corp",
    account: "Business Checking",
    type: "Credit",
    typeVariant: "success" as const,
    amount: "$11,000.00",
    balance: "$245,890.00",
  },
  {
    id: "TXN-892346",
    date: "Mar 24, 2024",
    description: "Office Rent Payment",
    account: "Business Checking",
    type: "Debit",
    typeVariant: "danger" as const,
    amount: "($4,500.00)",
    balance: "$234,890.00",
  },
  {
    id: "TXN-892347",
    date: "Mar 23, 2024",
    description: "Supplier Payment - Global Materials",
    account: "Business Checking",
    type: "Debit",
    typeVariant: "danger" as const,
    amount: "($8,750.00)",
    balance: "$239,390.00",
  },
  {
    id: "TXN-892348",
    date: "Mar 23, 2024",
    description: "Transfer to Savings",
    account: "Business Checking",
    type: "Debit",
    typeVariant: "muted" as const,
    amount: "($10,000.00)",
    balance: "$248,140.00",
  },
  {
    id: "TXN-892349",
    date: "Mar 22, 2024",
    description: "Transfer from Checking",
    account: "Business Savings",
    type: "Credit",
    typeVariant: "success" as const,
    amount: "$10,000.00",
    balance: "$125,400.00",
  },
  {
    id: "TXN-892350",
    date: "Mar 22, 2024",
    description: "Payroll Processing",
    account: "Payroll Account",
    type: "Debit",
    typeVariant: "danger" as const,
    amount: "($45,000.00)",
    balance: "$48,250.00",
  },
  {
    id: "TXN-892351",
    date: "Mar 21, 2024",
    description: "Invoice Payment - DataFlow Systems",
    account: "Business Checking",
    type: "Credit",
    typeVariant: "success" as const,
    amount: "$18,900.00",
    balance: "$258,140.00",
  },
  {
    id: "TXN-892352",
    date: "Mar 20, 2024",
    description: "Software Subscription - Adobe",
    account: "Business Checking",
    type: "Debit",
    typeVariant: "danger" as const,
    amount: "($599.88)",
    balance: "$239,240.00",
  },
];

const bankStats = [
  { label: "Total Balance", value: "$419,540", change: "+8.3% this month", icon: Landmark },
  { label: "Incoming (30d)", value: "$142,350", change: "+12 invoices paid", icon: ArrowDownRight },
  { label: "Outstanding (30d)", value: "$89,200", change: "15 payments made", icon: ArrowUpRight },
  { label: "Accounts", value: "4", change: "3 banks", icon: Building2 },
];

export default function BankingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("All");

  const filteredTransactions = recentTransactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount =
      selectedAccount === "All" || txn.account === selectedAccount;
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bankAccounts.map((account) => (
          <div
            key={account.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.bank}</p>
              </div>
              <StatusBadge
                status={account.status}
                variant={account.statusVariant}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Balance</span>
                <span className="text-lg font-bold">{account.balance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Available
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {account.availableBalance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs text-muted-foreground">
                  {account.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Account
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {account.accountNumber}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                  <option key={account.id} value={account.name}>
                    {account.name}
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
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary font-mono">
                      {txn.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">
                      {txn.description}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {txn.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {txn.account}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={txn.type}
                      variant={txn.typeVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        txn.type === "Credit" ? "text-success" : "text-danger"
                      }`}
                    >
                      {txn.amount}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {txn.balance}
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
              ))}
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
