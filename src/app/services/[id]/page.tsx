import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { getServiceById } from "@/lib/actions/services";
import BookingWidget from "@/components/services/BookingWidget";
// import BookingWidget from "@/components/services/BookingWidget";

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-base-200/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all services
          </Link>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Service Image & Detailed Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hero Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-sm">
              <Image
                src={service.image || "/placeholder-salon.jpg"}
                alt={service.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="badge badge-primary badge-lg font-medium shadow">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Title & Quick Highlights */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
                {service.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-4 border-y border-base-200 py-4 text-sm text-base-content/80">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>By <strong>{service.specialist}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{service.location}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-base-content">About this treatment</h2>
                <p className="mt-3 leading-relaxed text-base-content/80 whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Included Perks */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-base-200/60 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold">Premium Salon Products</h3>
                    <p className="text-xs text-base-content/70">
                      Dermatologist-tested & professional-grade care included.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold">Certified Specialist</h3>
                    <p className="text-xs text-base-content/70">
                      Performed by {service.specialist} at {service.location}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-5">
            <BookingWidget service={service} />
          </div>
        </div>
      </div>
    </main>
  );
}