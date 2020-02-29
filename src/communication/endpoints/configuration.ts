import { ipcMain } from 'electron'
import { ConfigurationData } from '@/models/ConfigurationData'
import { ConfigurationService } from '@/services/configuration.service'

ipcMain.on('get-config', (event) => {
  new ConfigurationService().GetConfigData().then(configData => {
    event.reply('get-config-reply', configData)
  })
})

ipcMain.on('save-config', (event, configData: ConfigurationData) => {
  new ConfigurationService().SaveConfigData(configData)
})
