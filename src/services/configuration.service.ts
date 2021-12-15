import { injectable } from 'inversify'
import { app } from 'electron'
import { existsSync, mkdirSync, writeFile, readFile } from 'fs'
import { ConfigurationData } from '@/models/ConfigurationData'
import { environment } from '../environments/environment'

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

  public ConfigData: ConfigurationData = {
    GnuCashDbConn: { Host: '', Database: '', User: '', Password: '' },
    GnuCashDefaults: { CurrencyGUID: '', ReconcileAccountGUID: '' },
    LocalDbBackup: { Enable: false, LocalPath: '' },
    AlphaVantageApiKey: '', SshConnection: ''
  };

  GetConfigData(): Promise<ConfigurationData> {
    return new Promise((resolve) => {
      if (existsSync(this.appDataPath) && existsSync(this.filePath)) {
        readFile(this.filePath, (err, configData) => {
          if (err) throw err
          const configDataObj: ConfigurationData = JSON.parse(configData.toString())

          this.ConfigData = configDataObj
          resolve(this.ConfigData)
        })
      } else {
        resolve(this.ConfigData)
      }
    })
  }

  SaveConfigData(configData: ConfigurationData) {
    return new Promise((resolve) => {
      if (!existsSync(this.folderPath)) {
        mkdirSync(this.folderPath)
      }

      writeFile(this.filePath, JSON.stringify(configData), (err) => {
        if (err) throw err
        console.log('Config file has been saved')
        this.ConfigData = configData
        resolve(this.ConfigData)
      })
    })
  }
}
