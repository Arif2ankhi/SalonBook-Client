"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Copy,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import StatusBadge from "@/app/components/shared/StatusBadge";
import { getAllTransactions, TransactionRecord } from "@/lib/actions/payments";


function formatDateTime(isoStr: string) {
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

function truncateId(value: string) {
  if (!value) return "—";
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}...${value.slice(-5)}`;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTransactions();
        setTransactions(data);
      } catch {
        toast.error("Failed to load payment transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const totalCollected = transactions
    .filter((tx) => tx.status === "paid")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const handleCopySession = async (sessionId: string) => {
    await navigator.clipboard.writeText(sessionId);
    setCopiedId(sessionId);
    toast.success("Stripe session ID copied.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">
          Loading verified transactions...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Header Row */}
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9C7886]">
            Payments Ledger
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D1A22]">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Read-only audit log of Stripe Checkout transactions verified by webhook.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE2DC] bg-white px-4 py-2 text-xs font-semibold text-[#2D1A22]">
            <CreditCard className="h-4 w-4 text-teal-700" />
            Verified total:{" "}
            <span className="text-teal-700">
              £{totalCollected.toFixed(2)}
            </span>
          </div>

          <Link
            href="/dashboard/admin/appointments"
            className="inline-flex items-center gap-2 rounded-full border border-[#DFD5CE] bg-white px-4 py-2 text-xs font-semibold text-[#2D1A22] transition hover:border-[#4A2535] hover:bg-[#FAF6F3]"
          >
            <CalendarDays className="h-4 w-4 text-[#4A2535]" />
            Appointments
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {transactions.length === 0 ? (
        <div className="w-full rounded-2xl border border-[#EAE2DC] bg-white p-14 text-center shadow-xs">
          <ShieldCheck className="mx-auto h-8 w-8 text-[#9C7886]" />
          <p className="mt-3 font-serif text-xl font-bold text-[#2D1A22]">
            No transactions recorded yet
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Completed Stripe payments for confirmed appointments will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-[#EAE2DC] bg-white shadow-xs">
          <table className="w-full min-w-[820px] table-auto border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EFE8E3] bg-[#FCF9F7] text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <th className="py-3.5 pl-6 pr-4">Customer &amp; Service</th>
                <th className="px-4 py-3.5">Appointment ID</th>
                <th className="px-4 py-3.5">Stripe Session</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE8] text-sm">
              {transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="transition-colors hover:bg-[#FAF6F3]"
                >
                  <td className="py-4 pl-6 pr-4">
                    <p className="font-semibold text-[#2D1A22]">
                      {tx.serviceName || "Salon Treatment"}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {tx.customerName || tx.customerEmail || tx.customerId}
                    </p>
                  </td>

                  <td className="px-4 py-4 font-mono text-xs text-neutral-600">
                    {truncateId(tx.appointmentId)}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleCopySession(tx.stripeSessionId)}
                      title="Copy full Stripe session ID"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAF6F3] px-2.5 py-1 font-mono text-xs text-[#2D1A22] transition hover:bg-[#F0E7E1]"
                    >
                      {truncateId(tx.stripeSessionId)}
                      {copiedId === tx.stripeSessionId ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-neutral-400" />
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-4 font-semibold text-[#2D1A22]">
                    {tx.currency === "GBP" ? "£" : `${tx.currency} `}
                    {Number(tx.amount).toFixed(2)}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge
                      status={tx.status === "paid" ? "Paid" : "Cancelled"}
                    />
                  </td>

                  <td className="py-4 pl-4 pr-6 text-right text-xs text-neutral-500">
                    {formatDateTime(tx.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}