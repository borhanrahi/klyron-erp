"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
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
} from "lucide-react";

const accounts = [
  {
    code: "1010",
    name: "Cash and Cash Equivalents",
    type: "Asset",
    typeVariant: "info" as const,
    balance: "$245,890.00",
    debit: "$312,450.00",
    credit: "$66,560.00",
    subType: "Current Asset",
  },
  {
    code: "1100",
    name: "Accounts Receivable",
    type: "Asset",
    typeVariant: "info" as const,
    balance: "$87,340.00",
    debit: "$124,600.00",
    credit: "$37,260.00",
    subType: "Current Asset",
  },
  {
    code: "1200",
    name: "Inventory",
    type: "Asset",
    typeVariant: "info" as const,
    balance: "$156,200.00",
    debit: "$198,500.00",
    credit: "$42,300.00",
    subType: "Current Asset",
  },
  {
    code: "1500",
    name: "Property, Plant & Equipment",
    type: "Asset",
    typeVariant: "info" as const,
    balance: "$520,000.00",
    debit: "$520,000.00",
    credit: "$0.00",
    subType: "Non-Current Asset",
  },
  {
    code: "1510",
    name: "Accumulated Depreciation",
    type: "Asset",
    typeVariant: "info" as const,
    balance: "($78,000.00)",
    debit: "$0.00",
    credit: "$78,000.00",
    subType: "Contra Asset",
  },
  {
    code: "2010",
    name: "Accounts Payable",
    type: "Liability",
    typeVariant: "warning" as const,
    balance: "$43,210.00",
    debit: "$12,800.00",
    credit: "$56,010.00",
    subType: "Current Liability",
  },
  {
    code: "2020",
    name: "Salaries Payable",
    type: "Liability",
    typeVariant: "warning" as const,
    balance: "$45,000.00",
    debit: "$0.00",
    credit: "$45,000.00",
    subType: "Current Liability",
  },
  {
    code: "2300",
    name: "Unearned Revenue",
    type: "Liability",
    typeVariant: "warning" as const,
    balance: "$15,000.00",
    debit: "$5,000.00",
    credit: "$20,000.00",
    subType: "Current Liability",
  },
  {
    code: "3010",
    name: "Common Stock",
    type: "Equity",
    typeVariant: "primary" as const,
    balance: "$500,000.00",
    debit: "$0.00",
    credit: "$500,000.00",
    subType: "Equity",
  },
  {
    code: "3020",
    name: "Retained Earnings",
    type: "Equity",
    typeVariant: "primary" as const,
    balance: "$289,220.00",
    debit: "$0.00",
    credit: "$289,220.00",
    subType: "Equity",
  },
  {
    code: "4000",
    name: "Sales Revenue",
    type: "Revenue",
    typeVariant: "success" as const,
    balance: "$485,600.00",
    debit: "$0.00",
    credit: "$485,600.00",
    subType: "Revenue",
  },
  {
    code: "4100",
    name: "Service Revenue",
    type: "Revenue",
    typeVariant: "success" as const,
    balance: "$72,300.00",
    debit: "$0.00",
    credit: "$72,300.00",
    subType: "Revenue",
  },
  {
    code: "5100",
    name: "Cost of Goods Sold",
    type: "Expense",
    typeVariant: "danger" as const,
    balance: "$198,400.00",
    debit: "$198,400.00",
    credit: "$0.00",
    subType: "Expense",
  },
  {
    code: "5200",
    name: "Salaries Expense",
    type: "Expense",
    typeVariant: "danger" as const,
    balance: "$270,000.00",
    debit: "$270,000.00",
    credit: "$0.00",
    subType: "Expense",
  },
  {
    code: "5300",
    name: "Office Supplies Expense",
    type: "Expense",
    typeVariant: "danger" as const,
    balance: "$4,560.00",
    debit: "$4,560.00",
    credit: "$0.00",
    subType: "Expense",
  },
];

const accountStats = [
  { label: "Total Assets", value: "$931,430", change: "+5.2% this quarter", icon: ArrowUpRight },
  { label: "Total Liabilities", value: "$103,210", change: "-3.1% vs last month", icon: ArrowDownRight },
  { label: "Total Equity", value: "$789,220", change: "Stable", icon: ArrowUpRight },
  { label: "Total Accounts", value: "156", change: "5 added this month", icon: BookOpen },
];

export default function LedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.includes(searchTerm);
    const matchesType =
      selectedType === "All" || account.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
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
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
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
              {filteredAccounts.map((account) => (
                <tr
                  key={account.code}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono font-medium text-primary">
                      {account.code}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">{account.name}</span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <StatusBadge
                      status={account.type}
                      variant={account.typeVariant}
                    />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {account.subType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      {account.debit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">
                      {account.credit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">{account.balance}</span>
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
  );
}
