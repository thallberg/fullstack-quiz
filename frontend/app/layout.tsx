import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Quiz application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>
        <AuthProvider>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-blue)] text-white">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white drop-shadow-md">
                    Quiz App 🎯
                  </span>
                </div>
              </header>
              <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[var(--color-blue)]/10 via-[var(--color-purple)]/10 to-[var(--color-pink)]/10">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
