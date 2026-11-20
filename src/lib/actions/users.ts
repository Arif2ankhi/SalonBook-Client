import { API_BASE_URL } from "../api/config";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  role: "customer" | "admin";
  isBlocked?: boolean;
}

export interface UpdateProfilePayload {
  email: string;
  requesterEmail: string;
  name: string;
  image: string;
  phone: string;
}

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

export const getUserProfile = async (email: string): Promise<UserProfile> => {
  const res = await fetch(
    `${API_BASE_URL}/users/profile?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  return res.json();
};

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};