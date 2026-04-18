"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NexTradeLogo } from "@/components/brand/logo";
import { ShoppingCart, Search, User, LogOut, LayoutDashboard, Menu, Sun, Moon } from "lucide-react";
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
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback, type FormEvent } from "react";
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
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const debouncedSearch = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout>;
      return (value: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }, 400);
      };
    })(),
    [router]
  );

  function handleSearchChange(value: string) {
    setQuery(value);
    debouncedSearch(value);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-16">
        <Link href="/" className="shrink-0">
          <NexTradeLogo className="h-8 w-auto" variant="auto" />
        </Link>

        {/* Desktop category nav */}
        <nav className="hidden md:flex gap-1">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`text-sm px-2.5 py-1.5 rounded-md hover:bg-muted transition-colors ${
                pathname === `/category/${cat.slug}` ? "bg-muted font-medium" : "text-muted-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Debounced search */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center w-44 lg:w-60">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search…"
              className="pl-8 h-9 bg-muted/50 border-transparent focus:border-border"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Dark mode toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shrink-0"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        {/* Cart */}
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative shrink-0">
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
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm font-medium truncate">{session.user.name}</div>
              <div className="px-2 pb-1.5 text-xs text-muted-foreground truncate">{session.user.email}</div>
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
            <Button variant="ghost" size="sm" className="shrink-0">Sign in</Button>
          </Link>
        )}

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-muted transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left">
            <NexTradeLogo className="h-8 w-auto mb-4" variant="auto" />
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search products…"
                  className="pl-8"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="py-2 px-3 rounded-md hover:bg-muted text-sm"
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
