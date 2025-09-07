import type { User } from "../types/AuthTypes";

// subscriptionUtils.ts - Update functions
export function hasActivePro(user?: User | null): boolean {
  if (!user?.subscription) return false;
  if (user.subscription.plan !== "pro") return false;
  if (!user.subscription.expiresAt) return false;
  return new Date(user.subscription.expiresAt) > new Date();
}

export function getSubscriptionType(user?: User | null): string {
  return user?.subscription?.type || 'monthly';
}

export function getSubscriptionRemaining(user?: User | null): number {
  if (!user?.subscription?.expiresAt) return 0;
  return new Date(user.subscription.expiresAt).getTime() - Date.now();
}

export function getSubscriptionDetails(user?: User | null): {
  isActive: boolean;
  type: string;
  expiresAt: Date | null;
  remainingTime: number;
} {
  if (!user?.subscription) {
    return {
      isActive: false,
      type: 'monthly',
      expiresAt: null,
      remainingTime: 0
    };
  }
  
  const isActive = hasActivePro(user);
  return {
    isActive,
    type: user.subscription.type || 'monthly',
    expiresAt: user.subscription.expiresAt ? new Date(user.subscription.expiresAt) : null,
    remainingTime: getSubscriptionRemaining(user)
  };
}