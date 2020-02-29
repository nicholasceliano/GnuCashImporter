import { GnuCashTransaction } from '../../models/GnuCashTransaction'
import { GnuCashImportMetaData } from '../../models/GnuCashImportMetaData'
import * as mysql from 'mysql'
import { v4 } from 'uuid'
import { environment } from '../../environments/environment'
import { GnuCashAccount } from '../../models/GnuCashAccount'
import { GnuCashPriceService } from './gnucashPrice.service'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'

@injectable()
export class GnuCashDatabaseService {
  private mySql!: mysql.Connection;

  constructor(@inject(GnuCashPriceService) private gnuCashPrice: GnuCashPriceService,
    @inject(ConfigurationService) private configService: ConfigurationService) {
    this.configService.GetConfigData().then(configData => {
      this.mySql = mysql.createConnection({
        host: configData.GnuCashDbConn.Host,
        user: configData.GnuCashDbConn.User,
        password: configData.GnuCashDbConn.Password,
        database: configData.GnuCashDbConn.Database
      })
    })
  }

  InsertTransactions(transactions: GnuCashTransaction[]): GnuCashImportMetaData | void {
    // Fix ValueNum/Denom and QuantityNum/Denom for Investments
    // build in lookup to find matching descriptions from past transactions and split to same account

    if (transactions.length > 0) {
      const importMetaData: GnuCashImportMetaData = {
        EarliestRecordDate: transactions.sort((a, b) => a.PostDate.getTime() - b.PostDate.getTime())[0].PostDate,
        LatestRecordDate: transactions.sort((a, b) => b.PostDate.getTime() - a.PostDate.getTime())[0].PostDate
      }

      transactions.forEach(t => {
        this.getAccountByGuid(t.AccountGuid).then(x => {
          t.TransactionGuid = v4().removeDashes()
          t = this.gnuCashPrice.SetTransactionValueFractions(t)

          this.insertTransaction(t)
          this.insertTransactionSplit(t)
          this.insertImbalanceTransactionSplit(t)

          console.log(`Inserted Transaction: ${x.name} - ${t.Description}`)
        })
      })

      return importMetaData
    }
  }

  private insertTransaction(transaction: GnuCashTransaction): void {
    this.mySql.query(`INSERT INTO transactions VALUES (
      '${transaction.TransactionGuid}',
      '${transaction.CurrencyGuid}',
      '',
      '${transaction.PostDate.toMySqlDateTimeString()}',
      '${transaction.CreateDate.toMySqlDateTimeString()}',
      '${transaction.Description}')`, (err) => {
      if (err) throw Error(err.stack)
    })
  }

  private getAccountByGuid(accountId: string): Promise<GnuCashAccount> {
    return new Promise((resolve, reject) => {
      let account: GnuCashAccount

      this.mySql.query(`SELECT
        guid, name, account_type, commodity_guid, parent_guid, hidden
        FROM accounts WHERE guid='${accountId}' LIMIT 1`, (err, results) => {
        if (err) return reject(err)

        results.forEach((r: GnuCashAccount) => {
          account = r
        })

        resolve(account)
      })
    })
  }

  private insertTransactionSplit(transaction: GnuCashTransaction): void {
    this.mySql.query(`INSERT INTO splits VALUES (
      '${v4().removeDashes()}',
      '${transaction.TransactionGuid}',
      '${transaction.AccountGuid}',
      '',
      '',
      'n',
      '${transaction.CreateDate.toMySqlDateTimeString()}',
      '${transaction.ValueNum}',
      '${transaction.ValueDenom}',
      '${transaction.QuantityNum}',
      '${transaction.QuantityDenom}',
      null)`, (err) => {
      if (err) throw Error(err.stack)
    })
  }

  private insertImbalanceTransactionSplit(transaction: GnuCashTransaction): void {
    this.getAccountByGuid(environment.gnuCashAccountGuid.imbalance).then(x => {
      transaction.TransactionGuid = v4().removeDashes()
      transaction.AccountGuid = environment.gnuCashAccountGuid.imbalance
      transaction.CurrencyGuid = x.commodity_guid
      transaction = this.gnuCashPrice.SetTransactionValueFractions(transaction)

      this.insertTransactionSplit(transaction)
    })
  }
}
