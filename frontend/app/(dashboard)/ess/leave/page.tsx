"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { Calendar, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

interface LeaveBalance {
  id: number;
  leave_type_id: number;
  leave_type_name: string;
  entitled: number;
  used: number;
  remaining: number;
}

interface LeaveRecord {
  id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

interface LeaveType {
  id: number;
  name: string;
  days_per_year: number;
  is_paid: boolean;
}

export default function ESSLeavePage() {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ leave_type_id: 0, start_date: "", end_date: "", days: 1, reason: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [balRes, histRes, typesRes] = await Promise.all([
        apiGet<any>("/ess/leave/balance"),
        apiGet<any>(`/ess/leave/history?page=${page}&per_page=10`),
        apiGet<any>("/ess/leave/types"),
      ]);
      setBalances(balRes.data || balRes.items || []);
      setHistory(histRes.data || histRes.items || []);
      setTotal(histRes.total || 0);
      setLeaveTypes(typesRes.data || typesRes.items || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [page]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      await apiPost("/ess/leave/apply", form);
      setMessage("Leave request submitted successfully");
      setShowForm(false);
      setForm({ leave_type_id: 0, start_date: "", end_date: "", days: 1, reason: "" });
      loadData();
    } catch {
      setMessage("Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading leave data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Leave"
        description="Manage your leave balance and requests."
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={<Link href="/ess/leave/apply" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95"><Plus className="h-4 w-4" /> Apply Leave</Link>}
      />

      {/* Leave Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border bg-card shadow-sm p-4">
            <p className="text-xs text-muted-foreground">{b.leave_type_name}</p>
            <p className="text-2xl font-bold mt-1">{b.remaining}</p>
            <p className="text-xs text-muted-foreground">of {b.entitled} days remaining</p>
            <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${((b.entitled - b.remaining) / Math.max(b.entitled, 1)) * 100}%` }} />
            </div>
          </div>
        ))}
        {balances.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card shadow-sm p-6 text-center text-muted-foreground">
            No leave balances found
          </div>
        )}
      </div>

      {/* Apply Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Apply for Leave</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Leave Type</label>
              <select
                value={form.leave_type_id}
                onChange={(e) => setForm({ ...form, leave_type_id: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value={0}>Select type</option>
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>{lt.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Days</label>
              <input type="number" value={form.days} min={1} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-muted-foreground">Reason</label>
            <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSubmit} disabled={submitting || !form.leave_type_id || !form.start_date} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95 disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
          </div>
          {message && <p className="mt-2 text-xs text-green-500">{message}</p>}
        </div>
      )}

      {/* History */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Leave History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 text-xs font-medium text-muted-foreground">Type</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Start</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">End</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Days</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {history.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No leave records</td></tr>
              ) : history.map((r) => (
                <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-medium">{leaveTypes.find(lt => lt.id === r.leave_type_id)?.name || "N/A"}</td>
                  <td className="p-3">{new Date(r.start_date).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(r.end_date).toLocaleDateString()}</td>
                  <td className="p-3">{r.days}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "approved" ? "bg-green-500/10 text-green-500" :
                      r.status === "rejected" ? "bg-red-500/10 text-red-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {r.status === "approved" ? <CheckCircle className="h-3 w-3" /> :
                       r.status === "rejected" ? <XCircle className="h-3 w-3" /> :
                       <Clock className="h-3 w-3" />}
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground max-w-[200px] truncate">{r.reason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 10 && (
          <div className="p-3 border-t border-border flex justify-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-xs rounded-lg border border-border hover:bg-muted disabled:opacity-50">Prev</button>
            <span className="px-3 py-1 text-xs text-muted-foreground">Page {page}</span>
            <button onClick={() => setPage(page + 1)} disabled={page * 10 >= total} className="px-3 py-1 text-xs rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
