// src/context/ThemeContext.ts

import { createContext } from 'react';

// Define the possible theme values
export type Theme = 'light' | 'dark';

// Define the shape of the context data
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create and export the context with an initial undefined value.
// This is the only export from this file.
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
