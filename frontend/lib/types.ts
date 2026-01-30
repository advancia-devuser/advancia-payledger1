
export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled'
}

export enum TransactionType {
  PAYROLL = 'Payroll',
  INVOICE = 'Invoice',
  VENDOR_PAYMENT = 'Vendor Payment',
  TAX = 'Tax',
  CRYPTO_SETTLEMENT = 'Crypto Settlement'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  category: string;
  network?: 'Solana' | 'Ethereum' | 'Base' | 'Polygon' | 'Stripe';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  lastPaid: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  status: 'Success' | 'Alert' | 'Flagged';
}

export interface VaultBalance {
  network: string;
  balance: number;
  valueUSD: number;
  change24h: number;
  address: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
