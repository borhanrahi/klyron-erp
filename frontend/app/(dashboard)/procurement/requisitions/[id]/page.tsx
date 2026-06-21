"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
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
} from "lucide-react";

const requisitionData = {
  id: "PR-2024-002",
  title: "IT Equipment Upgrade",
  requester: "Bob Smith",
  department: "Information Technology",
  date: "2024-01-14",
  priority: "High",
  status: "Pending",
  total: 15800.0,
  justification:
    "Current workstations are outdated and affecting productivity. Need to upgrade 10 developer workstations with latest hardware to support new development tools and improve efficiency.",
  specialInstructions:
    "Deliver to IT department, 3rd floor. Contact Bob Smith upon arrival.",
  items: [
    {
      id: 1,
      description: "Dell XPS 15 Developer Edition Laptop",
      quantity: 5,
      unit: "pcs",
      estimatedCost: 2400.0,
      total: 12000.0,
    },
    {
      id: 2,
      description: "27\" 4K Monitor - LG UltraFine",
      quantity: 5,
      unit: "pcs",
      estimatedCost: 600.0,
      total: 3000.0,
    },
    {
      id: 3,
      description: "Ergonomic Keyboard and Mouse Combo",
      quantity: 5,
      unit: "sets",
      estimatedCost: 160.0,
      total: 800.0,
    },
  ],
  approvalHistory: [
    {
      step: "Created",
      user: "Bob Smith",
      date: "2024-01-14 09:30",
      status: "Completed",
      comments: "Submitted for approval",
    },
    {
      step: "Department Manager",
      user: "Jane Doe",
      date: "2024-01-14 14:15",
      status: "Pending",
      comments: "Awaiting review",
    },
    {
      step: "Finance Review",
      user: "-",
      date: "-",
      status: "Waiting",
      comments: "",
    },
    {
      step: "Final Approval",
      user: "-",
      date: "-",
      status: "Waiting",
      comments: "",
    },
  ],
};

export default function RequisitionDetailPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [comment, setComment] = useState("");

  const tabs = [
    { id: "details", label: "Details" },
    { id: "approval", label: "Approval Workflow" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={requisitionData.id}
        description={requisitionData.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Requisitions", href: "/procurement/requisitions" },
          { label: requisitionData.id },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {requisitionData.status === "Pending" && (
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
            <button className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Reminder
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
                      <StatusBadge status={requisitionData.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <span className="text-foreground">
                        {requisitionData.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requester</p>
                      <p className="text-foreground">
                        {requisitionData.requester}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Department
                      </p>
                      <p className="text-foreground">
                        {requisitionData.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Request Date
                      </p>
                      <p className="text-foreground">
                        {requisitionData.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-foreground font-semibold">
                        ${requisitionData.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Business Justification
                    </p>
                    <p className="text-foreground bg-muted p-4 rounded-lg">
                      {requisitionData.justification}
                    </p>
                  </div>

                  {requisitionData.specialInstructions && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Special Instructions
                      </p>
                      <p className="text-foreground bg-muted p-4 rounded-lg">
                        {requisitionData.specialInstructions}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Requested Items
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium text-sm">
                              Description
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Qty
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Est. Cost
                            </th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium text-sm">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {requisitionData.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-border"
                            >
                              <td className="py-3 px-3 text-foreground">
                                {item.description}
                              </td>
                              <td className="py-3 px-3 text-right text-foreground">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="py-3 px-3 text-right text-foreground">
                                ${item.estimatedCost.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-foreground">
                                ${item.total.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-border">
                            <td
                              colSpan={3}
                              className="py-3 px-3 text-right font-medium text-foreground"
                            >
                              Total:
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-foreground">
                              ${requisitionData.total.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "approval" && (
                <div className="space-y-4">
                  {requisitionData.approvalHistory.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          step.status === "Completed"
                            ? "bg-success/20 text-success"
                            : step.status === "Pending"
                            ? "bg-warning/20 text-warning"
                            : "bg-muted-foreground/20 text-muted-foreground"
                        }`}
                      >
                        {step.status === "Completed" ? (
                          <Check className="h-4 w-4" />
                        ) : step.status === "Pending" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">
                            {step.step}
                          </p>
                          <StatusBadge status={step.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.user} • {step.date}
                        </p>
                        {step.comments && (
                          <p className="text-sm text-foreground mt-2 bg-background p-2 rounded">
                            {step.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        Requisition Created
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bob Smith • 2024-01-14 09:30
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        Created requisition with 3 items totaling $15,800.00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        Submitted for Approval
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bob Smith • 2024-01-14 09:35
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        Sent to Department Manager for review
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
            <h3 className="font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
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
            <h3 className="font-semibold text-foreground mb-4">
              Requester Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {requisitionData.requester}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {requisitionData.department}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}