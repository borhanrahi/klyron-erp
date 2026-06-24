"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Trash2,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiDelete } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";

interface QuotationItem {
  id: number;
  item_id: number;
  qty: number;
  price: number;
  tax: number;
  total: number;
}

interface Quotation {
  id: number;
  quote_number: string;
  customer_id: number;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  expiry: string | null;
  created_at: string;
  items: QuotationItem[];
}

function mapStatusVariant(status: string): "success" | "warning" | "danger" | "info" | "primary" | "muted" {
  const s = (status || "").toLowerCase();
  if (s === "accepted" || s === "completed") return "success";
  if (s === "sent" || s === "pending") return "warning";
  if (s === "rejected" || s === "cancelled") return "danger";
  if (s === "expired") return "muted";
  return "info";
}

export default function QuotationsListPage() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { confirm, state, handleClose } = useConfirm();

  useEffect(() => {
    async function fetchQuotations() {
      try {
        const res = await apiGet<any>("/sales/quotations");
        setQuotations(res.items ?? res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch quotations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotations();
  }, []);

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(q.customer_id).includes(searchTerm);
    const matchesStatus =
      selectedStatus === "All" || q.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  async function handleDelete(id: number) {
    const ok = await confirm("Are you sure you want to delete this quotation?");
    if (!ok) return;
    try {
      await apiDelete(`/sales/quotations/${id}`);
      setQuotations((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Failed to delete quotation:", err);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">
          Sales
        </Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          Quotations
        </span>
      </div>

      <PageHeader
        title="Quotations"
        description="Manage and track customer quotations."
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <Link
            href="/sales/quotations/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Quotation
          </Link>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search quotations..."
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
              <option value="All">Status: All</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading quotations...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      Quote #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Customer ID
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Total ($)
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredQuotations.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-primary">
                        {q.quote_number}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{q.customer_id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={q.status}
                        variant={mapStatusVariant(q.status)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold">${q.total.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{q.date}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/sales/quotations/${q.id}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredQuotations.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No quotations found.
              </div>
            )}
          </div>
        )}
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
