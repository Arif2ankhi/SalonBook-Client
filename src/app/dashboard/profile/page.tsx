"use client";

import ProfileForm from "@/app/components/shared/ProfileForm";
import { useSession } from "@/lib/auth-client";
// import ProfileForm from "@/components/shared/ProfileForm";

export default function SharedDashboardProfilePage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  return (
    <ProfileForm
      eyebrow={isAdmin ? "Salon Studio" : "Your Salon"}
      title={isAdmin ? "Admin profile" : "My profile"}
    />
  );
}