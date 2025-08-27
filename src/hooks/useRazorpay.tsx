import { useState } from 'react';
import { useCustomToast } from './useCustomToast';

// Define proper interfaces instead of using 'any'
interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface VerifyResponse {
  success: boolean;
  message?: string;
  paymentId?: string;
}

interface OrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

interface PaymentData {
  amount: number;
  userId: string;
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: string) => void; // Changed from 'any' to 'string'
}

// Window interface extension for Razorpay
declare global {
  interface Window {
    Razorpay?: {
      new (options: RazorpayOptions): {
        open(): void;
      };
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image?: string;
  handler: (response: PaymentResponse) => void;
  prefill: {
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useCustomToast();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async ({ amount, userId, onSuccess, onFailure }: PaymentData): Promise<void> => {
    try {
      setLoading(true);
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.showErrorToast('Payment gateway failed to load. Please check your internet connection.');
        onFailure?.('Payment gateway failed to load');
        return;
      }

      // Create order
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount, userId }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData: OrderResponse = await orderResponse.json();
      
      if (!orderData.success) {
        toast.showErrorToast('Failed to create payment order. Please try again.');
        onFailure?.('Failed to create payment order');
        return;
      }

      // Razorpay options
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: orderData.amount,
        currency: 'INR',
        name: 'TradeJournalAI',
        description: 'Pro Subscription - Unlock advanced trading analytics',
        order_id: orderData.orderId,
        image: '/logo.png', // Your logo
        handler: async (response: PaymentResponse) => {
          // Verify payment
          try {
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Verification request failed');
            }

            const verifyData: VerifyResponse = await verifyResponse.json();
            
            if (verifyData.success) {
              toast.showSuccessToast('Payment successful! Welcome to TradeJournalAI Pro!');
              onSuccess?.(response.razorpay_payment_id);
            } else {
              toast.showErrorToast('Payment verification failed. Please contact support.');
              onFailure?.(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
            toast.showErrorToast('Payment verification failed. Please contact support.');
            onFailure?.(errorMessage);
          }
        },
        prefill: {
          email: `${userId}@example.com`, // You can get actual email from user data
          contact: '9999999999', // You can get actual contact from user data
        },
        theme: {
          color: '#4840BB', // Your brand color
        },
        modal: {
          ondismiss: () => {
            toast.showInfoToast('Payment cancelled');
            onFailure?.('Payment cancelled by user');
          }
        }
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
      toast.showErrorToast('Failed to initiate payment. Please try again.');
      onFailure?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
};
