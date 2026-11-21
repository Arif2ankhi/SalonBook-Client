// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, Loader2, Plus } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";

// import { createService } from "@/lib/actions/services";
// import { Button, buttonVariants } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";
// import RoleGate from "@/app/components/RoleGate";

// const SERVICE_CATEGORIES = [
//   "Haircut & Styling",
//   "Hair Coloring",
//   "Hair Treatment",
//   "Facial & Skincare",
//   "Makeup",
//   "Manicure & Pedicure",
//   "Spa & Massage",
// ] as const;

// const SERVICE_LOCATIONS = [
//   "At the salon",
//   "Home visit",
//   "Salon or Home",
// ] as const;

// export interface ServiceFormData {
//   name: string;
//   category: string;
//   price: string;
//   duration: string;
//   image: string;
//   description: string;
//   location: string;
//   specialist: string;
// }

// const INITIAL_FORM: ServiceFormData = {
//   name: "",
//   category: "Haircut & Styling",
//   price: "",
//   duration: "45",
//   image: "",
//   description: "",
//   location: "At the salon",
//   specialist: "",
// };

// export default function AddServicePage() {
//   return (
//     <RoleGate role="admin">
//       <AddServiceContent />
//     </RoleGate>
//   );
// }

// function AddServiceContent() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<ServiceFormData>(INITIAL_FORM);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!formData.name.trim() || !formData.price || !formData.duration) {
//       toast.error("Please fill in service name, price, and duration.");
//       return;
//     }

//     const servicePayload = {
//       name: formData.name.trim(),
//       category: formData.category,
//       price: Number(formData.price),
//       duration: Number(formData.duration),
//       image: formData.image.trim(),
//       description: formData.description.trim(),
//       location: formData.location,
//       specialist: formData.specialist.trim() || "Senior Stylist",
//     };

//     // Logs form data in browser console
//     console.log("New Salon Service Data:", servicePayload);

//     setIsSubmitting(true);

//     createService(servicePayload)
//       .then((result) => {
//         console.log("MongoDB Insert Result:", result);
//         setIsSubmitting(false);

//         if (result.insertedId) {
//           toast.success("Salon service added successfully!");
//           setFormData(INITIAL_FORM);
//           router.push("/dashboard/admin/services");
//           router.refresh();
//         } else {
//           toast.error("Service could not be saved.");
//         }
//       })
//       .catch((error) => {
//         console.log("Create Service Error:", error);
//         setIsSubmitting(false);
//         toast.error("Failed to add service. Check your backend server.");
//       });
//   };

//   return (
//     <div className="flex min-h-[calc(100vh-6rem)] w-full flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto w-full max-w-5xl space-y-5 py-4">
//         <div className="flex items-center justify-between">
//           <Link
//             href="/dashboard/admin/services"
//             className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
//           >
//             <ArrowLeft className="mr-2 size-4" />
//             Back to services
//           </Link>
//         </div>

