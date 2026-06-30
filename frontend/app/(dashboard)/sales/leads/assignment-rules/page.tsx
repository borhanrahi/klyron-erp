"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  UserCheck,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  Save,
  Settings2,
  Users,
  ToggleLeft,
  ToggleRight,
  Building2,
  Filter,
  Globe,
  DollarSign,
  Target,
  ChevronDown,
  Info,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Distribution {
  id?: number;
  user_id: number;
  weight: number;
}

interface Team {
  id: number;
  name: string;
  description: string | null;
  lead_id: number | null;
  member_count: number;
  members: { employee_id: number; user_id: number; employee_code: string }[];
}

interface Criteria {
  sources?: string[];
  industries?: string[];
  min_lead_value?: number;
  max_lead_value?: number;
  has_email?: boolean;
  has_phone?: boolean;
  min_score?: number;
}

interface Rule {
  id: number;
  company_id: number;
  name: string;
  rule_type: string;
  team_id: number | null;
  criteria: Criteria | null;
  is_active: boolean;
  created_by?: number;
  created_at: string;
  distributions: Distribution[];
}

interface UserInfo {
  id: number;
  name: string;
}

const SOURCE_OPTIONS = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email_campaign", label: "Email Campaign" },
  { value: "cold_call", label: "Cold Call" },
  { value: "event", label: "Event" },
  { value: "social", label: "Social Media" },
  { value: "organic", label: "Organic Search" },
  { value: "other", label: "Other" },
];

const INDUSTRY_OPTIONS = [
  "Technology", "Finance", "Healthcare", "Manufacturing",
  "Retail", "Education", "Construction", "Agriculture",
  "Logistics", "Real Estate", "Energy", "Media",
];

