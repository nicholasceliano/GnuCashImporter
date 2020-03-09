import { StockTransactionData } from '../StockTransactionData'
import { GnuCashAccount } from './GnuCashAccount'

export interface GnuCashTransaction {
  TransactionGuid?: string;
  AccountGuid: string;
  Description: string;
  CurrencyGuid: string;
  Amount: number; // Negative is Withdrawl, Positive is Deposit
  PostDate: Date;
  CreateDate: Date;
  ReconcileAccount: GnuCashAccount;
  ValueNum?: number;
  ValueDenom?: number;
  QuantityNum?: number;
  QuantityDenom?: number;
  IsStock: boolean;
  StockData?: StockTransactionData;
}
