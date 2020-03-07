import fs from 'fs'
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { BankInstitution } from '../../models/BankInstitution'
import { inject, injectable } from 'inversify'
import { AllyBankService } from '../institutions/allyBank.service'
import { TDAmeritradeService } from '../institutions/tdAmeritrade.service'
import { USAABankService } from '../institutions/USAABank.service'
import { WellsFargoBankService } from '../institutions/wellsFargoBank.service'
import { FileUtilityService } from './fileUtility.service'
import { InsitutionOption } from '../../models/InstitutionOption'

@injectable()
export class TransactionParserService {
  constructor(
    @inject(FileUtilityService) private fileUtility: FileUtilityService,
    @inject(AllyBankService) private allyBank: BankInstitution,
    @inject(USAABankService) private USAABank: BankInstitution,
    @inject(WellsFargoBankService) private wellsFargoBank: BankInstitution,
    @inject(TDAmeritradeService) private tdAmeritrade: BankInstitution) { }

  GetImportsInsitutions(): InsitutionOption[] {
    return [
      { Id: 'ALLY', Name: 'Ally Bank', BankInstitution: this.allyBank },
      { Id: 'TDAM', Name: 'TD Ameritrade', BankInstitution: this.tdAmeritrade },
      { Id: 'USAA', Name: 'USAA Bank', BankInstitution: this.USAABank },
      { Id: 'WFBA', Name: 'Wells Fargo Bank', BankInstitution: this.wellsFargoBank }
    ]
  }

  GetTransactionsFromFile(filePath: string, fileName: string, importType: string, importAccount: string): Promise<GnuCashTransaction[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, fileContent) => {
        if (err) throw err

        const fileType = this.fileUtility.GetFileType(fileName)
        const importInsitution = this.GetImportsInsitutions().filter(x => x.Id === importType)

        if (importInsitution.length === 1) {
          return resolve(this.getTransactionsByFileType(importInsitution[0].BankInstitution, fileType, fileContent, importAccount))
        } else {
          return reject(Error('Invalid File Import Type'))
        }
      })
    })
  }

  private getTransactionsByFileType(institution: BankInstitution, fileType: string, fileContent: string, accountGuid: string): GnuCashTransaction[] {
    switch (fileType) {
      case '.pdf':
        return institution.ParsePDF()
      case '.csv':
        return institution.ParseCSV(fileContent, accountGuid)
      default:
        throw Error('Invalid File Type')
    }
  }
}