export default function AssignmentRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserInfo[]>([]);

  // Form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("round_robin");
  const [formTeamId, setFormTeamId] = useState<number | null>(null);
  const [formCriteria, setFormCriteria] = useState<Criteria>({});
  const [formMembers, setFormMembers] = useState<{ user_id: number; weight: number }[]>([]);
  const [showCriteriaBuilder, setShowCriteriaBuilder] = useState(false);

  useEffect(() => {
    fetchRules();
    fetchTeams();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (formTeamId && formTeamId > 0) {
      const team = teams.find((t) => t.id === formTeamId);
      if (team) {
        const memberUsers = team.members
          .filter((m): m is { employee_id: number; user_id: number; employee_code: string } => m.user_id !== null)
          .map((m) => {
            const ui = users.find((u) => u.id === m.user_id);
            return { id: m.user_id, name: ui?.name ?? `User #${m.user_id}` };
          });
        setTeamMembers(memberUsers);
        // Auto-populate members from team
        setFormMembers(memberUsers.map((mu) => ({ user_id: mu.id, weight: 1 })));
      }
    } else {
      setTeamMembers([]);
    }
  }, [formTeamId, teams, users]);

  async function fetchRules() {
    setLoading(true);
    try {
      const res = await apiGet<{ data: Rule[] }>("/sales/lead-assignment-rules");
      setRules(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch rules:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeams() {
    try {
      const res = await apiGet<{ data: Team[] }>("/sales/teams");
      setTeams(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  }

  async function fetchUsers() {
    try {
      const res = await apiGet<any>("/hr/employees", { per_page: "100" });
      const items = res.items ?? res.data ?? [];
      setUsers(items.map((e: any) => ({
        id: e.user_id ?? e.id,
        name: e.name ?? e.full_name ?? `User ${e.id}`,
      })));
    } catch {
      try {
        const res = await apiGet<any>("/users");
        const items = res.items ?? res.data ?? [];
        setUsers(items.map((u: any) => ({
          id: u.id,
          name: u.name ?? u.full_name ?? u.email ?? `User ${u.id}`,
        })));
      } catch {}
    }
  }

  function getUserName(userId: number): string {
    return users.find((u) => u.id === userId)?.name ?? `User #${userId}`;
  }

  function getTeamName(teamId: number | null): string | null {
    if (!teamId) return null;
    return teams.find((t) => t.id === teamId)?.name ?? null;
  }

  function addMember() {
    const availableUsers = formTeamId ? teamMembers : users;
    const nextUser = availableUsers.find((u) => !formMembers.some((m) => m.user_id === u.id));
    setFormMembers([...formMembers, { user_id: nextUser?.id ?? 0, weight: 1 }]);
  }

  function updateMember(index: number, field: "user_id" | "weight", value: number) {
    const updated = [...formMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormMembers(updated);
  }

  function removeMember(index: number) {
    setFormMembers(formMembers.filter((_, i) => i !== index));
  }

  function toggleCriteriaSource(source: string) {
    const current = formCriteria.sources ?? [];
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    setFormCriteria({ ...formCriteria, sources: updated.length > 0 ? updated : undefined });
  }

  function toggleCriteriaIndustry(industry: string) {
    const current = formCriteria.industries ?? [];
    const updated = current.includes(industry)
      ? current.filter((i) => i !== industry)
      : [...current, industry];
    setFormCriteria({ ...formCriteria, industries: updated.length > 0 ? updated : undefined });
  }

  async function handleCreateRule(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        name: formName,
        rule_type: formType,
        team_id: formTeamId ?? null,
        is_active: true,
        distributions: formMembers.filter((m) => m.user_id > 0),
      };
      // Only include criteria if at least one filter is set
      const hasCriteria = formCriteria.sources?.length || formCriteria.industries?.length ||
        formCriteria.min_lead_value !== undefined || formCriteria.max_lead_value !== undefined ||
        formCriteria.has_email || formCriteria.has_phone || formCriteria.min_score !== undefined;
      if (hasCriteria) {
        payload.criteria = formCriteria;
      }
      await apiPost("/sales/lead-assignment-rules", payload);
      setShowCreate(false);
      resetForm();
      fetchRules();
    } catch (err) {
      console.error("Failed to create rule:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(rule: Rule) {
    try {
      await apiPut(`/sales/lead-assignment-rules/${rule.id}`, { is_active: !rule.is_active });
      fetchRules();
    } catch (err) {
      console.error("Failed to toggle rule:", err);
    }
  }

  async function handleDeleteRule(ruleId: number) {
    try {
      await apiDelete(`/sales/lead-assignment-rules/${ruleId}`);
      fetchRules();
    } catch (err) {
      console.error("Failed to delete rule:", err);
    }
  }

  function resetForm() {
    setFormName("");
    setFormType("round_robin");
    setFormTeamId(null);
    setFormCriteria({});
    setFormMembers([]);
    setShowCriteriaBuilder(false);
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "round_robin": return "Round Robin";
      case "ratio": return "Ratio Based";
      case "manual": return "Manual Only";
      case "weighted": return "Weighted";
      default: return type;
    }
  }

  function getTypeDescription(type: string) {
    switch (type) {
      case "round_robin": return "Leads are distributed evenly — the person with the fewest active leads gets the next lead.";
      case "ratio": return "Leads are distributed proportionally based on weight. A member with weight 3 gets 3x more leads than one with weight 1.";
      case "manual": return "Leads are only assigned manually by managers. No auto-assignment.";
      default: return "";
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/sales" className="hover:text-foreground transition-colors">Sales</Link>
        <span>/</span>
        <Link href="/sales/leads" className="hover:text-foreground transition-colors">Leads</Link>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">Assignment Rules</span>
      </div>

      <PageHeader
        title="Lead Assignment Rules"
        description="Configure how leads are automatically distributed to your sales and call center teams."
        icon={<UserCheck className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/sales/leads"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Leads
            </Link>
            <button onClick={() => { setShowCreate(true); resetForm(); }}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Rule
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Create Rule Form */}
          {showCreate && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Create Assignment Rule</h3>
              <form onSubmit={handleCreateRule}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Rule Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="e.g., Website Leads → Sales Team"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Distribution Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="round_robin">Round Robin (Equal)</option>
                      <option value="ratio">Ratio Based (Weighted)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        Restrict to Team
                      </div>
                    </label>
                    <select
                      value={formTeamId ?? ""}
                      onChange={(e) => setFormTeamId(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-4 py-2.5 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">Any team member (no restriction)</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.member_count} members)
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formTeamId
                        ? "Only members of this team will receive leads from this rule."
                        : "Anyone in the distribution list can receive leads."}
                    </p>
                  </div>
                </div>

                {/* Criteria Builder */}
                <div className="border-t border-border pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCriteriaBuilder(!showCriteriaBuilder)}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mb-3"
                  >
                    <Filter className="h-4 w-4" />
                    Lead Matching Criteria
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showCriteriaBuilder ? "rotate-180" : ""}`} />
                    {Object.keys(formCriteria).length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-semibold">
                        Active
                      </span>
                    )}
                  </button>

                  {showCriteriaBuilder && (
                    <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Info className="h-3 w-3" />
                        Only leads matching ALL selected criteria will be routed through this rule.
                        Leave empty for a catch-all rule (matches all leads).
                      </p>

                      {/* Source Filter */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium mb-2">
                          <Globe className="h-3 w-3" />
                          Lead Source
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {SOURCE_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => toggleCriteriaSource(opt.value)}
                              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                                (formCriteria.sources ?? []).includes(opt.value)
                                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                                  : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Industry Filter */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium mb-2">
                          <Building2 className="h-3 w-3" />
                          Industry
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {INDUSTRY_OPTIONS.map((ind) => (
                            <button
                              key={ind}
                              type="button"
                              onClick={() => toggleCriteriaIndustry(ind)}
                              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                                (formCriteria.industries ?? []).includes(ind)
                                  ? "bg-primary/10 text-primary border-primary/30 font-medium"
                                  : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                              }`}
                            >
                              {ind}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Value Range */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium mb-1">
                            <DollarSign className="h-3 w-3" />
                            Min Est. Value
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={formCriteria.min_lead_value ?? ""}
                            onChange={(e) => setFormCriteria({
                              ...formCriteria,
                              min_lead_value: e.target.value ? parseInt(e.target.value) : undefined,
                            })}
                            className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:border-primary outline-none"
                            placeholder="No minimum"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium mb-1">
                            <DollarSign className="h-3 w-3" />
                            Max Est. Value
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={formCriteria.max_lead_value ?? ""}
                            onChange={(e) => setFormCriteria({
                              ...formCriteria,
                              max_lead_value: e.target.value ? parseInt(e.target.value) : undefined,
                            })}
                            className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:border-primary outline-none"
                            placeholder="No maximum"
                          />
                        </div>
                      </div>

                      {/* Contact Completeness & Score */}
                      <div className="grid grid-cols-3 gap-3">
                        <label className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/50 cursor-pointer hover:border-primary/30 transition-colors">
                          <input
                            type="checkbox"
                            checked={formCriteria.has_email ?? false}
                            onChange={(e) => setFormCriteria({ ...formCriteria, has_email: e.target.checked || undefined })}
                            className="rounded border-border text-primary focus:ring-primary/20"
                          />
                          <span className="text-xs">Has Email</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/50 cursor-pointer hover:border-primary/30 transition-colors">
                          <input
                            type="checkbox"
                            checked={formCriteria.has_phone ?? false}
                            onChange={(e) => setFormCriteria({ ...formCriteria, has_phone: e.target.checked || undefined })}
                            className="rounded border-border text-primary focus:ring-primary/20"
                          />
                          <span className="text-xs">Has Phone</span>
                        </label>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium mb-1">
                            <Target className="h-3 w-3" />
                            Min Score
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formCriteria.min_score ?? ""}
                            onChange={(e) => setFormCriteria({
                              ...formCriteria,
                              min_score: e.target.value ? parseInt(e.target.value) : undefined,
                            })}
                            className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:border-primary outline-none"
                            placeholder="Any"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Members Section */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Distribution Members
                      {formTeamId && (
                        <span className="text-xs text-muted-foreground font-normal">
                          (from {getTeamName(formTeamId)})
                        </span>
                      )}
                    </h4>
                    <button type="button" onClick={addMember}
                      className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Plus className="h-3 w-3" /> Add Member
                    </button>
                  </div>

                  {formMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
                      {formTeamId
                        ? "Team members from the selected team will be auto-added. Click \"Add Member\" to include more."
                        : "No members added. Select a team above or click \"Add Member\" to add individuals."}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formMembers.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                          <div className="flex-1 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                              {getUserName(m.user_id).charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm">{getUserName(m.user_id)}</span>
                          </div>
                          {formType === "ratio" && (
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-muted-foreground">Weight:</label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={m.weight}
                                onChange={(e) => updateMember(i, "weight", parseInt(e.target.value) || 1)}
                                className="w-20 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary outline-none text-center"
                              />
                            </div>
                          )}
                          <button type="button" onClick={() => removeMember(i)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-danger transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {formTeamId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Members are auto-populated from the selected team. You can add or remove members as needed.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {formType === "ratio" && formMembers.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs text-primary font-medium">Ratio Distribution Preview:</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formMembers
                        .filter((m) => m.user_id > 0)
                        .map((m) => `${getUserName(m.user_id)} (weight ${m.weight})`)
                        .join(" → ")}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                  <button type="button" onClick={() => setShowCreate(false)}
                    className="px-4 py-2 border border-border bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving || formMembers.filter((m) => m.user_id > 0).length === 0}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors flex items-center gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Create Rule
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Rules List */}
          {rules.length === 0 && !showCreate ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Settings2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold mb-1">No Assignment Rules</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create assignment rules to automatically distribute leads to your sales and call center teams.
              </p>
              <button onClick={() => { setShowCreate(true); resetForm(); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                <Plus className="h-4 w-4" />
                Create Your First Rule
              </button>
            </div>
          ) : (
            rules.map((rule) => {
              const teamName = getTeamName(rule.team_id);
              const hasCriteria = rule.criteria && (
                rule.criteria.sources?.length || rule.criteria.industries?.length ||
                rule.criteria.min_lead_value !== undefined || rule.criteria.max_lead_value !== undefined ||
                rule.criteria.has_email || rule.criteria.has_phone || rule.criteria.min_score !== undefined
              );

              return (
                <div key={rule.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold truncate">{rule.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${
                          rule.rule_type === "round_robin"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : rule.rule_type === "ratio"
                            ? "bg-warning/10 text-warning border border-warning/20"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {getTypeLabel(rule.rule_type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {teamName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {teamName}
                          </span>
                        )}
                        {rule.team_id && !teamName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            Team #{rule.team_id}
                          </span>
                        )}
                        {!rule.team_id && (
                          <span className="flex items-center gap-1 text-muted-foreground/60">
                            <Building2 className="h-3 w-3" />
                            No team restriction
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        onClick={() => handleToggleActive(rule)}
                        className={`p-2 rounded-lg transition-colors ${
                          rule.is_active
                            ? "text-success hover:bg-success/10"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                        title={rule.is_active ? "Deactivate" : "Activate"}
                      >
                        {rule.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-danger transition-colors"
                        title="Delete rule">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Criteria Display */}
                  {rule.criteria && hasCriteria && (
                    <div className="mt-3 flex items-start gap-1.5 p-2.5 rounded-lg bg-muted/30 border border-border">
                      <Filter className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {rule.criteria.sources?.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 text-[11px] rounded bg-primary/5 text-primary border border-primary/10">
                            Source: {s}
                          </span>
                        ))}
                        {rule.criteria.industries?.map((ind) => (
                          <span key={ind} className="px-1.5 py-0.5 text-[11px] rounded bg-info/5 text-info border border-info/10">
                            Industry: {ind}
                          </span>
                        ))}
                        {rule.criteria.min_lead_value !== undefined && (
                          <span className="px-1.5 py-0.5 text-[11px] rounded bg-success/5 text-success border border-success/10">
                            Min ${rule.criteria.min_lead_value.toLocaleString()}
                          </span>
                        )}
                        {rule.criteria.max_lead_value !== undefined && (
                          <span className="px-1.5 py-0.5 text-[11px] rounded bg-success/5 text-success border border-success/10">
                            Max ${rule.criteria.max_lead_value.toLocaleString()}
                          </span>
                        )}
                        {rule.criteria.has_email && (
                          <span className="px-1.5 py-0.5 text-[11px] rounded bg-warning/5 text-warning border border-warning/10">
                            Has email
                          </span>
                        )}
                        {rule.criteria.has_phone && (
                          <span className="px-1.5 py-0.5 text-[11px] rounded bg-warning/5 text-warning border border-warning/10">
                            Has phone
                          </span>
                        )}
                        {rule.criteria.min_score !== undefined && (
                          <span className="px-1.5 py-0.5 text-[11px] rounded bg-danger/5 text-danger border border-danger/10">
                            Score &ge; {rule.criteria.min_score}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {!rule.criteria && (
                    <div className="mt-3 flex items-center gap-1.5 p-2.5 rounded-lg bg-muted/20 border border-dashed border-border">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Catch-all rule — matches all leads regardless of source or criteria
                      </span>
                    </div>
                  )}

                  {/* Distribution Members */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {rule.distributions.map((d) => (
                      <div key={d.id ?? d.user_id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                          {getUserName(d.user_id).charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{getUserName(d.user_id)}</span>
                        {rule.rule_type === "ratio" && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium ml-1">
                            W:{d.weight}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {rule.is_active && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-success font-medium">
                        Active — new leads matching criteria will be auto-assigned
                      </span>
                    </div>
                  )}
                  {!rule.is_active && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Inactive — leads will not be routed through this rule</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