//         <Card className="w-full rounded-3xl border shadow-md">
//           <CardHeader className="px-6 pt-8 pb-4 sm:px-10">
//             <CardTitle className="font-heading text-2xl sm:text-3xl">
//               Add New Salon Service
//             </CardTitle>
//             <CardDescription className="text-sm sm:text-base">
//               Fill in the details below to publish a new service on the browse
//               services page.
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="px-6 pb-8 sm:px-10">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Row 1: Service Name & Category */}
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Service Name *</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     className="h-11 rounded-xl"
//                     placeholder="e.g. Gloss & Shine Treatment"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category *</Label>
//                   <Select
//                     value={formData.category}
//                     onValueChange={(value) => {
//                       if (value) {
//                         setFormData((prev) => ({ ...prev, category: value }));
//                       }
//                     }}
//                   >
//                     <SelectTrigger id="category" className="h-11 w-full rounded-xl">
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {SERVICE_CATEGORIES.map((category) => (
//                         <SelectItem key={category} value={category}>
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Row 2: Price, Duration & Service Location */}
//               <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
//                 <div className="space-y-2">
//                   <Label htmlFor="price">Price ($) *</Label>
//                   <Input
//                     id="price"
//                     name="price"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="h-11 rounded-xl"
//                     placeholder="55.00"
//                     value={formData.price}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="duration">Duration (minutes) *</Label>
//                   <Input
//                     id="duration"
//                     name="duration"
//                     type="number"
//                     min="5"
//                     step="5"
//                     className="h-11 rounded-xl"
//                     placeholder="45"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="location">Service Location</Label>
//                   <Select
//                     value={formData.location}
//                     onValueChange={(value) => {
//                       if (value) {
//                         setFormData((prev) => ({ ...prev, location: value }));
//                       }
//                     }}
//                   >
//                     <SelectTrigger id="location" className="h-11 w-full rounded-xl">
//                       <SelectValue placeholder="Select location" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {SERVICE_LOCATIONS.map((loc) => (
//                         <SelectItem key={loc} value={loc}>
//                           {loc}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Row 3: Service Image URL & Lead Stylist */}
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="image">Service Image URL *</Label>
//                   <Input
//                     id="image"
//                     name="image"
//                     type="url"
//                     className="h-11 rounded-xl"
//                     placeholder="https://images.unsplash.com/..."
//                     value={formData.image}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="specialist">
//                     Lead Stylist / Specialist{" "}
//                     <span className="text-xs text-muted-foreground">
//                       (Optional)
//                     </span>
//                   </Label>
//                   <Input
//                     id="specialist"
//                     name="specialist"
//                     className="h-11 rounded-xl"
//                     placeholder="e.g. Senior Hair Stylist"
//                     value={formData.specialist}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               {/* Row 4: Short Description */}
//               <div className="space-y-2">
//                 <Label htmlFor="description">Short Description *</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   rows={4}
//                   maxLength={220}
//                   className="rounded-xl"
//                   placeholder="A quick shine reset that softens tone, smooths the cuticle and leaves hair glassy..."
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                 />
//                 <p className="text-right text-xs text-muted-foreground">
//                   {formData.description.length}/220 characters
//                 </p>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="h-12 w-full rounded-2xl text-base font-medium"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 size-4 animate-spin" />
//                     Adding Service...
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="mr-2 size-4" />
//                     Add Service
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { createService } from "@/lib/actions/services";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import RoleGate from "@/app/components/RoleGate";
import ImageUploadField from "@/app/components/shared/ImageUploadField";

const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const;

const SERVICE_LOCATIONS = [
  "At the salon",
  "Home visit",
  "Salon or Home",
] as const;

export interface ServiceFormData {
  name: string;
  category: string;
  price: string;
  duration: string;
  image: string;
  description: string;
  location: string;
  specialist: string;
}

const INITIAL_FORM: ServiceFormData = {
  name: "",
  category: "Haircut & Styling",
  price: "",
  duration: "45",
  image: "",
  description: "",
  location: "At the salon",
  specialist: "",
};

export default function AddServicePage() {
  return (
    <RoleGate role="admin">
      <AddServiceContent />
    </RoleGate>
  );
}

function AddServiceContent() {
  const router = useRouter();
  const [formData, setFormData] = useState<ServiceFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.duration) {
      toast.error("Please fill in service name, price, and duration.");
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Please upload a service photo or provide an image URL.");
      return;
    }

    const servicePayload = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      duration: Number(formData.duration),
      image: formData.image.trim(),
      description: formData.description.trim(),
      location: formData.location,
      specialist: formData.specialist.trim() || "Senior Stylist",
    };

    console.log("New Salon Service Data:", servicePayload);

    setIsSubmitting(true);

    createService(servicePayload)
      .then((result) => {
        console.log("MongoDB Insert Result:", result);
        setIsSubmitting(false);

        if (result.insertedId) {
          toast.success("Salon service added successfully!");
          setFormData(INITIAL_FORM);
          router.push("/dashboard/admin/services");
          router.refresh();
        } else {
          toast.error("Service could not be saved.");
        }
      })
      .catch((error) => {
        console.log("Create Service Error:", error);
        setIsSubmitting(false);
        toast.error("Failed to add service. Check your backend server.");
      });
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] w-full flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-5 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/admin/services"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to services
          </Link>
        </div>

        <Card className="w-full rounded-3xl border shadow-md">
          <CardHeader className="px-6 pt-8 pb-4 sm:px-10">
            <CardTitle className="font-heading text-2xl sm:text-3xl">
              Add New Salon Service
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Fill in the details below to publish a new service on the browse
              services page.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Service Name & Category */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    className="h-11 rounded-xl"
                    placeholder="e.g. Gloss & Shine Treatment"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      if (value) {
                        setFormData((prev) => ({ ...prev, category: value }));
                      }
                    }}
                  >
                    <SelectTrigger id="category" className="h-11 w-full rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Price, Duration & Service Location */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="h-11 rounded-xl"
                    placeholder="55.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="5"
                    step="5"
                    className="h-11 rounded-xl"
                    placeholder="45"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Service Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => {
                      if (value) {
                        setFormData((prev) => ({ ...prev, location: value }));
                      }
                    }}
                  >
                    <SelectTrigger id="location" className="h-11 w-full rounded-xl">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Service Image Upload (ImgBB) & Lead Stylist */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <ImageUploadField
                  id="image"
                  label="Service Image *"
                  value={formData.image}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, image: url }))
                  }
                  placeholder="https://i.ibb.co/... or upload above"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="specialist">
                    Lead Stylist / Specialist{" "}
                    <span className="text-xs text-muted-foreground">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="specialist"
                    name="specialist"
                    className="h-11 rounded-xl"
                    placeholder="e.g. Senior Hair Stylist"
                    value={formData.specialist}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 4: Short Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  maxLength={220}
                  className="rounded-xl"
                  placeholder="A quick shine reset that softens tone, smooths the cuticle and leaves hair glassy..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <p className="text-right text-xs text-muted-foreground">
                  {formData.description.length}/220 characters
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl text-base font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Adding Service...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 size-4" />
                    Add Service
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}