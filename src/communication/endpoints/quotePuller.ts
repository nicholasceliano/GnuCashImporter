import { container } from '../../inversify.config'
import { ipcMain } from 'electron'
import { QuotePullerService } from '@/services/quote/quotePuller.service'

ipcMain.on('get-quotes', () => {
  console.log('Starting Retrieve Quotes...')
  container.get(QuotePullerService).RetrieveQuotes()
})
