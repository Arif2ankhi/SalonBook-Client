
/// 3rd codes 

import { API_BASE_URL } from "../api/config";

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

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};

// Public Browse Services-Only Active service
export const getActiveServices = async (): Promise<SalonService[]> => {
  const res = await fetch(`${API_BASE_URL}/services?status=Active`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch active services");
  }

  return res.json();
};

// Service Details - Single service by id
export const getServiceById = async (id: string): Promise<SalonService> => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch service details");
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error("Failed to create service");
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error("Failed to update service");
  }

  return res.json();
};

export const deleteService = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete service");
  }

  return res.json();
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