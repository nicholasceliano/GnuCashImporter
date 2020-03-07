import parse from 'csv-parse/lib/sync'
import { BankInstitution } from '../../models/BankInstitution'
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { USAABankRecord } from '../../models/institutions/USAABankRecord'
import { environment } from '../../environments/environment'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'

@injectable()
export class USAABankService implements BankInstitution {
  constructor(@inject(ConfigurationService) private configurationService: ConfigurationService) { }

  ParseCSV (fileContent: string): GnuCashTransaction[] {
    const records = this.parseCSV(fileContent)
    const transactions = this.mapAllBankRecordsToGnuCashTransactions(records)

    return transactions
  }

  ParsePDF (): GnuCashTransaction[] {
    throw Error('Not Implemented')
  }

  private parseCSV (fileContent: string): USAABankRecord[] {
    return parse(fileContent, {
      columns: header => header.map((column: string) => column.trim())
    })
  }

  private mapAllBankRecordsToGnuCashTransactions (allBankRecords: USAABankRecord[]): GnuCashTransaction[] {
    const transactions: GnuCashTransaction[] = []

    allBankRecords.forEach(r => {
      transactions.push({
        AccountGuid: environment.gnuCashAccountGuid.ally,
        Description: r.Description,
        CurrencyGuid: this.configurationService.ConfigData.GnuCashDefaults.CurrencyGUID,
        ReconcileAccountGuid: this.configurationService.ConfigData.GnuCashDefaults.ReconcileAccountGUID,
        Amount: parseFloat(r.Amount),
        PostDate: new Date(`${r.Date} ${r.Time}Z`),
        CreateDate: new Date()
      } as GnuCashTransaction)
    })

    return transactions
  }
}
