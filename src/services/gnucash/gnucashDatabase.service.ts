import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { GnuCashImportMetaData } from '../../models/gnuCash/GnuCashImportMetaData'
import mysql from 'mysql'
import { v4 } from 'uuid'
import { GnuCashAccount } from '../../models/gnuCash/GnuCashAccount'
import { GnuCashPriceService } from './gnucashPrice.service'
import { injectable, inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'
import { GnuCashCurrency } from '@/models/gnuCash/GnuCashCurrency'
import { GnuCashStockValue } from '@/models/gnuCash/GnuCashStockValue'
import { GnuCashPrice } from '@/models/gnuCash/GnuCashPrice'

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
    // build in lookup to find matching descriptions from past transactions and split to same account

    if (transactions.length > 0) {
      const importMetaData: GnuCashImportMetaData = {
        EarliestRecordDate: transactions.sort((a, b) => a.PostDate.getTime() - b.PostDate.getTime())[0].PostDate,
        LatestRecordDate: transactions.sort((a, b) => b.PostDate.getTime() - a.PostDate.getTime())[0].PostDate
      }

      transactions.forEach(t => {
        t.TransactionGuid = v4().removeDashes()
        t = this.gnuCashPrice.SetTransactionValueFractions(t)

        this.insertTransaction(t)
        this.insertTransactionSplit(t)
        this.insertImbalanceTransactionSplit(t)

        console.log(`Inserted Transaction: ${t.ReconcileAccount.name} - ${t.Description}`)
      })

      return importMetaData
    }
  }

  InsertPriceRecord(price: GnuCashPrice): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mySql.query(`CALL insertPrice('${v4().removeDashes()}', '${price.commodity_guid}', '${price.currency_guid}',
        '${price.date.toMySqlDateTimeString()}', '${price.source}', '${price.type}', ${price.value_num}, ${price.value_denom})`, (err) => {
        if (err) return reject(err)

        resolve()
      })
    })
  }

  GetCurrencies(): Promise<GnuCashCurrency[]> {
    return new Promise((resolve, reject) => {
      const currencies: GnuCashCurrency[] = []

      this.mySql.query(`SELECT c.guid, namespace, mnemonic, fullname, a.guid as reconcileAccountGuid
        FROM commodities c
          JOIN accounts a ON c.guid = a.commodity_guid AND a.name LIKE 'Imbalance-%'
        WHERE namespace = "CURRENCY"
        ORDER BY fullname`, (err, results) => {
        if (err) return reject(err)

        currencies.push(...results)

        resolve(currencies)
      })
    })
  }

  GetImportAccounts(): Promise<GnuCashAccount[]> {
    return new Promise((resolve, reject) => {
      const accounts: GnuCashAccount[] = []

      this.mySql.query(`SELECT
          guid, name, account_type, commodity_guid, parent_guid, hidden, placeholder
        FROM accounts
        WHERE account_type IN("ASSET", "BANK", "CREDIT") AND name NOT LIKE 'Imbalance-%' AND hidden = 0 AND placeholder = 0
        ORDER BY name`, (err, results) => {
        if (err) return reject(err)

        accounts.push(...results)

        resolve(accounts)
      })
    })
  }

  GetReconcileAccounts(): Promise<GnuCashAccount[]> {
    return new Promise((resolve, reject) => {
      const accounts: GnuCashAccount[] = []

      this.mySql.query(`SELECT
          guid, name, account_type, commodity_guid, parent_guid, hidden, placeholder
        FROM accounts
        WHERE (account_type IN("EXPENSE", "INCOME") OR name like 'Imbalance-%') AND hidden = 0 AND placeholder = 0
        ORDER BY name`, (err, results) => {
        if (err) return reject(err)

        accounts.push(...results)

        resolve(accounts)
      })
    })
  }

  GetStockReconcileAccounts(): Promise<GnuCashAccount[]> {
    return new Promise((resolve, reject) => {
      const accounts: GnuCashAccount[] = []

      this.getAccounts().then(accountList => {
        this.mySql.query(`SELECT
            guid, name, account_type, commodity_guid, parent_guid, hidden, placeholder
          FROM accounts
          WHERE (account_type IN("STOCK") OR name like 'Imbalance-%') AND hidden = 0 AND placeholder = 0
          ORDER BY name`, (err, results) => {
          if (err) return reject(err)

          results.forEach((r: GnuCashAccount) => {
            r.name = this.setReconcileAccountName(r.guid, accountList, []).join(':')
            accounts.push(r)
          })

          resolve(accounts)
        })
      })
    })
  }

  GetAllStockValues(): Promise<GnuCashStockValue[]> {
    return new Promise((resolve, reject) => {
      const stockValues: GnuCashStockValue[] = []

      this.mySql.query('CALL getAllStockValues()', (err, results) => {
        if (err) return reject(err)

        stockValues.push(...results[0])

        resolve(stockValues)
      })
    })
  }

  GetAccountByGuid(accountId: string): Promise<GnuCashAccount> {
    return new Promise((resolve, reject) => {
      let account: GnuCashAccount

      this.mySql.query(`SELECT
        guid, name, account_type, commodity_guid, parent_guid, hidden, placeholder
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

  private getAccounts(): Promise<GnuCashAccount[]> {
    return new Promise((resolve, reject) => {
      const accounts: GnuCashAccount[] = []

      this.mySql.query(`SELECT
          guid, name, account_type, commodity_guid, parent_guid, hidden, placeholder
        FROM accounts
        WHERE hidden = 0
        ORDER BY name`, (err, results) => {
        if (err) return reject(err)

        accounts.push(...results)

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

  private insertTransactionSplit(transaction: GnuCashTransaction, rootSplit = true): void {
    this.mySql.query(`INSERT INTO splits VALUES (
      '${v4().removeDashes()}',
      '${transaction.TransactionGuid}',
      '${rootSplit ? transaction.AccountGuid : transaction.ReconcileAccount.guid}',
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

    if (transaction.IsStock) {
      this.insertStockImbalanceTransactionStockPrice(transaction)
    }
  }

  private insertStockImbalanceTransactionStockPrice(transaction: GnuCashTransaction): void {
    if (transaction.StockData && transaction.StockData.Quantity) {
      const quotePrice = transaction.Amount / transaction.StockData.Quantity
      const price = this.gnuCashPrice.CalcSimplifiedFraction(-quotePrice, 6)

      /* eslint-disable @typescript-eslint/camelcase */
      this.InsertPriceRecord({
        commodity_guid: transaction.ReconcileAccount.commodity_guid,
        currency_guid: this.configService.ConfigData.GnuCashDefaults.CurrencyGUID,
        date: transaction.PostDate,
        source: 'Finance::Quote',
        type: 'last',
        value_num: price.Numerator,
        value_denom: price.Denominator
      } as GnuCashPrice)
    }
  }

  private setReconcileAccountName(parentGuid: string, accounts: GnuCashAccount[], retStr: string[]) {
    const account = accounts.filter(x => x.guid === parentGuid)[0]

    if (account) {
      if (account.parent_guid && !account.placeholder) {
        retStr.push(account.name)
      }
      retStr = this.setReconcileAccountName(account.parent_guid, accounts, retStr)
    }

    return retStr
  }
}
