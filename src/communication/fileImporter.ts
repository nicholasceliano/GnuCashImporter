import 'reflect-metadata'
import { container } from '../inversify.config'
import { FilePullerService } from '../services/file/filePuller.service'
import { ipcMain } from 'electron'

ipcMain.on('import-files', (event, arg) => {
  const filePullerService = container.get(FilePullerService)
  console.log('Starting...')
  filePullerService.ImportFilesFromDirectory()
});
