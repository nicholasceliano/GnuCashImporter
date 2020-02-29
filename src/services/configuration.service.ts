import { injectable } from 'inversify'
import { app } from 'electron'
import { existsSync, mkdirSync, writeFile, readFile } from 'fs'
import { ConfigurationData } from '@/models/ConfigurationData'
import { environment } from '@/environments/environment'

@injectable()
export class ConfigurationService {
  private appDataPath: string;
  private folderPath: string;
  private filePath: string;

  constructor() {
    this.appDataPath = app.getPath('appData')
    this.folderPath = `${this.appDataPath}\\${environment.userConfigFolderName}`
    this.filePath = `${this.folderPath}\\${environment.userConfigFileName}`
  }

  GetConfigData(): Promise<ConfigurationData> {
    return new Promise((resolve) => {
      if (existsSync(this.appDataPath) && existsSync(this.filePath)) {
        readFile(this.filePath, (err, configData) => {
          if (err) throw err
          const configDataObj = JSON.parse(configData.toString())

          resolve(configDataObj)
        })
      } else {
        resolve({
          GnuCashDbConn: { Host: '', Database: '', User: '', Password: '' }, AlphaVantageApiKey: ''
        })
      }
    })
  }

  SaveConfigData(configData: ConfigurationData) {
    if (!existsSync(this.folderPath)) {
      mkdirSync(this.folderPath)
    }

    writeFile(this.filePath, JSON.stringify(configData), (err) => {
      if (err) throw err
      console.log('Config file has been saved')
    })
  }
}
