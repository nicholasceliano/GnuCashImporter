import { StockTransactionData } from '../StockTransactionData'

export interface GnuCashTransaction {
  AccountGuid: string;
  Description: string;
  Amount: number; // Negative is Withdrawl, Positive is Deposit
  PostDate: Date;
  CreateDate: Date;
  ReconcileAccountGuid?: string;

  CurrencyGuid?: string;
  TransactionGuid?: string;
  ValueNum?: number;
  ValueDenom?: number;
  QuantityNum?: number;
  QuantityDenom?: number;

  IsStock: boolean;
  StockData: StockTransactionData;
}
