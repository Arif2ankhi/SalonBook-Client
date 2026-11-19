import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  iconBgClass?: string;
}

export default function StatCard({
  label,
  value,
  subtitle,
  icon,
  iconBgClass = "bg-[#F5EFEA] text-[#5C3A47]",
}: StatCardProps) {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-[#EAE2DC] bg-white p-5 shadow-xs">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          {label}
        </p>
        <p className="mt-2 font-serif text-3xl font-bold text-[#2D1A22]">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>
        )}
      </div>

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}
      >
        {icon}
      </div>
    </div>
  );
}