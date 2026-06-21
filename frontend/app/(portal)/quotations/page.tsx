"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Send,
} from "lucide-react";

const quotations = [
  {
    id: "QTN-2024-012",
    date: "Mar 24, 2024",
    validUntil: "Apr 23, 2024",
    items: 5,
    total: "$12,500.00",
    status: "Pending",
    statusVariant: "warning" as const,
  },
  {
    id: "QTN-2024-011",
    date: "Mar 18, 2024",
    validUntil: "Apr 17, 2024",
    items: 8,
    total: "$24,300.00",
    status: "Accepted",
    statusVariant: "success" as const,
  },
  {
    id: "QTN-2024-010",
    date: "Mar 10, 2024",
    validUntil: "Apr 9, 2024",
    items: 3,
    total: "$8,750.00",
    status: "Sent",
    statusVariant: "info" as const,
  },
  {
    id: "QTN-2024-009",
    date: "Mar 2, 2024",
    validUntil: "Apr 1, 2024",
    items: 12,
    total: "$45,600.00",
    status: "Expired",
    statusVariant: "muted" as const,
  },
];

export default function PortalQuotationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h1 className="text-2xl font-bold">Quotations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and accept your quotations
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search quotations..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Quote ID
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Valid Until
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Items
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Total
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {quotations.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {quote.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {quote.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {quote.validUntil}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {quote.items} items
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">{quote.total}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge
                      status={quote.status}
                      variant={quote.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
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
            Showing 1-4 of 12 quotations
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
