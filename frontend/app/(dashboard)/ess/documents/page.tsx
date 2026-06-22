"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { apiGet } from "@/lib/api";
import { FileText, Download, ExternalLink } from "lucide-react";

interface Document {
  id: number;
  title: string;
  category: string;
  file_url: string;
  version: number;
  uploaded_by: number;
  created_at: string;
}

export default function ESSDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ data: Document[] }>("/ess/documents")
      .then((res) => setDocs(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-muted-foreground">Loading documents...</div>;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="My Documents"
        description="Access your personal documents and files."
        icon={<FileText className="h-6 w-6 text-primary" />}
      />

      {docs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No documents found.</p>
          <p className="text-xs text-muted-foreground mt-1">Your documents will appear here once uploaded by HR.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 text-xs font-medium text-muted-foreground">Title</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Version</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Uploaded</th>
                  <th className="p-3 text-xs font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {docs.map((d) => (
                  <tr key={d.id} className="hover:bg-muted/5 transition-colors">
                    <td className="p-3 font-medium">{d.title}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{d.category}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">v{d.version}</td>
                    <td className="p-3 text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" /> View
                      </a>
                    </td>
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
