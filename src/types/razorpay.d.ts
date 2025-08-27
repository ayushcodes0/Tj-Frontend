declare global {
  interface Window {
    Razorpay?: {
      new (options: {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => void;
        prefill: {
          email: string;
        };
        theme: {
          color: string;
        };
        modal: {
          ondismiss: () => void;
        };
      }): {
        open(): void;
      };
    };
  }
}

export {};
