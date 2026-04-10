import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "AutoCRM — AI-Powered Automotive CRM",
  description: "AI-native CRM layer for automotive dealerships",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="h-full bg-background text-foreground">
        <TooltipProvider>
          <Sidebar />
          <div className="flex h-full min-h-0 flex-col pl-[240px]">
            <Topbar />
            <main className="min-h-0 flex-1 overflow-auto">{children}</main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
