// src/context/FilterContext.tsx
import { createContext } from 'react';

// Define the shape of the context value.
interface FilterState {
  filter: 'lifetime' | 'week' | 'year' | 'day';
  year: number | string;
  month: number | string;
  day: number | string;
  week: number | string;
  setFilter: (filter: 'lifetime' | 'week' | 'year' | 'day') => void;
  setYear: (year: number | string) => void;
  setMonth: (month: number | string) => void;
  setDay: (day: number | string) => void;
  setWeek: (week: number | string) => void;
}

// Now, create the context with an explicit type argument and a default value of undefined.
// We assert the type to be undefined, as it will be populated by the provider.
export const FilterContext = createContext<FilterState | undefined>(undefined);