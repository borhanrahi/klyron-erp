"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { HeadphonesIcon, Plus, Clock, CheckCircle, MessageSquare } from "lucide-react";

interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  status: string;
  created_at: string;
}

export default function ESSSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ subject: "", description: "", category: "general", priority: "medium" });

  const loadTickets = () => {
    apiGet<{ data: Ticket[] }>("/ess/support/tickets")
      .then((res) => setTickets(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTickets(); }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      await apiPost("/ess/support/tickets", form);
      setMessage("Ticket created successfully");
      setShowForm(false);
      setForm({ subject: "", description: "", category: "general", priority: "medium" });
      loadTickets();
    } catch {
      setMessage("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading support tickets...</div>;

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Support Tickets"
        description="Create and track your support requests."
        icon={<HeadphonesIcon className="h-6 w-6 text-primary" />}
        actions={<button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95"><Plus className="h-4 w-4" /> New Ticket</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Tickets</p>
          <p className="text-2xl font-bold mt-1">{tickets.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground">Open</p>
          <p className="text-2xl font-bold mt-1 text-yellow-500">{openCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold mt-1 text-green-500">{tickets.filter((t) => t.status === "resolved" || t.status === "closed").length}</p>
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Create Support Ticket</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option value="general">General</option>
                <option value="it">IT Support</option>
                <option value="hr">HR</option>
                <option value="facilities">Facilities</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSubmit} disabled={submitting || !form.subject} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95 disabled:opacity-50">
              {submitting ? "Creating..." : "Create Ticket"}
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
                <th className="p-3 text-xs font-medium text-muted-foreground">Ticket #</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Subject</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Category</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {tickets.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No tickets yet</td></tr>
              ) : tickets.map((t) => (
                <tr key={t.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-mono text-xs">{t.ticket_number}</td>
                  <td className="p-3 font-medium">{t.subject}</td>
                  <td className="p-3 text-muted-foreground">{t.category || "-"}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.priority === "urgent" ? "bg-red-500/10 text-red-500" :
                      t.priority === "high" ? "bg-orange-500/10 text-orange-500" :
                      t.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-gray-500/10 text-gray-500"
                    }`}>{t.priority || "medium"}</span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === "open" ? "bg-blue-500/10 text-blue-500" :
                      t.status === "resolved" || t.status === "closed" ? "bg-green-500/10 text-green-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {t.status === "open" ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
