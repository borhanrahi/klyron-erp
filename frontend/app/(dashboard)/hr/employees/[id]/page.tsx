"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Edit,
  ArrowLeft,
  FileText,
  Laptop,
  Clock,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Star,
  CheckCircle,
  GitBranch,
  Heart,
  Activity,
  Users,
  X,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────

interface EmployeeDetail {
  id: number;
  employee_code: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  blood_group: string | null;
  nationality: string | null;
  national_id: string | null;
  passport_number: string | null;
  present_address: string | null;
  permanent_address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;
  department_name: string | null;
  department_id: number | null;
  designation: string | null;
  designation_id: number | null;
  employment_type_id: number | null;
  work_location_id: number | null;
  shift_id: number | null;
  reporting_to: number | null;
  secondary_supervisor_id: number | null;
  skip_level_manager_id: number | null;
  salary: number;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_routing_number: string | null;
  tax_id: string | null;
  joining_date: string | null;
  resignation_date: string | null;
  status: string;
  photo_url: string | null;
  created_at: string | null;
}

interface Team {
  id: number;
  name: string;
  lead_name: string | null;
  member_count: number;
}

interface Dependent {
  id: number;
  name: string;
  relationship_type: string;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  is_beneficiary: boolean;
  is_emergency_contact: boolean;
  occupation: string | null;
}

interface LifecycleEvent {
  id: number;
  from_status: string | null;
  to_status: string;
  reason: string | null;
  effective_date: string | null;
  changed_by_name: string | null;
  employee_code: string | null;
  created_at: string | null;
}

// ─── Status Helpers ─────────────────────────────────────────────────────────

