import type { Metadata } from "next";
import { cookies } from "next/headers";
import { QueryProvider } from "@/lib/query/query-provider";
import { ThemeProvider, type ThemeVariant } from "@/lib/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOGAP",
  description: "SaaS B2B para estudios juridicos"
};

const variantCookieName = "bogaap-theme-variant";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const initialVariant: ThemeVariant =
    cookieStore.get(variantCookieName)?.value === "dark" ? "dark" : "light";
  const htmlClassName = initialVariant === "dark" ? "theme-navy-slate dark" : "theme-navy-slate";

  return (
    <html lang="es" className={htmlClassName}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=overlays-content" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider initialVariant={initialVariant}>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
