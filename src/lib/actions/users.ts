import { API_BASE_URL, readJsonResponse } from "../api/config";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  role: "customer" | "admin";
  isBlocked?: boolean;
  createdAt?: string | null;
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

  return readJsonResponse<UserProfile[]>(res, "Failed to fetch users");
};

export const getUserProfile = async (email: string): Promise<UserProfile> => {
  const res = await fetch(
    `${API_BASE_URL}/users/profile?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJsonResponse<UserProfile>(res, "Failed to load profile");
};

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // readJsonResponse checks res.ok BEFORE trusting the body and surfaces the
  // server's validation message (e.g. unauthorized requester) via ApiError.
  return readJsonResponse(res, "Failed to update profile");
};