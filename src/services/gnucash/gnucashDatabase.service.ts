import { GnuCashTransaction } from '../../models/GnuCashTransaction'
import { GnuCashImportMetaData } from '../../models/GnuCashImportMetaData'
import * as mysql from 'mysql'
import { v4 } from 'uuid'
import { environment } from '../../environments/environment'
import { GnuCashAccount } from '../../models/GnuCashAccount'
import { GnuCashPriceService } from './gnucashPrice.service'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'
import { GnuCashCurrency } from '@/models/GnuCashCurrency'

@injectable()
export class GnuCashDatabaseService {
  private mySql!: mysql.Connection;

  constructor(@inject(GnuCashPriceService) private gnuCashPrice: GnuCashPriceService,
    @inject(ConfigurationService) private configService: ConfigurationService) {
    this.mySql = mysql.createConnection({
      host: this.configService.ConfigData.GnuCashDbConn.Host,
      user: this.configService.ConfigData.GnuCashDbConn.User,
      password: this.configService.ConfigData.GnuCashDbConn.Password,
      database: this.configService.ConfigData.GnuCashDbConn.Database
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

  GetCurrencies(): Promise<GnuCashCurrency[]> {
    return new Promise((resolve, reject) => {
      const currencies: GnuCashCurrency[] = []

      this.mySql.query(`SELECT c.guid, namespace, mnemonic, fullname, a.guid as reconcileAccountGuid
        FROM commodities c
          JOIN accounts a ON c.guid = a.commodity_guid AND a.name LIKE 'Imbalance-%'
        WHERE namespace = "CURRENCY"`, (err, results) => {
        if (err) return reject(err)

        results.forEach((r: GnuCashCurrency) => {
          currencies.push(r)
        })

        resolve(currencies)
      })
    })
  }

  GetReconcileAccounts(): Promise<GnuCashAccount[]> {
    return new Promise((resolve, reject) => {
      const accounts: GnuCashAccount[] = []

      this.mySql.query(`SELECT
          guid, name, account_type, commodity_guid, parent_guid, hidden
        FROM accounts
        WHERE (account_type IN("EXPENSE", "INCOME") OR name like 'Imbalance-%') AND hidden = 0 AND placeholder = 0`, (err, results) => {
        if (err) return reject(err)

        results.forEach((r: GnuCashAccount) => {
          accounts.push(r)
        })

        resolve(accounts)
      })
    })
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
        FROM accounts
        WHERE guid='${accountId}' LIMIT 1`, (err, results) => {
        if (err) return reject(err)

        results.forEach((r: GnuCashAccount) => {
          account = r
        })

        resolve(account)
      })
    })
  }

  private insertTransactionSplit(transaction: GnuCashTransaction, rootSplit = true): void {
    this.mySql.query(`INSERT INTO splits VALUES (
      '${v4().removeDashes()}',
      '${transaction.TransactionGuid}',
      '${ rootSplit ? transaction.AccountGuid : transaction.ReconcileAccountGuid}',
      '',
      '',
      'n',
      '${new Date(0).toMySqlDateTimeString()}',
      '${transaction.ValueNum}',
      '${transaction.ValueDenom}',
      '${transaction.QuantityNum}',
      '${transaction.QuantityDenom}',
      null)`, (err) => {
      if (err) throw Error(err.stack)
    })
  }

  private insertImbalanceTransactionSplit(transaction: GnuCashTransaction): void {
    transaction = this.gnuCashPrice.SetTransactionValueFractions(transaction, false)

    this.insertTransactionSplit(transaction, false)
  }
}
