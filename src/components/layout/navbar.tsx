"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, UserRound } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/layout/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/app/components/shared/ThemeToggled";

type NavLink = { href: string; label: string };

const PUBLIC_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  // "Featured Salon Services" — its own route at src/app/features/page.tsx.
  { href: "/features", label: "Features" },
];

export function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    const { error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("User signout successfully");
         router.push("/sign-in");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to sign out");
        },
      },
    });
    if (error) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  // Dashboard lives ONLY in the avatar dropdown (project requirement) — the
  // main-nav entry next to "Browse Services" has been removed, so `navLinks`
  // is just the public links (Home / Browse Services / Features).
  //
  // The dropdown still needs its target:
  // - signed in  → straight to that user's role dashboard (/dashboard/customer | /dashboard/admin)
  // - signed out → /dashboard, which server-redirects to /dashboard/customer
  // The server route (src/app/dashboard/page.tsx) is the single source of
  // truth for the role redirect, so the navbar can render before the session
  // finishes loading without flashing the wrong link.
  const dashboardHref = user
    ? `/dashboard/${user.role || "customer"}`
    : "/dashboard";

  const navLinks: NavLink[] = PUBLIC_LINKS;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                isActive(link.href) && "bg-accent text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        

        <div className="flex items-center gap-3">
          <ThemeToggle/>

          {user && (
            <span className="hidden text-sm font-medium text-muted-foreground lg:inline">
              Welcome, <span className="font-semibold text-foreground">{user.name}</span>
            </span>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-full border bg-card p-1.5 pr-3 shadow-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open profile menu"
              >
                <Avatar className="size-8">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {initials || <UserRound className="size-4" />}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                  {user.name}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-lg">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-1 p-3">
                    <p className="truncate text-base font-bold text-foreground">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-1.5 w-fit rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-secondary-foreground uppercase">
                      {user.role || "customer"}
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    render={<Link href={dashboardHref} />}
                    className="cursor-pointer gap-2.5 rounded-xl py-2.5 font-medium"
                  >
                    <LayoutDashboard className="size-4 text-muted-foreground" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    render={<Link href="/dashboard/profile" />}
                    className="cursor-pointer gap-2.5 rounded-xl py-2.5 font-medium"
                  >
                    <User className="size-4 text-muted-foreground" />
                    My profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2.5 rounded-xl py-2.5 font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Sign In
              </Link>
              <Link href="/sign-up" className={cn(buttonVariants())}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile navigation */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left font-heading text-xl font-semibold">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 px-4"
                aria-label="Mobile main"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                      isActive(link.href) && "bg-accent text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {user ? (
                  <Button
                    variant="outline"
                    className="mt-3 w-full justify-start"
                    onClick={() => {
                      closeMobile();
                      handleLogout();
                    }}
                  >
                    <LogOut aria-hidden="true" />
                    Logout
                  </Button>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    <Link
                      href="/sign-in"
                      onClick={closeMobile}
                      className={cn(buttonVariants({ variant: "outline" }))}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={closeMobile}
                      className={cn(buttonVariants())}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
