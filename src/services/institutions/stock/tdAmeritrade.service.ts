import { BankInstitution } from '../../../models/BankInstitution'
import { GnuCashTransaction } from '../../../models/gnuCash/GnuCashTransaction'
import { injectable, inject } from 'inversify'
import { FileParserService } from '../../file/fileParser.service'
import { ConfigurationService } from '../../configuration.service'
import { TDAmeritradeRecord } from '@/models/institutions/TDAmeritradeRecord'
import { StockTransactionData } from '@/models/StockTransactionData'
import { GnuCashDatabaseService } from '../../gnucash/gnucashDatabase.service'

@injectable()
export class TDAmeritradeService extends FileParserService implements BankInstitution {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService,
    @inject(GnuCashDatabaseService) protected gnuCashDatabaseService: GnuCashDatabaseService) {
    super(configurationService, gnuCashDatabaseService)
  }

  ParseCSV(fileContent: string, accountGuid: string): Promise<GnuCashTransaction[]> {
    const records = this.ParseCSVToBankRecord<TDAmeritradeRecord>(fileContent)
    const transactions = this.MapBankRecordsToGnuCashTransactions<TDAmeritradeRecord>(records, accountGuid,
      (r) => r.DESCRIPTION,
      (r) => r.AMOUNT,
      (r) => `${r.DATE}Z`,
      (r) => !!((r.QUANTITY && r.PRICE)),
      (r) => ({
        Symbol: r.SYMBOL,
        Price: r.PRICE ? parseFloat(r.PRICE) : undefined,
        PriceString: r.PRICE ? parseFloat(r.PRICE).toDollars() : '',
        Quantity: r.QUANTITY ? parseFloat(r.QUANTITY) : undefined
      } as StockTransactionData))

    return transactions
  }

  ParsePDF(): Promise<GnuCashTransaction[]> {
    throw Error('Not Implemented')
  }
}
