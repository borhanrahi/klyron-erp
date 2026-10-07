import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WakeBackend from "@/components/common/WakeBackend";

const inter = Inter({ subsets: ["latin"] });

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/api\/v1\/?$/, "");

export const metadata: Metadata = {
  title: "Klyron ERP",
  description: "Enterprise Resource Planning System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Instant wake: fires during HTML parse, before any JS bundle loads */}
        <link rel="preconnect" href={API_BASE} />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{fetch(${JSON.stringify(API_BASE + "/health")},{keepalive:true}).catch(function(){})}catch(e){}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=null;try{t=localStorage.getItem("klyron-theme")}catch(e){}if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}})()`,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <WakeBackend />
        {children}
      </body>
    </html>
  );
}
