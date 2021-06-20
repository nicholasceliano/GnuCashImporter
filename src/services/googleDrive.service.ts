import { app } from 'electron'
import { ConfigurationService } from './configuration.service'
import { createReadStream, readFile } from 'fs'
import { injectable, inject } from 'inversify'
import { google } from 'googleapis'
import { environment } from '@/environments/environment'
import { OAuth2Client } from 'google-auth-library'

@injectable()
export class GoogleDriveService {
  private appDataPath: string;
  private folderPath: string;
  private TOKEN_PATH: string;
  private SCOPES = ['https://www.googleapis.com/auth/drive']

  constructor(@inject(ConfigurationService) private configService: ConfigurationService) {
    this.appDataPath = app.getPath('appData')
    this.folderPath = `${this.appDataPath}\\${environment.userConfigFolderName}`
    this.TOKEN_PATH = `${this.folderPath}\\${environment.googleDriveAuthFileName}`
  }

  UploadFile(fileLoc: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.Authorize(environment.googleDriveClientSecret).then(auth => {
        this.GetUploadFolderId(auth).then(folderId => {
          this.CreateFile(auth, folderId, fileLoc, 'application/sql').then(resp => resp.status === 200 ? resolve(resp.statusText) : reject(resp))
        })
      })
    })
  }

  private CreateFile(auth: OAuth2Client, uploadFolderId: string, fileLoc: string, fileType: string) {
    const drive = google.drive({ version: 'v3', auth })

    const fileMetadata = {
      name: fileLoc.replace(/^.*[\\\/]/, ''), // eslint-disable-line
      mimeType: fileType,
      parents: [uploadFolderId]
    }

    const media = {
      mimeType: fileType,
      body: createReadStream(fileLoc)
    }

    return drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    })
  }

  private GetUploadFolderId(auth: OAuth2Client): Promise<string> {
    return new Promise((resolve, reject) => {
      const drive = google.drive({ version: 'v3', auth })

      drive.files.list({ q: `mimeType='application/vnd.google-apps.folder' and name='${environment.googleDriveFolder}'` }).then(resp => {
        resp.data.files && resp.data.files.length === 1 && resp.data.files[0].id ? resolve(resp.data.files[0].id) : reject(resp)
      })
    })
  }

  private Authorize(credentials: any): Promise<OAuth2Client> {
    return new Promise((resolve, reject) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed // eslint-disable-line
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]) // eslint-disable-line

      // Check if we have previously stored a token.
      readFile(this.TOKEN_PATH, (err, token) => {
        if (err) return this.GetAccessToken(oAuth2Client)
        oAuth2Client.setCredentials(JSON.parse(token.toString()))
        resolve(oAuth2Client)
      })
    })
  }

  private GetAccessToken(oAuth2Client: OAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: this.SCOPES }) // eslint-disable-line
    console.log('Authorize this app by visiting this url:', authUrl)

    // un-comment and put 'code' here on first auth

    // oAuth2Client.getToken('code', (err, token) => {
    //   if (err) return console.error('Error retrieving access token', err);
    //   if (token){
    //     oAuth2Client.setCredentials(token);
    //     // Store the token to disk for later program executions
    //     writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
    //       if (err) return console.error(err);
    //       console.log('Token stored to', this.TOKEN_PATH);
    //     });
    //   }
    // });
  }
}
