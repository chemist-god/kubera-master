import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TopNav } from "@/components/nav/top-nav";
import { genVariable } from "@/lib/config/genVariable";

const outfit = Outfit({ variable: '--font-sans', subsets: ["latin"] });

export const metadata: Metadata = {
  title: genVariable.app.name,
  description: genVariable.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav />
          {children}
          <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {genVariable.app.displayName}
            </span>
            <span className="mx-2 text-muted-foreground/60">•</span>
            <span className="font-mono">v{genVariable.version.app}</span>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
