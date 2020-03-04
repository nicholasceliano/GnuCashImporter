import 'reflect-metadata'
import { container } from '../../inversify.config'
import { FilePullerService } from '../../services/file/filePuller.service'
import { ipcMain } from 'electron'
import { TransactionParserService } from '@/services/file/transactionParser.service'
import { GnuCashImportFile } from '@/models/GnuCashImportFile'

ipcMain.on('import-files', (event, args: GnuCashImportFile) => {
  const filePullerService = container.get(FilePullerService)
  console.log('Starting File Import...')
  filePullerService.ImportFiles(args.FilePath, args.FileName, args.ImportType).then(resp => {
    event.reply('import-files-reply', resp)
  })
})

ipcMain.on('parse-files', (event, importFile: GnuCashImportFile) => {
  const transactionParserService = container.get(TransactionParserService)
  console.log('Starting File Parse...')
  transactionParserService.GetTransactionsFromFile(importFile.FilePath, importFile.FileName, importFile.ImportType).then(transactions => {
    importFile.Transactions = transactions
    event.reply('parse-files-reply', importFile)
  })
})
