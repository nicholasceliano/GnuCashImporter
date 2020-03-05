import fs from 'fs'
import { GnuCashDatabaseService } from '../gnucash/gnucashDatabase.service'
import { FileUtilityService } from './fileUtility.service'
import { environment } from '../../environments/environment'
import { GnuCashImportMetaData } from '../../models/GnuCashImportMetaData'
import { inject, injectable } from 'inversify'
import { TransactionParserService } from './transactionParser.service'

@injectable()
export class FilePullerService {
  constructor(
    @inject(TransactionParserService) private transactionParserService: TransactionParserService,
    @inject(FileUtilityService) private fileUtility: FileUtilityService,
    @inject(GnuCashDatabaseService) private gnuCash: GnuCashDatabaseService) { }

  ImportFiles(filePath: string, fileName: string, importType?: string): Promise<void> {
    return new Promise((resolve) => {
      this.transactionParserService.GetTransactionsFromFile(filePath, fileName, importType).then(transactions => {
        const importMetaData = this.gnuCash.InsertTransactions(transactions)

        // need to check if file has already been imported

        if (importMetaData) {
          this.archiveFile(filePath, fileName, importMetaData, importType)
        } else {
          this.deleteFile(fileName)
        }

        resolve()
      })
    })
  }

  private archiveFile(filePath: string, fileName: string, importMetaData: GnuCashImportMetaData, importType?: string): void {
    const fileType = this.fileUtility.GetFileType(fileName)
    const destFolder = `${environment.fileUploadDirectory}/${environment.archiveFolderName}`
    const destFileName = `${importType}_${importMetaData.EarliestRecordDate.getTime()}_${importMetaData.LatestRecordDate.getTime()}${fileType}`

    fs.access(`${destFolder}/${destFileName}`, (exists) => {
      if (!exists) {
        fs.rename(filePath, `${destFolder}/${destFileName}`, (err) => {
          if (err) throw err
        })
      }
    })
  }

  private deleteFile(fileName: string): void {
    console.log(`${fileName} - to be deleted.`)
    throw Error('Not Implemented')
  }
}
