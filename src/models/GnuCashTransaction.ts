export interface GnuCashTransaction {
  AccountGuid: string;
  Description: string;
  Amount: number; // Negative is Withdrawl, Positive is Deposit
  PostDate: Date;
  CreateDate: Date;

  CurrencyGuid?: string;
  TransactionGuid?: string;
  ValueNum?: number;
  ValueDenom?: number;
  QuantityNum?: number;
  QuantityDenom?: number;
}
