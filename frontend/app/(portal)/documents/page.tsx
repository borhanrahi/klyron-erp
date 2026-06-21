"use client";

import {
  FolderOpen,
  Search,
  Download,
  Eye,
  FileText,
  Image,
  FileSpreadsheet,
  File,
} from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Service Agreement.pdf",
    type: "pdf",
    size: "2.4 MB",
    date: "Mar 24, 2024",
    icon: FileText,
    color: "text-danger",
  },
  {
    id: 2,
    name: "Q1 Financial Report.xlsx",
    type: "spreadsheet",
    size: "1.8 MB",
    date: "Mar 20, 2024",
    icon: FileSpreadsheet,
    color: "text-success",
  },
  {
    id: 3,
    name: "Product Catalog 2024.pdf",
    type: "pdf",
    size: "5.2 MB",
    date: "Mar 15, 2024",
    icon: FileText,
    color: "text-danger",
  },
  {
    id: 4,
    name: "Company Logo.png",
    type: "image",
    size: "856 KB",
    date: "Mar 10, 2024",
    icon: Image,
    color: "text-info",
  },
  {
    id: 5,
    name: "Project Timeline.docx",
    type: "document",
    size: "324 KB",
    date: "Mar 5, 2024",
    icon: File,
    color: "text-primary",
  },
];

export default function PortalDocumentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Access your shared documents and files
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/5 transition-colors"
              >
                <div className={`p-2 bg-muted rounded-xl`}>
                  <Icon className={`h-5 w-5 ${doc.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.size} · {doc.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
