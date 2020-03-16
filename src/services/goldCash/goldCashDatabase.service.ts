import mysql from 'mysql'
import { v4 } from 'uuid'
import { GoldCashAccount } from '../../models/goldCash/goldCashAccount'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'

@injectable()
export class GoldCashDatabaseService {
  private mySql!: mysql.Connection;

  constructor(@inject(ConfigurationService) private configService: ConfigurationService) {
    this.mySql = mysql.createConnection({
      host: this.configService.ConfigData.GnuCashDbConn.Host,
      user: this.configService.ConfigData.GnuCashDbConn.User,
      password: this.configService.ConfigData.GnuCashDbConn.Password,
      database: this.configService.ConfigData.GnuCashDbConn.Database
    })
  }

  InsertAccount(account: GoldCashAccount){
    account.guid = v4().removeDashes()
    this.mySql.query(`INSERT INTO accounts VALUES (
      '${account.guid}',
      '${account.name}',
      '${account.owner}')`, (err) => {
      if (err) throw Error(err.stack)
    })
    return Promise.resolve()
  }

  GetAccounts(): Promise<GoldCashAccount[]> {
    return new Promise((resolve, reject) => {
      const accounts: GoldCashAccount[] = []
      this.mySql.query(`SELECT
          guid, name, owner
        FROM accounts
        ORDER BY name`, (err, results) => {
        if (err) return reject(err)
        accounts.push(...results)
        resolve(accounts)
      })
    })
  }

}
