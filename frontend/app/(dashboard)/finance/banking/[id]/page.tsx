"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import {
  Landmark,
  ArrowLeft,
  DollarSign,
  Building2,
  CreditCard,
  Globe,
  Hash,
  Calendar,
  Loader2,
  Trash2,
  Star,
  MapPin,
} from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function fmtDate(s?: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface BankAccount {
  id: number;
  name: string;
  account_number: string;
  bank_name: string;
  balance: number;
  currency: string;
  is_default: boolean;
  branch_id: number | null;
  created_at: string;
}

export default function BankAccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: BankAccount }>(`/finance/bank-accounts/${params.id}`)
      .then((res) => setAccount(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Delete this bank account?")) return;
    try {
      await apiDelete(`/finance/bank-accounts/${params.id}`);
      router.push("/finance/banking");
    } catch {
      alert("Failed to delete bank account");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  if (error || !account)
    return (
      <div className="text-center py-20 text-danger">
        {error || "Bank account not found"}
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <span
          className="cursor-pointer hover:text-foreground"
          onClick={() => router.push("/finance/banking")}
        >
          Banking
        </span>
        <span className="text-primary font-bold border-b-2 border-primary pb-0.5">
          {account.name}
        </span>
      </div>

      <PageHeader
        title={account.name}
        description={`${account.bank_name} — Account ${account.account_number}`}
        icon={<Landmark className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/finance/banking")}
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleDelete}
              className="border border-danger/50 bg-danger/10 text-danger px-4 py-2 rounded-lg font-medium transition-all hover:bg-danger/20 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Balance</p>
          </div>
          <p className="text-2xl font-bold">{fmt(account.balance)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Bank Name</p>
          </div>
          <p className="text-2xl font-bold">{account.bank_name}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Account Number</p>
          </div>
          <p className="text-2xl font-bold font-mono">{account.account_number}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Currency</p>
          </div>
          <p className="text-2xl font-bold">{account.currency}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Account Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Account Name</span>
            <span className="text-sm font-medium">{account.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Bank Name</span>
            <span className="text-sm font-medium">{account.bank_name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Account Number</span>
            <span className="text-sm font-medium font-mono">{account.account_number}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="text-sm font-medium">{fmt(account.balance)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Currency</span>
            <span className="text-sm font-medium">{account.currency}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Default Account</span>
            <StatusBadge
              status={account.is_default ? "Yes" : "No"}
              variant={account.is_default ? "success" : "muted"}
            />
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Branch ID</span>
            <span className="text-sm font-medium">{account.branch_id ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Created At</span>
            <span className="text-sm font-medium">{fmtDate(account.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
