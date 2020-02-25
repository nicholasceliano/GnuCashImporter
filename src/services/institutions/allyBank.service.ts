import parse = require('csv-parse/lib/sync');
import { BankInstitution } from '../../models/BankInstitution';
import { GnuCashTransaction } from '../../models/GnuCashTransaction';
import { AllyBankRecord } from '../../models/institutions/AllyBankRecord';
import { environment } from '../../environments/environment';
import { injectable } from 'inversify';

@injectable()
export class AllyBankService implements BankInstitution {

    ImportCSV(fileContent: string): GnuCashTransaction[] {
        const records = this.parseCSV(fileContent);
        const transactions = this.mapAllBankRecordsToGnuCashTransactions(records);

        return transactions;
    }

    ImportPDF(): GnuCashTransaction[] {
        throw ('Not Implemented');
    }

    private parseCSV(fileContent: string): AllyBankRecord[] {
        return parse(fileContent, {
            columns: header => header.map((column: string) => column.trim())
        });
    }

    private mapAllBankRecordsToGnuCashTransactions(allBankRecords: AllyBankRecord[]): GnuCashTransaction[] {
        const transactions: GnuCashTransaction[] = [];

        allBankRecords.forEach(r => {
            transactions.push({
                AccountGuid: environment.gnuCashAccountGuid.ally,
                Description: r.Description,
                Amount: r.Amount,
                PostDate: new Date(`${r.Date} ${r.Time}Z`),
                CreateDate: new Date()
            } as GnuCashTransaction);
        });

        return transactions
    }
}