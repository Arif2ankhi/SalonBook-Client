"use client";

// const ManageServicesPage = () => {
//     return (
//         <div>
//             <h2>Manage Services</h2>
//         </div>
//     );
// };

// export default ManageServicesPage;


import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteService,
  getServices,
  updateService,
  type SalonService,
} from "@/lib/actions/services";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const;

interface EditFormState {
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  image: string;
  status: "Active" | "Inactive";
}

// Helper to normalize older MongoDB records that didn't have a `status` field yet
function getNormalizedStatus(service: SalonService): "Active" | "Inactive" {
  if (service.status === "Inactive" || service.isActive === false) {
    return "Inactive";
  }
  return "Active";
}

// Formats date like "Mon, Nov 16, 2026" as shown in the UI reference
function formatCreatedDate(dateString?: string): string {
  if (!dateString) return "Recently added";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "Recently added";
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ManageServicesPage() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Edit modal states
  const [editingService, setEditingService] = useState<SalonService | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    category: "Haircut & Styling",
    price: "",
    duration: "",
    description: "",
    image: "",
    status: "Active",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Busy row tracker for status toggle / delete
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadServices = () => {
    // isLoading already starts as true, so no need to set it here —
    // a synchronous setState would trip react-hooks/set-state-in-effect.
    getServices()
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Fetch services error:", error);
        setIsLoading(false);
        toast.error("Failed to load services from server.");
      });
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Build unique category options combining predefined categories + any existing DB categories
  const availableCategories = Array.from(
    new Set([
      ...SERVICE_CATEGORIES,
      ...services.map((s) => s.category).filter(Boolean),
    ])
  );

  // Filtered services for the table
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const currentStatus = getNormalizedStatus(service);
    const matchesStatus =
      statusFilter === "all" || currentStatus === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Open Edit Dialog
  const handleOpenEdit = (service: SalonService) => {
    setEditingService(service);
    setEditForm({
      name: service.name || "",
      category: service.category || "Haircut & Styling",
      price: String(service.price ?? ""),
      duration: String(service.duration ?? ""),
      description: service.description || "",
      image: service.image || "",
      status: getNormalizedStatus(service),
    });
  };

  // Handle Image File Upload in Edit Modal
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditForm((prev) => ({ ...prev, image: reader.result as string }));
        toast.success("New image selected.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Updated Service
  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;

    const numericPrice = Number(editForm.price);
    const numericDuration = Number(editForm.duration);

    if (!editForm.name.trim()) {
      toast.error("Service name is required.");
      return;
    }
    if (numericPrice <= 0 || Number.isNaN(numericPrice)) {
      toast.error("Price must be a positive number.");
      return;
    }
    if (numericDuration <= 0 || Number.isNaN(numericDuration)) {
      toast.error("Duration must be a positive number.");
      return;
    }

    const updatedFields = {
      name: editForm.name.trim(),
      category: editForm.category,
      price: numericPrice,
      duration: numericDuration,
      description: editForm.description.trim(),
      image: editForm.image,
      status: editForm.status,
      isActive: editForm.status === "Active",
    };

    setIsSavingEdit(true);

    updateService(editingService._id, updatedFields)
      .then(() => {
        setServices((prev) =>
          prev.map((item) =>
            item._id === editingService._id
              ? { ...item, ...updatedFields }
              : item
          )
        );
        setIsSavingEdit(false);
        setEditingService(null);
        toast.success("Service updated successfully!");
      })
      .catch((error) => {
        console.log("Update service error:", error);
        setIsSavingEdit(false);
        toast.error("Failed to update service.");
      });
  };

  // Toggle Active / Inactive
  const handleToggleStatus = (service: SalonService) => {
    const currentStatus = getNormalizedStatus(service);
    const nextStatus: "Active" | "Inactive" =
      currentStatus === "Active" ? "Inactive" : "Active";

    setBusyId(service._id);

    updateService(service._id, {
      status: nextStatus,
      isActive: nextStatus === "Active",
    })
      .then(() => {
        setServices((prev) =>
          prev.map((item) =>
            item._id === service._id
              ? {
                  ...item,
                  status: nextStatus,
                  isActive: nextStatus === "Active",
                }
              : item
          )
        );
        setBusyId(null);
        toast.success(
          nextStatus === "Active"
            ? `"${service.name}" is now Active.`
            : `"${service.name}" has been Deactivated.`
        );
      })
      .catch((error) => {
        console.log("Status toggle error:", error);
        setBusyId(null);
        toast.error("Failed to change service status.");
      });
  };

  // Delete Service
  const handleDelete = (service: SalonService) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setBusyId(service._id);

    deleteService(service._id)
      .then(() => {
        setServices((prev) =>
          prev.filter((item) => item._id !== service._id)
        );
        setBusyId(null);
        toast.success(`"${service.name}" deleted.`);
      })
      .catch((error) => {
        console.log("Delete service error:", error);
        setBusyId(null);
        toast.error("Failed to delete service.");
      });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            THE MENU
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Manage services
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, activate and retire treatments. Inactive services
            disappear from public browsing and cannot be booked.
          </p>
        </div>

        <Link
          href="/dashboard/admin/services/new"
          className={cn(
            buttonVariants({ size: "default" }),
            "w-fit shrink-0 rounded-full px-5 py-5 text-sm font-medium shadow-sm"
          )}
        >
          <Plus className="mr-1.5 size-4" />
          New service
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-xs md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by service name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-full border-border/80 bg-background pl-10 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (value) setStatusFilter(value);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-full sm:w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              if (value) setCategoryFilter(value);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-full sm:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services Table Container */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm">Loading salon services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="font-medium text-foreground">No services found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter, or add a new salon service.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b bg-muted/30 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  <th className="px-5 py-3.5">Service</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-sm">
                {filteredServices.map((service) => {
                  const status = getNormalizedStatus(service);
                  const isActive = status === "Active";
                  const isBusy = busyId === service._id;

                  return (
                    <tr
                      key={service._id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      {/* Service Image + Name + Truncated Description */}
                      <td className="max-w-xs px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="size-11 shrink-0 rounded-xl border object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {service.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                          {service.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 font-semibold whitespace-nowrap text-foreground">
                        ${Number(service.price).toFixed(2)}
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                        {service.duration} min
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                            isActive
                              ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              isActive ? "bg-emerald-600" : "bg-muted-foreground"
                            )}
                          />
                          {status}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="px-4 py-4 text-xs whitespace-nowrap text-muted-foreground">
                        {formatCreatedDate(service.createdAt)}
                      </td>

                      {/* Actions: Edit, Activate/Deactivate, Delete */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => handleOpenEdit(service)}
                            className="h-8 rounded-full px-3.5 text-xs font-medium"
                          >
                            <Pencil className="mr-1.5 size-3" />
                            Edit
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => handleToggleStatus(service)}
                            className="h-8 rounded-full px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                          >
                            <Power className="mr-1.5 size-3.5" />
                            {isActive ? "Deactivate" : "Activate"}
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isBusy}
                            onClick={() => handleDelete(service)}
                            aria-label={`Delete ${service.name}`}
                            className="size-8 rounded-full text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Service Modal */}
      <Dialog
        open={Boolean(editingService)}
        onOpenChange={(open) => {
          if (!open) setEditingService(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              Edit Salon Service
            </DialogTitle>
            <DialogDescription>
              Update service details, pricing, status, or upload a new service
              image.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            {/* Service Name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Service Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-category">Service Category *</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => {
                    if (value) {
                      setEditForm((prev) => ({ ...prev, category: value }));
                    }
                  }}
                >
                  <SelectTrigger id="edit-category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-status">Service Status *</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => {
                    if (value === "Active" || value === "Inactive") {
                      setEditForm((prev) => ({ ...prev, status: value }));
                    }
                  }}
                >
                  <SelectTrigger id="edit-status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price & Estimated Duration */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-price">Price ($) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-duration">
                  Estimated Duration (minutes) *
                </Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="5"
                  step="5"
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* Service Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="edit-image-upload">Service Image (Upload)</Label>
              <div className="flex items-center gap-4">
                {editForm.image ? (
                  <img
                    src={editForm.image}
                    alt="Service preview"
                    className="size-16 shrink-0 rounded-xl border object-cover"
                  />
                ) : null}
                <label
                  htmlFor="edit-image-upload"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Upload className="size-4" />
                  <span>Choose image file to replace</span>
                  <input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingService(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEdit}>
                {isSavingEdit ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}