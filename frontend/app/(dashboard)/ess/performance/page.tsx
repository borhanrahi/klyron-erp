"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import { TrendingUp, Target, Star } from "lucide-react";

interface KPI {
  id: number;
  name: string;
  type: string;
  target_value: number;
  actual_value: number;
  unit: string;
  weight: number;
  period: string;
  status: string;
}

interface Review {
  id: number;
  period: string;
  review_type: string;
  rating: number | null;
  feedback: string | null;
  status: string;
  created_at: string;
}

export default function ESSPerformancePage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<{ data: KPI[] }>("/ess/kpis"),
      apiGet<{ data: Review[] }>("/ess/reviews"),
    ])
      .then(([kRes, rRes]) => { setKpis(kRes.data); setReviews(rRes.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-muted-foreground">Loading performance data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Performance"
        description="Track your KPIs and performance reviews."
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />

      {/* KPIs */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Target className="h-4 w-4" /> Key Performance Indicators</h3>
        </div>
        <div className="p-4">
          {kpis.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No KPIs assigned yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.map((k) => {
                const pct = k.target_value > 0 ? Math.min(100, (k.actual_value / k.target_value) * 100) : 0;
                return (
                  <div key={k.id} className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">{k.name}</h4>
                      <span className="text-xs text-muted-foreground">{k.period}</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-xl font-bold">{k.actual_value}</span>
                      <span className="text-xs text-muted-foreground">/ {k.target_value} {k.unit}</span>
                    </div>
                    <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{pct.toFixed(0)}% achieved · Weight: {k.weight}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Star className="h-4 w-4" /> Performance Reviews</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 text-xs font-medium text-muted-foreground">Period</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Type</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Rating</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Feedback</th>
                <th className="p-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {reviews.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No reviews yet</td></tr>
              ) : reviews.map((r) => (
                <tr key={r.id} className="hover:bg-muted/5 transition-colors">
                  <td className="p-3 font-medium">{r.period}</td>
                  <td className="p-3 text-muted-foreground">{r.review_type}</td>
                  <td className="p-3">
                    {r.rating != null ? (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {r.rating}/5
                      </span>
                    ) : "-"}
                  </td>
                  <td className="p-3 text-muted-foreground max-w-[300px] truncate">{r.feedback || "-"}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "completed" ? "bg-green-500/10 text-green-500" :
                      r.status === "in_progress" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-blue-500/10 text-blue-500"
                    }`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
