"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ArrowLeft,
  Download,
  Printer,
  Edit,
  ChevronRight,
  Package,
  Layers,
  Clock,
  DollarSign,
  Hash,
} from "lucide-react";
import Link from "next/link";

const bom = {
  id: "BOM-2024-081",
  name: "Enterprise Server Unit",
  product: "SRV-ENT-001",
  status: "Active",
  statusVariant: "success" as const,
  revision: "3.2",
  lastUpdated: "Mar 20, 2024",
  createdBy: "Mike Johnson",
  stats: {
    totalComponents: 24,
    totalCost: "$3,450.00",
    estimatedBuildTime: "4.5 hours",
    version: "3.2",
  },
  components: [
    {
      id: 1,
      level: 1,
      name: "Chassis Assembly",
      partNumber: "CH-992",
      quantity: 1,
      unitCost: "$180.00",
      totalCost: "$180.00",
      supplier: "MetalWorks Inc",
      isAssembly: true,
      children: [
        {
          id: 11,
          level: 2,
          name: "Steel Frame",
          partNumber: "FRM-101",
          quantity: 1,
          unitCost: "$85.00",
          totalCost: "$85.00",
          supplier: "MetalWorks Inc",
        },
        {
          id: 12,
          level: 2,
          name: "Side Panels",
          partNumber: "PAN-202",
          quantity: 2,
          unitCost: "$25.00",
          totalCost: "$50.00",
          supplier: "MetalWorks Inc",
        },
        {
          id: 13,
          level: 2,
          name: "Front Bezel",
          partNumber: "BZL-303",
          quantity: 1,
          unitCost: "$45.00",
          totalCost: "$45.00",
          supplier: "PlasticParts Co",
        },
      ],
    },
    {
      id: 2,
      level: 1,
      name: "Motherboard",
      partNumber: "MB-550",
      quantity: 1,
      unitCost: "$420.00",
      totalCost: "$420.00",
      supplier: "TechComponents Ltd",
      isAssembly: false,
    },
    {
      id: 3,
      level: 1,
      name: "CPU Processor",
      partNumber: "CPU-Intel-Xeon",
      quantity: 2,
      unitCost: "$650.00",
      totalCost: "$1,300.00",
      supplier: "Intel Direct",
      isAssembly: false,
    },
    {
      id: 4,
      level: 1,
      name: "RAM Module",
      partNumber: "RAM-32GB-ECC",
      quantity: 4,
      unitCost: "$180.00",
      totalCost: "$720.00",
      supplier: "MemoryPlus",
      isAssembly: false,
    },
    {
      id: 5,
      level: 1,
      name: "Power Supply Unit",
      partNumber: "PSU-850W",
      quantity: 1,
      unitCost: "$120.00",
      totalCost: "$120.00",
      supplier: "PowerTech",
      isAssembly: false,
    },
    {
      id: 6,
      level: 1,
      name: "Cooling System",
      partNumber: "COOL-liquid",
      quantity: 1,
      unitCost: "$95.00",
      totalCost: "$95.00",
      supplier: "CoolMax",
      isAssembly: false,
    },
  ],
};

export default function BOMDetailsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/manufacturing"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Manufacturing
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{bom.name}</h1>
            <StatusBadge
              status={bom.status}
              variant={bom.statusVariant}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {bom.id} · Rev {bom.revision} · Updated {bom.lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="border border-border bg-card text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/10 flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit BOM
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(bom.stats).map(([key, value]) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-xs text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </p>
            <p className="text-xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Components Tree */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Components Tree
          </h3>
          <button className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-1">
            <Package className="h-4 w-4" />
            Add Component
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Component
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  Part Number
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Qty
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                  Unit Cost
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4">
                  Total
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {bom.components.map((component) => (
                <>
                  <tr
                    key={component.id}
                    className={`hover:bg-muted/5 transition-colors ${
                      component.isAssembly ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${(component.level - 1) * 24}px` }}
                      >
                        {component.isAssembly ? (
                          <Layers className="h-4 w-4 text-primary" />
                        ) : (
                          <Package className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={`text-sm ${
                            component.isAssembly ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {component.name}
                        </span>
                        {component.isAssembly && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Assembly
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground font-mono">
                        {component.partNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm">{component.quantity}</span>
                    </td>
                    <td className="py-3 px-4 text-right hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {component.unitCost}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold">
                        {component.totalCost}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {component.supplier}
                      </span>
                    </td>
                  </tr>
                  {component.children?.map((child) => (
                    <tr
                      key={child.id}
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div
                          className="flex items-center gap-2"
                          style={{ paddingLeft: `${(child.level - 1) * 24 + 12}px` }}
                        >
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{child.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground font-mono">
                          {child.partNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm">{child.quantity}</span>
                      </td>
                      <td className="py-3 px-4 text-right hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {child.unitCost}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold">
                          {child.totalCost}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {child.supplier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-muted/30">
                <td colSpan={4} className="py-3 px-4 text-right text-sm font-bold">
                  Total BOM Cost
                </td>
                <td className="py-3 px-4 text-right text-lg font-bold text-primary">
                  {bom.stats.totalCost}
                </td>
                <td className="hidden xl:table-cell"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
