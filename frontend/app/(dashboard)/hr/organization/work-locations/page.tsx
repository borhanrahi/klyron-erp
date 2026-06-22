"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Globe,
} from "lucide-react";

const workLocations = [
  { id: 1, name: "New York HQ", address: "350 Fifth Avenue, New York, NY 10118", type: "Office", capacity: 200, employees: 48, timezone: "EST (UTC-5)", status: "Active", statusVariant: "success" as const },
  { id: 2, name: "San Francisco Office", address: "1 Infinite Loop, Cupertino, CA 95014", type: "Office", capacity: 150, employees: 36, timezone: "PST (UTC-8)", status: "Active", statusVariant: "success" as const },
  { id: 3, name: "London Office", address: "1 Canada Square, London E14 5AB", type: "Office", capacity: 100, employees: 22, timezone: "GMT (UTC+0)", status: "Active", statusVariant: "success" as const },
  { id: 4, name: "Remote", address: "N/A", type: "Remote", capacity: null, employees: 32, timezone: "Various", status: "Active", statusVariant: "success" as const },
  { id: 5, name: "Hybrid - Austin", address: "201 Colorado Street, Austin, TX 78701", type: "Hybrid", capacity: 50, employees: 10, timezone: "CST (UTC-6)", status: "Active", statusVariant: "success" as const },
  { id: 6, name: "Singapore Office", address: "1 Raffles Place, Singapore 048616", type: "Office", capacity: 80, employees: 0, timezone: "SGT (UTC+8)", status: "Planned", statusVariant: "warning" as const },
];

export default function WorkLocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = workLocations.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Work Locations"
        description="Manage office locations, remote, and hybrid work arrangements."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Organization" },
          { label: "Work Locations" },
        ]}
        icon={<MapPin className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Location</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Address</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Timezone</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employees</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((loc) => (
                <tr key={loc.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{loc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{loc.address}</span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <StatusBadge status={loc.type} variant={loc.type === "Remote" ? "info" : loc.type === "Hybrid" ? "warning" : "primary"} />
                  </td>
                  <td className="py-3 px-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{loc.timezone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{loc.employees}</span>
                      {loc.capacity && <span className="text-xs text-muted-foreground">/ {loc.capacity}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={loc.status} variant={loc.statusVariant} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {workLocations.length} locations</p>
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
