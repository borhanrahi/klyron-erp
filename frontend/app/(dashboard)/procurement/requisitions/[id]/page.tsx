"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Save,
  X,
  Check,
  Clock,
  User,
  Building2,
  Calendar,
  FileText,
  MessageSquare,
  History,
  Send,
  XCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

interface RequisitionItem {
  id: number;
  pr_id: number;
  item_id: number;
  qty: number;
  estimated_price: number;
  notes: string;
}

interface Requisition {
  id: number;
  pr_number: string;
  department_id: number;
  requester_id: number;
  status: string;
  priority: string;
  total_estimated: number;
  notes: string;
  company_id: number;
  created_at: string;
  items: RequisitionItem[];
}

export default function RequisitionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [comment, setComment] = useState("");
  const [requisition, setRequisition] = useState<Requisition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    apiGet<{ data: Requisition }>(`/procurement/requisitions/${params.id}`)
      .then((res) => setRequisition(res.data))
      .catch(() => setError("Failed to load requisition."))
      .finally(() => setLoading(false));
  }, [params.id]);

  const tabs = [
    { id: "details", label: "Details" },
    { id: "approval", label: "Approval Workflow" },
    { id: "history", label: "History" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !requisition) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Requisition Not Found"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Procurement", href: "/procurement" },
            { label: "Requisitions", href: "/procurement/requisitions" },
            { label: "Not Found" },
          ]}
          actions={
            <button
              onClick={() => router.push("/procurement/requisitions")}
              className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Requisitions
            </button>
          }
        />
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
          <p className="text-foreground text-lg">{error || "Requisition not found."}</p>
          <button
            onClick={() => router.push("/procurement/requisitions")}
            className="mt-4 text-primary underline"
          >
            Go back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={requisition.pr_number}
        description={requisition.notes || "Purchase Requisition"}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Requisitions", href: "/procurement/requisitions" },
          { label: requisition.pr_number },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {requisition.status === "pending_approval" && (
              <>
                <button className="px-4 py-2 bg-success text-white rounded-lg flex items-center gap-2 hover:bg-success/90 transition-colors">
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button className="px-4 py-2 bg-danger text-white rounded-lg flex items-center gap-2 hover:bg-danger/90 transition-colors">
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => router.push("/procurement/requisitions")}
              className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border">
            <div className="border-b border-border">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <StatusBadge status={requisition.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <span className="text-foreground capitalize">{requisition.priority}</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requester ID</p>
                      <p className="text-foreground">{requisition.requester_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department ID</p>
                      <p className="text-foreground">{requisition.department_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-foreground">{requisition.created_at ? new Date(requisition.created_at).toLocaleString() : "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Estimated</p>
                      <p className="text-foreground font-semibold">${(requisition.total_estimated || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  {requisition.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Notes</p>
                      <p className="text-foreground bg-muted p-4 rounded-lg">{requisition.notes}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Requested Items</p>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">Item ID</th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">Qty</th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">Est. Price</th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">Total</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisition.items?.map((item) => (
                            <tr key={item.id} className="border-b border-border">
                              <td className="py-3 px-3 text-foreground">{item.item_id}</td>
                              <td className="py-3 px-3 text-right text-foreground">{item.qty}</td>
                              <td className="py-3 px-3 text-right text-foreground">${(item.estimated_price || 0).toLocaleString()}</td>
                              <td className="py-3 px-3 text-right font-medium text-foreground">${((item.qty || 0) * (item.estimated_price || 0)).toLocaleString()}</td>
                              <td className="py-3 px-3 text-foreground">{item.notes || "-"}</td>
                            </tr>
                          ))}
                          {(!requisition.items || requisition.items.length === 0) && (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-muted-foreground">No items</td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-border">
                            <td colSpan={3} className="py-3 px-3 text-right font-medium text-foreground">Total:</td>
                            <td className="py-3 px-3 text-right font-bold text-foreground">${(requisition.total_estimated || 0).toLocaleString()}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "approval" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div className="p-2 rounded-full bg-success/20 text-success">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">Created</p>
                        <StatusBadge status="completed" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Requisition created on {requisition.created_at ? new Date(requisition.created_at).toLocaleString() : "-"}
                      </p>
                    </div>
                  </div>
                  {requisition.status === "draft" && (
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                      <div className="p-2 rounded-full bg-warning/20 text-warning">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Pending Submission</p>
                        <p className="text-sm text-muted-foreground">This requisition has not been submitted for approval yet.</p>
                      </div>
                    </div>
                  )}
                  {requisition.status === "pending_approval" && (
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                      <div className="p-2 rounded-full bg-warning/20 text-warning">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Pending Approval</p>
                        <p className="text-sm text-muted-foreground">Awaiting manager review.</p>
                      </div>
                    </div>
                  )}
                  {requisition.status === "approved" && (
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                      <div className="p-2 rounded-full bg-success/20 text-success">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Approved</p>
                        <p className="text-sm text-muted-foreground">Requisition has been approved.</p>
                      </div>
                    </div>
                  )}
                  {requisition.status === "rejected" && (
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                      <div className="p-2 rounded-full bg-danger/20 text-danger">
                        <XCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Rejected</p>
                        <p className="text-sm text-muted-foreground">Requisition has been rejected.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Requisition Created</p>
                      <p className="text-sm text-muted-foreground">
                        {requisition.created_at ? new Date(requisition.created_at).toLocaleString() : "-"}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        Created requisition with {requisition.items?.length || 0} items totaling ${(requisition.total_estimated || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-left">
                Print Requisition
              </button>
              <button className="w-full px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-left">
                Download PDF
              </button>
              <button className="w-full px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-left">
                Duplicate Requisition
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              placeholder="Add a comment..."
            />
            <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Post Comment
            </button>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Requisition Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Requester #{requisition.requester_id}</p>
                  <p className="text-sm text-muted-foreground">Department #{requisition.department_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
