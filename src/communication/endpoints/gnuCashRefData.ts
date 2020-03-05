import { ipcMain } from 'electron'
import { container } from '@/inversify.config'
import { GnuCashDatabaseService } from '@/services/gnucash/gnucashDatabase.service'

ipcMain.on('get-currencies', (event) => {
  container.get(GnuCashDatabaseService).GetCurrencies().then(currencies => {
    event.reply('get-currencies-reply', currencies)
  }, (err) => {
    console.log(err)
  })
})
