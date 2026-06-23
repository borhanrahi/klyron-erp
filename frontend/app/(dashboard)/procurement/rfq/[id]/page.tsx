"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import { ArrowLeft, Calendar, Building2, FileText } from "lucide-react";

interface RFQ {
  id: number;
  rfq_number: string;
  title: string;
  description?: string;
  supplier_id?: number;
  status: string;
  issue_date?: string;
  due_date?: string;
  total_amount: number;
  company_id: number;
  created_at?: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function RFQDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    setError("");
    apiGet<{ data: RFQ }>(`/procurement/rfqs/${params.id}`)
      .then((res) => setRfq(res.data))
      .catch(() => setError("Failed to load RFQ."))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !rfq) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Request for Quotation"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Procurement", href: "/procurement" },
            { label: "RFQ", href: "/procurement/rfq" },
            { label: "Not Found" },
          ]}
          actions={
            <button
              onClick={() => router.push("/procurement/rfq")}
              className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </button>
          }
        />
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">{error || "RFQ not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={rfq.rfq_number}
        description={rfq.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "RFQ", href: "/procurement/rfq" },
          { label: rfq.rfq_number },
        ]}
        actions={
          <button
            onClick={() => router.push("/procurement/rfq")}
            className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">RFQ Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={rfq.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RFQ Number</p>
                <p className="text-foreground">{rfq.rfq_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="text-foreground">{rfq.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p className="text-foreground">{rfq.supplier_id ? `Supplier #${rfq.supplier_id}` : "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="text-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {fmtDate(rfq.issue_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {fmtDate(rfq.due_date)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground">{rfq.description || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="text-foreground">{fmtDate(rfq.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-bold text-lg text-foreground">{fmt(rfq.total_amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={rfq.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
