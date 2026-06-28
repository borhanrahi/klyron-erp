"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { usePermissions } from "@/hooks/usePermissions";
import { PageHeader } from "@/components/common/PageHeader";
import { KPICard } from "@/components/common/KPICard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  CalendarCheck,
  HandCoins,
  Clock,
  ClipboardCheck,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface DashboardStats {
  team_size: number;
  pending_leaves: number;
  pending_loans: number;
  attendance_today: number;
  open_tasks: number;
  pending_reviews: number;
}

interface PendingItem {
  id: number;
  type: "leave" | "loan";
  employee_name: string;
  reason: string;
  amount?: number;
  days?: number;
  status: string;
  created_at: string;
}

export default function ManagementDashboard() {
  const { profile, loading } = usePermissions();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && profile) {
      fetchDashboard();
    }
  }, [loading, profile]);

  async function fetchDashboard() {
    try {
      setFetching(true);
      const [leavesRes, loansRes] = await Promise.allSettled([
        apiGet<any>("/hr/leaves?per_page=5&status=pending"),
        apiGet<any>("/hr/loans?per_page=5&status=pending"),
      ]);

      setStats({
        team_size: 24,
        pending_leaves: 0,
        pending_loans: 0,
        attendance_today: 18,
        open_tasks: 5,
        pending_reviews: 2,
      });

      const combined: PendingItem[] = [];

      if (leavesRes.status === "fulfilled" && leavesRes.value) {
        const leaves = leavesRes.value.items || leavesRes.value.data?.items || [];
        leaves.forEach((l: any) => {
          combined.push({
            id: l.id,
            type: "leave",
            employee_name: l.employee_name || `Employee #${l.employee_id}`,
            reason: l.reason || "Leave request",
            days: l.days || 1,
            status: l.status,
            created_at: l.created_at,
          });
        });
      }

      if (loansRes.status === "fulfilled" && loansRes.value) {
        const loans = loansRes.value.items || loansRes.value.data?.items || [];
        loans.forEach((l: any) => {
          combined.push({
            id: l.id,
            type: "loan",
            employee_name: l.employee_name || `Employee #${l.employee_id}`,
            reason: l.reason || "Loan request",
            amount: l.amount || 0,
            status: l.status,
            created_at: l.created_at,
          });
        });
      }

      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setPendingItems(combined.slice(0, 10));
    } catch {
      setStats({ team_size: 0, pending_leaves: 0, pending_loans: 0, attendance_today: 0, open_tasks: 0, pending_reviews: 0 });
    } finally {
      setFetching(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Management Dashboard"
        description={`Welcome back, ${profile.full_name}`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          label="Team Size"
          value={stats?.team_size ?? 0}
          icon={<Users className="h-5 w-5" />}
          color="primary"
        />
        <KPICard
          label="Pending Leaves"
          value={stats?.pending_leaves ?? 0}
          icon={<CalendarCheck className="h-5 w-5" />}
          color="warning"
        />
        <KPICard
          label="Pending Loans"
          value={stats?.pending_loans ?? 0}
          icon={<HandCoins className="h-5 w-5" />}
          color="warning"
        />
        <KPICard
          label="Today Attendance"
          value={stats?.attendance_today ?? 0}
          icon={<Clock className="h-5 w-5" />}
          color="success"
        />
        <KPICard
          label="Open Tasks"
          value={stats?.open_tasks ?? 0}
          icon={<ClipboardCheck className="h-5 w-5" />}
          color="accent"
        />
        <KPICard
          label="Pending Reviews"
          value={stats?.pending_reviews ?? 0}
          icon={<TrendingUp className="h-5 w-5" />}
          color="accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/management/leaves"
          className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Leave Approvals</p>
            <p className="text-xs text-muted-foreground">{stats?.pending_leaves ?? 0} pending</p>
          </div>
        </a>
        <a
          href="/management/loans"
          className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <HandCoins className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Loan Approvals</p>
            <p className="text-xs text-muted-foreground">{stats?.pending_loans ?? 0} pending</p>
          </div>
        </a>
        <a
          href="/management/my-team"
          className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">My Team</p>
            <p className="text-xs text-muted-foreground">{stats?.team_size ?? 0} members</p>
          </div>
        </a>
      </div>

      {/* Pending Approvals */}
      <div className="rounded-xl bg-card border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Pending Approvals</h2>
        </div>
        <div className="p-4">
          {fetching ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p>No pending approvals. All caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${item.type === "leave" ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
                      {item.type === "leave" ? (
                        <CalendarCheck className="h-4 w-4 text-amber-500" />
                      ) : (
                        <HandCoins className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.employee_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type === "leave"
                          ? `${item.reason} (${item.days} day${item.days && item.days > 1 ? "s" : ""})`
                          : `${item.reason} - $${item.amount?.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
