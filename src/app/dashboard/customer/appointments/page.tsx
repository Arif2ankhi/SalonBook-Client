"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CreditCard,
  Eye,
  Loader2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner"; // Swap to "react-hot-toast" if you use react-hot-toast
import { useSession } from "@/lib/auth-client";
import {
  Appointment,
  getCustomerAppointments,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import StatusBadge from "@/app/components/shared/StatusBadge";
// import StatusBadge from "@/components/shared/StatusBadge";

export default function CustomerAppointmentsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const userEmail = session?.user?.email;

  const fetchAppointments = useCallback(async () => {
    if (!userEmail) return;
    try {
      setIsLoading(true);
      const data = await getCustomerAppointments(userEmail);
      setAppointments(data);
    } catch {
      toast.error("Failed to load your appointments.");
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!isSessionLoading && userEmail) {
      fetchAppointments();
    } else if (!isSessionLoading && !userEmail) {
      setIsLoading(false);
    }
  }, [isSessionLoading, userEmail, fetchAppointments]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget || cancelTarget.status !== "Pending") return;

    try {
      setActionId(cancelTarget._id);
      await updateAppointmentStatus(cancelTarget._id, "Cancelled");
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === cancelTarget._id ? { ...item, status: "Cancelled" } : item
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

  const handlePayNowClick = (appointment: Appointment) => {
    // Placeholder until Stripe Checkout is initialized in the final step
    toast.info(
      `Stripe Checkout for "${appointment.serviceName}" (£${appointment.servicePrice.toFixed(
        2
      )}) will be connected next!`
    );
  };

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-base-content/70">Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">My Appointments</h1>
          <p className="text-sm text-base-content/70">
            Track your salon requests, cancel pending bookings, or pay for confirmed sessions.
          </p>
        </div>
        <Link href="/services" className="btn btn-primary btn-sm sm:btn-md">
          <Sparkles className="h-4 w-4" />
          Book New Service
        </Link>
      </div>

      {/* Empty State */}
      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">
          <Calendar className="mx-auto h-10 w-10 text-primary/70" />
          <h2 className="mt-3 text-lg font-semibold">No appointments yet</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Explore our salon treatments and schedule your first visit.
          </p>
          <Link href="/services" className="btn btn-primary btn-sm mt-5">
            Browse Services
          </Link>
        </div>
      ) : (
        /* Responsive Table */
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <table className="table w-full">
            <thead className="bg-base-200/70 text-xs uppercase text-base-content/70">
              <tr>
                <th>Service</th>
                <th>Appointment Schedule</th>
                <th>Price</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Requested On</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const canCancel = appt.status === "Pending";
                const canPay =
                  appt.status === "Confirmed" && appt.paymentStatus === "Unpaid";

                return (
                  <tr key={appt._id} className="hover:bg-base-200/30">
                    {/* Service Image, Name & Category */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-base-300 bg-base-200">
                          <Image
                            src={appt.serviceImage || "/placeholder-salon.jpg"}
                            alt={appt.serviceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-base-content">
                            {appt.serviceName}
                          </div>
                          {appt.serviceCategory && (
                            <div className="text-xs text-base-content/60">
                              {appt.serviceCategory}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {appt.appointmentDate}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-base-content/70">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {appt.timeSlot}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="font-semibold text-base-content">
                      £{Number(appt.servicePrice).toFixed(2)}
                    </td>

                    {/* Appointment Status */}
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>

                    {/* Payment Status */}
                    <td>
                      <StatusBadge status={appt.paymentStatus} />
                    </td>

                    {/* Request Date */}
                    <td className="text-xs text-base-content/70">
                      {new Date(appt.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAppointment(appt)}
                          className="btn btn-ghost btn-xs tooltip"
                          data-tip="View Details"
                          aria-label="View Appointment Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(appt)}
                            disabled={actionId === appt._id}
                            className="btn btn-outline btn-error btn-xs"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        )}

                        {canPay && (
                          <button
                            type="button"
                            onClick={() => handlePayNowClick(appt)}
                            className="btn btn-primary btn-xs"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            Pay Now
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

      {/* Details Modal */}
      {selectedAppointment && (
        <dialog open className="modal modal-open bg-black/40">
          <div className="modal-box max-w-md">
            <h3 className="text-lg font-bold">{selectedAppointment.serviceName}</h3>
            {selectedAppointment.serviceCategory && (
              <p className="text-xs text-primary font-medium mt-0.5">
                {selectedAppointment.serviceCategory}
              </p>
            )}

            <div className="mt-4 space-y-2.5 text-sm border-y border-base-200 py-4">
              <div className="flex justify-between">
                <span className="text-base-content/60">Date & Time:</span>
                <span className="font-medium">
                  {selectedAppointment.appointmentDate} at {selectedAppointment.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Price:</span>
                <span className="font-semibold">
                  £{Number(selectedAppointment.servicePrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Appointment Status:</span>
                <StatusBadge status={selectedAppointment.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Payment Status:</span>
                <StatusBadge status={selectedAppointment.paymentStatus} />
              </div>
              {selectedAppointment.message && (
                <div className="pt-2">
                  <span className="text-base-content/60 block mb-1">Your Message:</span>
                  <p className="rounded-lg bg-base-200 p-2.5 text-xs">
                    {selectedAppointment.message}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="btn btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <dialog open className="modal modal-open bg-black/40">
          <div className="modal-box max-w-sm">
            <h3 className="text-lg font-bold">Cancel Appointment?</h3>
            <p className="py-3 text-sm text-base-content/75">
              Are you sure you want to cancel your pending request for{" "}
              <strong>{cancelTarget.serviceName}</strong> on{" "}
              <strong>{cancelTarget.appointmentDate}</strong> at{" "}
              <strong>{cancelTarget.timeSlot}</strong>?
            </p>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="btn btn-ghost btn-sm"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionId === cancelTarget._id}
                className="btn btn-error btn-sm"
              >
                {actionId === cancelTarget._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}