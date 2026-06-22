"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { ClipboardList, Plus, Clock, CheckCircle, XCircle } from "lucide-react";

interface Request {
  id: number;
  subject: string;
  status: string;
  created_at: string;
}

export default function ESSRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ type: "general", subject: "", description: "", priority: "medium" });

  useEffect(() => {
    apiGet<{ data: Request[] }>("/ess/requests/history")
      .then((res) => setRequests(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      await apiPost("/ess/support/tickets", {
        subject: form.subject,
        description: form.description,
        category: form.type,
        priority: form.priority,
      });
      setMessage("Request submitted successfully");
      setShowForm(false);
      setForm({ type: "general", subject: "", description: "", priority: "medium" });
      apiGet<{ data: Request[] }>("/ess/requests/history").then((res) => setRequests(res.data || []));
    } catch {
      setMessage("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading requests...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Requests"
        description="Submit and track your requests."
        icon={<ClipboardList className="h-6 w-6 text-primary" />}
        actions={<button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95"><Plus className="h-4 w-4" /> New Request</button>}
      />

      {showForm && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">New Request</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Request subject" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Describe your request" />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSubmit} disabled={submitting || !form.subject} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95 disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
          {message && <p className="mt-2 text-xs text-green-500">{message}</p>}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 text-xs font-medium text-muted-foreground">ID</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Subject</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {requests.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No requests yet</td></tr>
              ) : requests.map((r) => (
                <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-mono text-xs">#{r.id}</td>
                  <td className="p-3 font-medium">{r.subject}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "open" ? "bg-blue-500/10 text-blue-500" :
                      r.status === "resolved" ? "bg-green-500/10 text-green-500" :
                      r.status === "closed" ? "bg-gray-500/10 text-gray-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {r.status === "open" ? <Clock className="h-3 w-3" /> :
                       r.status === "resolved" ? <CheckCircle className="h-3 w-3" /> :
                       <XCircle className="h-3 w-3" />}
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
