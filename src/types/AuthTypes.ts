
export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
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
