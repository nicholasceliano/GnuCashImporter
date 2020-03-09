import parse from 'csv-parse/lib/sync'
import { GnuCashTransaction } from '@/models/gnuCash/GnuCashTransaction'
import { ConfigurationService } from '../configuration.service'
import { injectable, inject } from 'inversify'
import { StockTransactionData } from '@/models/StockTransactionData'
import { GnuCashDatabaseService } from '../gnucash/gnucashDatabase.service'

@injectable()
export abstract class FileParserService {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService,
    @inject(GnuCashDatabaseService) protected gnuCashDatabaseService: GnuCashDatabaseService) { }

  ParseCSVToBankRecord<T>(fileContent: string, columnStructure?: string[]): T[] {
    /* eslint-disable @typescript-eslint/camelcase */
    return parse(fileContent, {
      columns: columnStructure || (header => header.map((column: string) => column.trim())),
      skip_lines_with_error: true
    })
  }

  async MapBankRecordsToGnuCashTransactions<T>(bankRecords: T[], accountGuid: string,
    description: (r: T) => string, amount: (r: T) => string, postDate: (r: T) => string, isStock?: (r: T) => boolean, stockData?: (r: T) => StockTransactionData): Promise<GnuCashTransaction[]> {
    const transactions: GnuCashTransaction[] = []

    const defaultReconcileAccount = await this.gnuCashDatabaseService.GetAccountByGuid(this.configurationService.ConfigData.GnuCashDefaults.ReconcileAccountGUID)

    bankRecords.forEach(r => {
      transactions.push({
        AccountGuid: accountGuid,
        Description: description(r),
        CurrencyGuid: this.configurationService.ConfigData.GnuCashDefaults.CurrencyGUID,
        ReconcileAccount: defaultReconcileAccount,
        Amount: parseFloat(amount(r)),
        PostDate: new Date(postDate(r)),
        CreateDate: new Date(),
        IsStock: isStock ? isStock(r) : false,
        StockData: stockData ? stockData(r) : undefined
      } as GnuCashTransaction)
    })

    return transactions
  }
}
