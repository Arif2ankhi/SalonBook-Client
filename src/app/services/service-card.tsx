import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import type { SalonService } from "@/lib/actions/services";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: SalonService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Top Image + Category Pill */}
      <div className="relative h-60 w-full overflow-hidden bg-muted">
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3.5 left-3.5 rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold tracking-wider text-foreground uppercase shadow-xs backdrop-blur-xs">
          {service.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-2.5">
          {/* Name & Price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-heading text-xl font-semibold text-foreground">
              {service.name}
            </h3>
            <span className="shrink-0 font-heading text-lg font-semibold text-foreground">
              ${Number(service.price).toFixed(2)}
            </span>
          </div>

          {/* Short Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>

          {/* Duration */}
          <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground">
            <Clock className="size-3.5 text-primary" />
            <span>{service.duration} min</span>
          </div>
        </div>

        {/* Bottom Footer: Location & View Details Button */}
        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {service.location || "At the salon"}
          </span>

          <Link
            href={`/services/${service._id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full px-4 text-xs font-medium transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
            )}
          >
            View details
            <ArrowUpRight className="ml-1 size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}