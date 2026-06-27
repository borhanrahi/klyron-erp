"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  UserCog,
  Users,
  Calendar,
  ClipboardList,
  Mail,
  Building2,
  Briefcase,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Employee {
  id: number;
  full_name: string | null;
  employee_code: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  department_name: string | null;
  status: string;
  joining_date: string | null;
  reporting_to: number | null;
  user_id: number | null;
}

interface Team {
  id: number;
  name: string;
  member_count: number;
  lead_id: number | null;
  lead_name: string | null;
}

interface CurrentUser {
  id: number;
  email: string;
  full_name: string;
  company_id: number | null;
}

const statusVariant = (s: string): "success" | "warning" | "muted" | "danger" => {
  if (s === "active") return "success";
  if (s === "on_leave") return "warning";
  if (s === "resigned" || s === "terminated") return "danger";
  return "muted";
};

export default function MyTeamPage() {
  const [directReports, setDirectReports] = useState<Employee[]>([]);
  const [managingTeams, setManagingTeams] = useState<Team[]>([]);
  const [myEmployeeId, setMyEmployeeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Get current user info
      const authUser = await apiGet<CurrentUser>("/auth/me");
      const userId = authUser.id;

      // Step 2: Get all employees to find the one linked to current user
      const empRes = await apiGet<{ items: Employee[]; total: number }>(
        "/hr/employee-directory",
        { per_page: "100", status: "active" }
      );
      const allEmployees = empRes.items || [];

      // Step 3: Find this user's employee record (Employee.user_id === User.id)
      const myEmployee = allEmployees.find((e) => e.user_id === userId);
      if (myEmployee) {
        setMyEmployeeId(myEmployee.id);

        // Step 4: Get direct reports (employees where reporting_to === myEmployee.id)
        const myReports = allEmployees.filter((e) => e.reporting_to === myEmployee.id);
        setDirectReports(myReports);

        // Step 5: Get teams where current user is the lead
        try {
          const teamsRes = await apiGet<{ items: Team[] }>("/hr/teams", { per_page: "50" });
          const teams = teamsRes.items || [];
          setManagingTeams(teams.filter((t) => t.lead_id === myEmployee.id));
        } catch {
          setManagingTeams([]);
        }
      } else {
        // User has no employee record — they may be an admin
        setDirectReports([]);
        setManagingTeams([]);
        setError("No employee record found for your account. Contact an HR admin.");
      }
    } catch (err) {
      setError("Could not load from API. Ensure the backend server is running and you're logged in.");
      setDirectReports([]);
      setManagingTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeMembers = directReports.filter((e) => e.status === "active");
  const onLeave = directReports.filter((e) => e.status === "on_leave");

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Team (Supervisor)"
        description="Manage your direct reports and team assignments."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "My Team" },
        ]}
        icon={<UserCog className="h-6 w-6 text-primary" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Direct Reports</p>
              <p className="text-xl font-bold">{loading ? "..." : directReports.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success/10 rounded-xl"><CheckCircle className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-xl font-bold">{loading ? "..." : activeMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-warning/10 rounded-xl"><AlertCircle className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-xs text-muted-foreground">On Leave</p>
              <p className="text-xl font-bold">{loading ? "..." : onLeave.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-info/10 rounded-xl"><ClipboardList className="h-5 w-5 text-info" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Teams Led</p>
              <p className="text-xl font-bold">{loading ? "..." : managingTeams.length}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-sm text-warning">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "members", label: "Direct Reports", icon: Users },
          { id: "teams", label: "Teams Managed", icon: ClipboardList },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {/* Direct Reports Tab */}
      {activeTab === "members" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">Loading...</div>
          ) : directReports.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No direct reports found.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {myEmployeeId
                  ? "You don't have anyone reporting to you yet. Assign employees to report to you from their profile."
                  : "Link your user account to an employee record to view your team."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Code</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Department</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Designation</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Joined</th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {directReports.map((emp) => (
                      <tr key={emp.id} className="hover:bg-muted/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {(emp.full_name || emp.employee_code || "??").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{emp.full_name || emp.employee_code}</p>
                              <p className="text-xs text-muted-foreground">{emp.email || emp.phone || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-sm font-mono text-muted-foreground">{emp.employee_code}</span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground">{emp.department_name || "—"}</span>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <span className="text-sm text-muted-foreground">{emp.designation || "—"}</span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={emp.status} variant={statusVariant(emp.status)} />
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/hr/employees/${emp.id}`}
                              className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1"
                            >
                              View Profile <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Showing {directReports.length} direct report(s)</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Teams Managed Tab */}
      {activeTab === "teams" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">Teams You Lead</h3>
          </div>
          {managingTeams.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">You are not leading any teams yet.</p>
              <Link href="/hr/teams" className="text-sm text-primary hover:underline mt-1 inline-block">
                Browse Teams
              </Link>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {managingTeams.map((team) => (
                <Link
                  key={team.id}
                  href="/hr/teams"
                  className="border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all block"
                >
                  <h4 className="font-semibold text-sm">{team.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{team.member_count} members</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Supervisor Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "View Team Directory", href: "/hr/employees", icon: Users },
            { label: "Manage Teams", href: "/hr/teams", icon: ClipboardList },
            { label: "Org Chart", href: "/hr/org-chart", icon: Building2 },
            { label: "Leave Approvals", href: "/hr/leaves", icon: Calendar },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <action.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
