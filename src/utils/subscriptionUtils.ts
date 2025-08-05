// src/utils/subscriptionUtils.ts
import type { User } from '../types/AuthTypes';

export function hasActivePro(user?: User | null): boolean {
  if (!user?.subscription) return false;
  if (user.subscription.plan !== "pro") return false;       // uncomment this when done with development and remove return true
  // if (!user.subscription.expiresAt) return false;
  // return new Date(user.subscription.expiresAt) > new Date();
  return true;
}



export function getProTrialRemaining(user?: User | null): number {
  if (!user?.subscription?.expiresAt) return 0;
  return new Date(user.subscription.expiresAt).getTime() - Date.now();
}
