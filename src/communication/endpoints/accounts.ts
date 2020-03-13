import { ipcMain } from 'electron'
import { container } from '@/inversify.config'

ipcMain.on('add-account', (event) => {
  console.log('added account')
})

ipcMain.on('get-accounts', (event) => {
  console.log('requested account list from api')
  const resp = ['str1', 'str2', 'str3', 'str4']
  event.reply('get-accounts-reply', resp)
})