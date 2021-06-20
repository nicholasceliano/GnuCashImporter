import { container } from '@/inversify.config'
import { GoldCashAccount } from '@/models/goldCash/GoldCashAccount'
import { ipcMain } from 'electron'
import { GoldCashDatabaseService } from '../../services/goldCash/goldCashDatabase.service'

ipcMain.on('add-account', (event, account: GoldCashAccount) => {
  console.log('server received request to add an account')
  console.log(account.guid)
  container.get(GoldCashDatabaseService).InsertAccount(account).then(
    event.reply('add-account-reply')
  )
})

ipcMain.on('get-accounts', (event) => {
  console.log('server received request to list accounts')
  container.get(GoldCashDatabaseService).GetAccounts().then(accounts => {
    event.reply('get-accounts-reply', accounts)
  }, (err) => {
    console.log(err)
  })
})