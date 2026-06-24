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
  Loader2,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

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
    const params: Record<string, string> = { page: String(p), per_page: "10" };
    if (searchTerm) params.search = searchTerm;
    if (selectedDate) params.date = selectedDate;
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

  useEffect(() => {
    fetchAttendance(1);
  }, [selectedDate]);

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

  const getInitials = (name: string | null, id: number) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return `#${id}`;
  };

  return (
    <div className="space-y-4 animate-in fade-in-0 duration-200">
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
        <div className="p-3 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAttendance(1)}
                className="w-full pl-9 pr-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              className="px-3 py-1.5 bg-muted text-foreground border border-border rounded-lg text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-medium text-muted-foreground py-2 px-3">Employee</th>
                <th className="text-left font-medium text-muted-foreground py-2 px-3">Date</th>
                <th className="text-left font-medium text-muted-foreground py-2 px-3 hidden md:table-cell">Check In</th>
                <th className="text-left font-medium text-muted-foreground py-2 px-3 hidden md:table-cell">Check Out</th>
                <th className="text-left font-medium text-muted-foreground py-2 px-3 hidden lg:table-cell">Hours</th>
                <th className="text-left font-medium text-muted-foreground py-2 px-3 hidden lg:table-cell">Late</th>
                <th className="text-left font-medium text-muted-foreground py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                    Loading...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">No records found.</td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">
                          {getInitials(rec.employee_name, rec.employee_id)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{rec.employee_name || `#${rec.employee_id}`}</p>
                          <p className="text-muted-foreground">{rec.employee_code || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{rec.date}</td>
                    <td className="py-2 px-3 text-muted-foreground hidden md:table-cell">{formatTime(rec.check_in)}</td>
                    <td className="py-2 px-3 text-muted-foreground hidden md:table-cell">{formatTime(rec.check_out)}</td>
                    <td className="py-2 px-3 text-muted-foreground hidden lg:table-cell">{formatHours(rec.work_hours)}</td>
                    <td className="py-2 px-3 text-muted-foreground hidden lg:table-cell">
                      {rec.late_minutes ? `${rec.late_minutes}m` : "—"}
                    </td>
                    <td className="py-2 px-3">
                      <StatusBadge status={rec.status} variant={attStatusVariant(rec.status)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-3 py-2 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {total > 0 ? `Showing ${(page - 1) * 10 + 1}–${Math.min(page * 10, total)} of ${total}` : "No results"}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => fetchAttendance(page - 1)} disabled={page <= 1} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 py-0.5 bg-primary text-white rounded text-xs font-medium">{page}</span>
            <span className="text-xs text-muted-foreground">of {pages}</span>
            <button onClick={() => fetchAttendance(page + 1)} disabled={page >= pages} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
