import { BankInstitution } from '../../../models/BankInstitution'
import { GnuCashTransaction } from '../../../models/gnuCash/GnuCashTransaction'
import { AllyBankRecord } from '../../../models/institutions/AllyBankRecord'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../../configuration.service'
import { FileParserService } from '../../file/fileParser.service'
import { GnuCashDatabaseService } from '../../gnucash/gnucashDatabase.service'

@injectable()
export class AllyBankService extends FileParserService implements BankInstitution {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService,
    @inject(GnuCashDatabaseService) protected gnuCashDatabaseService: GnuCashDatabaseService) {
    super(configurationService, gnuCashDatabaseService)
  }

  ParseCSV(fileContent: string, accountGuid: string): Promise<GnuCashTransaction[]> {
    const records = this.ParseCSVToBankRecord<AllyBankRecord>(fileContent)
    const transactions = this.MapBankRecordsToGnuCashTransactions<AllyBankRecord>(records, accountGuid,
      (r) => r.Description,
      (r) => r.Amount,
      (r) => `${r.Date} ${r.Time}Z`)

    return transactions
  }

  ParsePDF(): Promise<GnuCashTransaction[]> {
    throw Error('Not Implemented')
  }
}
