import { ipcMain } from 'electron'
import { ConfigurationData } from '@/models/ConfigurationData'
import { ConfigurationService } from '@/services/configuration.service'
import { container } from '@/inversify.config'

ipcMain.on('get-config', (event) => {
  container.get(ConfigurationService).GetConfigData().then(configData => {
    event.reply('get-config-reply', configData)
  })
})

ipcMain.on('save-config', (event, configData: ConfigurationData) => {
  container.get(ConfigurationService).SaveConfigData(configData).then(configData => {
    event.reply('save-config-reply', configData)
  })
})
