"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import { Package, Laptop, Smartphone } from "lucide-react";

interface Asset {
  id: number;
  asset_name: string;
  asset_type: string;
  serial_number: string;
  assigned_date: string;
  return_date: string | null;
  condition_at_assignment: string;
  condition_at_return: string | null;
  status: string;
}

export default function ESSAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: Asset[] }>("/ess/assets")
      .then((res) => setAssets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-muted-foreground">Loading assets...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Assets"
        description="View assets assigned to you."
        icon={<Package className="h-6 w-6 text-primary" />}
      />

      {assets.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No assets assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {a.asset_type === "laptop" ? <Laptop className="h-5 w-5 text-primary" /> :
                   a.asset_type === "phone" ? <Smartphone className="h-5 w-5 text-primary" /> :
                   <Package className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{a.asset_name}</h3>
                  <p className="text-xs text-muted-foreground">{a.asset_type}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Serial</span><span className="font-mono text-xs">{a.serial_number || "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Assigned</span><span>{new Date(a.assigned_date).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Condition</span><span>{a.condition_at_assignment || "N/A"}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.status === "assigned" ? "bg-green-500/10 text-green-500" :
                    a.status === "returned" ? "bg-blue-500/10 text-blue-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  }`}>{a.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
