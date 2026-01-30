import React, { useState } from "react";
import styles from "./PaymentButton.module.css";
import { useAuth } from "../../hooks/useAuth";

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
  planType?: string;

  originalAmount?: number;
  payableAmount?: number;
  discountApplied?: boolean;
  discountPercent?: number;

  message?: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
  paymentId?: string;
}

// ✅ Razorpay types (no any)
interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void | Promise<void>;
  prefill?: {
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayCheckoutOptions): RazorpayInstance;
}

type RazorpayWindow = Window &
  typeof globalThis & {
    Razorpay?: RazorpayConstructor;
  };

interface PaymentButtonProps {
  amount: number;
  userEmail: string;
  className?: string;
  planType: "monthly" | "annual";
  disabled?: boolean;
  onSuccess?: (paymentId: string, planType: string) => void;
  onFailure?: (error: string) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  userEmail,
  className = "",
  planType,
  disabled = false,
  onSuccess,
  onFailure,
}) => {
  const { user, token } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as RazorpayWindow).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (): Promise<OrderResponse | null> => {
    try {
      if (!user?.id) throw new Error("User not found");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          planType,
          amount,
        }),
      });

      const data: OrderResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create order");
      }

      return data;
    } catch (err) {
      console.error("Create Order Error:", err);
      const msg = err instanceof Error ? err.message : "Failed to create order";
      setError(msg);
      onFailure?.(msg);
      return null;
    }
  };

  const verifyPayment = async (paymentData: RazorpayResponse): Promise<boolean> => {
    try {
      if (!user?.id) throw new Error("User not found");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...paymentData,
          userId: user.id,
          planType,
        }),
      });

      const data: VerifyResponse = await response.json();

      if (!response.ok) throw new Error(data?.message || "Payment verification failed");

      return data.success;
    } catch (err) {
      console.error("Payment Verification Error:", err);
      const msg = err instanceof Error ? err.message : "Payment verification failed";
      setError(msg);
      onFailure?.(msg);
      return false;
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Failed to load Razorpay. Please check your internet connection.");

      const orderData = await createOrder();
      if (!orderData || !orderData.success) throw new Error("Failed to create payment order. Please try again.");

      const Razorpay = (window as RazorpayWindow).Razorpay;
      if (!Razorpay) throw new Error("Razorpay SDK not available");

      const options: RazorpayCheckoutOptions = {
        key: import.meta.env.VITE_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TradeJournalAI",
        description:
          planType === "annual"
            ? "Pro Annual Subscription - Advanced Trading Analytics"
            : "Pro Monthly Subscription - Advanced Trading Analytics",
        order_id: orderData.orderId,

        handler: async (response: RazorpayResponse) => {
          const isVerified = await verifyPayment(response);

          if (isVerified) {
            onSuccess?.(response.razorpay_payment_id, planType);
          } else {
            onFailure?.("Payment verification failed");
          }
        },

        prefill: { email: userEmail },

        theme: { color: "#4840BB" },

        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onFailure?.("Payment cancelled by user");
          },
        },
      };

      // optional console log
      if (orderData.discountApplied) {
        console.log("🎉 Discount applied:", {
          original: orderData.originalAmount,
          payable: orderData.payableAmount,
          percent: orderData.discountPercent,
        });
      }

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(errorMessage);
      onFailure?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.paymentButton} ${className} ${isLoading ? styles.loading : ""}`}
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
          <button className={styles.retryButton} onClick={() => setError(null)} type="button">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
