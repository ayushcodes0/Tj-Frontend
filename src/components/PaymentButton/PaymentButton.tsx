import React, { useState } from 'react';
import styles from './PaymentButton.module.css';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface OrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  planType?: string; // Add optional planType
}

interface VerifyResponse {
  success: boolean;
  message: string;
  paymentId?: string;
}

interface PaymentButtonProps {
  amount: number;
  userEmail: string;
  className?: string;
  planType: 'monthly' | 'annual';
  disabled?: boolean; // Add disabled prop
  onSuccess?: (paymentId: string, planType: string) => void;
  onFailure?: (error: string) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  userEmail,
  className = '',
  planType,
  disabled = false,
  onSuccess,
  onFailure,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if ((window as Window & typeof globalThis & { Razorpay?: unknown }).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createOrder = async (): Promise<OrderResponse | null> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount, 
          planType // Use the destructured planType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data: OrderResponse = await response.json();
      return data;
    } catch (err) {
      console.error('Create Order Error:', err);
      return null;
    }
  };

  const verifyPayment = async (paymentData: RazorpayResponse): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          planType // Include planType in verification
        }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data: VerifyResponse = await response.json();
      return data.success;
    } catch (err) {
      console.error('Payment Verification Error:', err);
      return false;
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }

      // Create order
      const orderData = await createOrder();
      if (!orderData || !orderData.success) {
        throw new Error('Failed to create payment order. Please try again.');
      }

      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TradeJournalAI',
        description: planType === 'annual' 
          ? 'Pro Annual Subscription - Advanced Trading Analytics' 
          : 'Pro Monthly Subscription - Advanced Trading Analytics',
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          // Verify payment
          const isVerified = await verifyPayment(response);
          if (isVerified) {
            alert(`Payment successful! Welcome to TradeJournalAI Pro ${planType === 'annual' ? 'Annual' : 'Monthly'}!`);
            onSuccess?.(response.razorpay_payment_id, planType);
          } else {
            alert('Payment verification failed. Please contact support.');
            onFailure?.('Payment verification failed');
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: '#4840BB',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onFailure?.('Payment cancelled by user');
          },
        },
      };

      const rzp = new ((window as Window & typeof globalThis & { Razorpay?: unknown }).Razorpay as {
        new (options: unknown): { open(): void };
      })(options);
      
      rzp.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(errorMessage);
      onFailure?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.paymentButton} ${className} ${isLoading ? styles.loading : ''}`}
        onClick={handlePayment}
        disabled={disabled || isLoading}
        type="button"
        aria-label={`Pay ${amount} rupees for TradeJournalAI Pro ${planType} subscription`}
      >
        {isLoading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner}></span>
            Processing...
          </span>
        ) : (
          `Subscribe for ₹${amount}`
        )}
      </button>
      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
          <button
            className={styles.retryButton}
            onClick={() => setError(null)}
            type="button"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;