const statusVariant = (s: string): "success" | "warning" | "muted" | "danger" | "info" => {
  if (s === "active") return "success";
  if (s === "on_leave") return "warning";
  if (s === "resigned" || s === "terminated") return "danger";
  if (s === "onboarding") return "info";
  return "muted";
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function EmployeeProfilePage() {
  const params = useParams();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [lifecycle, setLifecycle] = useState<LifecycleEvent[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  const fetchEmployee = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch employee details
      const empRes = await apiGet<{ data: EmployeeDetail }>(`/hr/employees/${employeeId}`);
      setEmployee(empRes.data);

      // Fetch teams
      try {
        const teamsRes = await apiGet<{ data: Team[] }>(`/hr/employees/${employeeId}/teams`);
        setTeams(teamsRes.data || []);
      } catch { setTeams([]); }

      // Fetch dependents
      try {
        const depRes = await apiGet<{ data: Dependent[] }>(`/hr/employees/${employeeId}/dependents`);
        setDependents(depRes.data || []);
      } catch { setDependents([]); }

      // Fetch lifecycle
      try {
        const lcRes = await apiGet<{ data: LifecycleEvent[] }>(`/hr/employees/${employeeId}/lifecycle`);
        setLifecycle(lcRes.data || []);
      } catch { setLifecycle([]); }

      // Fetch documents
      try {
        const docRes = await apiGet<{ items: any[] } | { data: any[] }>("/hr/employee-documents", { per_page: "20" });
        const docs = (docRes as any).items || (docRes as any).data || [];
        setDocuments(docs.filter((d: any) => d.employee_id === Number(employeeId)));
      } catch { setDocuments([]); }

      // Fetch attendance
      try {
        const attRes = await apiGet<{ items: any[] } | { data: any[] }>("/hr/attendance", { per_page: "10" });
        const atts = (attRes as any).items || (attRes as any).data || [];
        setAttendance(atts.filter((a: any) => a.employee_id === Number(employeeId)).slice(0, 5));
      } catch { setAttendance([]); }

      // Fetch trainings
      try {
        const trRes = await apiGet<{ items: any[] } | { data: any[] }>("/hr/trainings", { per_page: "20" });
        const trs = (trRes as any).items || (trRes as any).data || [];
        setTrainings(trs.slice(0, 5));
      } catch { setTrainings([]); }

      // Fetch performance reviews
      try {
        const perfRes = await apiGet<{ items: any[] } | { data: any[] }>("/hr/performance-reviews", { per_page: "10" });
        const perfs = (perfRes as any).items || (perfRes as any).data || [];
        setPerformances(perfs.filter((p: any) => p.employee_id === Number(employeeId)));
      } catch { setPerformances([]); }
    } catch {
      setError("Failed to load employee data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchEmployee();
  }, [employeeId]);

  // ─── Tabs ───────────────────────────────────────────────────────────────

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "teams", label: "Teams", icon: GitBranch },
    { id: "dependents", label: "Dependents", icon: Heart },
    { id: "lifecycle", label: "Lifecycle", icon: Activity },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "training", label: "Training", icon: GraduationCap },
    { id: "performance", label: "Performance", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Employee Profile"
          description={error || "Employee not found"}
          breadcrumbs={[{ label: "HRM", href: "/hr" }, { label: "Employees", href: "/hr/employees" }, { label: "Profile" }]}
          icon={<User className="h-6 w-6 text-primary" />}
          actions={
            <Link href="/hr/employees" className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          }
        />
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <User className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">{error || "Employee not found"}</p>
        </div>
      </div>
    );
  }

  const name = employee.full_name || `${employee.first_name || ""} ${employee.last_name || ""}`.trim() || employee.employee_code;
  const avatarLetters = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={name}
        description={`${employee.designation || "No Designation"} · ${employee.department_name || "No Department"}`}
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Employees", href: "/hr/employees" },
          { label: name },
        ]}
        icon={<User className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/hr/employees"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2 cursor-pointer">
              <Edit className="h-4 w-4" /> Edit Profile
            </button>
          </div>
        }
      />

      {/* Profile Summary */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">{avatarLetters}</div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{employee.email || "—"}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{employee.phone || "—"}</span></div>
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{employee.department_name || "—"}</span></div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Code: {employee.employee_code}</span></div>
          </div>
          <StatusBadge status={employee.status} variant={statusVariant(employee.status)} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
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

      {/* ── Personal Tab ─────────────────────────────────────────────────── */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: name },
                { label: "Email", value: employee.email || "—" },
                { label: "Phone", value: employee.phone || "—" },
                { label: "Date of Birth", value: employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : "—" },
                { label: "Gender", value: employee.gender || "—" },
                { label: "Marital Status", value: employee.marital_status || "—" },
                { label: "Blood Group", value: employee.blood_group || "—" },
                { label: "Nationality", value: employee.nationality || "—" },
                { label: "National ID", value: employee.national_id || "—" },
                { label: "Passport No.", value: employee.passport_number || "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Contact & Address</h3>
              <div className="space-y-4">
                {[
                  { label: "Present Address", value: employee.present_address || "—" },
                  { label: "Permanent Address", value: employee.permanent_address || "—" },
                ].map((item) => (
                  <div key={item.label} className="py-2 border-b border-border/50 last:border-0">
                    <span className="text-xs text-muted-foreground block mb-1">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                {[
                  { label: "Name", value: employee.emergency_contact_name || "—" },
                  { label: "Phone", value: employee.emergency_contact_phone || "—" },
                  { label: "Relation", value: employee.emergency_contact_relation || "—" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Employment Tab ──────────────────────────────────────────────── */}
      {activeTab === "employment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
            <div className="space-y-4">
              {[
                { label: "Department", value: employee.department_name || "—" },
                { label: "Designation", value: employee.designation || "—" },
                { label: "Employee Code", value: employee.employee_code },
                { label: "Join Date", value: employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : "—" },
                { label: "Status", value: employee.status },
                { label: "Employment Type ID", value: employee.employment_type_id?.toString() || "—" },
                { label: "Work Location ID", value: employee.work_location_id?.toString() || "—" },
                { label: "Shift ID", value: employee.shift_id?.toString() || "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Reporting Structure</h3>
            <div className="space-y-4">
              {[
                { label: "Reporting To (Supervisor)", value: employee.reporting_to ? `Employee #${employee.reporting_to}` : "Not assigned" },
                { label: "Secondary Supervisor", value: employee.secondary_supervisor_id ? `Employee #${employee.secondary_supervisor_id}` : "Not assigned" },
                { label: "Skip-Level Manager", value: employee.skip_level_manager_id ? `Employee #${employee.skip_level_manager_id}` : "Not assigned" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Teams Tab ───────────────────────────────────────────────────── */}
      {activeTab === "teams" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" /> Teams
            </h3>
            <Link
              href="/hr/teams"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Manage Teams
            </Link>
          </div>
          {teams.length === 0 ? (
            <div className="py-8 text-center">
              <GitBranch className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Not assigned to any teams</p>
              <Link href={`/hr/teams`} className="text-xs text-primary hover:underline mt-1 inline-block">
                Go to Teams
              </Link>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg"><GitBranch className="h-4 w-4 text-primary" /></div>
                    <div>
                      <p className="text-sm font-semibold">{team.name}</p>
                      <p className="text-xs text-muted-foreground">Lead: {team.lead_name || "N/A"} · {team.member_count} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Dependents Tab ──────────────────────────────────────────────── */}
      {activeTab === "dependents" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Dependents
            </h3>
          </div>
          {dependents.length === 0 ? (
            <div className="py-8 text-center">
              <Heart className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No dependents recorded</p>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {dependents.map((dep) => (
                <div key={dep.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{dep.name}</h4>
                    <StatusBadge status={dep.relationship_type} variant="info" />
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {dep.date_of_birth && <p>DOB: {new Date(dep.date_of_birth).toLocaleDateString()}</p>}
                    {dep.gender && <p>Gender: {dep.gender}</p>}
                    {dep.phone && <p>Phone: {dep.phone}</p>}
                    {dep.occupation && <p>Occupation: {dep.occupation}</p>}
                    <div className="flex gap-2 mt-1">
                      {dep.is_beneficiary && <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">Beneficiary</span>}
                      {dep.is_emergency_contact && <span className="px-2 py-0.5 bg-warning/10 text-warning rounded text-xs">Emergency Contact</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Lifecycle Tab ───────────────────────────────────────────────── */}
      {activeTab === "lifecycle" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Status History
            </h3>
          </div>
          {lifecycle.length === 0 ? (
            <div className="py-8 text-center">
              <Activity className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No status changes recorded</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="relative">
                {lifecycle.map((event, idx) => (
                  <div key={event.id} className="flex gap-4 pb-6 last:pb-0 relative">
                    {idx < lifecycle.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border" />
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      event.to_status === "active" ? "bg-success/20 text-success" :
                      event.to_status === "terminated" || event.to_status === "resigned" ? "bg-danger/20 text-danger" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      <div className="w-2.5 h-2.5 rounded-full bg-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={event.from_status || "—"} variant="muted" />
                        <span className="text-xs text-muted-foreground">→</span>
                        <StatusBadge status={event.to_status} variant={statusVariant(event.to_status)} />
                      </div>
                      {event.reason && <p className="text-xs text-muted-foreground mt-1">{event.reason}</p>}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {event.changed_by_name && <span>By: {event.changed_by_name}</span>}
                        {event.created_at && <span>{new Date(event.created_at).toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Financial Tab ───────────────────────────────────────────────── */}
      {activeTab === "financial" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Salary Information</h3>
            <div className="space-y-4">
              {[
                { label: "Base Salary", value: employee.salary ? `$${employee.salary.toLocaleString()}` : "—" },
                { label: "Bank Name", value: employee.bank_name || "—" },
                { label: "Account Number", value: employee.bank_account_number ? `****${employee.bank_account_number.slice(-4)}` : "—" },
                { label: "Routing Number", value: employee.bank_routing_number || "—" },
                { label: "Tax ID", value: employee.tax_id || "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="space-y-4">
              {[
                { label: "Employee ID", value: `#${employee.id}` },
                { label: "Code", value: employee.employee_code },
                { label: "Status", value: employee.status },
                { label: "Joined", value: employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Documents Tab ────────────────────────────────────────────── */}
      {activeTab === "documents" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold">Documents</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer">
              <FileText className="h-4 w-4" /> Upload Document
            </button>
          </div>
          <div className="p-4">
            {documents.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
                      <div>
                        <p className="text-sm font-medium">{doc.title || doc.name || `Document #${doc.id}`}</p>
                        <p className="text-xs text-muted-foreground">{doc.doc_type || doc.category || "Document"} · v{doc.version || 1}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : "—"}
                      </span>
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" className="text-sm text-primary hover:underline">Download</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Attendance Tab ────────────────────────────────────────────── */}
      {activeTab === "attendance" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Recent Attendance</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Check In</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Check Out</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Hours</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {attendance.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No attendance records found.</td></tr>
                ) : (
                  attendance.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{r.date ? new Date(r.date).toLocaleDateString() : "—"}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{r.check_in ? new Date(r.check_in).toLocaleTimeString() : "—"}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{r.check_out ? new Date(r.check_out).toLocaleTimeString() : "—"}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{r.ot_hours ? `${r.ot_hours}h` : "—"}</td>
                      <td className="py-3 px-4"><StatusBadge status={r.status || "present"} variant={r.status === "present" || !r.status ? "success" : "warning"} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Training Tab ──────────────────────────────────────────────── */}
      {activeTab === "training" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Training Records</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Program</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Score</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Completed</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {trainings.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No training records found.</td></tr>
                ) : (
                  trainings.map((t, i) => (
                    <tr key={i} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{t.title || t.name || `Training #${t.id}`}</td>
                      <td className="py-3 px-4"><StatusBadge status={t.status || "enrolled"} variant={t.status === "completed" ? "success" : t.status === "enrolled" ? "info" : "muted"} /></td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{t.score ? `${t.score}%` : "—"}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{t.completed_at ? new Date(t.completed_at).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Performance Tab ───────────────────────────────────────────── */}
      {activeTab === "performance" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border"><h3 className="text-lg font-semibold">Performance History</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Period</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Rating</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Reviewer</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {performances.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No performance reviews found.</td></tr>
                ) : (
                  performances.map((p, i) => (
                    <tr key={i} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{p.period || p.review_type || `Review #${p.id}`}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          <span className="text-sm font-medium">{p.rating ? `${p.rating}/5` : "—"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{p.reviewer_name || `User #${p.reviewer_id}` || "—"}</td>
                      <td className="py-3 px-4"><StatusBadge status={p.status || "draft"} variant={p.status === "completed" ? "success" : p.status === "draft" ? "muted" : "info"} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
