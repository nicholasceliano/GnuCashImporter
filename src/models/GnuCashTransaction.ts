export interface GnuCashTransaction {
    AccountGuid: string;
    Description: string;
    Amount: number; // Negative is Withdrawl, Positive is Deposit
    PostDate: Date;
    CreateDate: Date;

    // These all need to be calculated during/right before insert
    CurrencyGuid?: string; // Pulled from lookup off Account Guid
    TransactionGuid?: string;
    ValueNum?: number;
    ValueDenom?: number;
    QuantityNum?: number;
    QuantityDenom?: number;
}