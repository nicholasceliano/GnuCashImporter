import parse from 'csv-parse/lib/sync'
import { GnuCashTransaction } from '@/models/gnuCash/GnuCashTransaction'
import { ConfigurationService } from '../configuration.service'
import { injectable, inject } from 'inversify'

@injectable()
export abstract class FileParserService {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService) { }

  ParseCSVToBankRecord<T>(fileContent: string, columnStructure?: string[]): T[] {
    return parse(fileContent, {
      columns: columnStructure ? columnStructure : header => header.map((column: string) => column.trim()),
      skip_lines_with_error: true
    })
  }

  MapBankRecordsToGnuCashTransactions<T>(bankRecords: T[], accountGuid: string, description: (r: T) => string, amount: (r :T) => string, postDate: (r: T) => string): GnuCashTransaction[] {
    const transactions: GnuCashTransaction[] = []

    bankRecords.forEach(r => {
      transactions.push({
        AccountGuid: accountGuid,
        Description: description(r),
        CurrencyGuid: this.configurationService.ConfigData.GnuCashDefaults.CurrencyGUID,
        ReconcileAccountGuid: this.configurationService.ConfigData.GnuCashDefaults.ReconcileAccountGUID,
        Amount: parseFloat(amount(r)),
        PostDate: new Date(postDate(r)),
        CreateDate: new Date()
      } as GnuCashTransaction)
    })

    return transactions
  }
}
