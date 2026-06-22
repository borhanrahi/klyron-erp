"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Filter,
} from "lucide-react";

const documents = [
  { id: 1, name: "Employment Contract - Sarah Chen", employee: "Sarah Chen", category: "Contract", uploadDate: "Jan 15, 2022", size: "245 KB", type: "PDF", status: "Verified", statusVariant: "success" as const },
  { id: 2, name: "Tax Form W-4 - Mike Johnson", employee: "Mike Johnson", category: "Tax", uploadDate: "Mar 8, 2021", size: "89 KB", type: "PDF", status: "Verified", statusVariant: "success" as const },
  { id: 3, name: "NDA Agreement - Emily Davis", employee: "Emily Davis", category: "Legal", uploadDate: "Jun 22, 2020", size: "312 KB", type: "PDF", status: "Verified", statusVariant: "success" as const },
  { id: 4, name: "ID Proof - David Park", employee: "David Park", category: "Identity", uploadDate: "Sep 5, 2023", size: "1.2 MB", type: "PDF", status: "Verified", statusVariant: "success" as const },
  { id: 5, name: "Resume - Alex Kim", employee: "Alex Kim", category: "Resume", uploadDate: "Feb 14, 2022", size: "156 KB", type: "PDF", status: "Verified", statusVariant: "success" as const },
  { id: 6, name: "Medical Certificate - Rachel Martinez", employee: "Rachel Martinez", category: "Medical", uploadDate: "Jun 10, 2024", size: "78 KB", type: "PDF", status: "Pending Review", statusVariant: "warning" as const },
  { id: 7, name: "Address Proof - James Wilson", employee: "James Wilson", category: "Identity", uploadDate: "Aug 19, 2023", size: "456 KB", type: "JPG", status: "Verified", statusVariant: "success" as const },
  { id: 8, name: "Experience Letter - Lisa Thompson", employee: "Lisa Thompson", category: "Employment", uploadDate: "Apr 11, 2020", size: "120 KB", type: "PDF", status: "Verified", statusVariant: "success" as const },
];

const categories = ["All", "Contract", "Tax", "Legal", "Identity", "Resume", "Medical", "Employment"];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = documents.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Employee Documents"
        description="Centralized document management for all employee records."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Documents" },
        ]}
        icon={<FileText className="h-6 w-6 text-primary" />}
        actions={
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        }
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Document</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">Employee</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Category</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">Upload Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">Size</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-4 w-4 text-primary" /></div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{doc.employee}</span></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><StatusBadge status={doc.category} variant="primary" /></td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="text-sm text-muted-foreground">{doc.uploadDate}</span></td>
                  <td className="py-3 px-4 hidden xl:table-cell"><span className="text-sm text-muted-foreground">{doc.size}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={doc.status} variant={doc.statusVariant} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"><Download className="h-4 w-4" /></button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {documents.length} documents</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
