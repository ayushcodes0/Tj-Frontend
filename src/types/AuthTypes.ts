// types/AuthTypes.ts
export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  type?: string;
  startedAt?: string | null;
  expiresAt?: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  subscription: Subscription;
  createdAt?: string;
  // ...any other profile fields
}

// Add these new response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error: boolean;
}

export interface SubscriptionUpdateResponse extends ApiResponse<User> {
  data: User;
}
