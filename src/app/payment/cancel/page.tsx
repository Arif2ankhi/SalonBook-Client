"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import {
  VerifiedPaymentResponse,
  verifyStripePayment,
} from "@/lib/actions/payments";
import StatusBadge from "@/components/shared/StatusBadge";

function formatLongDate(dateStr?: string) {
  if (!dateStr) return "—";
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function truncateSessionId(id: string) {
  if (id.length <= 22) return id;
  return `${id.slice(0, 12)}...${id.slice(-6)}`;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";

  const [receipt, setReceipt] = useState<VerifiedPaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setErrorMessage("Missing Stripe session reference.");
      setIsLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        setIsLoading(true);
        const data = await verifyStripePayment(sessionId);
        setReceipt(data);
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error ? err.message : "Unable to verify payment."
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">
          Verifying your Stripe payment...
        </p>
      </div>
    );
  }

  if (errorMessage || !receipt?.verified) {
    return (
      <div className="mx-auto my-16 max-w-lg rounded-3xl border border-[#EAE2DC] bg-white p-8 text-center shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-[#2D1A22]">
          Payment verification pending
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {errorMessage || "We could not confirm this payment session yet."}
        </p>
        <Link
          href="/dashboard/customer/appointments"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4A2535] px-6 py-2.5 text-xs font-semibold text-white"
        >
          Back to My appointments
        </Link>
      </div>
    );
  }

  const appt = receipt.appointment;

  return (
    <div className="mx-auto my-12 w-full max-w-xl px-4">
      <div className="overflow-hidden rounded-3xl border border-[#EAE2DC] bg-white shadow-sm">
        <div className="bg-[#EAF7F0] px-6 py-9 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-3xl font-bold text-[#2D1A22]">
            Payment verified
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-neutral-600">
            Thank you — Stripe confirmed your payment and the salon has recorded it against your appointment.
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={appt?.status || "Confirmed"} />
            <StatusBadge status="Paid" />
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Stripe verified
            </span>
          </div>

          <div className="rounded-2xl border border-[#EFE8E3] bg-[#FAF6F3] p-5">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2D1A22]">
              <Scissors className="h-4 w-4 text-[#9C7886]" />
              {appt?.serviceName || "Salon Appointment"}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Date
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#2D1A22]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#7A4B5E]" />
                  {formatLongDate(appt?.appointmentDate)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Time
                </p>
                <p className="mt-1 text-xs font-semibold text-[#2D1A22]">
                  {appt?.timeSlot || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 border-t border-[#EFE8E3] pt-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Amount</span>
              <span className="text-sm font-bold text-[#2D1A22]">
                £{Number(receipt.amount).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Stripe session</span>
              <span
                title={receipt.stripeSessionId}
                className="font-mono text-[11px] text-neutral-600"
              >
                {truncateSessionId(receipt.stripeSessionId)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4A2535] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#3A1C29]"
            >
              View appointment
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center justify-center rounded-full border border-[#DFD5CE] bg-white px-5 py-3 text-xs font-semibold text-[#2D1A22] transition hover:border-[#4A2535] hover:bg-[#FAF6F3]"
            >
              All appointments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#4A2535]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}