"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  ShoppingCart,
  TrendingUp,
  Clock,
  Plus,
  Edit,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";

const supplier = {
  name: "TechParts Supply Co.",
  code: "SUP-001",
  category: "Electronics & Components",
  rating: 4.8,
  status: "Active",
  statusVariant: "success" as const,
  since: "Jan 15, 2022",
  contact: {
    name: "John Smith",
    title: "Sales Manager",
    phone: "+1 (555) 123-4567",
    email: "john.smith@techparts.com",
    address: "123 Industrial Blvd, San Jose, CA 95131",
  },
  stats: {
    totalOrders: 156,
    avgDelivery: "3.2 days",
    onTimeRate: "98.5%",
    totalSpend: "$1.2M",
  },
};

const recentOrders = [
  {
    id: "PO-2024-045",
    date: "Mar 24, 2024",
    items: 12,
    total: "$24,500",
    status: "Delivered",
    statusVariant: "success" as const,
  },
  {
    id: "PO-2024-038",
    date: "Mar 18, 2024",
    items: 8,
    total: "$15,200",
    status: "In Transit",
    statusVariant: "info" as const,
  },
  {
    id: "PO-2024-031",
    date: "Mar 10, 2024",
    items: 5,
    total: "$8,750",
    status: "Delivered",
    statusVariant: "success" as const,
  },
  {
    id: "PO-2024-024",
    date: "Mar 2, 2024",
    items: 15,
    total: "$32,100",
    status: "Delivered",
    statusVariant: "success" as const,
  },
];

const performanceMetrics = [
  { label: "Quality Score", value: "96%", icon: Star, color: "text-success" },
  { label: "Delivery Score", value: "98%", icon: Clock, color: "text-primary" },
  { label: "Response Time", value: "2.1h", icon: TrendingUp, color: "text-accent" },
  { label: "Communication", value: "4.8/5", icon: Mail, color: "text-warning" },
];

export default function SupplierProfilePage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <a href="/procurement" className="hover:text-foreground transition-colors">
          Procurement
        </a>
        <span>/</span>
        <a href="/procurement/suppliers" className="hover:text-foreground transition-colors">
          Suppliers
        </a>
        <span>/</span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          {supplier.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{supplier.name}</h1>
              <StatusBadge
                status={supplier.status}
                variant={supplier.statusVariant}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {supplier.code} · {supplier.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Purchase Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(supplier.stats).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-xs text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-xl font-bold mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="text-center p-4 rounded-xl bg-muted/50">
                    <Icon className={`h-6 w-6 ${metric.color} mx-auto mb-2`} />
                    <p className="text-xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View All
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                      Order ID
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                      Items
                    </th>
                    <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                      Total
                    </th>
                    <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.map((order) => (
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
                        <span className="text-sm font-semibold">
                          {order.total}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <StatusBadge
                          status={order.status}
                          variant={order.statusVariant}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Key Contacts</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                JS
              </div>
              <div>
                <p className="text-sm font-semibold">{supplier.contact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {supplier.contact.title}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <a
                href={`tel:${supplier.contact.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{supplier.contact.phone}</span>
              </a>
              <a
                href={`mailto:${supplier.contact.email}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{supplier.contact.email}</span>
              </a>
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{supplier.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Create Purchase Order
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Message
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Vendor Score</h3>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary">
                {supplier.rating}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(supplier.rating)
                      ? "text-warning fill-warning"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {supplier.stats.totalOrders} orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
