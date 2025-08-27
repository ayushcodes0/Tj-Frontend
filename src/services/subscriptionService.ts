// services/subscriptionService.ts
import type { SubscriptionUpdateResponse } from '../types/AuthTypes';

export const upgradeUserToPro = async (
  userId: string, 
  paymentId: string
): Promise<SubscriptionUpdateResponse> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/subscription`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SubscriptionUpdateResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to upgrade subscription');
    }

    return data;
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    throw error instanceof Error ? error : new Error('Failed to upgrade subscription');
  }
};
