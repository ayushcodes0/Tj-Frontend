// src/hooks/useTheme.ts

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // Ensure this path is correct

/**
 * Custom hook to access theme context data.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
