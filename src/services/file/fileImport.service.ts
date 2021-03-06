import fs from 'fs'
import { GnuCashDatabaseService } from '../gnucash/gnucashDatabase.service'
import { FileUtilityService } from './fileUtility.service'
import { environment } from '../../environments/environment'
import { GnuCashImportMetaData } from '@/models/gnuCash/GnuCashImportMetaData'
import { inject, injectable } from 'inversify'
import { GnuCashImportFile } from '@/models/gnuCash/GnuCashImportFile'

@injectable()
export class FileImportService {
  constructor(
    @inject(FileUtilityService) private fileUtility: FileUtilityService,
    @inject(GnuCashDatabaseService) private gnuCash: GnuCashDatabaseService) { }

  ImportFiles(file: GnuCashImportFile): Promise<void> {
    return new Promise((resolve) => {
      const importMetaData = this.gnuCash.InsertTransactions(file.Transactions)

      // need to check if file has already been imported

      if (importMetaData) {
        this.archiveFile(file.FilePath, file.FileName, importMetaData, file.ImportType)
      } else {
        this.deleteFile(file.FileName)
      }

      resolve()
    })
  }

  private archiveFile(filePath: string, fileName: string, importMetaData: GnuCashImportMetaData, importType?: string): void {
    const fileType = this.fileUtility.GetFileType(fileName)
    const destFolder = `${environment.fileUploadDirectory}/${environment.archiveFolderName}`
    const destFileName = `${importType}_${importMetaData.EarliestRecordDate.getTime()}_${importMetaData.LatestRecordDate.getTime()}${fileType}`

    fs.access(`${destFolder}/${destFileName}`, (fileDoesntExist) => {
      if (fileDoesntExist) {
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
