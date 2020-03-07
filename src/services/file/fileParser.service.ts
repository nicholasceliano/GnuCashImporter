import parse from 'csv-parse/lib/sync'
import { GnuCashTransaction } from '@/models/gnuCash/GnuCashTransaction'
import { ConfigurationService } from '../configuration.service'
import { injectable, inject } from 'inversify'

@injectable()
export abstract class FileParserService {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService) { }

  ParseCSVToBankRecord<T>(fileContent: string): T[] {
    return parse(fileContent, {
      columns: header => header.map((column: string) => column.trim())
    })
  }

  MapBankRecordsToGnuCashTransactions<T>(bankRecords: T[], accountGuid: string, description: Function, amount: Function, postDate: Function): GnuCashTransaction[] {
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
