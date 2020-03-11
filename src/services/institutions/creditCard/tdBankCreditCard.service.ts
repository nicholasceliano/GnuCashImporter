import { BankInstitution } from '../../../models/BankInstitution'
import { GnuCashTransaction } from '../../../models/gnuCash/GnuCashTransaction'
import { TDCreditCardRecord } from '../../../models/institutions/TDCreditCardRecord'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../../configuration.service'
import { FileParserService } from '../../file/fileParser.service'
import { GnuCashDatabaseService } from '../../gnucash/gnucashDatabase.service'

@injectable()
export class TDBankCreditCardService extends FileParserService implements BankInstitution {
  constructor(@inject(ConfigurationService) protected configurationService: ConfigurationService,
    @inject(GnuCashDatabaseService) protected gnuCashDatabaseService: GnuCashDatabaseService) {
    super(configurationService, gnuCashDatabaseService)
  }

  ParseCSV(fileContent: string, accountGuid: string): Promise<GnuCashTransaction[]> {
    const records = this.ParseCSVToBankRecord<TDCreditCardRecord>(fileContent, undefined, { relax: true })
    const transactions = this.MapBankRecordsToGnuCashTransactions<TDCreditCardRecord>(records, accountGuid,
      (r) => `${r.Merchant} ${r['Merchant City']}, ${r['Merchant State']} ${r['Merchant Zip']}`.trim(),
      (r) => `${r['Billing Amount'].startsWith('(') && r['Billing Amount'].endsWith(')') ? '-' : ''}${r['Billing Amount'].removeParentheses().removeDollarSign()}`,
      (r) => `${r['Transaction Date']}Z`)

    return transactions
  }

  ParsePDF(): Promise<GnuCashTransaction[]> {
    throw Error('Not Implemented')
  }
}
