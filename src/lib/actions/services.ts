
/// 3rd codes 

import { API_BASE_URL, readJsonResponse } from "../api/config";

export interface SalonService {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  image: string;
  description: string;
  location?: string;
  specialist?: string;
  status?: "Active" | "Inactive";
  isActive?: boolean;
  createdAt?: string;
}

export interface NewServicePayload {
  name: string;
  category: string;
  price: number;
  duration: number;
  image: string;
  description: string;
  location?: string;
  specialist?: string;
  status?: "Active" | "Inactive";
  isActive?: boolean;
}

// Admin Manage Services-for all service
export const getServices = async (): Promise<SalonService[]> => {
  const res = await fetch(`${API_BASE_URL}/services`, {
    cache: "no-store",
  });

  return readJsonResponse<SalonService[]>(res, "Failed to fetch services");
};

// Public Browse Services-Only Active service
export const getActiveServices = async (): Promise<SalonService[]> => {
  const res = await fetch(`${API_BASE_URL}/services?status=Active`, {
    cache: "no-store",
  });

  return readJsonResponse<SalonService[]>(res, "Failed to fetch active services");
};

// Home: featured active services (default 6, newest first)
export const getFeaturedServices = async (
  limit = 6
): Promise<SalonService[]> => {
  const res = await fetch(
    `${API_BASE_URL}/services/featured?limit=${limit}`,
    { cache: "no-store" }
  );

  return readJsonResponse<SalonService[]>(
    res,
    "Failed to fetch featured services"
  );
};

// Home: distinct categories of active services (explore-by-category links)
export const getServiceCategories = async (): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/services/categories`, {
    cache: "no-store",
  });

  return readJsonResponse<string[]>(
    res,
    "Failed to fetch service categories"
  );
};

// Service Details - Single service by id
export const getServiceById = async (id: string): Promise<SalonService> => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    cache: "no-store",
  });

  // Throws ApiError(…, 404) for unknown ids so the page can notFound(),
  // and ApiError(…, 5xx) for backend failures so error.tsx can take over.
  return readJsonResponse<SalonService>(res, "Failed to fetch service details");
};

export const createService = async (data: NewServicePayload) => {
  const res = await fetch(`${API_BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      status: data.status || "Active",
      isActive: (data.status || "Active") === "Active",
      createdAt: new Date().toISOString(),
    }),
  });

  return readJsonResponse<{ insertedId?: string; acknowledged?: boolean }>(
    res,
    "Failed to create service"
  );
};

export const updateService = async (
  id: string,
  data: Partial<NewServicePayload>
) => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return readJsonResponse(res, "Failed to update service");
};

export const deleteService = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "DELETE",
  });

  return readJsonResponse(res, "Failed to delete service");
};



//2nd codes 





// import { API_BASE_URL } from "../api/config";

// export interface SalonService {
//   _id: string;
//   name: string;
//   category: string;
//   price: number;
//   duration: number;
//   image: string;
//   description: string;
//   location?: string;
//   specialist?: string;
//   status?: "Active" | "Inactive";
//   isActive?: boolean;
//   createdAt?: string;
// }

// export interface NewServicePayload {
//   name: string;
//   category: string;
//   price: number;
//   duration: number;
//   image: string;
//   description: string;
//   location?: string;
//   specialist?: string;
//   status?: "Active" | "Inactive";
//   isActive?: boolean;
// }

// export const getServices = async (): Promise<SalonService[]> => {
//   const res = await fetch(`${API_BASE_URL}/services`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch services");
//   }

//   return res.json();
// };

// export const createService = async (data: NewServicePayload) => {
//   const res = await fetch(`${API_BASE_URL}/services`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       ...data,
//       status: data.status || "Active",
//       isActive: (data.status || "Active") === "Active",
//       createdAt: new Date().toISOString(),
//     }),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to create service");
//   }

//   return res.json();
// };

// export const updateService = async (
//   id: string,
//   data: Partial<NewServicePayload>
// ) => {
//   const res = await fetch(`${API_BASE_URL}/services/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to update service");
//   }

//   return res.json();
// };

// export const deleteService = async (id: string) => {
//   const res = await fetch(`${API_BASE_URL}/services/${id}`, {
//     method: "DELETE",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to delete service");
//   }

//   return res.json();
// };