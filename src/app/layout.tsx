import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { getCategories } from "@/lib/dummyApi";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: { default: "NexTrade Core", template: "%s | NexTrade" },
  description: "Modern e-commerce powered by DummyJSON",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, session] = await Promise.all([getCategories(), auth()]);

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
          <CartProvider>
            <Navbar categories={categories} session={session} />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">{children}</main>
            <footer className="border-t py-8 text-center text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">NexTrade Core</p>
              <p>© {new Date().getFullYear()} All rights reserved.</p>
            </footer>
          </CartProvider>
          </SessionProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
