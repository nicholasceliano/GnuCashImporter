import { BankInstitution } from '../../models/BankInstitution'
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { USAABankRecord } from '../../models/institutions/USAABankRecord'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'
import { FileParserService } from '../file/fileParser.service'

@injectable()
export class USAABankService extends FileParserService implements BankInstitution {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService) {
    super(configurationService)
  }

  ParseCSV (fileContent: string, accountGuid: string): GnuCashTransaction[] {
    const columnStructure = ['Blank1', 'Blank2', 'Date', 'Blank3','Description','Type','Amount']
    const records = this.ParseCSVToBankRecord<USAABankRecord>(fileContent, columnStructure)
    const transactions = this.MapBankRecordsToGnuCashTransactions<USAABankRecord>(records, accountGuid,
      (r) => r.Description.trim(),
      (r) => r.Amount,
      (r) => `${r.Date}Z`)

    return transactions
  }

  ParsePDF (): GnuCashTransaction[] {
    throw Error('Not Implemented')
  }
}
