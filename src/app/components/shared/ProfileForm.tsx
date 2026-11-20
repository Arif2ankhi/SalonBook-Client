"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner"; // Swap to "react-hot-toast" if using react-hot-toast
import { authClient, useSession } from "@/lib/auth-client";
import { getUserProfile, updateUserProfile } from "@/lib/actions/users";
import { ApiError } from "@/lib/api/config";
import { uploadImageToImgBB } from "@/lib/utils/uploadImage";

interface ProfileFormProps {
  eyebrow?: string;
  title?: string;
}

function formatMemberSince(dateStr?: string | null) {
  if (!dateStr) return "Recently joined";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return "Recently joined";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ProfileForm({
  eyebrow = "Account",
  title = "My profile",
}: ProfileFormProps) {
  const { data: session, isPending: isSessionLoading } = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [isBlocked, setIsBlocked] = useState(false);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (isSessionLoading) return;
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getUserProfile(userEmail);
        setName(profile.name || session?.user?.name || "");
        setImage(profile.image || session?.user?.image || "");
        setPhone(profile.phone || "");
        setRole(profile.role || "customer");
        setIsBlocked(Boolean(profile.isBlocked));
        setCreatedAt(profile.createdAt || null);
      } catch (err) {
        // Fall back to session info so the form stays usable, but tell the
        // user their saved details couldn't be fetched (failed API request).
        // A plain 404 just means no profile row exists yet — that's normal.
        if (!(err instanceof ApiError) || err.status !== 404) {
          toast.error(
            "Could not load your saved profile details. Showing your account info instead."
          );
        }
        setName(session?.user?.name || "");
        setImage(session?.user?.image || "");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isSessionLoading, userEmail, session?.user?.name, session?.user?.image]);

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be up to 5 MB.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImageToImgBB(file);
      setImage(uploadedUrl);
      toast.success("Photo uploaded to ImgBB!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopyLink = async () => {
    if (!image) return;
    await navigator.clipboard.writeText(image);
    setCopied(true);
    toast.success("ImgBB link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error("You must be signed in to update your profile.");
      return;
    }

    if (!name.trim()) {
      toast.error("Full name is required.");
      return;
    }

    try {
      setIsSaving(true);

      await updateUserProfile({
        email: userEmail,
        requesterEmail: userEmail,
        name: name.trim(),
        image: image.trim(),
        phone: phone.trim(),
      });

      if (typeof authClient?.updateUser === "function") {
        await authClient.updateUser({
          name: name.trim(),
          image: image.trim() || undefined,
        });
      }

      toast.success("Changes saved! Your profile is up to date.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not save profile changes."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A2535]" />
        <p className="text-sm text-neutral-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9C7886]">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D1A22]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Keep the details we use for your appointments up to date. Your email and role are managed by the salon.
        </p>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Main Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#EAE2DC] bg-white p-6 sm:p-8 shadow-xs lg:col-span-8"
        >
          {/* Photo & Name Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-[#E5D8D0] bg-[#F5EFEA]">
              {image ? (
                <Image
                  src={image}
                  alt={name || "Profile photo"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#7A4B5E]">
                  <UserRound className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl font-bold text-[#2D1A22]">
                Photo &amp; name
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                This is how you will appear in the salon&apos;s booking records.
              </p>

              {/* Replace / Remove Action Buttons */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD5CE] bg-white px-4 py-1.5 text-xs font-semibold text-[#2D1A22] transition hover:border-[#4A2535] hover:bg-[#FAF6F3] disabled:opacity-60"
                >
                  {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isUploading ? "Uploading..." : "Replace image"}
                </button>

                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 transition hover:text-rose-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>

              <p className="mt-2 text-[11px] text-neutral-400">
                JPG, PNG or WebP · up to 5 MB
              </p>

              {/* Visible ImgBB Link Pill right next to the photo */}
              {image && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#EAE2DC] bg-[#FAF6F3] px-3 py-1.5 text-xs">
                  <span className="shrink-0 font-semibold text-[#7A4B5E]">
                    ImgBB URL:
                  </span>
                  <a
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={image}
                    className="min-w-0 flex-1 truncate text-[#2D1A22] underline-offset-2 hover:underline"
                  >
                    {image}
                  </a>
                  <a
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open image in new tab"
                    className="shrink-0 rounded p-1 text-neutral-500 hover:bg-white hover:text-[#4A2535]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy ImgBB link"
                    className="shrink-0 rounded p-1 text-neutral-500 hover:bg-white hover:text-[#4A2535]"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Full Name & Phone Number Row */}
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1.5 block text-xs font-semibold text-[#2D1A22]"
              >
                Full name
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#DFD5CE] bg-white py-2.5 pl-10 pr-4 text-sm text-[#2D1A22] focus:border-[#4A2535] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="mb-1.5 block text-xs font-semibold text-[#2D1A22]"
              >
                Phone number{" "}
                <span className="font-normal text-neutral-400">(optional)</span>
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900077"
                className="w-full rounded-xl border border-[#DFD5CE] bg-white px-4 py-2.5 text-sm text-[#2D1A22] focus:border-[#4A2535] focus:outline-none"
              />
              <p className="mt-1.5 text-[11px] text-neutral-400">
                Used only if the salon needs to reach you.
              </p>
            </div>
          </div>

          {/* Read-Only Email Address */}
          <div className="mt-5">
            <label
              htmlFor="profile-email"
              className="mb-1.5 block text-xs font-semibold text-[#2D1A22]"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="profile-email"
                type="email"
                disabled
                value={userEmail || ""}
                className="w-full cursor-not-allowed rounded-xl border border-[#EAE2DC] bg-[#F5EFEA]/70 py-2.5 pl-10 pr-4 text-sm text-neutral-500"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-400">
              Email changes are handled privately by the salon for account security.
            </p>
          </div>

          {/* Footer Save Row */}
          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-[#EFE8E3] pt-5 sm:flex-row sm:items-center">
            <p className="text-xs text-neutral-400">
              Changes apply to future appointments immediately.
            </p>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4A2535] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3A1C29] disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        {/* Right Side Info Cards */}
        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-2xl border border-[#EAE2DC] bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-[#2D1A22]">
              <ShieldCheck className="h-4 w-4 text-[#7A4B5E]" />
              <h2 className="font-serif text-lg font-bold">Account details</h2>
            </div>

            <div className="mt-4 space-y-3 border-b border-[#EFE8E3] pb-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Role</span>
                <span className="rounded-full border border-[#DFD5CE] bg-[#FAF6F3] px-3 py-0.5 font-semibold capitalize text-[#2D1A22]">
                  {role}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Status</span>
                {isBlocked ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-0.5 font-medium text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Member since</span>
                <span className="font-semibold text-[#2D1A22]">
                  {formatMemberSince(createdAt)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-neutral-400">
              Role and account status cannot be changed from your profile. Contact the salon if you need help with access.
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE2DC] bg-[#F6EFE9] p-6">
            <Calendar className="h-4 w-4 text-[#7A4B5E]" />
            <h3 className="mt-2.5 font-serif text-base font-bold text-[#2D1A22]">
              {role === "admin" ? "Manage your salon" : "Planning a visit?"}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              {role === "admin"
                ? "Review pending customer appointment requests or update your active salon menu."
                : "Browse the menu and request your next appointment — the salon will confirm it shortly."}
            </p>
            <Link
              href={role === "admin" ? "/dashboard/admin/appointments" : "/services"}
              className="mt-4 inline-block text-xs font-semibold text-[#4A2535] hover:underline"
            >
              {role === "admin" ? "Manage appointments" : "Browse services"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}