interface StatusBadgeProps {
  status: "Pending" | "Confirmed" | "Cancelled" | "Unpaid" | "Paid" | string;
}

const BADGE_STYLES: Record<string, string> = {
  Pending: "badge-warning text-warning-content",
  Confirmed: "badge-info text-info-content",
  Cancelled: "badge-error text-error-content",
  Unpaid: "badge-ghost border-base-300 text-base-content/75",
  Paid: "badge-success text-success-content",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styleClass = BADGE_STYLES[status] || "badge-ghost";

  return (
    <span className={`badge badge-sm sm:badge-md font-medium ${styleClass}`}>
      {status}
    </span>
  );
}