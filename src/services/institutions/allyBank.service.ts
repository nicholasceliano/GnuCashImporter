
import { BankInstitution } from '../../models/BankInstitution'
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { AllyBankRecord } from '../../models/institutions/AllyBankRecord'
import { environment } from '../../environments/environment'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'
import { FileParserService } from '../file/fileParser.service'

@injectable()
export class AllyBankService extends FileParserService implements BankInstitution {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService) {
    super(configurationService)
  }

  ParseCSV (fileContent: string): GnuCashTransaction[] {
    const records = this.ParseCSVToBankRecord<AllyBankRecord>(fileContent)
    const transactions = this.MapBankRecordsToGnuCashTransactions<AllyBankRecord>(records, environment.gnuCashAccountGuid.ally,
      (r) => r.Description,
      (r) => r.Amount,
      (r) => `${r.Date} ${r.Time}Z`)

    return transactions
  }

  ParsePDF (): GnuCashTransaction[] {
    throw Error('Not Implemented')
  }
}
