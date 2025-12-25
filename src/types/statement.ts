export type BankTemplate = 'PNB' | 'SBI' | 'HDFC' | 'ICICI' | 'AXIS' | 'KOTAK' | 'IDFC' | 'INDUSIND' | 'CBI' | 'YES' | 'BOB' | 'UCO' | 'IOB' | 'CANARA' | 'UNION';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface StatementUserDetails {
  name: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  startingBalance: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  branch?: string;
  bankBranch?: string;
  branchAddress?: string;
  phoneNumber?: string;
  email?: string;
}

export interface StatementMeta {
  generatedAt: string;
  template: BankTemplate;
  userType: 'salaried' | 'selfEmployed';
  configHash: string;
  seed: number;
  statementPeriodStart?: string;
  statementPeriodEnd?: string;
}

export interface Statement {
  id: string;
  details: StatementUserDetails;
  meta: StatementMeta;
  transactions: Transaction[];
  pdfUri?: string;
}
