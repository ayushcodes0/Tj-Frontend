
import type { TradeFormData, SavedTrade } from '../types/trade';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Option {
  _id: string;
  name: string;
}

// Helper to get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
};

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

// --- NEW UNIFIED FETCH FUNCTION ---
// Replaces fetchStrategies, fetchOutcomeSummaries, etc.
export const fetchOptions = async (type: 'Strategy' | 'OutcomeSummary' | 'RulesFollowed' | 'EmotionalState'): Promise<Option[]> => {
  const response = await fetch(`${API_BASE_URL}/api/options?type=${type}`, { headers: getAuthHeaders() });
  return handleResponse(response);
};

// --- NEW UNIFIED ADD FUNCTION ---
// Replaces addStrategy, addRulesFollowed, etc.
export const addOption = async (type: 'Strategy' | 'RulesFollowed' | 'EmotionalState', name: string): Promise<Option> => {
  const response = await fetch(`${API_BASE_URL}/api/options`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ type, name }),
  });
  return handleResponse(response);
};

// --- Save Trade Function (no changes needed) ---
export const saveTrade = async (tradeData: TradeFormData): Promise<SavedTrade> => {
  const response = await fetch(`${API_BASE_URL}/api/trades`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(tradeData),
  });
  return handleResponse(response);
};
