import { BankInstitution } from '../../models/BankInstitution'
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { injectable } from 'inversify'
import { FileParserService } from '../file/fileParser.service'

@injectable()
export class TDAmeritradeService extends FileParserService implements BankInstitution {
  ParseCSV (fileContent: string): GnuCashTransaction[] {
    console.log(fileContent)
    throw Error('Not Implemented')
  }

  ParsePDF (): GnuCashTransaction[] {
    throw Error('Not Implemented')
  }
}
