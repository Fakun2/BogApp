import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOGAP",
  description: "SaaS B2B para estudios juridicos"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="theme-navy-slate dark">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
