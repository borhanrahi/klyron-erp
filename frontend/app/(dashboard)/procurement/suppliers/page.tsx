"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { apiGet, apiDelete } from "@/lib/api";
import { useConfirm, ConfirmModal } from "@/components/common/ConfirmModal";
import {
  Search,
  Plus,
  Download,
  Star,
  Mail,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  rating: number;
  balance: number;
  status: string;
  since: string;
}

export default function SuppliersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { confirm, state, handleClose } = useConfirm();

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await apiGet<{ items: any[] }>("/procurement/suppliers");
      setSuppliers(
        res.items.map((s: any) => ({
          id: s.id,
          name: s.name || s.company_name || "",
          contact: s.contact_person || s.contact || "",
          email: s.email || "",
          phone: s.phone || "",
          location: s.location || s.address || "",
          category: s.category || "",
          rating: s.rating || 0,
          balance: s.balance || s.outstanding_balance || 0,
          status: s.status || "Active",
          since: s.created_at || s.since || "",
        }))
      );
    } catch {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleDelete = async (id: string) => {
    const ok = await confirm("Are you sure you want to delete this supplier?");
    if (!ok) return;
    setDeleting(id);
    try {
      await apiDelete(`/procurement/suppliers/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete supplier. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const categories = [
    "All",
    "Electronics",
    "Raw Materials",
    "Packaging",
    "Equipment",
    "Office Supplies",
    "Sustainable Materials",
  ];

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || supplier.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier directory and relationships"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Procurement", href: "/procurement" },
          { label: "Suppliers" },
        ]}
        actions={
          <button
            onClick={() => router.push("/procurement/suppliers/new")}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        }
      />

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Rating
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Balance
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {supplier.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.id}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-foreground">{supplier.contact}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {supplier.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-muted rounded-full text-sm text-foreground">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="text-foreground">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">
                    ${supplier.balance.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={supplier.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/procurement/suppliers/${supplier.id}`)
                        }
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        disabled={deleting === supplier.id}
                        className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === supplier.id ? (
                          <Loader2 className="h-4 w-4 text-danger animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-danger" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-border bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        variant={state.variant}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    </div>
  );
}
