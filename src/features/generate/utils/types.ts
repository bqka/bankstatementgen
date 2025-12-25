import { BankTemplate, Statement, StatementUserDetails, Transaction } from '@/types/statement';

export interface SalariedFormValues extends StatementUserDetails {
  employer: string;
  customEmployer?: string;
  salaryAmount: number;
  durationMonths: number;
  startingBalance: number;
  template: BankTemplate;
  numberOfTransactions: number;
  closingBalance?: number; // Optional target closing balance
  statementEndDate?: Date; // Optional: Statement end date (defaults to today)
  statementStartDate?: Date; // Optional: Statement start date (calculated from end date if not provided)
}

export interface SelfEmployedFormValues extends StatementUserDetails {
  turnover: number;
  periodMonths: 3 | 6;
  template: BankTemplate;
  startingBalance: number;
  numberOfTransactions: number;
  closingBalance?: number; // Optional target closing balance
  statementEndDate?: Date; // Optional: Statement end date (defaults to today)
  statementStartDate?: Date; // Optional: Statement start date (calculated from end date if not provided)
}

export interface GeneratorResult {
  statement: Statement;
}

export type TransactionGenerator<T> = (
  inputs: T,
  options: {
    seed: number;
  }
) => Transaction[];
