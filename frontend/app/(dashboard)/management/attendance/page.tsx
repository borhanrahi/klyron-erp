"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name: string | null;
  employee_code: string | null;
  check_in: string | null;
  check_out: string | null;
  status: string;
  work_hours: number | null;
  late_minutes: number | null;
  date: string;
}

const attVariant = (s: string): "success" | "warning" | "danger" | "info" | "muted" => {
  if (s === "present") return "success";
  if (s === "late") return "warning";
  if (s === "absent") return "danger";
  if (s === "leave") return "info";
  return "muted";
};

export default function TeamAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchAttendance = (p: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "10" };
    if (search) params.search = search;
    if (selectedDate) params.date = selectedDate;
    apiGet<{ items: AttendanceRecord[]; total: number; page: number; pages: number }>("/hr/attendance", params)
      .then((res) => {
        setRecords(res.items);
        setTotal(res.total);
        setPage(res.page);
        setPages(res.pages);
      })
      .catch(() => {
        setRecords([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttendance(1);
  }, [selectedDate]);

  const formatTime = (t: string | null) => {
    if (!t) return "\u2014";
    try {
      const d = new Date(t);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return t;
    }
  };

  const formatHours = (h: number | null) => {
    if (!h) return "\u2014";
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  const getInitials = (name: string | null, id: number) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return `#${id}`;
  };

  const today = new Date().toISOString().split("T")[0];

  // Summary stats
  const present = records.filter((r) => r.status === "present" || r.status === "late").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const onLeave = records.filter((r) => r.status === "leave").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Attendance"
        description="Monitor daily attendance and work hours across your team"
      />

      {/* Summary Cards */}
      {!loading && records.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-success">{present}</p>
            <p className="text-xs text-muted-foreground mt-1">Present / Late</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-danger">{absent}</p>
            <p className="text-xs text-muted-foreground mt-1">Absent</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 text-center">
            <p className="text-2xl font-bold text-info">{onLeave}</p>
            <p className="text-xs text-muted-foreground mt-1">On Leave</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search attendance..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAttendance(1)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
              className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Check In</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Check Out</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Hours</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Late</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full inline-block mr-2" />
                    Loading attendance...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                    <UserCheck className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    No attendance records found for this date.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {getInitials(rec.employee_name, rec.employee_id)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{rec.employee_name || `Employee #${rec.employee_id}`}</p>
                          <p className="text-xs text-muted-foreground">{rec.employee_code || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{rec.date}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{formatTime(rec.check_in)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{formatTime(rec.check_out)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">{formatHours(rec.work_hours)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {rec.late_minutes ? `${rec.late_minutes}m` : "\u2014"}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={rec.status} variant={attVariant(rec.status)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total > 0 ? `Showing ${(page - 1) * 10 + 1}\u2013${Math.min(page * 10, total)} of ${total}` : "No results"}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchAttendance(page - 1)} disabled={page <= 1} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchAttendance(page + 1)} disabled={page >= pages} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
