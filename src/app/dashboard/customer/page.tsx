// import React from 'react';

// const CustomerDashboardPage = () => {
//     return (
//         <div>
//             <h2>Customer Dashboard Page</h2>
//         </div>
//     );
// };

// export default CustomerDashboardPage;
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Scissors,
  Sparkles,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner"; // Swap to "react-hot-toast" if using react-hot-toast
import { useSession } from "@/lib/auth-client";
import {
  Appointment,
  getCustomerAppointments,
} from "@/lib/actions/appointments";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";

export default function CustomerOverviewPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userEmail = session?.user?.email;
  const firstName = session?.user?.name?.split(" ")[0] || "Guest";

  useEffect(() => {
    if (isSessionLoading) return;

    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getCustomerAppointments(userEmail);
        setAppointments(data);
      } catch {
        toast.error("Failed to load dashboard overview.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isSessionLoading, userEmail]);

  // Compute overview counts
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const cancelledCount = appointments.filter((a) => a.status === "Cancelled").length;

  // Latest 4 requests for the Recent Appointments panel
  const recentAppointments = appointments.slice(0, 4);

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">Loading your salon overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Greeting Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8C6D79]">
            Your Salon
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D1A22]">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            A clear view of your appointments, payments and next visit.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4A2535] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-[#3A1C29]"
        >
          <Scissors className="h-4 w-4" />
          Book a service
        </Link>
      </div>

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Appointments"
          value={totalCount}
          icon={<Calendar className="h-4 w-4" />}
          iconBgClass="bg-[#F3ECE8] text-[#5C3A47]"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          subtitle="Awaiting salon confirmation"
          icon={<Clock className="h-4 w-4" />}
          iconBgClass="bg-amber-100/80 text-amber-700"
        />
        <StatCard
          label="Confirmed"
          value={confirmedCount}
          subtitle="Ready to pay or visit"
          icon={<CheckCircle2 className="h-4 w-4" />}
          iconBgClass="bg-emerald-100/80 text-emerald-700"
        />
        <StatCard
          label="Cancelled"
          value={cancelledCount}
          icon={<XCircle className="h-4 w-4" />}
          iconBgClass="bg-rose-100/80 text-rose-600"
        />
      </div>

      {/* Bottom 2-Column Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Recent Appointments Card */}
        <div className="rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xs lg:col-span-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2D1A22]">
                Recent appointments
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Your latest requests and their status.
              </p>
            </div>
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A2535] hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#E5DBD4] bg-[#FAF7F5] p-8 text-center">
              <p className="text-sm font-medium text-[#2D1A22]">
                No appointment requests yet
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Browse our salon services to book your first treatment.
              </p>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#4A2535] px-4 py-2 text-xs font-medium text-white"
              >
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-[#EFE8E3] bg-[#FCFBF9] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE8] text-[#5C3A47]">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2D1A22]">
                        {appt.serviceName}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {appt.appointmentDate} · {appt.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <StatusBadge status={appt.status} />
                    <StatusBadge status={appt.paymentStatus} />
                    <span className="ml-1 text-sm font-bold text-[#2D1A22]">
                      £{Number(appt.servicePrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Inspiration Cards */}
        <div className="space-y-5 lg:col-span-5">
          {/* Dark Plum "How payment works" Card */}
          <div className="rounded-2xl bg-[#3D1D2B] p-6 text-white shadow-xs">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-200/70">
              Good to know
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              How payment works
            </h2>

            <ol className="mt-4 space-y-3 text-xs leading-relaxed text-rose-100/90">
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold">
                  1
                </span>
                <span>
                  Request an appointment and wait for the salon to confirm.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold">
                  2
                </span>
                <span>
                  Once confirmed, a <strong>Pay now</strong> button appears beside
                  the appointment.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold">
                  3
                </span>
                <span>Checkout is handled securely by Stripe.</span>
              </li>
            </ol>

            <Link
              href="/dashboard/customer/appointments"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-[#3D1D2B] transition hover:bg-rose-50"
            >
              Go to my appointments
            </Link>
          </div>

          {/* Warm Cream "Looking for inspiration?" Card */}
          <div className="rounded-2xl border border-[#EAE2DC] bg-[#F6EFE9] p-6">
            <Sparkles className="h-5 w-5 text-[#7A4B5E]" />
            <h3 className="mt-3 font-serif text-lg font-bold text-[#2D1A22]">
              Looking for inspiration?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              Explore seasonal colour, skin rituals and quiet spa treatments on
              the full menu.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#4A2535] hover:underline"
            >
              Browse services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}