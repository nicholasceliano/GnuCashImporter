import fs from 'fs'
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { BankInstitution } from '../../models/BankInstitution'
import { inject, injectable } from 'inversify'
import { AllyBankService } from '../institutions/allyBank.service'
import { TDAmeritradeService } from '../institutions/tdAmeritrade.service'
import { USAABankService } from '../institutions/USAABank.service'
import { WellsFargoBankService } from '../institutions/wellsFargoBank.service'
import { FileUtilityService } from './fileUtility.service'

@injectable()
export class TransactionParserService {
  constructor(
    @inject(FileUtilityService) private fileUtility: FileUtilityService,
    @inject(AllyBankService) private allyBank: BankInstitution,
    @inject(USAABankService) private USAABank: BankInstitution,
    @inject(WellsFargoBankService) private wellsFargoBank: BankInstitution,
    @inject(TDAmeritradeService) private tdAmeritrade: BankInstitution) { }

  GetTransactionsFromFile(filePath: string, fileName: string, importType?: string): Promise<GnuCashTransaction[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, fileContent) => {
        if (err) throw err

        const fileType = this.fileUtility.GetFileType(fileName)

        switch (importType) {
          case 'ALLY':
            return resolve(this.getTransactionsByFileType(this.allyBank, fileType, fileContent))
          case 'TDAM':
            return resolve(this.getTransactionsByFileType(this.tdAmeritrade, fileType, fileContent))
          case 'USAA':
            return resolve(this.getTransactionsByFileType(this.USAABank, fileType, fileContent))
          case 'WF':
            return resolve(this.getTransactionsByFileType(this.wellsFargoBank, fileType, fileContent))
          default:
            return reject(Error('Invalid File Import Type'))
        }
      })
    })
  }

  private getTransactionsByFileType(institution: BankInstitution, fileType: string, fileContent: string): GnuCashTransaction[] {
    switch (fileType) {
      case '.pdf':
        return institution.ParsePDF()
      case '.csv':
        return institution.ParseCSV(fileContent)
      default:
        throw Error('Invalid File Type')
    }
  }
}
