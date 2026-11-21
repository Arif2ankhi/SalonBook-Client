"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  ShieldAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllUsers,
  toggleUserBlockStatus,
  UserProfile,
} from "@/lib/actions/users";
import {
  Appointment,
  getAllAppointments,
} from "@/lib/actions/appointments";
import StatusBadge from "@/app/components/shared/StatusBadge";
// import StatusBadge from "@/components/shared/StatusBadge";

function formatJoinedDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Modals
  const [selectedCustomer, setSelectedCustomer] =
    useState<UserProfile | null>(null);
  const [statusTarget, setStatusTarget] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Loaded once on mount. Defined inside the effect (like the other
    // dashboard pages) so no setState runs while the effect body executes.
    const loadDirectory = async () => {
      try {
        // isLoading already starts as true, so no need to set it here.
        const [allUsers, allAppointments] = await Promise.all([
          getAllUsers(),
          getAllAppointments(),
        ]);
        // Show registered customers (exclude admin accounts)
        const registeredCustomers = allUsers.filter(
          (u) => (u.role || "customer") !== "admin"
        );
        setCustomers(registeredCustomers);
        setAppointments(allAppointments);
      } catch {
        toast.error("Failed to load customer directory.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDirectory();
  }, []);

  const getCustomerAppointments = (email: string) =>
    appointments.filter((appt) => appt.customerEmail === email);

  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return;
    const nextBlockedState = !Boolean(statusTarget.isBlocked);

    try {
      setActionId(statusTarget._id);
      await toggleUserBlockStatus(statusTarget._id, nextBlockedState);
      setCustomers((prev) =>
        prev.map((user) =>
          user._id === statusTarget._id
            ? { ...user, isBlocked: nextBlockedState }
            : user
        )
      );
      toast.success(
        nextBlockedState
          ? `${statusTarget.name || statusTarget.email} has been blocked.`
          : `${statusTarget.name || statusTarget.email} has been unblocked.`
      );
      setStatusTarget(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not update customer status."
      );
    } finally {
      setActionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">Loading customer directory...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9C7886]">
            Customers
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D1A22]">
            Customer directory
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            View everyone registered with the salon. Blocking an account immediately revokes protected access until you restore it.
          </p>
        </div>

        <Link
          href="/dashboard/admin/appointments"
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#DFD5CE] bg-white px-5 py-2.5 text-xs font-semibold text-[#2D1A22] shadow-2xs transition hover:border-[#4A2535] hover:bg-[#FAF6F3] sm:self-auto"
        >
          <CalendarDays className="h-4 w-4 text-[#4A2535]" />
          Manage appointments
        </Link>
      </div>

      {/* Customer Directory Table */}
      {customers.length === 0 ? (
        <div className="rounded-2xl border border-[#EAE2DC] bg-white p-14 text-center shadow-xs">
          <p className="font-serif text-xl font-bold text-[#2D1A22]">
            No registered customers yet
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Customer accounts will appear here as soon as clients register.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-[#EAE2DC] bg-white shadow-xs">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EFE8E3] bg-[#FCF9F7] text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <th className="py-3.5 pl-6 pr-4">Customer</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5">Appointments</th>
                <th className="px-4 py-3.5">Account</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE8] text-sm">
              {customers.map((customer) => {
                const isBlocked = Boolean(customer.isBlocked);
                const bookingCount = getCustomerAppointments(
                  customer.email
                ).length;
                const initial =
                  (customer.name || customer.email)?.charAt(0).toUpperCase() ||
                  "C";

                return (
                  <tr
                    key={customer._id}
                    className="transition-colors hover:bg-[#FAF6F3]"
                  >
                    {/* Customer Avatar + Name + Email */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#4A2535] text-xs font-bold text-white">
                          {customer.image ? (
                            <Image
                              src={customer.image}
                              alt={customer.name || "Customer"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            initial
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#2D1A22]">
                            {customer.name || "Unnamed Customer"}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4 text-xs text-neutral-600">
                      {customer.phone?.trim() ? customer.phone : "—"}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-4 text-xs text-neutral-500">
                      {formatJoinedDate(customer.createdAt)}
                    </td>

                    {/* Appointments Count */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D1A22]">
                        <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                        {bookingCount}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={isBlocked ? "Blocked" : "Active"} />
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-4 pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(customer)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D1A22] transition hover:text-[#4A2535]"
                        >
                          View
                          <ArrowRight className="h-3 w-3" />
                        </button>

                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={() => setStatusTarget(customer)}
                            disabled={actionId === customer._id}
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Unblock
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setStatusTarget(customer)}
                            disabled={actionId === customer._id}
                            className="inline-flex items-center gap-1 rounded-full border border-[#E6DDD6] bg-white px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Block
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

      {/* View Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#4A2535] text-sm font-bold text-white">
                  {selectedCustomer.image ? (
                    <Image
                      src={selectedCustomer.image}
                      alt={selectedCustomer.name || "Customer"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    (selectedCustomer.name || selectedCustomer.email)
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2D1A22]">
                    {selectedCustomer.name || "Unnamed Customer"}
                  </h3>
                  <StatusBadge
                    status={selectedCustomer.isBlocked ? "Blocked" : "Active"}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close modal"
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3 border-y border-[#EFE8E3] py-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
                <span className="font-medium text-[#2D1A22]">
                  {selectedCustomer.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </span>
                <span className="font-medium text-[#2D1A22]">
                  {selectedCustomer.phone?.trim() || "Not provided"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Member since</span>
                <span className="font-medium text-[#2D1A22]">
                  {formatJoinedDate(selectedCustomer.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Total bookings</span>
                <span className="font-semibold text-[#2D1A22]">
                  {getCustomerAppointments(selectedCustomer.email).length}{" "}
                  appointments
                </span>
              </div>
            </div>

            {/* Recent Appointments Preview */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Recent Bookings
              </p>
              {getCustomerAppointments(selectedCustomer.email).length === 0 ? (
                <p className="mt-2 rounded-xl bg-[#FAF6F3] p-3 text-xs text-neutral-500">
                  No appointments booked yet.
                </p>
              ) : (
                <div className="mt-2 max-h-40 space-y-2 overflow-y-auto pr-1">
                  {getCustomerAppointments(selectedCustomer.email)
                    .slice(0, 4)
                    .map((appt) => (
                      <div
                        key={appt._id}
                        className="flex items-center justify-between rounded-xl bg-[#FAF6F3] px-3 py-2 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-[#2D1A22]">
                            {appt.serviceName}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {appt.appointmentDate} · {appt.timeSlot}
                          </p>
                        </div>
                        <StatusBadge status={appt.status} />
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = selectedCustomer;
                  setSelectedCustomer(null);
                  setStatusTarget(target);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold text-white ${
                  selectedCustomer.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {selectedCustomer.isBlocked ? "Unblock account" : "Block account"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-full bg-[#4A2535] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3A1C29]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block / Unblock Confirmation Modal */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-[#2D1A22]">
              <ShieldAlert
                className={`h-5 w-5 ${
                  statusTarget.isBlocked ? "text-emerald-600" : "text-rose-600"
                }`}
              />
              <h3 className="font-serif text-lg font-bold">
                {statusTarget.isBlocked
                  ? "Unblock customer account?"
                  : "Block customer account?"}
              </h3>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              {statusTarget.isBlocked ? (
                <>
                  Restoring access will allow{" "}
                  <strong className="text-[#2D1A22]">
                    {statusTarget.name || statusTarget.email}
                  </strong>{" "}
                  to sign in and book appointments again.
                </>
              ) : (
                <>
                  Blocking{" "}
                  <strong className="text-[#2D1A22]">
                    {statusTarget.name || statusTarget.email}
                  </strong>{" "}
                  will immediately revoke their access to protected salon features until unblocked.
                </>
              )}
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="rounded-full border border-[#DFD5CE] px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={actionId === statusTarget._id}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 ${
                  statusTarget.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {actionId === statusTarget._id && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {statusTarget.isBlocked ? "Yes, unblock" : "Yes, block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}