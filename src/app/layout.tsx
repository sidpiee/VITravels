import type { Metadata } from "next";
import {
  Funnel_Display,
  Geist,
  Geist_Mono,
  Inter,
  Special_Gothic_Expanded_One,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NavMenu } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import QueryProvider from "@/services/QueryProvider";

const special = Special_Gothic_Expanded_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-special",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-funnel-display",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vitravels",
  description: "Find your perfect travel partner",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        funnelDisplay.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className={`min-h-full flex flex-col ${special.variable}`}>
        <QueryProvider>
          <ThemeProvider attribute="class">
            <div className="fixed top-0 right-0 z-50 p-4">
              <NavMenu />
            </div>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
