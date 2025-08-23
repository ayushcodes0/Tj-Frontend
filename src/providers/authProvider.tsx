import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { User } from '../types/AuthTypes';

interface AuthProviderProps { 
  children: ReactNode; 
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore on page load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Helper: persist user/token
  const persistAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  // ADD: Set token for Google OAuth callback
  const setAuthToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    // Fetch user data with the new token
    fetchUserProfile(newToken);
  };

  // ADD: Fetch user profile after Google OAuth
  // In your AuthProvider - update the fetchUserProfile function
const fetchUserProfile = async (authToken: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user profile');
    
    const userData = data.user || data.data;
    
    // Check if user got Pro trial
    if (userData.subscription?.plan === 'pro') {
      console.log('🎉 User has Pro subscription!');
      console.log('Expires at:', userData.subscription.expiresAt);
    }
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    logout();
  }
};


  // Registration
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      persistAuth(data.data, data.token);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage); 
      throw new Error(errorMessage);
    } finally { 
      setLoading(false); 
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      persistAuth(data.data, data.token);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage); 
      throw new Error(errorMessage);
    } finally { 
      setLoading(false); 
    }
  };

  // Logout (clears everywhere)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateAvatar = async (file: File): Promise<void> => {
    if (!token) throw new Error("Not logged in");
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/avatar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Avatar update failed");

    const newUser: User = { ...user!, avatar: data.data.avatar };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Change username
  const changeUsername = async (newUsername: string) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true); 
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/username`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Username update failed";
      setError(msg); 
      throw new Error(msg);
    } finally { 
      setLoading(false); 
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error("Not authenticated");
    setLoading(true); 
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password update failed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Password update failed";
      setError(msg); 
      throw new Error(msg);
    } finally { 
      setLoading(false); 
    }
  };

  // ADD setAuthToken to the context value
  const value = { 
    user, 
    token, 
    register, 
    login, 
    logout, 
    loading, 
    error, 
    updateAvatar, 
    changePassword, 
    changeUsername,
    setAuthToken  // Add this line
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
