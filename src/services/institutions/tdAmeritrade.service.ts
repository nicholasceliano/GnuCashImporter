import { BankInstitution } from '../../models/BankInstitution'
import { GnuCashTransaction } from '../../models/GnuCashTransaction'
import { injectable } from 'inversify'

@injectable()
export class TDAmeritradeService implements BankInstitution {
  ParseCSV (fileContent: string): GnuCashTransaction[] {
    console.log(fileContent)
    throw Error('Not Implemented')
  }

  ParsePDF (): GnuCashTransaction[] {
    throw Error('Not Implemented')
  }
}
