import { API_BASE_URL } from "../api/config";

export interface Appointment {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  serviceCategory?: string;
  servicePrice: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerImage?: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid";
  createdAt: string;
}

// Customer: fetch only logged-in customer's appointments
export const getCustomerAppointments = async (
  email: string
): Promise<Appointment[]> => {
  const res = await fetch(
    `${API_BASE_URL}/appointments?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return res.json();
};

// Admin: fetch all appointment requests
export const getAllAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch all appointments");
  }

  return res.json();
};

// Update status (Customer cancels Pending; Admin Confirms or Cancels)
export const updateAppointmentStatus = async (
  id: string,
  status: "Confirmed" | "Cancelled"
) => {
  const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update appointment status");
  }

  return res.json();
};