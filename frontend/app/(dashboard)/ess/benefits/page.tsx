"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import { Shield, Heart, CheckCircle } from "lucide-react";

interface Benefit {
  id: number;
  plan_name: string;
  plan_type: string;
  provider: string | null;
  monthly_cost: number;
  employee_contribution: number;
  start_date: string;
  status: string;
}

export default function ESSBenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: Benefit[] }>("/ess/benefits")
      .then((res) => setBenefits(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-muted-foreground">Loading benefits...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Benefits"
        description="View your enrolled benefit plans."
        icon={<Shield className="h-6 w-6 text-primary" />}
      />

      {benefits.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No benefits enrolled yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Contact HR to enroll in a benefit plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border bg-card shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{b.plan_name}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                  <CheckCircle className="h-3 w-3" /> {b.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{b.plan_type}</span></div>
                {b.provider && <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span>{b.provider}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Monthly Cost</span><span>৳{b.monthly_cost?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Your Contribution</span><span>৳{b.employee_contribution?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span>{new Date(b.start_date).toLocaleDateString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
