"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Search, User, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { signOut } from "next-auth/react";
import { useState, type FormEvent } from "react";
import type { Session } from "next-auth";

type Category = { slug: string; name: string };

interface NavbarProps {
  categories: Category[];
  session: Session | null;
}

export function Navbar({ categories, session }: NavbarProps) {
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-16">
        <Link href="/" className="font-bold text-xl tracking-tight shrink-0">
          NexTrade
        </Link>

        {/* Desktop category nav */}
        <nav className="hidden md:flex gap-1 flex-wrap">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`text-sm px-2 py-1 rounded hover:bg-muted transition-colors ${
                pathname === `/category/${cat.slug}` ? "bg-muted font-medium" : "text-muted-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 w-48 lg:w-64">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-8 h-9"
            />
          </div>
        </form>

        {/* Cart */}
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
        </Link>

        {/* User menu */}
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-muted transition-colors">
              <User className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm font-medium">{session.user.name}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/orders" className="flex w-full">My Orders</Link>
              </DropdownMenuItem>
              {session.user.role === "admin" && (
                <DropdownMenuItem>
                  <Link href="/admin" className="flex w-full items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
        )}

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-muted transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-1 mt-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="py-2 px-3 rounded hover:bg-muted text-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
