"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Loader2,
  Scissors,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  Appointment,
  getCustomerAppointments,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { createStripeCheckoutSession } from "@/lib/actions/payments";
import StatusBadge from "@/app/components/shared/StatusBadge";

type FilterTab = "All" | "Pending" | "Confirmed" | "Cancelled";

const FILTER_TABS: FilterTab[] = ["All", "Pending", "Confirmed", "Cancelled"];

function formatAppointmentDate(dateStr: string) {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRequestedDate(isoStr: string) {
  const parsed = new Date(isoStr);
  if (Number.isNaN(parsed.getTime())) return isoStr;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CustomerAppointmentsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  // Modals
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const userEmail = session?.user?.email;
  useEffect(() => {
    if (isSessionLoading || !userEmail) return;

    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        const data = await getCustomerAppointments(userEmail);
        if (isMounted) {
          setAppointments(data);
        }
      } catch {
        if (isMounted) {
          toast.error("Failed to load your appointments.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, userEmail]);

  const filteredAppointments =
    activeFilter === "All"
      ? appointments
      : appointments.filter((appt) => appt.status === activeFilter);

  const handleConfirmCancel = async () => {
    if (!cancelTarget || cancelTarget.status !== "Pending") return;

    try {
      setActionId(cancelTarget._id);
      await updateAppointmentStatus(cancelTarget._id, "Cancelled");
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === cancelTarget._id
            ? { ...item, status: "Cancelled" }
            : item
        )
      );
      toast.success("Appointment request cancelled.");
      setCancelTarget(null);
    } catch {
      toast.error("Could not cancel appointment. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const handlePayNowClick = async (appointment: Appointment) => {
    try {
      setPayingId(appointment._id);
      const { url } = await createStripeCheckoutSession(
        appointment._id,
        appointment.customerEmail
      );
      if (url) {
        // window.location.href = url;
        window.location.assign(url);
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not open Stripe Checkout."
      );
      setPayingId(null);
    }
  };

  const showLoader = isSessionLoading || (isLoading && Boolean(userEmail));

  if (showLoader) {
    return (
      <div className="flex min-h-[65vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9C7886]">
            Your Bookings
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D1A22]">
            My appointments
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track every request, cancel a pending appointment, or pay once the salon has confirmed.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#4A2535] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-[#3A1C29] sm:self-auto"
        >
          <Scissors className="h-4 w-4" />
          Book a service
        </Link>
      </div>

      {/* Filter Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "bg-[#4A2535] text-white shadow-xs"
                  : "border border-[#E6DDD6] bg-white text-[#5C464F] hover:border-[#4A2535]/40"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Full-Width Appointments Table Card */}
      {filteredAppointments.length === 0 ? (
        <div className="w-full rounded-2xl border border-[#EAE2DC] bg-white p-14 text-center shadow-xs">
          <Calendar className="mx-auto h-10 w-10 text-[#8C6D79]" />
          <h2 className="mt-3 font-serif text-xl font-bold text-[#2D1A22]">
            {activeFilter === "All"
              ? "No appointments yet"
              : `No ${activeFilter.toLowerCase()} appointments`}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {activeFilter === "All"
              ? "Explore our salon services and request your first visit."
              : "Switch tabs above to view your other appointment requests."}
          </p>
          {activeFilter === "All" && (
            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#4A2535] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#3A1C29]"
            >
              Browse services
            </Link>
          )}
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-[#EAE2DC] bg-white shadow-xs">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EFE8E3] bg-[#FCF9F7] text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <th className="py-3.5 pl-6 pr-4">Service</th>
                <th className="px-4 py-3.5">Date &amp; Time</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Appointment</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Requested</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE8] text-sm">
              {filteredAppointments.map((appt) => {
                const canCancel = appt.status === "Pending";
                const canPay =
                  appt.status === "Confirmed" &&
                  appt.paymentStatus === "Unpaid";

                return (
                  <tr
                    key={appt._id}
                    className="transition-colors hover:bg-[#FAF6F3]"
                  >
                    {/* Service Image + Name + Category */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#EAE2DC] bg-[#F5EFEA]">
                          <Image
                            src={appt.serviceImage || "/placeholder-salon.jpg"}
                            alt={appt.serviceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D1A22]">
                            {appt.serviceName}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {appt.serviceCategory || "Salon Treatment"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Appointment Date & Time */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-[#2D1A22]">
                        {formatAppointmentDate(appt.appointmentDate)}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {appt.timeSlot}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 font-semibold text-[#2D1A22]">
                      £{Number(appt.servicePrice).toFixed(2)}
                    </td>

                    {/* Appointment Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={appt.status} />
                    </td>

                    {/* Payment Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={appt.paymentStatus} />
                    </td>

                    {/* Requested Date */}
                    <td className="px-4 py-4 text-xs text-neutral-500">
                      {formatRequestedDate(appt.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-4 pr-6">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setSelectedAppointment(appt)}
                          className="rounded-full border border-[#DFD5CE] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2D1A22] transition hover:border-[#4A2535] hover:bg-[#FAF6F3]"
                        >
                          Details
                        </button>

                        {canPay && (
                          <button
                            type="button"
                            onClick={() => handlePayNowClick(appt)}
                            disabled={payingId === appt._id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#B4823E] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#9E6F31] disabled:opacity-60"
                          >
                            {payingId === appt._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CreditCard className="h-3.5 w-3.5" />
                            )}
                            Pay now
                          </button>
                        )}

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(appt)}
                            disabled={actionId === appt._id}
                            className="px-2 py-1 text-xs font-semibold text-rose-600 transition hover:text-rose-800 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9C7886]">
                  {selectedAppointment.serviceCategory || "Salon Service"}
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-[#2D1A22]">
                  {selectedAppointment.serviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3 border-y border-[#EFE8E3] py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Appointment Date</span>
                <span className="font-medium text-[#2D1A22]">
                  {formatAppointmentDate(selectedAppointment.appointmentDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Time Slot</span>
                <span className="font-medium text-[#2D1A22]">
                  {selectedAppointment.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Service Price</span>
                <span className="font-semibold text-[#2D1A22]">
                  £{Number(selectedAppointment.servicePrice).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Appointment Status</span>
                <StatusBadge status={selectedAppointment.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Payment Status</span>
                <StatusBadge status={selectedAppointment.paymentStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Requested On</span>
                <span className="text-xs text-neutral-600">
                  {formatRequestedDate(selectedAppointment.createdAt)}
                </span>
              </div>

              {selectedAppointment.message && (
                <div className="pt-2">
                  <span className="mb-1 block text-xs font-medium text-neutral-500">
                    Your Note
                  </span>
                  <p className="rounded-xl bg-[#FAF6F3] p-3 text-xs text-[#2D1A22]">
                    {selectedAppointment.message}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              {selectedAppointment.status === "Confirmed" &&
                selectedAppointment.paymentStatus === "Unpaid" && (
                  <button
                    type="button"
                    disabled={payingId === selectedAppointment._id}
                    onClick={() => {
                      const target = selectedAppointment;
                      setSelectedAppointment(null);
                      handlePayNowClick(target);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#B4823E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9E6F31] disabled:opacity-60"
                  >
                    {payingId === selectedAppointment._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CreditCard className="h-3.5 w-3.5" />
                    )}
                    Pay now
                  </button>
                )}
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-full bg-[#4A2535] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3A1C29]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-[#2D1A22]">
              Cancel pending appointment?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              Are you sure you want to cancel your request for{" "}
              <strong className="text-[#2D1A22]">
                {cancelTarget.serviceName}
              </strong>{" "}
              on{" "}
              <strong className="text-[#2D1A22]">
                {formatAppointmentDate(cancelTarget.appointmentDate)}
              </strong>{" "}
              at <strong className="text-[#2D1A22]">{cancelTarget.timeSlot}</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="rounded-full border border-[#DFD5CE] px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Keep request
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionId === cancelTarget._id}
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {actionId === cancelTarget._id && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}