"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Laptop,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  User,
} from "lucide-react";

const assets = [
  { id: 1, name: "MacBook Pro 16-inch", assetTag: "IT-001", category: "Laptop", assignedTo: "Sarah Chen", assignedDate: "Jan 16, 2022", condition: "Good", status: "Assigned", statusVariant: "success" as const },
  { id: 2, name: "Dell 27\" Monitor", assetTag: "IT-002", category: "Monitor", assignedTo: "Sarah Chen", assignedDate: "Jan 16, 2022", condition: "Good", status: "Assigned", statusVariant: "success" as const },
  { id: 3, name: "MacBook Air M2", assetTag: "IT-003", category: "Laptop", assignedTo: "Mike Johnson", assignedDate: "Mar 10, 2021", condition: "Good", status: "Assigned", statusVariant: "success" as const },
  { id: 4, name: "Apple Magic Keyboard", assetTag: "IT-004", category: "Peripheral", assignedTo: "Emily Davis", assignedDate: "Jun 25, 2020", condition: "Good", status: "Assigned", statusVariant: "success" as const },
  { id: 5, name: "Ergonomic Chair", assetTag: "FN-001", category: "Furniture", assignedTo: "David Park", assignedDate: "Sep 10, 2023", condition: "Good", status: "Assigned", statusVariant: "success" as const },
  { id: 6, name: "iPhone 15 Pro", assetTag: "MB-001", category: "Mobile", assignedTo: "Alex Kim", assignedDate: "Feb 20, 2022", condition: "Good", status: "Assigned", statusVariant: "success" as const },
  { id: 7, name: "MacBook Pro 14-inch", assetTag: "IT-005", category: "Laptop", assignedTo: "-", assignedDate: "-", condition: "Good", status: "Available", statusVariant: "info" as const },
  { id: 8, name: "Dell 24\" Monitor", assetTag: "IT-006", category: "Monitor", assignedTo: "-", assignedDate: "-", condition: "Fair", status: "Available", statusVariant: "info" as const },
  { id: 9, name: "MacBook Pro 16-inch", assetTag: "IT-007", category: "Laptop", assignedTo: "-", assignedDate: "-", condition: "Repair", status: "Under Repair", statusVariant: "danger" as const },
];

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filtered = assets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || a.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Asset Assignment"
        description="Track company assets assigned to employees."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Assets" },
        ]}
        icon={<Laptop className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Assets</p>
          <p className="text-2xl font-bold mt-1">{assets.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Assigned</p>
          <p className="text-2xl font-bold mt-1 text-success">{assets.filter((a) => a.status === "Assigned").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-bold mt-1 text-info">{assets.filter((a) => a.status === "Available").length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Under Repair</p>
          <p className="text-2xl font-bold mt-1 text-danger">{assets.filter((a) => a.status === "Under Repair").length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Assigned">Assigned</option>
              <option value="Available">Available</option>
              <option value="Under Repair">Under Repair</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">Asset <ArrowUpDown className="h-3 w-3" /></button>
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Asset Tag</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Category</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Assigned To</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Condition</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((asset) => (
                <tr key={asset.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><Laptop className="h-4 w-4 text-primary" /></div>
                      <span className="text-sm font-medium">{asset.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{asset.assetTag}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><StatusBadge status={asset.category} variant="primary" /></td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      {asset.assignedTo !== "-" && <User className="h-3 w-3 text-muted-foreground" />}
                      <span className="text-sm text-muted-foreground">{asset.assignedTo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <StatusBadge
                      status={asset.condition}
                      variant={asset.condition === "Good" ? "success" : asset.condition === "Fair" ? "warning" : "danger"}
                    />
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={asset.status} variant={asset.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {assets.length} assets</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
