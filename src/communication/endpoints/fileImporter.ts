import { container } from '../../inversify.config'
import { FileImportService } from '../../services/file/fileImport.service'
import { ipcMain } from 'electron'
import { TransactionParserService } from '../../services/file/transactionParser.service'
import { GnuCashImportFile } from '../../models/gnuCash/GnuCashImportFile'
import { SelectOption } from '../../models/utility/SelectOption'

ipcMain.on('import-files', (event, file: GnuCashImportFile) => {
  console.log('Starting File Import...')
  container.get(FileImportService).ImportFiles(file).then(resp => {
    event.reply('import-files-reply', resp)
  })
})

ipcMain.on('parse-files', (event, importFile: GnuCashImportFile) => {
  console.log('Starting File Parse...')
  container.get(TransactionParserService).GetTransactionsFromFile(importFile.FilePath, importFile.FileName, importFile.ImportType, importFile.ImportAccount).then(transactions => {
    importFile.Transactions = transactions
    event.reply('parse-files-reply', importFile)
  })
})

ipcMain.on('get-file-import-options', (event) => {
  const importOptions = container.get(TransactionParserService).GetImportsInsitutions().map(x => ({ Id: x.Id, Name: x.Name } as SelectOption))
  event.reply('get-file-import-options-reply', importOptions)
})
