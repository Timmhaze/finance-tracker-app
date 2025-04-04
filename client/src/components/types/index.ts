export interface Account {
    _id: string;
    title: string;
    balance: string;
    currency: string;
    date: string;
    convertedBalance?: string;
  }

  export interface TransactionRecord {
    _id: string; // MongoDB ID
    description: string;
    category: string;
    type: string;
    amount: string;
    currency: string;
    paymentType: string;
    date: string;
    account: {
      _id: string; // MongoDB ID
      title: string;
    };
  }