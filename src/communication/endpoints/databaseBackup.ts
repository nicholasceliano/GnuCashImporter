import { DatabaseDumpService } from '@/services/databaseDump.service'
import { GoogleDriveService } from '@/services/googleDrive.service'
import { ipcMain } from 'electron'
import { container } from '../../inversify.config'

ipcMain.on('database-backup', (event) => {
  console.log('server received request to database-backup')

  container.get(DatabaseDumpService).DumpMySQLDatabase().then((fileLoc) => {
    event.reply('database-dump-reply', 'MySQL Database dump Successful')

    container.get(GoogleDriveService).UploadFile(fileLoc).then(() => {
      event.reply('database-store-reply', 'Database upload to Google Drive Successful')
    }).catch((err) => {
      event.reply('database-store-reply', 'Database upload to Google Drive Failed')
      console.log(`Error: ${err}`)
    })
  }).catch((err) => {
    event.reply('database-dump-reply', 'MySQL Database dump Failed')
    console.log(`Error: ${err}`)
  })
})
