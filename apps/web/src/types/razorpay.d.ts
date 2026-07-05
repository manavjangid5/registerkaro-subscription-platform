export interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    handler: (response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => void;
    prefill?: { name?: string; email?: string };
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
  }
  
  interface RazorpayInstance {
    open: () => void;
  }
  
  declare global {
    interface Window {
      Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
    }
  }
  
  export {};