import { useState } from 'react';
import type { ReactNode } from 'react';
import { FilterContext } from '../context/FilterContext';

// Helper functions to get initial date values.
const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;
const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

// Use React.PropsWithChildren to correctly type the children prop.
interface Props {
  children: ReactNode;
}

export const FilterProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState<'lifetime' | 'week' | 'year' | 'day'>('lifetime');
  const [year, setYear] = useState<number | string>(getCurrentYear());
  const [month, setMonth] = useState<number | string>(getCurrentMonth());
  const [day, setDay] = useState<number | string>(new Date().getDate());
  const [week, setWeek] = useState<number | string>(getCurrentWeek());

  const value = {
    filter,
    year,
    month,
    day,
    week,
    setFilter,
    setYear,
    setMonth,
    setDay,
    setWeek,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};