// src/context/AuthContext.ts
import { createContext } from 'react';
import type { User } from '../types/AuthTypes';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  updateAvatar: (file: File) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);