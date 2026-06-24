"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Layers,
  Search,
  Users,
} from "lucide-react";

interface SalaryStructure {
  id: number;
  name: string;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  components: Array<{ id: number; component_id: number; amount: number; percentage: number }>;
  created_at: string;
}

interface SalaryStructureListResponse {
  items: SalaryStructure[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export default function SalaryStructuresPage() {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStructures = (p: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "15" };
    if (search) params.search = search;
    apiGet<SalaryStructureListResponse>("/hr/salary-structures", params)
      .then((res) => { setStructures(res.items); setTotal(res.total); setPage(res.page); setPages(res.pages); })
      .catch(() => { setStructures([]); setTotal(0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStructures(1); }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Structures"
        description="Define salary ranges, allowances, and deduction templates."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Salary Structures" },
        ]}
        icon={<Layers className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search salary structures..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchStructures(1)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Structure</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Description</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Components</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading salary structures...
                  </div>
                </td></tr>
              ) : structures.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No salary structures found.</td></tr>
              ) : (
                structures.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium">{s.name}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{s.description || "—"}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{s.components?.length || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={s.is_active ? "Active" : "Inactive"} variant={s.is_active ? "success" : "muted"} />
                    </td>
                    <td className="py-3 px-4">
                      {s.is_default && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {structures.length} of {total} structures</p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchStructures(page - 1)} disabled={page <= 1} className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors">Previous</button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchStructures(page + 1)} disabled={page >= pages} className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
