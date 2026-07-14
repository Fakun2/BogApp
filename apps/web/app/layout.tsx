import type { Metadata } from "next";
import { QueryProvider } from "@/lib/query/query-provider";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOGAP",
  description: "SaaS B2B para estudios juridicos"
};

const themeInitScript = `
(() => {
  try {
    const root = document.documentElement;
    const colorMode = "navy-slate";
    const variant = localStorage.getItem("bogaap-theme-variant") === "dark" ? "dark" : "light";

    root.classList.remove("theme-monotone", "theme-dorado", "theme-navy-slate", "dark");
    root.classList.add("theme-" + colorMode);

    if (variant === "dark") {
      root.classList.add("dark");
    }

    localStorage.setItem("bogaap-theme", colorMode);
    localStorage.setItem("bogaap-theme-variant", variant);
  } catch {
    document.documentElement.classList.add("theme-navy-slate");
    document.documentElement.classList.remove("dark");
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="theme-navy-slate" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
