"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  ExternalLink,
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  allowUrlInput?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploadField({
  id = "image",
  label,
  value,
  onChange,
  placeholder = "https://i.ibb.co/...",
  required = false,
  allowUrlInput = true,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key is missing in .env.local.");
      e.target.value = "";
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setIsUploading(false);
    e.target.value = "";

    if (!res.ok || !result?.success || !result?.data?.display_url) {
      toast.error("Image upload failed. Please try again.");
      return;
    }

    onChange(result.data.display_url);
    toast.success("Image uploaded to ImgBB!");
  };

  const handleCopyUrl = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("ImgBB URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2.5">
      <Label htmlFor={id}>{label}</Label>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload / Preview Row */}
      <div className="flex flex-wrap items-center gap-3">
        {value && value.startsWith("http") && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#EAE2DC] bg-[#FAF6F3]">
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              className="object-cover"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#DFD5CE] bg-white px-4 text-xs font-semibold text-[#2D1A22] transition hover:border-[#4A2535] hover:bg-[#FAF6F3] disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#4A2535]" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="h-3.5 w-3.5 text-[#4A2535]" />
              {value ? "Replace image" : "Upload image"}
            </>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 transition hover:text-rose-800"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        )}

        <span className="text-[11px] text-muted-foreground">
          JPG, PNG or WebP · up to 5 MB
        </span>
      </div>

      {/* Optional Direct URL Input (keeps manual URL entry working too) */}
      {allowUrlInput && (
        <Input
          id={id}
          name={id}
          type="url"
          className="h-11 rounded-xl"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}

      {/* ImgBB URL Bar (Matches My Profile Design) */}
      {value && value.startsWith("http") && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#EFE8E3] bg-[#FAF6F3] px-3.5 py-2 text-xs">
          <div className="min-w-0 truncate text-neutral-600">
            <span className="font-semibold text-[#2D1A22]">ImgBB URL: </span>
            <span className="font-mono text-[11px]">{value}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="Open image in new tab"
              className="rounded-md p-1 text-neutral-500 transition hover:bg-white hover:text-[#2D1A22]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={handleCopyUrl}
              title="Copy image URL"
              className="rounded-md p-1 text-neutral-500 transition hover:bg-white hover:text-[#2D1A22]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}