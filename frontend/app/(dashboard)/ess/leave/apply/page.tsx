"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import {
  Calendar,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Plane,
  Stethoscope,
  Heart,
  Baby,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

interface LeaveType {
  id: number;
  name: string;
  days_per_year: number;
  is_paid: boolean;
}

interface LeaveBalance {
  id: number;
  leave_type_id: number;
  leave_type_name: string;
  entitled: number;
  used: number;
  remaining: number;
}

const LEAVE_ICONS: Record<string, typeof Calendar> = {
  "Annual Leave": Plane,
  "Sick Leave": Stethoscope,
  "Personal Leave": Heart,
  "Maternity Leave": Baby,
  "Paternity Leave": Baby,
  "Study Leave": GraduationCap,
  "Compensatory Leave": CalendarDays,
};

function calcBusinessDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  let days = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) days++;
    cur.setDate(cur.getDate() + 1);
  }
  return Math.max(days, 1);
}

export default function ApplyLeavePage() {
  const router = useRouter();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    leave_type_id: 0,
    start_date: "",
    end_date: "",
    days: 1,
    reason: "",
  });

  const selectedType = leaveTypes.find((t) => t.id === form.leave_type_id);
  const selectedBalance = balances.find(
    (b) => b.leave_type_id === form.leave_type_id
  );

  useEffect(() => {
    Promise.all([
      apiGet<{ data: LeaveType[] }>("/ess/leave/types"),
      apiGet<{ data: LeaveBalance[] }>("/ess/leave/balance"),
    ])
      .then(([typesRes, balRes]) => {
        setLeaveTypes(typesRes.data || []);
        setBalances(balRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (form.start_date && form.end_date) {
      const days = calcBusinessDays(form.start_date, form.end_date);
      setForm((f) => ({ ...f, days }));
    }
  }, [form.start_date, form.end_date]);

  const handleSubmit = async () => {
    setError("");
    if (!form.leave_type_id) {
      setError("Please select a leave type");
      return;
    }
    if (!form.start_date) {
      setError("Please select a start date");
      return;
    }
    if (!form.end_date) {
      setError("Please select an end date");
      return;
    }
    if (new Date(form.end_date) < new Date(form.start_date)) {
      setError("End date cannot be before start date");
      return;
    }
    if (selectedBalance && form.days > selectedBalance.remaining) {
      setError(
        `Insufficient balance. You have ${selectedBalance.remaining} day(s) remaining for ${selectedType?.name}`
      );
      return;
    }

    setSubmitting(true);
    try {
      await apiPost("/ess/leave/apply", {
        leave_type_id: form.leave_type_id,
        start_date: form.start_date,
        end_date: form.end_date,
        days: form.days,
        reason: form.reason || undefined,
      });
      setSuccess(true);
    } catch {
      setError("Failed to submit leave request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading leave types...
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-200">
        <PageHeader
          title="Apply for Leave"
          description="Submit a new leave request"
          icon={<Calendar className="h-6 w-6 text-primary" />}
        />
        <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Leave Request Submitted</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Your leave request for{" "}
            <span className="font-medium text-foreground">
              {selectedType?.name}
            </span>{" "}
            from{" "}
            <span className="font-medium text-foreground">
              {new Date(form.start_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {new Date(form.end_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>{" "}
            ({form.days} day{form.days !== 1 ? "s" : ""}) has been submitted
            for approval.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSuccess(false);
                setForm({
                  leave_type_id: 0,
                  start_date: "",
                  end_date: "",
                  days: 1,
                  reason: "",
                });
              }}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Apply Another
            </button>
            <button
              onClick={() => router.push("/ess/leave")}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95"
            >
              View My Leaves
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Apply for Leave"
        description="Submit a new leave request"
        icon={<Calendar className="h-6 w-6 text-primary" />}
        actions={
          <button
            onClick={() => router.push("/ess/leave")}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Leave
          </button>
        }
      />

      {/* Balance Summary */}
      {balances.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {balances.map((b) => {
            const Icon = LEAVE_ICONS[b.leave_type_name] || Calendar;
            const isSelected = form.leave_type_id === b.leave_type_id;
            const pct =
              b.entitled > 0
                ? ((b.entitled - b.remaining) / b.entitled) * 100
                : 0;
            return (
              <button
                key={b.id}
                onClick={() =>
                  setForm((f) => ({ ...f, leave_type_id: b.leave_type_id }))
                }
                className={`rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    className={`h-4 w-4 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs font-medium truncate">
                    {b.leave_type_name}
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {b.remaining}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  of {b.entitled} days
                </p>
                <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isSelected ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Form */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold">Leave Details</h3>
        </div>
        <div className="p-5 space-y-5">
          {/* Leave Type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Leave Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {leaveTypes.map((lt) => {
                const Icon = LEAVE_ICONS[lt.name] || Calendar;
                const isActive = form.leave_type_id === lt.id;
                return (
                  <button
                    key={lt.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, leave_type_id: lt.id }))
                    }
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div>
                      <div className="text-xs font-medium">{lt.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {lt.days_per_year}d/yr
                        {lt.is_paid ? " • Paid" : " • Unpaid"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Start Date *
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, start_date: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                End Date *
              </label>
              <input
                type="date"
                value={form.end_date}
                min={form.start_date || undefined}
                onChange={(e) =>
                  setForm((f) => ({ ...f, end_date: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Number of Days
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.days}
                  min={1}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, days: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-0.5" />
                  biz days
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Reason / Notes
            </label>
            <textarea
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
              rows={3}
              placeholder="Optional — provide a reason for your leave request"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Balance Warning */}
          {selectedBalance && form.days > 0 && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-xs ${
                form.days > selectedBalance.remaining
                  ? "bg-danger/10 text-danger border border-danger/20"
                  : "bg-info/10 text-info border border-info/20"
              }`}
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                {form.days > selectedBalance.remaining ? (
                  <span>
                    <strong>Insufficient balance.</strong> You have{" "}
                    {selectedBalance.remaining} day(s) remaining for{" "}
                    {selectedType?.name}. You are requesting {form.days} day(s).
                  </span>
                ) : (
                  <span>
                    Requesting <strong>{form.days}</strong> day(s) from{" "}
                    <strong>{selectedBalance.remaining}</strong> remaining{" "}
                    {selectedType?.name} balance.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-danger/10 text-danger border border-danger/20 text-xs">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => router.push("/ess/leave")}
              className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.leave_type_id || !form.start_date}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
