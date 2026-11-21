
interface StatusBadgeProps {
  status: "Pending" | "Confirmed" | "Cancelled" | "Unpaid" | "Paid" | string;
}

const PILL_STYLES: Record<string, { wrapper: string; dot: string }> = {
  Pending: {
    wrapper: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
  },
  Confirmed: {
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    wrapper: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
  Unpaid: {
    wrapper: "border-orange-200 bg-orange-50/80 text-orange-800",
    dot: "bg-orange-400",
  },
  Paid: {
    wrapper: "border-teal-200 bg-teal-50 text-teal-800",
    dot: "bg-teal-500",
  },
  Active: {
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
  Blocked: {
    wrapper: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = PILL_STYLES[status] || {
    wrapper: "border-neutral-200 bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${style.wrapper}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}