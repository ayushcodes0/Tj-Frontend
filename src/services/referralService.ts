// src/services/referralService.ts

export interface ReferralStats {
  totalReferred?: number;
  totalRewardDays?: number;
  totalPaidReferrals?: number;
}

export interface ReferralInfo {
  code?: string;
  referredBy?: string | null;
  redeemedAt?: string;
  discountUnlocked?: boolean;
  discountPercent?: number;
  stats?: ReferralStats;
}

export interface SubscriptionInfo {
  plan?: string;
  type?: string;
  startedAt?: string;
  expiresAt?: string;
}

export interface ReferralMeResponse {
  success?: boolean;
  referral?: ReferralInfo;
  subscription?: SubscriptionInfo;
  message?: string;
}

export async function getReferralMe(token: string): Promise<ReferralMeResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/referral/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch referral info");

  return data;
}

export async function applyReferralCode(
  token: string,
  code: string
): Promise<{ message: string; discountPercent?: number }> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/referral/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to apply coupon");

  return data;
}

export async function generateReferralCode(
  token: string
): Promise<{ message: string; code: string }> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/referral/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to generate coupon");

  return data;
}
