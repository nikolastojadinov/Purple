// Pi Network SDK global type declaration
// See: https://developers.minepi.com/docs/pi-platform-sdk

export interface AuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

export interface PaymentDTO {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  from_address: string;
  to_address: string;
  direction: "user_to_app" | "app_to_user";
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction?: {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

declare global {
  interface Window {
    Pi?: {
      init: (config: {
        version: string;
        sandbox: boolean;
        appId: string;
      }) => void;
      authenticate: (
        scopes: string[],
        onIncomplete?: (payment: PaymentDTO) => void
      ) => Promise<AuthResult>;
      createPayment: (paymentData: {
        amount: number;
        memo: string;
        metadata: Record<string, any>;
      }) => Promise<PaymentDTO>;
      initialized?: boolean;
    };
    PurpleBeats?: {
      piLogin: () => Promise<AuthResult>;
      piPayment: (amount: number, memo: string, metadata: Record<string, any>) => Promise<PaymentDTO>;
    };
  }
}

export {};