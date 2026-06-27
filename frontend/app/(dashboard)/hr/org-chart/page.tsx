"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import {
  ChartNetwork,
  ChevronDown,
  ChevronRight,
  User,
  Search,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface OrgNode {
  id: number;
  employee_id: number;
  employee_name: string | null;
  employee_code: string;
  designation: string | null;
  department: string | null;
  photo_url: string | null;
  children: OrgNode[];
}

function OrgTreeNode({ node, depth = 0, searchTerm = "" }: { node: OrgNode; depth?: number; searchTerm?: string }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const matchesSearch = searchTerm
    ? (node.employee_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.employee_code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.designation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.department || "").toLowerCase().includes(searchTerm.toLowerCase())
    : true;

  // Auto-expand matching nodes
  useEffect(() => {
    if (searchTerm) setExpanded(true);
  }, [searchTerm]);

  if (!matchesSearch && !searchTerm) return null;

  // Check if any child matches search
  const childMatches = searchTerm && hasChildren
    ? node.children.some((c) => {
        const childCtx = [c.employee_name, c.employee_code, c.designation, c.department]
          .filter(Boolean).join(" ").toLowerCase();
        return childCtx.includes(searchTerm.toLowerCase());
      })
    : false;

  if (!matchesSearch && !childMatches) return null;

  return (
    <div className="relative">
      <div className={`relative flex items-start gap-3 p-3 rounded-xl transition-all ${
        matchesSearch && searchTerm ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/30"
      }`}>
        {/* Connector line */}
        {depth > 0 && (
          <div className="absolute left-[26px] -top-4 w-px h-4 bg-border" />
        )}

        {/* Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-1.5 w-5 h-5 flex items-center justify-center rounded-md transition-colors shrink-0 ${
            hasChildren ? "bg-muted hover:bg-muted/80 cursor-pointer" : "invisible"
          }`}
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
          {(node.employee_name || node.employee_code || "?").split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{node.employee_name || node.employee_code}</span>
            <span className="text-xs font-mono text-muted-foreground">{node.employee_code}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {node.designation && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> {node.designation}
              </span>
            )}
            {node.department && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {node.department}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="ml-6 pl-4 border-l border-border/50 space-y-1 mt-1">
          {node.children.map((child) => (
            <OrgTreeNode key={child.id} node={child} depth={depth + 1} searchTerm={searchTerm} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const [orgTree, setOrgTree] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAll, setExpandedAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrgChart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ data: OrgNode[] }>("/hr/org-chart");
      setOrgTree(res.data || []);
    } catch (err) {
      setError("Failed to load org chart. Make sure the backend is running.");
      setOrgTree([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgChart();
  }, []);

  // Count total people
  function countNodes(nodes: OrgNode[]): number {
    let count = 0;
    for (const node of nodes) {
      count += 1 + countNodes(node.children);
    }
    return count;
  }
  const totalPeople = countNodes(orgTree);

  // Find max depth
  function maxDepth(nodes: OrgNode[]): number {
    let max = 0;
    for (const node of nodes) {
      max = Math.max(max, 1 + maxDepth(node.children));
    }
    return max;
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Organization Chart"
        description="View and explore your company's reporting hierarchy."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Org Chart" },
        ]}
        icon={<ChartNetwork className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={fetchOrgChart}
            className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2 cursor-pointer"
          >
            <Maximize2 className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Total People</p>
          <p className="text-2xl font-bold">{loading ? "..." : totalPeople}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Top-Level Managers</p>
          <p className="text-2xl font-bold">{loading ? "..." : orgTree.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Hierarchy Levels</p>
          <p className="text-2xl font-bold">{loading ? "..." : maxDepth(orgTree)}</p>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, code, designation, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Org Tree */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading organization chart...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <ChartNetwork className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground mb-2">{error}</p>
              <p className="text-xs text-muted-foreground/60">Seed employee data with reporting_to values to see the org chart.</p>
            </div>
          ) : orgTree.length === 0 ? (
            <div className="py-16 text-center">
              <ChartNetwork className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No organization hierarchy found.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Assign reporting managers to employees to build the org chart.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {orgTree.map((node) => (
                <OrgTreeNode key={node.id} node={node} searchTerm={searchTerm} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
