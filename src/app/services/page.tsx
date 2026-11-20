"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { getActiveServices, type SalonService } from "@/lib/actions/services";
// import { ServiceCard } from "@/components/services/service-card";
// import { ServiceCard } from "@services/service-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCard } from "../components/service-card";

const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const;

type SortOption = "default" | "price-asc" | "price-desc";

export default function BrowseServicesPage() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    // isLoading already starts as true, so no need to set it here.
    getActiveServices()
      .then((data) => {
        const activeOnly = Array.isArray(data)
          ? data.filter(
              (item) => item.status !== "Inactive" && item.isActive !== false
            )
          : [];
        setServices(activeOnly);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching services:", err);
        setErrorMessage("Could not load services. Please check your server.");
        setIsLoading(false);
        // Toast + inline banner both surface the failed API request.
        toast.error("Failed to fetch services from the server.");
      });
  }, []);

  // ১. Filter according to search and category
  const filteredServices = services.filter((service) => {
    const matchesName = service.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    return matchesName && matchesCategory;
  });

  // ২. Sorting By Price  (Low to High / High to Low)
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "price-asc") {
      return Number(a.price) - Number(b.price);
    }
    if (sortBy === "price-desc") {
      return Number(b.price) - Number(a.price);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Top Header Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
              THE SERVICE MENU
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Explore Your Dreamy experience
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Browse every active treatment at SalonBook. Search by name, filter
              by category, or sort by price — then choose a time that suits you.
            </p>
          </div>

          {/* Available Services Count Pill */}
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-xs">
            <Sparkles className="size-3.5 text-primary" />
            <span>{sortedServices.length} services available</span>
          </div>
        </div>

        {/* Search, Category Filter & Price Sort Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-xs md:flex-row md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-full border-border/80 bg-background pl-11 text-sm"
            />
          </div>

          {/* Category & Sort Dropdowns */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                if (value) setSelectedCategory(value);
              }}
            >
              <SelectTrigger className="h-11 w-full rounded-full sm:w-52">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {SERVICE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (
                  value === "default" ||
                  value === "price-asc" ||
                  value === "price-desc"
                ) {
                  setSortBy(value);
                }
              }}
            >
              <SelectTrigger className="h-11 w-full rounded-full sm:w-52">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sort by: Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Count Info Row */}
        {!isLoading && !errorMessage && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              Showing <span className="font-medium text-foreground">{sortedServices.length}</span> of{" "}
              <span className="font-medium text-foreground">{services.length}</span> active services
            </p>
            {(searchQuery || selectedCategory !== "all" || sortBy !== "default") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSortBy("default");
                }}
                className="font-medium text-primary hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* Services Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="text-sm">Loading salon treatments...</p>
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="font-medium text-destructive">{errorMessage}</p>
          </div>
        ) : sortedServices.length === 0 ? (
          <div className="rounded-3xl border bg-card p-12 text-center shadow-xs">
            <p className="font-heading text-xl font-semibold text-foreground">
              No matching services found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try searching with a different keyword or select &ldquo;All categories&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}