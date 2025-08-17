// src/context/ThemeProvider.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeContext, type Theme } from '../context/ThemeContext'; // Import the context and types

// Create and export ONLY the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the current theme. Initialize from localStorage or default to 'light'.
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('app-theme') as Theme | null;
      return storedTheme || 'light';
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      return 'light';
    }
  });

  // Effect to apply the theme to the document and update localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    // --- FIX: Explicitly type the 'prevTheme' parameter ---
    setTheme((prevTheme: Theme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
