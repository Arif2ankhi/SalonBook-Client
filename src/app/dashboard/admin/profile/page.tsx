

import ProfileForm from "@/app/components/shared/ProfileForm";
import RoleGate from "@/app/components/RoleGate";

export default function AdminProfilePage() {
  return (
    <RoleGate role="admin">
      <ProfileForm eyebrow="Salon Studio" title="Admin profile" />
    </RoleGate>
  );
}