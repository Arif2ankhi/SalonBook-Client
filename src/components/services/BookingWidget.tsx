

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner"; // or "react-hot-toast" depending on which toast package you installed
import { SalonService } from "@/lib/actions/services";
import { API_BASE_URL, ApiError, readJsonResponse } from "@/lib/api/config";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
];

interface BookingWidgetProps {
  service: SalonService;
}

export default function BookingWidget({ service }: BookingWidgetProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const today = new Date().toISOString().split("T")[0];
  const [appointmentDate, setAppointmentDate] = useState(today);
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = session?.user as { id: string; name: string; email: string; role?: string } | undefined;
  const isAdmin = user?.role === "admin";
  const isInactive = service.status === "Inactive" || service.isActive === false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Route exists as (auth)/sign-in — the old /login path was a dead link.
      router.push("/sign-in");
      return;
    }

    if (!appointmentDate || !timeSlot) {
      toast.error("Please select both a date and a time slot.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getTokenFromClient();

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          serviceId: service._id,
          serviceName: service.name,
          serviceImage: service.image,
          serviceCategory: service.category,
          servicePrice: service.price,
          customerId: user.id,
          customerName: user.name,
          customerEmail: user.email,
          role: user.role,
          appointmentDate,
          timeSlot,
          message,
        }),
      });

      // Throws ApiError carrying the HTTP status + server message.
      await readJsonResponse(res, "Failed to request appointment.");

      toast.success("Appointment request submitted! Status: Pending.");
      router.push("/dashboard/customer/appointments");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          // Booking conflict: slot taken between load and submit.
          toast.error(
            err.message ||
              "That time slot has just been booked. Please pick another slot."
          );
          setTimeSlot("");
        } else if (err.status === 401 || err.status === 403) {
          toast.error("Your session has expired. Please sign in again.");
          router.push("/sign-in");
        } else {
          toast.error(err.message || "Failed to request appointment.");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-md sticky top-24">
      <div className="flex items-baseline justify-between border-b border-base-200 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-base-content/60">Service Price</span>
          <p className="text-3xl font-bold text-primary">£{service.price.toFixed(2)}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1 text-sm font-medium">
          <Clock className="h-4 w-4 text-primary" />
          {service.duration} mins
        </span>
      </div>

      {isInactive ? (
        <div className="mt-6 rounded-xl bg-warning/15 border border-warning/30 p-4 text-sm text-warning-content">
          This service is currently inactive and unavailable for booking.
        </div>
      ) : isAdmin ? (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-base-200 p-4 text-sm text-base-content/80">
          <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p>You are logged in as an <strong>Admin</strong>. Only customer accounts can submit appointment requests.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label htmlFor="appointment-date" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-primary" />
              Appointment Date
            </label>
            <input
              id="appointment-date"
              type="date"
              min={today}
              required
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold">Available Time Slot</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition ${
                    timeSlot === slot
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300 hover:border-primary/60"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="appointment-message" className="mb-1.5 block text-sm font-semibold">
              Additional Message <span className="font-normal text-base-content/50">(Optional)</span>
            </label>
            <textarea
              id="appointment-message"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any specific requests or notes..."
              className="textarea textarea-bordered w-full text-sm"
            />
          </div>
          
              <Button
  type="submit"
  disabled={isSubmitting || isPending}
  className="h-12 w-full rounded-full bg-[#4A2535] text-sm font-semibold text-white shadow-sm hover:bg-[#3A1C29]"
>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Submitting...
    </>
  ) : isPending ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Checking your session...
    </>
  ) : !user ? (
    "Sign In to Request Appointment"
  ) : (
    <>
      <CheckCircle2 className="mr-2 h-5 w-5" />
      Request Appointment
    </>
  )}
</Button>
        </form>
      )}
    </div>
  );
}