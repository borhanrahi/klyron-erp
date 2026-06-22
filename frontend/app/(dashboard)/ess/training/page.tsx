"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import { GraduationCap, CheckCircle, Clock, Award } from "lucide-react";

interface Training {
  id: number;
  training_id: number;
  title: string;
  description: string | null;
  trainer: string | null;
  status: string;
  completion_date: string | null;
  score: number | null;
  certificate_url: string | null;
}

export default function ESSTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: Training[] }>("/ess/trainings")
      .then((res) => setTrainings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-muted-foreground">Loading trainings...</div>;

  const completed = trainings.filter((t) => t.status === "completed").length;
  const inProgress = trainings.filter((t) => t.status === "in_progress" || t.status === "enrolled").length;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Training"
        description="Track your enrolled and completed trainings."
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Enrolled</p>
          <p className="text-2xl font-bold mt-1">{trainings.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold mt-1 text-green-500">{completed}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 text-center">
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-yellow-500">{inProgress}</p>
        </div>
      </div>

      {trainings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No trainings enrolled yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 text-xs font-medium text-muted-foreground">Training</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Trainer</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Score</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {trainings.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/5 transition-colors">
                    <td className="p-3">
                      <p className="font-medium">{t.title}</p>
                      {t.description && <p className="text-xs text-muted-foreground mt-0.5 max-w-[300px] truncate">{t.description}</p>}
                    </td>
                    <td className="p-3 text-muted-foreground">{t.trainer || "N/A"}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.status === "completed" ? "bg-green-500/10 text-green-500" :
                        t.status === "in_progress" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        {t.status === "completed" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">{t.score != null ? `${t.score}%` : "-"}</td>
                    <td className="p-3 text-muted-foreground">{t.completion_date ? new Date(t.completion_date).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
