"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Plus,
  Scissors,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";

type Role = "customer" | "admin";

interface MenuItem {
  /** Stable React key. */
  id: string;
  /** Label rendered next to the icon. */
  name: string;
  /** Route this item points at. */
  url: string;
  /** Lucide icon component. */
  icon: LucideIcon;
}

/** Sidebar links per role — mirrors the customer / admin dashboard mockups. */
const menuItemsByRole: Record<Role, MenuItem[]> = {
  customer: [
    { id: "overview", name: "Overview", url: "/dashboard/customer", icon: LayoutDashboard },
    { id: "appointments", name: "My appointments", url: "/dashboard/customer/appointments", icon: CalendarDays },
    { id: "services", name: "Browse services", url: "/services", icon: Scissors },
    { id: "profile", name: "My profile", url: "/dashboard/customer/profile", icon: UserRound },
  ],
  admin: [
    { id: "overview", name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
    { id: "services", name: "Manage services", url: "/dashboard/admin/services", icon: Scissors },
    { id: "add-servics", name: "Add service", url: "/dashboard/admin/services/new", icon: Plus },
    { id: "appointments", name: "Appointments", url: "/dashboard/admin/appointments", icon: CalendarDays },
    { id: "customers", name: "Customers", url: "/dashboard/admin/customers", icon: Users },
    { id: "transactions", name: "Transactions", url: "/dashboard/admin/transactions", icon: CreditCard },
    { id: "profile", name: "My profile", url: "/dashboard/admin/profile", icon: UserRound },
  ],
};

/** Eyebrow + heading shown in the sidebar header for each role. */
const dashboardHeadingByRole: Record<Role, { label: string; title: string }> = {
  customer: { label: "Your salon", title: "Customer dashboard" },
  admin: { label: "Salon studio", title: "Admin dashboard" },
};

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  // The sidebar mirrors the page being viewed: /dashboard/admin shows the
  // admin menu, /dashboard/customer shows the customer menu. Any other
  // dashboard route falls back to the signed-in role (session role comes
  // from Better Auth as a plain string — narrow it so the role-keyed
  // records below stay type-safe).
  const role: Role = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/customer")
      ? "customer"
      : session?.user?.role === "admin"
        ? "admin"
        : "customer";
  const heading = dashboardHeadingByRole[role];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            {heading.label}
          </p>
          <p className="font-heading text-lg font-semibold text-sidebar-foreground">
            {heading.title}
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsByRole[role].map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={pathname === item.url}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
