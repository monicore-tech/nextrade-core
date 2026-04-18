import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { getCategories } from "@/lib/dummyApi";
import { auth } from "@/auth";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: { default: "NexTrade Core", template: "%s | NexTrade" },
  description: "Modern e-commerce powered by DummyJSON",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, session] = await Promise.all([getCategories(), auth()]);

  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <Navbar categories={categories} session={session} />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">{children}</main>
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NexTrade Core
          </footer>
        </CartProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
