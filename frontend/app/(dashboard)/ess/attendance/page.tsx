"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { Clock, LogIn, LogOut, Calendar, BarChart3 } from "lucide-react";

interface TodayAttendance {
  check_in: string | null;
  check_out: string | null;
  status: string;
  work_hours: number | null;
}

interface AttendanceRecord {
  id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  late_minutes: number;
  ot_hours: number;
}

interface AttendanceSummary {
  month: number;
  year: number;
  total_days: number;
  present: number;
  late: number;
  absent: number;
  total_hours: number;
  avg_hours: number;
}

export default function ESSAttendancePage() {
  const [today, setToday] = useState<TodayAttendance | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const [todayRes, histRes, sumRes] = await Promise.all([
        apiGet<{ data: TodayAttendance }>("/ess/attendance/today"),
        apiGet<{ data: AttendanceRecord[]; total: number }>(`/ess/attendance/history?page=${page}&per_page=10`),
        apiGet<{ data: AttendanceSummary }>("/ess/attendance/summary?month=" + (new Date().getMonth() + 1) + "&year=" + new Date().getFullYear()),
      ]);
      setToday(todayRes.data);
      setHistory(histRes.data);
      setTotal(histRes.total);
      setSummary(sumRes.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [page]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      await apiPost("/ess/attendance/check-in", { method: "manual" });
      setMessage("Checked in successfully");
      loadData();
    } catch (e: unknown) {
      const err = e as Error;
      setMessage(err.message?.includes("Already") ? "Already checked in today" : "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      await apiPost("/ess/attendance/check-out", {});
      setMessage("Checked out successfully");
      loadData();
    } catch {
      setMessage("Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading attendance...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Attendance"
        description="Track your daily attendance and history."
        icon={<Clock className="h-6 w-6 text-primary" />}
      />

      {/* Check-in/out & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Today&apos;s Status</p>
          <p className="text-lg font-bold text-primary">{today?.status || "N/A"}</p>
          {today?.check_in && <p className="text-xs text-muted-foreground mt-1">In: {today.check_in.substring(11, 16)}</p>}
          {today?.check_out && <p className="text-xs text-muted-foreground">Out: {today.check_out.substring(11, 16)}</p>}
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 flex flex-col gap-2">
          <button
            onClick={handleCheckIn}
            disabled={actionLoading || !!today?.check_in}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors active:scale-95 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" /> Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={actionLoading || !today?.check_in || !!today?.check_out}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors active:scale-95 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" /> Check Out
          </button>
          {message && <p className="text-xs text-center text-muted-foreground">{message}</p>}
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Days This Month</p>
          <p className="text-2xl font-bold">{summary?.total_days || 0}</p>
          <p className="text-xs text-green-500">{summary?.present || 0} present</p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Avg Hours/Day</p>
          <p className="text-2xl font-bold">{summary?.avg_hours?.toFixed(1) || "0.0"}</p>
          <p className="text-xs text-muted-foreground">{summary?.total_hours?.toFixed(1) || 0}h total</p>
        </div>
      </div>

      {/* History */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Check In</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Check Out</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Late</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">OT Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {history.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No attendance records</td></tr>
              ) : history.map((r) => (
                <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-medium">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-3">{r.check_in ? new Date(r.check_in).toLocaleTimeString() : "-"}</td>
                  <td className="p-3">{r.check_out ? new Date(r.check_out).toLocaleTimeString() : "-"}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "present" ? "bg-green-500/10 text-green-500" :
                      r.status === "late" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>{r.status}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{r.late_minutes}m</td>
                  <td className="p-3 text-muted-foreground">{r.ot_hours}h</td>
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
