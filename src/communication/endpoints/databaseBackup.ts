import { ConfigurationService } from '@/services/configuration.service'
import { DatabaseDumpService } from '@/services/databaseDump.service'
import { FileUtilityService } from '@/services/file/fileUtility.service'
import { GoogleDriveService } from '@/services/googleDrive.service'
import { ipcMain } from 'electron'
import { container } from '../../inversify.config'

ipcMain.on('database-backup', (event) => {
  const configService = container.get(ConfigurationService)
  const databaseDumpService = container.get(DatabaseDumpService)
  console.log('server received request to database-backup')

  databaseDumpService.DumpMySQLDatabase().then((fileLoc) => {
    event.reply('database-dump-reply', 'MySQL Database dump Successful')

    if (configService.ConfigData.LocalDbBackup.Enable) {
      const fileUtilityService = container.get(FileUtilityService)
      const fileLocation = fileUtilityService.MoveFile(fileLoc, configService.ConfigData.LocalDbBackup.LocalPath);
      event.reply('database-store-reply', `Database backup successfully moved to ${fileLocation}`)
    } else {
      const googleDriveService = container.get(GoogleDriveService)
      googleDriveService.UploadFile(fileLoc).then(() => {
        event.reply('database-store-reply', 'Database upload to Google Drive Successful')
      }).catch((err) => {
        event.reply('database-store-reply', 'Database upload to Google Drive Failed')
        console.log(`Error: ${err}`)
      })
    }
  }).catch((err) => {
    event.reply('database-dump-reply', 'MySQL Database dump Failed')
    console.log(`Error: ${err}`)
  })
})
