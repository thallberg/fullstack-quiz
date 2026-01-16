import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationMenu } from "@/components/NavigationMenu";

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Quiz application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>
        <AuthProvider>
          <NavigationMenu />
          <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
