"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Eye,
  Loader2,
  MessageSquare,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Appointment,
  getAllAppointments,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import StatusBadge from "@/app/components/shared/StatusBadge";
import RoleGate from "@/app/components/RoleGate";
// import StatusBadge from "@/components/shared/StatusBadge";

type StatusFilter = "All" | "Pending" | "Confirmed" | "Cancelled";

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

export default function AdminAppointmentsPage() {
  return (
    <RoleGate role="admin">
      <AdminAppointmentsContent />
    </RoleGate>
  );
}

function AdminAppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Modals
  const [detailsTarget, setDetailsTarget] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  useEffect(() => {
    // Loaded once on mount. Defined inside the effect (like the other
    // dashboard pages) so no setState runs while the effect body executes.
    const loadAppointments = async () => {
      try {
        // isLoading already starts as true, so no need to set it here.
        const data = await getAllAppointments();
        setAppointments(data);
      } catch {
        toast.error("Failed to load appointment requests.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus =
      statusFilter === "All" || appt.status === statusFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      appt.customerName?.toLowerCase().includes(q) ||
      appt.customerEmail?.toLowerCase().includes(q) ||
      appt.serviceName?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleConfirmAppointment = async (appt: Appointment) => {
    if (appt.status !== "Pending") return;

    try {
      setActionId(appt._id);
      await updateAppointmentStatus(appt._id, "Confirmed");
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === appt._id ? { ...item, status: "Confirmed" } : item
        )
      );
      toast.success(`Confirmed ${appt.customerName}'s appointment.`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not confirm appointment."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelTarget) return;

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
      toast.success("Appointment cancelled.");
      setCancelTarget(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel appointment."
      );
    } finally {
      setActionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">
          Loading appointment requests...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9C7886]">
          Bookings
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D1A22]">
          Appointments
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review every request, confirm a time, or cancel on behalf of the salon. Status changes are enforced by the server.
        </p>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#EAE2DC] bg-white p-3.5 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email or service..."
            className="w-full rounded-xl border border-[#EFE8E3] bg-[#FCFBF9] py-2 pl-10 pr-4 text-sm text-[#2D1A22] placeholder:text-neutral-400 focus:border-[#4A2535] focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          aria-label="Filter appointments by status"
          className="rounded-xl border border-[#DFD5CE] bg-white px-4 py-2 text-xs font-semibold text-[#2D1A22] focus:border-[#4A2535] focus:outline-none sm:w-44"
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-[#EAE2DC] bg-white p-14 text-center shadow-xs">
          <p className="font-serif text-xl font-bold text-[#2D1A22]">
            No matching appointments
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Try clearing your search filter or switching the status dropdown.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-[#EAE2DC] bg-white shadow-xs">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EFE8E3] bg-[#FCF9F7] text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <th className="py-3.5 pl-6 pr-4">Customer</th>
                <th className="px-4 py-3.5">Service</th>
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
                const canConfirm = appt.status === "Pending";
                const canCancel =
                  appt.status === "Pending" || appt.status === "Confirmed";
                const isBusy = actionId === appt._id;
                const initial =
                  appt.customerName?.charAt(0).toUpperCase() || "C";

                return (
                  <tr
                    key={appt._id}
                    className="transition-colors hover:bg-[#FAF6F3]"
                  >
                    {/* Customer Avatar + Name + Email */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#4A2535] text-xs font-bold text-white">
                          {appt.customerImage ? (
                            <Image
                              src={appt.customerImage}
                              alt={appt.customerName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            initial
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#2D1A22]">
                            {appt.customerName}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {appt.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Service Name + Category */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#2D1A22]">
                        {appt.serviceName}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {appt.serviceCategory || "Salon Treatment"}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-4">
                      <p className="text-xs font-semibold text-[#2D1A22]">
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailsTarget(appt)}
                          title="View appointment details"
                          aria-label="View appointment details"
                          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#E6DDD6] bg-white text-[#5C464F] transition hover:border-[#4A2535] hover:text-[#2D1A22]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {appt.message && (
                            <span
                              title="Has customer message"
                              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#B4823E]"
                            />
                          )}
                        </button>

                        {canConfirm && (
                          <button
                            type="button"
                            onClick={() => handleConfirmAppointment(appt)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-full border border-[#DFD5CE] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#2D1A22] shadow-2xs transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                            Confirm
                          </button>
                        )}

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(appt)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:text-rose-800 disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
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
      {detailsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9C7886]">
                  {detailsTarget.serviceCategory || "Booking Details"}
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-[#2D1A22]">
                  {detailsTarget.serviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsTarget(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3 border-y border-[#EFE8E3] py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer</span>
                <span className="font-semibold text-[#2D1A22]">
                  {detailsTarget.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Email</span>
                <span className="text-xs text-[#2D1A22]">
                  {detailsTarget.customerEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Appointment</span>
                <span className="font-medium text-[#2D1A22]">
                  {formatAppointmentDate(detailsTarget.appointmentDate)} ·{" "}
                  {detailsTarget.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Service Price</span>
                <span className="font-semibold text-[#2D1A22]">
                  £{Number(detailsTarget.servicePrice).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Appointment Status</span>
                <StatusBadge status={detailsTarget.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Payment Status</span>
                <StatusBadge status={detailsTarget.paymentStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Requested On</span>
                <span className="text-xs text-neutral-600">
                  {formatRequestedDate(detailsTarget.createdAt)}
                </span>
              </div>

              <div className="pt-2">
                <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <MessageSquare className="h-3.5 w-3.5 text-[#7A4B5E]" />
                  Customer Message
                </span>
                <p className="rounded-xl bg-[#FAF6F3] p-3 text-xs text-[#2D1A22]">
                  {detailsTarget.message?.trim()
                    ? detailsTarget.message
                    : "No additional message provided."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              {detailsTarget.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => {
                    const target = detailsTarget;
                    setDetailsTarget(null);
                    handleConfirmAppointment(target);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirm booking
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetailsTarget(null)}
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
              Cancel customer appointment?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              Are you sure you want to cancel{" "}
              <strong className="text-[#2D1A22]">
                {cancelTarget.customerName}
              </strong>
              &apos;s booking for{" "}
              <strong className="text-[#2D1A22]">
                {cancelTarget.serviceName}
              </strong>{" "}
              on{" "}
              <strong className="text-[#2D1A22]">
                {formatAppointmentDate(cancelTarget.appointmentDate)}
              </strong>{" "}
              at{" "}
              <strong className="text-[#2D1A22]">{cancelTarget.timeSlot}</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="rounded-full border border-[#DFD5CE] px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={handleCancelAppointment}
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