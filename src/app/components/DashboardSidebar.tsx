"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Plus,
  Scissors,
  Sparkles,
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
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";

type Role = "customer" | "admin";

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}

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

const dashboardHeadingByRole: Record<Role, { label: string; title: string }> = {
  customer: { label: "Your salon", title: "Customer dashboard" },
  admin: { label: "Salon studio", title: "Admin dashboard" },
};

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
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
      <SidebarHeader className="px-4 pt-5 pb-3">
        {/* SalonBook Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-sidebar-foreground">
            Salon<span className="text-primary">Book</span>
          </span>
        </Link>

        <div className="my-3 border-t border-sidebar-border" />

        {/* Role Eyebrow + Heading */}
        <div className="px-1">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            {heading.label}
          </p>
          <p className="font-heading text-lg font-semibold text-sidebar-foreground">
            {heading.title}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
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