import { FeaturedServices } from "@/components/home/featured-services";

/**
 * `/features` — direct route for the navbar "Features" link.
 *
 * Renders the same "Featured Salon Services" block that sits directly under
 * the hero slider on the home page. A real route (rather than a `/#features`
 * hash anchor) means:
 *
 * - it works from any page, including ones with their own scroll position
 * - `usePathname()` matches it, so the nav item shows its active state
 */
export default function FeaturesPage() {
  return <FeaturedServices />;
}
