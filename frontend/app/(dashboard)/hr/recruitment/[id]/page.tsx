"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmModal, useConfirm } from "@/components/common/ConfirmModal";
import { apiGet, apiPut, apiPost, apiDelete } from "@/lib/api";
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Clock,
  Star,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Send,
  Loader2,
  Download,
} from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  resume_url: string | null;
  source: string | null;
  stage: string;
  rating: number | null;
  notes: string | null;
  applied_date: string | null;
  created_at: string | null;
}

interface Interview {
  id: number;
  candidate_id: number;
  interviewer_id: number | null;
  round: number;
  type: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  status: string;
  feedback: string | null;
  rating: number | null;
  result: string | null;
  created_at: string | null;
}

interface OfferLetter {
  id: number;
  candidate_id: number;
  position: string | null;
  salary_offered: number | null;
  joining_date: string | null;
  status: string;
  created_at: string | null;
}

const STAGE_VARIANTS: Record<string, any> = {
  applied: "info", screening: "warning", interview: "primary", offer: "success",
  hired: "success", rejected: "danger", on_hold: "warning",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtDateTime(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { confirm, state: confirmState, handleClose: confirmClose } = useConfirm();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<OfferLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({ type: "phone_screen", scheduled_at: "", duration_minutes: 60 });
  const [submittingInterview, setSubmittingInterview] = useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({ position: "", salary_offered: "", joining_date: "" });
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [cData, iData, oData] = await Promise.all([
        apiGet<{ data: Candidate }>(`/hr/candidates/${id}`),
        apiGet<{ items: Interview[]; total: number }>(`/hr/interviews`, { candidate_id: String(id), per_page: "100" }),
        apiGet<{ items: OfferLetter[]; total: number }>(`/hr/offer-letters`, { candidate_id: String(id), per_page: "100" }),
      ]);
      setCandidate(cData.data);
      setInterviews(iData.items || []);
      setOffers(oData.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStage = async (stage: string) => {
    try { await apiPut(`/hr/candidates/${id}`, { stage }); await fetchData(); } catch {}
  };

  const moveToNextStage = async () => {
    if (!candidate) return;
    const flow = ["applied", "screening", "interview", "offer", "hired"];
    const idx = flow.indexOf(candidate.stage);
    if (idx >= 0 && idx < flow.length - 1) await updateStage(flow[idx + 1]);
  };

  const handleReject = async () => {
    if (await confirm({ title: "Reject candidate?", message: "This moves them to Rejected.", confirmLabel: "Reject", variant: "danger" })) await updateStage("rejected");
  };

  const handleHold = async () => {
    if (await confirm({ title: "Put on hold?", message: "This moves them to On Hold.", confirmLabel: "Hold", variant: "warning" })) await updateStage("on_hold");
  };

  const handleDelete = async () => {
    if (!await confirm({ title: "Delete candidate?", message: "This cannot be undone.", confirmLabel: "Delete", variant: "danger" })) return;
    try { await apiDelete(`/hr/candidates/${id}`); router.push("/hr/recruitment"); } catch {}
  };

  const handleScheduleInterview = async () => {
    if (!interviewForm.scheduled_at) return;
    setSubmittingInterview(true);
    try {
      await apiPost("/hr/interviews", {
        candidate_id: id, type: interviewForm.type,
        scheduled_at: new Date(interviewForm.scheduled_at).toISOString(),
        duration_minutes: interviewForm.duration_minutes, status: "scheduled",
      });
      setShowInterviewModal(false);
      setInterviewForm({ type: "phone_screen", scheduled_at: "", duration_minutes: 60 });
      await fetchData();
    } catch {} finally { setSubmittingInterview(false); }
  };

  const handleExtendOffer = async () => {
    if (!offerForm.position) return;
    setSubmittingOffer(true);
    try {
      await apiPost("/hr/offer-letters", {
        candidate_id: id, position: offerForm.position,
        salary_offered: offerForm.salary_offered ? parseFloat(offerForm.salary_offered) : null,
        joining_date: offerForm.joining_date ? new Date(offerForm.joining_date).toISOString() : null,
        status: "draft",
      });
      setShowOfferModal(false);
      setOfferForm({ position: "", salary_offered: "", joining_date: "" });
      await fetchData();
    } catch {} finally { setSubmittingOffer(false); }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try { await apiPut(`/hr/candidates/${id}`, { notes: notesDraft }); setEditingNotes(false); await fetchData(); } catch {} finally { setSavingNotes(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error || !candidate) return <div className="text-center py-20 text-muted-foreground">{error || "Candidate not found"}</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={candidate.name}
        description={candidate.email || "No email"}
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Recruitment", href: "/hr/recruitment" },
          { label: candidate.name },
        ]}
        icon={<User className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/hr/recruitment" className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            {candidate.resume_url && (
              <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2">
                <Download className="h-4 w-4" /> Resume
              </a>
            )}
            <button onClick={handleDelete} className="border border-danger bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3">
                {candidate.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <div className="mt-2"><StatusBadge status={candidate.stage} variant={STAGE_VARIANTS[candidate.stage] || "info"} /></div>
            </div>
            <div className="space-y-3">
              {candidate.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span>{candidate.email}</span></div>}
              {candidate.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{candidate.phone}</span></div>}
              {candidate.source && <div className="flex items-center gap-2 text-sm"><Briefcase className="h-4 w-4 text-muted-foreground" /><span>{candidate.source}</span></div>}
              <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /><span>Applied {fmtDate(candidate.applied_date)}</span></div>
            </div>
          </div>

          {/* Rating */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Rating</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => apiPut(`/hr/candidates/${id}`, { rating: star }).then(fetchData)} className="p-0.5">
                  <Star className={`h-6 w-6 transition-colors ${star <= (candidate.rating || 0) ? "text-warning fill-warning" : "text-muted-foreground/30 hover:text-muted-foreground/50"}`} />
                </button>
              ))}
              {candidate.rating && <button onClick={() => apiPut(`/hr/candidates/${id}`, { rating: null }).then(fetchData)} className="ml-2 text-xs text-muted-foreground hover:text-foreground">Clear</button>}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</h3>
              {!editingNotes && (
                <button onClick={() => { setEditingNotes(true); setNotesDraft(candidate.notes || ""); }} className="text-primary text-xs hover:underline flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={4} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Add notes about this candidate..." />
                <div className="flex gap-2">
                  <button onClick={handleSaveNotes} disabled={savingNotes} className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-hover disabled:opacity-50">
                    {savingNotes ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditingNotes(false)} className="text-muted-foreground text-xs hover:text-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.notes || "No notes yet."}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              {candidate.stage !== "hired" && candidate.stage !== "rejected" && (
                <button onClick={moveToNextStage} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 rotate-[-90deg]" /> Move to Next Stage
                </button>
              )}
              {candidate.stage !== "rejected" && candidate.stage !== "hired" && (
                <>
                  <button onClick={() => setShowInterviewModal(true)} className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Schedule Interview
                  </button>
                  <button onClick={() => { setOfferForm({ position: "", salary_offered: "", joining_date: "" }); setShowOfferModal(true); }} className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors flex items-center gap-2">
                    <Send className="h-4 w-4" /> Extend Offer
                  </button>
                  <button onClick={handleHold} className="border border-warning bg-warning/10 text-warning px-4 py-2 rounded-lg text-sm font-medium hover:bg-warning/20 transition-colors">
                    Hold
                  </button>
                  <button onClick={handleReject} className="border border-danger bg-danger/10 text-danger px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger/20 transition-colors">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Interviews */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Interviews ({interviews.length})</h3>
              <button onClick={() => setShowInterviewModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Interview
              </button>
            </div>
            {interviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No interviews scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((interview) => (
                  <div key={interview.id} className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Round {interview.round} — {interview.type || "Interview"}</p>
                          <p className="text-xs text-muted-foreground">{fmtDateTime(interview.scheduled_at)} · {interview.duration_minutes || 60}min</p>
                        </div>
                      </div>
                      <StatusBadge status={interview.status} variant={interview.status === "completed" ? "success" : interview.status === "cancelled" ? "danger" : "info"} />
                    </div>
                    {interview.feedback && <p className="text-sm text-muted-foreground mt-2">{interview.feedback}</p>}
                    {interview.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-3 w-3 ${s <= interview.rating! ? "text-warning fill-warning" : "text-muted-foreground/30"}`} />)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offer Letters */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Offer Letters ({offers.length})</h3>
              <button onClick={() => { setOfferForm({ position: "", salary_offered: "", joining_date: "" }); setShowOfferModal(true); }} className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" /> New Offer
              </button>
            </div>
            {offers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No offer letters yet.</p>
            ) : (
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{offer.position || "Position"}</p>
                        <p className="text-xs text-muted-foreground">
                          {offer.salary_offered ? `$${offer.salary_offered.toLocaleString()}` : "Salary TBD"}
                          {offer.joining_date ? ` · Joining ${fmtDate(offer.joining_date)}` : ""}
                        </p>
                      </div>
                      <StatusBadge status={offer.status} variant={offer.status === "accepted" ? "success" : offer.status === "rejected" ? "danger" : "info"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowInterviewModal(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Schedule Interview</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <select value={interviewForm.type} onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })} className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="phone_screen">Phone Screen</option>
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="cultural">Cultural Fit</option>
                  <option value="final">Final Round</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                <input type="datetime-local" value={interviewForm.scheduled_at} onChange={(e) => setInterviewForm({ ...interviewForm, scheduled_at: e.target.value })} className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Duration (minutes)</label>
                <input type="number" value={interviewForm.duration_minutes} onChange={(e) => setInterviewForm({ ...interviewForm, duration_minutes: parseInt(e.target.value) || 60 })} className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowInterviewModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleScheduleInterview} disabled={!interviewForm.scheduled_at || submittingInterview} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
                {submittingInterview && <Loader2 className="h-4 w-4 animate-spin" />} Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowOfferModal(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Extend Offer Letter</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Position *</label>
                <input type="text" value={offerForm.position} onChange={(e) => setOfferForm({ ...offerForm, position: e.target.value })} className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Senior Developer" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Salary Offered</label>
                <input type="number" value={offerForm.salary_offered} onChange={(e) => setOfferForm({ ...offerForm, salary_offered: e.target.value })} className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 120000" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Joining Date</label>
                <input type="date" value={offerForm.joining_date} onChange={(e) => setOfferForm({ ...offerForm, joining_date: e.target.value })} className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowOfferModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleExtendOffer} disabled={!offerForm.position || submittingOffer} className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/90 disabled:opacity-50 flex items-center gap-2">
                {submittingOffer && <Loader2 className="h-4 w-4 animate-spin" />} Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={confirmState.open} title={confirmState.title} message={confirmState.message} confirmLabel={confirmState.confirmLabel} cancelLabel={confirmState.cancelLabel} variant={confirmState.variant} onConfirm={() => confirmClose(true)} onCancel={() => confirmClose(false)} />
    </div>
  );
}
