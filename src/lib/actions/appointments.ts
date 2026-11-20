import { API_BASE_URL, readJsonResponse } from "../api/config";

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

  return readJsonResponse<Appointment[]>(
    res,
    "Failed to fetch appointments"
  );
};

// Admin: fetch all appointment requests
export const getAllAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    cache: "no-store",
  });

  return readJsonResponse<Appointment[]>(
    res,
    "Failed to fetch all appointments"
  );
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

  return readJsonResponse(res, "Failed to update appointment status");
};