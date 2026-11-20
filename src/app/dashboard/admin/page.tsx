"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Plus,
  Scissors,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getAllUsers, UserProfile } from "@/lib/actions/users";
import { getServices, SalonService } from "@/lib/actions/services";
import {
  Appointment,
  getAllAppointments,
} from "@/lib/actions/appointments";
import StatCard from "@/app/components/shared/StatCard";
import StatusBadge from "@/app/components/shared/StatusBadge";
import RoleGate from "@/app/components/RoleGate";
// import StatCard from "@/components/shared/StatCard";
// import StatusBadge from "@/components/shared/StatusBadge";

function formatShortDate(dateStr: string) {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCreatedAt(isoStr: string) {
  const parsed = new Date(isoStr);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminOverviewPage() {
  return (
    <RoleGate role="admin">
      <AdminOverviewContent />
    </RoleGate>
  );
}

function AdminOverviewContent() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<SalonService[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setIsLoading(true);
        const [usersData, servicesData, appointmentsData] = await Promise.all([
          getAllUsers(),
          getServices(),
          getAllAppointments(),
        ]);
        setUsers(usersData);
        setServices(servicesData);
        setAppointments(appointmentsData);
      } catch {
        toast.error("Failed to load salon studio overview.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  // Computed Studio Metrics
  const totalCustomers = users.filter(
    (u) => (u.role || "customer") === "customer"
  ).length;

  const activeServicesCount = services.filter(
    (s) => s.status === "Active" || (!s.status && s.isActive !== false)
  ).length;

  const totalAppointmentsCount = appointments.length;

  const pendingCount = appointments.filter(
    (a) => a.status === "Pending"
  ).length;

  const confirmedCount = appointments.filter(
    (a) => a.status === "Confirmed"
  ).length;

  const cancelledCount = appointments.filter(
    (a) => a.status === "Cancelled"
  ).length;

  const paidAppointments = appointments.filter(
    (a) => a.paymentStatus === "Paid"
  );
  const totalRevenue = paidAppointments.reduce(
    (sum, item) => sum + Number(item.servicePrice || 0),
    0
  );

  const latestAppointments = appointments.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">
          Loading salon studio overview...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9C7886]">
            Salon Studio
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D1A22]">
            Today at a glance
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Customers, services, appointment requests and verified payments — all in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/admin/services/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#4A2535] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A1C29]"
          >
            <Plus className="h-4 w-4" />
            New service
          </Link>
          <Link
            href="/dashboard/admin/appointments"
            className="inline-flex items-center gap-2 rounded-full border border-[#DFD5CE] bg-white px-5 py-2.5 text-xs font-semibold text-[#2D1A22] transition hover:border-[#4A2535] hover:bg-[#FAF6F3]"
          >
            Review requests
          </Link>
        </div>
      </div>

      {/* 6 Summary Stat Cards (2 rows x 3 cols) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Customers"
          value={totalCustomers}
          subtitle="Registered client accounts"
          icon={<Users className="h-4 w-4" />}
          iconBgClass="bg-[#F3ECE8] text-[#5C3A47]"
        />
        <StatCard
          label="Active Services"
          value={activeServicesCount}
          subtitle={`${services.length} services in total`}
          icon={<Scissors className="h-4 w-4" />}
          iconBgClass="bg-[#F3ECE8] text-[#5C3A47]"
        />
        <StatCard
          label="Successful Payments"
          value={`£${totalRevenue.toFixed(2)}`}
          subtitle={`${paidAppointments.length} verified transactions`}
          icon={<CreditCard className="h-4 w-4" />}
          iconBgClass="bg-teal-100/80 text-teal-700"
        />
        <StatCard
          label="Pending Requests"
          value={pendingCount}
          subtitle={`Out of ${totalAppointmentsCount} total requests`}
          icon={<Clock className="h-4 w-4" />}
          iconBgClass="bg-amber-100/80 text-amber-700"
        />
        <StatCard
          label="Confirmed"
          value={confirmedCount}
          subtitle="Upcoming paid or unpaid visits"
          icon={<CheckCircle2 className="h-4 w-4" />}
          iconBgClass="bg-emerald-100/80 text-emerald-700"
        />
        <StatCard
          label="Cancelled"
          value={cancelledCount}
          subtitle={`${totalAppointmentsCount} appointments all-time`}
          icon={<XCircle className="h-4 w-4" />}
          iconBgClass="bg-rose-100/80 text-rose-600"
        />
      </div>

      {/* Bottom 2-Column Layout: Latest Requests Table + Keep the Salon Moving */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Latest Appointment Requests Table */}
        <div className="rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xs lg:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2D1A22]">
                Latest appointment requests
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Newest requests across the salon.
              </p>
            </div>
            <Link
              href="/dashboard/admin/appointments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A2535] hover:underline"
            >
              Manage all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {latestAppointments.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#E5DBD4] bg-[#FAF7F5] p-10 text-center">
              <p className="text-sm font-semibold text-[#2D1A22]">
                No appointment requests yet
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Customer bookings will appear here as soon as they are submitted.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[580px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#EFE8E3] text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="px-3 pb-3">Service</th>
                    <th className="px-3 pb-3">Date</th>
                    <th className="px-3 pb-3">Status</th>
                    <th className="pl-3 pb-3 text-right">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EDE9] text-sm">
                  {latestAppointments.map((appt) => (
                    <tr
                      key={appt._id}
                      className="transition-colors hover:bg-[#FAF6F3]"
                    >
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-[#2D1A22]">
                          {appt.customerName}
                        </p>
                        <p className="mt-0.5 text-[11px] text-neutral-400">
                          {formatCreatedAt(appt.createdAt)}
                        </p>
                      </td>
                      <td className="px-3 py-3.5 font-medium text-[#2D1A22]">
                        {appt.serviceName}
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-xs font-medium text-[#2D1A22]">
                          {formatShortDate(appt.appointmentDate)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-neutral-400">
                          {appt.timeSlot}
                        </p>
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={appt.status} />
                      </td>
                      <td className="pl-3 py-3.5 text-right">
                        <StatusBadge status={appt.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Quick Actions ("Keep the salon moving") + Verification Note */}
        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-2xl bg-[#3D1D2B] p-6 text-white shadow-xs">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-200/70">
              Quick Actions
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              Keep the salon moving
            </h2>

            <div className="mt-5 space-y-2.5">
              <Link
                href="/dashboard/admin/appointments"
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white transition hover:bg-white/15"
              >
                <span className="flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 text-[#D9A760]" />
                  Confirm pending requests
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-white/70" />
              </Link>

              <Link
                href="/dashboard/admin/services"
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white transition hover:bg-white/15"
              >
                <span className="flex items-center gap-2.5">
                  <Scissors className="h-4 w-4 text-[#D9A760]" />
                  Edit the service menu
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-white/70" />
              </Link>

              <Link
                href="/dashboard/admin/customers"
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white transition hover:bg-white/15"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-[#D9A760]" />
                  Review customer accounts
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-white/70" />
              </Link>

              <Link
                href="/dashboard/admin/transactions"
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white transition hover:bg-white/15"
              >
                <span className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-[#D9A760]" />
                  See verified payments
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-white/70" />
              </Link>
            </div>
          </div>

          {/* Bottom Security & Verification Note Card */}
          <div className="rounded-2xl border border-[#EAE2DC] bg-[#F6EFE9] p-5">
            <div className="flex items-center gap-2 text-[#4A2535]">
              <ShieldCheck className="h-4 w-4" />
              <h3 className="font-serif text-base font-bold text-[#2D1A22]">
                Payments stay verified
              </h3>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
              Appointments are marked paid only after a signature-verified Stripe webhook event — never manually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}