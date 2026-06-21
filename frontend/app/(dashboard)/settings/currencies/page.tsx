"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DollarSign,
  Search,
  Plus,
  Edit,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from "lucide-react";

const currencies = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    rate: "1.0000",
    change: "+0.00%",
    changeType: "neutral" as const,
    isBase: true,
    lastUpdated: "Just now",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: "0.9234",
    change: "+0.12%",
    changeType: "up" as const,
    isBase: false,
    lastUpdated: "2 hours ago",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    rate: "0.7891",
    change: "-0.08%",
    changeType: "down" as const,
    isBase: false,
    lastUpdated: "2 hours ago",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    rate: "151.23",
    change: "+0.45%",
    changeType: "up" as const,
    isBase: false,
    lastUpdated: "2 hours ago",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    rate: "1.3612",
    change: "-0.15%",
    changeType: "down" as const,
    isBase: false,
    lastUpdated: "2 hours ago",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    rate: "1.5342",
    change: "+0.22%",
    changeType: "up" as const,
    isBase: false,
    lastUpdated: "2 hours ago",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "Fr",
    rate: "0.8845",
    change: "+0.05%",
    changeType: "up" as const,
    isBase: false,
    lastUpdated: "2 hours ago",
  },
];

const currencyStats = [
  { label: "Base Currency", value: "USD", change: "United States Dollar" },
  { label: "Active Currencies", value: "7", change: "All synced" },
  { label: "Last Rate Update", value: "2h ago", change: "Auto-refresh enabled" },
  { label: "Exchange Provider", value: "Open Exchange", change: "API connected" },
];

export default function CurrenciesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span>Settings</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Currencies
        </span>
      </div>

      <PageHeader
        title="Currencies"
        description="Manage system currencies, base rates, and exchange rate feeds."
        icon={<DollarSign className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Rates
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Currency
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currencyStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search currencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Currency Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Currency
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Code
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Exchange Rate
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden sm:table-cell">
                  24h Change
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Last Updated
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCurrencies.map((currency) => (
                <tr
                  key={currency.code}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {currency.symbol}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{currency.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {currency.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {currency.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-semibold">
                        {currency.rate}
                      </span>
                      {currency.isBase && (
                        <StatusBadge status="Base" variant="primary" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      {currency.changeType === "up" ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : currency.changeType === "down" ? (
                        <TrendingDown className="h-3 w-3 text-danger" />
                      ) : null}
                      <span
                        className={`text-sm ${
                          currency.changeType === "up"
                            ? "text-success"
                            : currency.changeType === "down"
                            ? "text-danger"
                            : "text-muted-foreground"
                        }`}
                      >
                        {currency.change}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {currency.lastUpdated}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
