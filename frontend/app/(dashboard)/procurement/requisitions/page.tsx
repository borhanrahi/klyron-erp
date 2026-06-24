"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import {
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  Building2,
  AlertCircle,
} from "lucide-react";

interface Requisition {
  id: number;
  pr_number: string;
  department_id: number;
  status: string;
  priority: string;
  total_estimated: number;
  notes: string;
  created_at: string;
  items: { id: number; item_id: number; qty: number; estimated_price: number }[];
}

export default function RequisitionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm, state, handleClose } = useConfirm();

  const fetchRequisitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ items: Requisition[] }>("/procurement/requisitions");
      setRequisitions(res.items || []);
    } catch {
      setError("Failed to load requisitions.");
      setRequisitions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = await confirm("Are you sure you want to delete this requisition?");
    if (!ok) return;
    try {
      await apiDelete(`/procurement/requisitions/${id}`);
      fetchRequisitions();
    } catch {
      alert("Failed to delete requisition.");
    }
  };

  const statuses = [
    "All",
    "draft",
    "pending_approval",
    "approved",
    "rejected",
    "cancelled",
  ];

  const filteredRequisitions = requisitions.filter((req) => {
    const matchesSearch =
      req.pr_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Requisitions"
        description="Manage purchase requests from all departments"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Requisitions" },
        ]}
        actions={
          <button
            onClick={() => router.push("/procurement/requisitions/new")}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Requisition
          </button>
        }
      />

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-danger" />
          <span className="text-foreground">{error}</span>
          <button onClick={fetchRequisitions} className="ml-auto text-primary underline">Retry</button>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search requisitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All" : status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">PR Number</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Department</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Priority</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Items</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Total</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.map((req) => (
                <tr key={req.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{req.pr_number}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{req.department_id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-foreground capitalize">{req.priority}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-foreground">{req.created_at ? new Date(req.created_at).toLocaleDateString() : "-"}</span>
                  </td>
                  <td className="py-4 px-4 text-foreground">{req.items?.length || 0}</td>
                  <td className="py-4 px-4 font-medium text-foreground">
                    ${(req.total_estimated || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/procurement/requisitions/${req.id}`)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequisitions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">No requisitions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRequisitions.length} of {requisitions.length} requisitions
          </p>
        </div>
      </div>
      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
