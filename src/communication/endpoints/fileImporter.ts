import { container } from '../../inversify.config'
import { FilePullerService } from '../../services/file/filePuller.service'
import { ipcMain } from 'electron'
import { TransactionParserService } from '@/services/file/transactionParser.service'
import { GnuCashImportFile } from '@/models/GnuCashImportFile'

ipcMain.on('import-files', (event, file: GnuCashImportFile) => {
  console.log('Starting File Import...')
  container.get(FilePullerService).ImportFiles(file).then(resp => {
    event.reply('import-files-reply', resp)
  })
})

ipcMain.on('parse-files', (event, importFile: GnuCashImportFile) => {
  console.log('Starting File Parse...')
  container.get(TransactionParserService).GetTransactionsFromFile(importFile.FilePath, importFile.FileName, importFile.ImportType).then(transactions => {
    importFile.Transactions = transactions
    event.reply('parse-files-reply', importFile)
  })
})
