"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
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
  overtime_hours: number | null;
  late_minutes: number | null;
  date: string;
}

interface AttendanceListResponse {
  items: AttendanceRecord[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

const attStatusVariant = (s: string): "success" | "warning" | "danger" | "info" | "muted" => {
  if (s === "present") return "success";
  if (s === "late") return "warning";
  if (s === "absent") return "danger";
  if (s === "leave") return "info";
  return "muted";
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchAttendance = (p: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(p), per_page: "15" };
    if (searchTerm) params.search = searchTerm;
    apiGet<AttendanceListResponse>("/hr/attendance", params)
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
  }, []);

  const formatTime = (t: string | null) => {
    if (!t) return "—";
    try {
      const d = new Date(t);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return t;
    }
  };

  const formatHours = (h: number | null) => {
    if (!h) return "—";
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Attendance Tracking"
        description="Monitor daily attendance and work hours."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Attendance" },
        ]}
        icon={<Clock className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search attendance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAttendance(1)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <button
              onClick={() => fetchAttendance(1)}
              className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee ID</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Check In</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Check Out</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Hours</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">Loading attendance...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No attendance records found.</td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {(rec.employee_name || `#${rec.employee_id}`).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{rec.employee_name || `Employee #${rec.employee_id}`}</p>
                          <p className="text-xs text-muted-foreground">{rec.employee_code || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{rec.date}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{formatTime(rec.check_in)}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{formatTime(rec.check_out)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{formatHours(rec.work_hours)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={rec.status} variant={attStatusVariant(rec.status)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {records.length} of {total} records</p>
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
