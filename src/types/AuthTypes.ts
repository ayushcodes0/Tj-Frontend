// src/types/AuthTypes.ts
export interface User {
  id: string;
  username: string;
  email: string;
  // Add any additional user fields you need
}

export interface AuthResponse {
  user: User;
  token: string;
}