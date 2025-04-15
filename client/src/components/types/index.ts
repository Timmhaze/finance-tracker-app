//client/src/components/types/index.ts

export interface Account {
  _id: string;
  title: string;
  currency: 'EUR' | 'CZK';  // Enforced as either EUR or CZK
  accountBalance: number;
  dateCreated?: string; // Optional, set during creation
}

export interface TransactionRecord {
  _id: string; // MongoDB ID
  description: string;
  category: string;
  type: string;
  amount: string;
  currency: string;
  paymentType: string;
  dateCreated?: string;
  linkedAccount: {
    _id: string,
    title: string
  };
  originalAmount?: number;
  originalCurrency?: string;
  
}
