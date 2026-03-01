import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { LayoutHeader } from "@/components/layout/LayoutHeader";

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
          <LocaleProvider>
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              <SidebarInset>
                <LayoutHeader />
                <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[var(--color-blue)]/10 via-[var(--color-purple)]/10 to-[var(--color-pink)]/10">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
