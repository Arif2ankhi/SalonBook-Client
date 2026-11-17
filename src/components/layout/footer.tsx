import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";

// lucide-react no longer ships brand icons, so simple inline SVGs are used.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.52l.48-3h-3V8.56c0-.87.24-1.46 1.5-1.46H17V4.4c-.26-.03-1.14-.11-2.17-.11-2.15 0-3.63 1.31-3.63 3.72V10.5H8.5v3h2.7V21h2.3Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.53 3H20l-5.4 6.17L21 21h-6.56l-4.14-5.6L5.6 21H3l5.8-6.63L3 3h6.72l3.9 5.35L17.53 3Zm-1.1 16h1.55L7.6 4.9H5.94L16.43 19Z" />
    </svg>
  );
}

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://x.com", label: "X (Twitter)", icon: XIcon },
];

const OPENING_HOURS = [
  { days: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
  { days: "Saturday", time: "9:00 AM - 9:00 PM" },
  { days: "Sunday", time: "10:00 AM - 6:00 PM" },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-6 text-muted-foreground">
            SalonBook makes it easy to discover salon services and book
            appointments online — pick a service, choose a time slot, and let
            our stylists take care of the rest.
          </p>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-heading text-lg font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="font-heading text-lg font-semibold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>+44 (555) 123-4567</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>hello@salonbook.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>143 Peticott Lane, London, E1 0AL</span>
            </li>
          </ul>
        </div>

        {/* Opening hours */}
        <div>
          <h3 className="font-heading text-lg font-semibold">Opening Hours</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {OPENING_HOURS.map((slot) => (
              <li key={slot.days} className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">{slot.days}</span>
                  <span>{slot.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} SalonBook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
