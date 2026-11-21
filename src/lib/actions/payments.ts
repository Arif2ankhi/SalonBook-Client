import { API_BASE_URL } from "../api/config";
import { Appointment } from "./appointments";

export interface TransactionRecord {
  _id: string;
  appointmentId: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}

export interface VerifiedPaymentResponse {
  verified: boolean;
  stripeSessionId: string;
  amount: number;
  currency: string;
  appointment: Appointment | null;
}

export const createStripeCheckoutSession = async (
  appointmentId: string,
  customerEmail: string
): Promise<{ url: string; sessionId: string }> => {
  const res = await fetch(`${API_BASE_URL}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointmentId, customerEmail }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to start Stripe checkout");
  }

  return data;
};

export const verifyStripePayment = async (
  sessionId: string
): Promise<VerifiedPaymentResponse> => {
  const res = await fetch(
    `${API_BASE_URL}/payments/verify/${encodeURIComponent(sessionId)}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Could not verify payment session");
  }

  return data;
};

export const getAllTransactions = async (): Promise<TransactionRecord[]> => {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
};