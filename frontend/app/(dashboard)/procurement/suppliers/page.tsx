"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Search,
  Plus,
  Filter,
  Download,
  Star,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const suppliers = [
  {
    id: "SUP-001",
    name: "TechParts International",
    contact: "John Mitchell",
    email: "john@techparts.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    category: "Electronics",
    rating: 4.8,
    balance: 24500.0,
    status: "Active",
    since: "2022-03-15",
  },
  {
    id: "SUP-002",
    name: "Global Materials Co",
    contact: "Sarah Johnson",
    email: "sarah@globalmaterials.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    category: "Raw Materials",
    rating: 4.5,
    balance: 18750.0,
    status: "Active",
    since: "2021-07-22",
  },
  {
    id: "SUP-003",
    name: "Packaging Solutions Ltd",
    contact: "Michael Chen",
    email: "michael@packagingsolutions.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    category: "Packaging",
    rating: 4.2,
    balance: 12300.0,
    status: "Active",
    since: "2023-01-10",
  },
  {
    id: "SUP-004",
    name: "Industrial Equipment Inc",
    contact: "Emily Rodriguez",
    email: "emily@industrialequip.com",
    phone: "+1 (555) 456-7890",
    location: "Houston, TX",
    category: "Equipment",
    rating: 3.9,
    balance: 8900.0,
    status: "Inactive",
    since: "2020-11-05",
  },
  {
    id: "SUP-005",
    name: "Office Supplies Direct",
    contact: "David Kim",
    email: "david@officesupplies.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    category: "Office Supplies",
    rating: 4.7,
    balance: 5200.0,
    status: "Active",
    since: "2023-06-18",
  },
  {
    id: "SUP-006",
    name: "GreenTech Solutions",
    contact: "Lisa Thompson",
    email: "lisa@greentech.com",
    phone: "+1 (555) 678-9012",
    location: "Portland, OR",
    category: "Sustainable Materials",
    rating: 4.6,
    balance: 31200.0,
    status: "Active",
    since: "2022-09-30",
  },
];

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

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
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
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
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4 text-danger" />
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
    </div>
  );
}