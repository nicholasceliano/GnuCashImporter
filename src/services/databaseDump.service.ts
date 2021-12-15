import { ConfigurationService } from './configuration.service'
import { injectable, inject } from 'inversify'
import { exec } from 'child_process'
import { environment } from '../environments/environment'

@injectable()
export class DatabaseDumpService {
  constructor(@inject(ConfigurationService) private configService: ConfigurationService) { }

  async DumpMySQLDatabase(): Promise<string> {
    const u = this.configService.ConfigData.GnuCashDbConn.User
    const pw = this.configService.ConfigData.GnuCashDbConn.Password
    const db = this.configService.ConfigData.GnuCashDbConn.Database
    const path = `${environment.fileUploadDirectory}/${db}_${new Date().toISOString().replace(/:/g, '')}.sql`
    const sshConnection = this.configService.ConfigData.SshConnection;
    let mysqlDumpCmd = `mysqldump -u ${u} -p${pw} ${db}`;

    if (sshConnection) {
      mysqlDumpCmd = `ssh ${sshConnection} "${mysqlDumpCmd}"`
    }

    const cmd = `${mysqlDumpCmd} > ${path} --no-tablespaces`

    return new Promise((resolve, reject) => {
      exec(cmd, (err) => {
        err ? reject(err) : resolve(path)
      })
    })
  }
}
