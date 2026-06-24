"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Calculator,
  Play,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Search,
} from "lucide-react";
import { apiPost, apiGet } from "@/lib/api";

interface Employee {
  id: number;
  employee_code: string;
  salary: number;
  full_name?: string;
  department_name?: string;
}

interface EmployeeListResponse {
  items: Employee[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

const processingSteps = [
  { step: 1, name: "Select Pay Period", description: "Choose month and year" },
  { step: 2, name: "Preview Employees", description: "Review affected employees" },
  { step: 3, name: "Generate Payroll", description: "Process salary calculations" },
  { step: 4, name: "Review Results", description: "Confirm generated records" },
];

export default function PayrollRunPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await apiGet<EmployeeListResponse>("/hr/employees", { per_page: "100" });
      setEmployees(res.items);
      setSelectedEmployees(res.items.map((e) => e.id));
      setSelectAll(true);
      setCurrentStep(2);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const ids = selectAll ? undefined : selectedEmployees.join(",");
      const params: Record<string, string> = { month: String(month), year: String(year) };
      if (ids) params.employee_ids = ids;

      // Build query string
      let url = `/hr/payroll-actions/generate?month=${month}&year=${year}`;
      if (!selectAll && selectedEmployees.length > 0) {
        url += `&employee_ids=${selectedEmployees.join(",")}`;
      }

      const res = await apiPost<{ created: number; updated: number }>(url, {});
      setResult(res);
      setCurrentStep(4);
    } catch (err) {
      console.error("Payroll generation failed", err);
    } finally {
      setGenerating(false);
    }
  };

  const toggleEmployee = (id: number) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(id)) return prev.filter((eid) => eid !== id);
      return [...prev, id];
    });
    setSelectAll(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
      setSelectAll(false);
    } else {
      setSelectedEmployees(filteredEmployees.map((e) => e.id));
      setSelectAll(true);
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      (e.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.employee_code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmt = (n: number | null) => (n != null ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Run Payroll"
        description="Generate payroll for selected employees."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Payroll", href: "/hr/payroll" },
          { label: "Run Payroll" },
        ]}
        icon={<Calculator className="h-6 w-6 text-primary" />}
      />

      {/* Step Indicator */}
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <div className="flex items-center justify-between">
          {processingSteps.map((step, idx) => (
            <div key={step.step} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep > step.step
                      ? "bg-success text-white"
                      : currentStep === step.step
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.step ? <CheckCircle className="h-4 w-4" /> : step.step}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.step ? "" : "text-muted-foreground"}`}>{step.name}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {idx < processingSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 rounded ${currentStep > step.step ? "bg-success" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Period */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4">Select Pay Period</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1.5">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {monthNames.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={fetchEmployees}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preview Employees */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Select Employees</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedEmployees.length} of {employees.length} employees selected for {monthNames[month - 1]} {year}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-56 pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button
                  onClick={toggleSelectAll}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectAll ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  <th className="w-12 py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Employee</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Department</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Base Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">Loading employees...</td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">No employees found.</td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(emp.id)}
                          onChange={() => toggleEmployee(emp.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {(emp.full_name || emp.employee_code || "NA").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{emp.full_name || `Employee #${emp.id}`}</p>
                            <p className="text-xs text-muted-foreground">{emp.employee_code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{emp.department_name || "—"}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium">{fmt(emp.salary)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={selectedEmployees.length === 0 || generating}
              className="bg-success text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Generate Payroll ({selectedEmployees.length} employees)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {currentStep === 4 && result && (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-bold mb-2">Payroll Generated Successfully!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {monthNames[month - 1]} {year} payroll has been processed.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-primary">{result.created}</p>
                <p className="text-xs text-muted-foreground">New Records</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-info">{result.updated}</p>
                <p className="text-xs text-muted-foreground">Updated</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/hr/payroll"
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                View Payroll
              </a>
              <button
                onClick={() => { setCurrentStep(1); setResult(null); }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Run Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
