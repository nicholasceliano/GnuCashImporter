import { container } from '../../inversify.config'
import { ipcMain } from 'electron'
import { QuotePullerService } from '@/services/quote/quotePuller.service'

ipcMain.on('get-quotes', (event) => {
  console.log('Starting Retrieve Quotes...')
  container.get(QuotePullerService).RetrieveQuotes().then(() => {
    event.reply('get-quotes-reply')
  })
})
