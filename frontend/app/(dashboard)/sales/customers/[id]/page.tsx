"use client";

import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  ArrowLeft,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet, apiPut, apiDelete } from "@/lib/api";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  tax_id: string;
  address: string;
  credit_limit: number;
  balance: number;
  loyalty_points: number;
  status: string;
  created_at: string;
}

function mapStatusVariant(status: string): "success" | "warning" | "danger" | "info" | "primary" | "muted" {
  const s = (status || "").toLowerCase();
  if (s === "active" || s === "verified") return "success";
  if (s === "pending" || s === "inactive") return "warning";
  if (s === "suspended" || s === "blocked") return "danger";
  return "info";
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tax_id: "",
    address: "",
    credit_limit: 0,
    balance: 0,
    loyalty_points: 0,
    status: "",
  });

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await apiGet<{ data: Customer }>(`/sales/customers/${id}`);
        const cust = res.data;
        setCustomer(cust);
        setForm({
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
          tax_id: cust.tax_id,
          address: cust.address,
          credit_limit: cust.credit_limit,
          balance: cust.balance,
          loyalty_points: cust.loyalty_points,
          status: cust.status,
        });
      } catch (err) {
        console.error("Failed to fetch customer:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await apiPut(`/sales/customers/${id}`, form);
      setCustomer((prev) => (prev ? { ...prev, ...form } : prev));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update customer:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await apiDelete(`/sales/customers/${id}`);
      router.push("/sales/customers");
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading customer...</span>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Customer not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200 max-w-4xl mx-auto">
      <Link
        href="/sales/customers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Link>

      <PageHeader
        title="Customer Details"
        icon={<Users className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 border border-border bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-danger/30 bg-danger/10 text-danger rounded-lg font-medium hover:bg-danger/20 transition-all flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold">{customer.name}</h2>
          <StatusBadge
            status={customer.status}
            variant={mapStatusVariant(customer.status)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Name</label>
            {editing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{customer.name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Email</label>
            {editing ? (
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{customer.email}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Phone</label>
            {editing ? (
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{customer.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Tax ID</label>
            {editing ? (
              <input
                type="text"
                value={form.tax_id}
                onChange={(e) => setForm((f) => ({ ...f, tax_id: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{customer.tax_id}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Address</label>
            {editing ? (
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{customer.address}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Credit Limit</label>
            {editing ? (
              <input
                type="number"
                value={form.credit_limit || ""}
                onChange={(e) => setForm((f) => ({ ...f, credit_limit: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">${customer.credit_limit.toLocaleString()}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Balance</label>
            {editing ? (
              <input
                type="number"
                value={form.balance || ""}
                onChange={(e) => setForm((f) => ({ ...f, balance: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">${customer.balance.toLocaleString()}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Loyalty Points</label>
            {editing ? (
              <input
                type="number"
                value={form.loyalty_points || ""}
                onChange={(e) => setForm((f) => ({ ...f, loyalty_points: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{customer.loyalty_points.toLocaleString()}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            {editing ? (
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            ) : (
              <StatusBadge
                status={customer.status}
                variant={mapStatusVariant(customer.status)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
