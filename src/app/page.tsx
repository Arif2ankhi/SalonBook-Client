import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedServices } from "@/components/home/featured-services";
import { ServiceCategories } from "@/components/home/service-categories";
import { HowItWorks } from "@/components/home/how-it-works";

export default function HomePage() {
  return (
    <>
      {/* Banner */}
      <HeroSlider />

      {/* Dynamic: featured active services (max 6) */}
      <FeaturedServices />

      {/* Dynamic: explore services by category */}
      <ServiceCategories />

      {/* Static: booking explainer + CTA */}
      <HowItWorks />
    </>
  );
}
