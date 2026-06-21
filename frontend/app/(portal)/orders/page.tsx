"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ShoppingCart,
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

const orders = [
  {
    id: "SO-2024-001",
    date: "Mar 24, 2024",
    items: 5,
    total: "$12,500.00",
    status: "Confirmed",
    statusVariant: "success" as const,
  },
  {
    id: "SO-2024-002",
    date: "Mar 18, 2024",
    items: 3,
    total: "$8,750.00",
    status: "Processing",
    statusVariant: "info" as const,
  },
  {
    id: "SO-2024-003",
    date: "Mar 10, 2024",
    items: 8,
    total: "$24,300.00",
    status: "Shipped",
    statusVariant: "primary" as const,
  },
  {
    id: "SO-2024-004",
    date: "Mar 2, 2024",
    items: 2,
    total: "$3,200.00",
    status: "Delivered",
    statusVariant: "success" as const,
  },
];

export default function PortalOrdersPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your order history and status
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Order ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Date
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
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">
                      {order.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {order.date}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {order.items} items
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold">{order.total}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge
                      status={order.status}
                      variant={order.statusVariant}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-4 of 18 orders
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
