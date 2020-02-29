import 'reflect-metadata'
import { container } from '../../inversify.config'
import { FilePullerService } from '../../services/file/filePuller.service'
import { ipcMain } from 'electron'

ipcMain.on('import-files', () => {
  const filePullerService = container.get(FilePullerService)
  console.log('Starting File Import...')
  filePullerService.ImportFilesFromDirectory()
})
