import { GnuCashTransaction } from "../../models/GnuCashTransaction";
import { GnuCashImportMetaData } from "../../models/GnuCashImportMetaData";

export class GnuCashDatabase {
    InsertTransactions(transactions: GnuCashTransaction[]): GnuCashImportMetaData {
        // need to get currency type from Accounts table
        // need to add record into Transactions table
        // need to add two records into Splits table (might just set split to 'unassigned'(or whatever it is) and user will need to manually select)
            // can build in lookup to find matching descriptions from past transactions and split to same account

        const importMetaData: GnuCashImportMetaData = {
            EarliestRecordDate: transactions.sort((a, b) => a.PostDate.getTime() - b.PostDate.getTime())[0].PostDate,
            LatestRecordDate: transactions.sort((a, b) => b.PostDate.getTime() - a.PostDate.getTime())[0].PostDate
        };

        transactions.forEach(t => {
            console.log(`insert ${JSON.stringify(t)} into database.`);
        });

        return importMetaData;
    }
}