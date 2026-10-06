import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WakeBackend from "@/components/common/WakeBackend";

const inter = Inter({ subsets: ["latin"] });

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
