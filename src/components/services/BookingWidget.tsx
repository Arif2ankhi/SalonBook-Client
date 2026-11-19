// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Calendar, Clock, MapPin, User, CheckCircle2, Loader2 } from "lucide-react";
// import { SalonService } from "@/lib/actions/services";
// import { API_BASE_URL } from "@/lib/api/config";
// // Update this import path if your Better Auth client lives elsewhere (e.g. @/lib/auth-client)
// import { useSession } from "@/lib/auth-client";

// const TIME_SLOTS = [
//   "09:30 AM",
//   "10:30 AM",
//   "11:30 AM",
//   "01:00 PM",
//   "02:30 PM",
//   "04:00 PM",
//   "05:30 PM",
// ];

// interface BookingWidgetProps {
//   service: SalonService;
// }

// export default function BookingWidget({ service }: BookingWidgetProps) {
//   const router = useRouter();
//   const { data: session, isPending: isSessionLoading } = useSession();

//   // Default minimum date = today (YYYY-MM-DD)
//   const today = new Date().toISOString().split("T")[0];

//   const [selectedDate, setSelectedDate] = useState<string>(today);
//   const [selectedTime, setSelectedTime] = useState<string>("");
//   const [notes, setNotes] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleBookNow = async () => {
//     setError(null);

//     if (!session?.user) {
//       // Redirect unauthenticated users to login and return back here afterward
//       router.push(`/login?callbackUrl=/services/${service._id}`);
//       return;
//     }

//     if (!selectedDate || !selectedTime) {
//       setError("Please select both an appointment date and a time slot.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const response = await fetch(`${API_BASE_URL}/api/bookings/checkout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           serviceId: service._id,
//           serviceName: service.name,
//           price: service.price,
//           duration: service.duration,
//           specialist: service.specialist,
//           location: service.location,
//           date: selectedDate,
//           timeSlot: selectedTime,
//           notes,
//           customerEmail: session.user.email,
//           customerName: session.user.name,
//           userId: session.user.id,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to initiate booking.");
//       }

//       // If Express returns a Stripe Checkout URL, redirect to Stripe
//       if (data.url) {
//         window.location.href = data.url;
//         return;
//       }

//       // Fallback if direct booking without immediate Stripe redirect
//       router.push("/dashboard/customer/bookings?booked=true");
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg sticky top-24">
//       <div className="flex items-baseline justify-between border-b border-base-200 pb-4">
//         <div>
//           <span className="text-sm text-base-content/60">Total Price</span>
//           <p className="text-3xl font-bold text-primary">£{service.price.toFixed(2)}</p>
//         </div>
//         <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1 text-sm font-medium">
//           <Clock className="h-4 w-4 text-primary" />
//           {service.duration} mins
//         </span>
//       </div>

//       {/* Key Meta */}
//       <div className="my-4 space-y-2.5 text-sm text-base-content/80">
//         <div className="flex items-center gap-2">
//           <User className="h-4 w-4 text-primary shrink-0" />
//           <span>
//             Specialist: <strong className="font-medium text-base-content">{service.specialist}</strong>
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <MapPin className="h-4 w-4 text-primary shrink-0" />
//           <span>{service.location}</span>
//         </div>
//       </div>

//       {/* Date Picker */}
//       <div className="mt-5">
//         <label htmlFor="booking-date" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
//           <Calendar className="h-4 w-4 text-primary" />
//           Select Date
//         </label>
//         <input
//           id="booking-date"
//           type="date"
//           min={today}
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="input input-bordered w-full focus:outline-none focus:border-primary"
//         />
//       </div>

//       {/* Time Slot Grid */}
//       <div className="mt-5">
//         <span className="mb-2 block text-sm font-semibold">Select Time Slot</span>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//           {TIME_SLOTS.map((slot) => {
//             const isSelected = selectedTime === slot;
//             return (
//               <button
//                 key={slot}
//                 type="button"
//                 onClick={() => setSelectedTime(slot)}
//                 className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
//                   isSelected
//                     ? "border-primary bg-primary text-primary-content shadow-sm"
//                     : "border-base-300 bg-base-100 hover:border-primary/60 hover:bg-base-200/50"
//                 }`}
//               >
//                 {slot}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Optional Special Requests */}
//       <div className="mt-5">
//         <label htmlFor="booking-notes" className="mb-1.5 block text-sm font-semibold">
//           Special Notes <span className="font-normal text-base-content/50">(Optional)</span>
//         </label>
//         <textarea
//           id="booking-notes"
//           rows={2}
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           placeholder="Allergies, hair length, or preferred style notes..."
//           className="textarea textarea-bordered w-full text-sm focus:outline-none focus:border-primary"
//         />
//       </div>

//       {/* Validation / API Error */}
//       {error && (
//         <div className="mt-4 rounded-lg bg-error/10 border border-error/30 p-3 text-xs text-error">
//           {error}
//         </div>
//       )}

//       {/* Book Now CTA */}
//       <button
//         type="button"
//         onClick={handleBookNow}
//         disabled={isSubmitting || isSessionLoading}
//         className="btn btn-primary mt-6 w-full text-pink-600 font-bold"
//       >
//         {isSubmitting ? (
//           <>
//             <Loader2 className="h-5 w-5 animate-spin" />
//             Processing...
//           </>
//         ) : !session?.user ? (
//           "Sign in to Book"
//         ) : (
//           <>
//             <CheckCircle2 className="h-5 w-5 text-base-300" />
//             Request Appointment
//           </>
//         )}
//       </button>

//       <p className="mt-3 text-center text-xs text-base-content/60">
//         Instant confirmation • Free rescheduling up to 24h prior
//       </p>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner"; // or "react-hot-toast" depending on which toast package you installed
import { SalonService } from "@/lib/actions/services";
import { API_BASE_URL } from "@/lib/api/config";
import { useSession } from "@/lib/auth-client";

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
      router.push(`/login?callbackUrl=/services/${service._id}`);
      return;
    }

    if (!appointmentDate || !timeSlot) {
      toast.error("Please select both a date and a time slot.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to request appointment.");
        return;
      }

      toast.success("Appointment request submitted! Status: Pending.");
      router.push("/dashboard/customer/appointments");
    } catch {
      toast.error("Network error. Please try again.");
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

          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="btn btn-primary w-full font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : !user ? (
              "Sign In to Request Appointment"
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Request Appointment
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}