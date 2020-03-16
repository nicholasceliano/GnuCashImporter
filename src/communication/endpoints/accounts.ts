import { ipcMain } from 'electron'
import { container } from '../../inversify.config'
import { GoldCashDatabaseService } from '../../services/goldCash/goldCashDatabase.service'

ipcMain.on('add-account', (event) => {
  console.log('server received request to add account')
})

ipcMain.on('get-accounts', (event) => {
  container.get(GoldCashDatabaseService).GetAccounts().then(accounts => {
    event.reply('get-accounts-reply', accounts)
  }, (err) => {
    console.log(err)
  })
})