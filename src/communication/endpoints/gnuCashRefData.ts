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

ipcMain.on('get-reconcile-accounts', (event) => {
  container.get(GnuCashDatabaseService).GetReconcileAccounts().then(accounts => {
    event.reply('get-reconcile-accounts-reply', accounts)
  }, (err) => {
    console.log(err)
  })
})

ipcMain.on('get-stock-reconcile-accounts', (event) => {
  container.get(GnuCashDatabaseService).GetStockReconcileAccounts().then(accounts => {
    event.reply('get-stock-reconcile-accounts-reply', accounts)
  }, (err) => {
    console.log(err)
  })
})

ipcMain.on('get-import-accounts', (event) => {
  container.get(GnuCashDatabaseService).GetImportAccounts().then(accounts => {
    event.reply('get-import-accounts-reply', accounts)
  }, (err) => {
    console.log(err)
  })
})
