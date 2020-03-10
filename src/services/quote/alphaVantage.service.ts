import { inject, injectable } from 'inversify'
import { ConfigurationService } from '../configuration.service'
import { environment } from '../../environments/environment'
import { SecurityRecord } from '@/models/quotePuller/SecurityRecord'
import https from 'https'
import { UtilityService } from '../utility.service'
import { GnuCashStockValue } from '@/models/gnuCash/GnuCashStockValue'
import { GnuCashPriceService } from '../gnucash/gnucashPrice.service'
import { GnuCashPrice } from '@/models/gnuCash/GnuCashPrice'
import { GnuCashDatabaseService } from '../gnucash/gnucashDatabase.service'
import { win } from '../../background'
import { AlphaVantageJSONProperties } from '@/models/AlphaVantageJSONProperties'
import { GlobalConstants } from '../../globalConstants'
import { AVQuoteImportResponse } from '@/models/AVQuoteImportResponse'

@injectable()
export class AlphaVantageService {
  private apiKey: string;
  private sleepTime: number;

  constructor(@inject(ConfigurationService) private configService: ConfigurationService,
    @inject(GnuCashPriceService) private gnuCashPriceService: GnuCashPriceService,
    @inject(GnuCashDatabaseService) private gnuCashDatabaseService: GnuCashDatabaseService,
    @inject(UtilityService) private utilityService: UtilityService) {
    this.apiKey = this.configService.ConfigData.AlphaVantageApiKey
    this.sleepTime = 60000 / 5 // 5 is limit per min for AV free account
  }

  public async GetQuotes(stockValues: GnuCashStockValue[]) {
    this.sendQuoteImportResponse(true, `Starting Quote Import - ${stockValues.length} Records | ${this.sleepTime / 1000} second Interval`)
    this.configService.ConfigData.AlphaVantageApiKey
    let loopCt = 0

    for await (const s of stockValues) {
      const isCommodity = s.isCommodity === 1
      const jsonProps = isCommodity ? GlobalConstants.COMMODITY_PROPS : GlobalConstants.STOCK_PROPS
      const urlBody = isCommodity ? `CURRENCY_EXCHANGE_RATE&from_currency=${s.stockName}&to_currency=USD` : `GLOBAL_QUOTE&symbol=${s.stockName}`
      const url = `${environment.alphaVantageAPIUrl}?function=${urlBody}&apikey=${this.apiKey}`
      loopCt++

      await this.quoteRequest(url, jsonProps).then(async quote => {
        await this.insertQuotesIntoGnuCash(stockValues, quote, loopCt)
      }, async (err) => this.sendQuoteImportResponse(false, `Failed Insert - ${s.stockName} - ${err}`))

      if (loopCt < stockValues.length) {
        await this.utilityService.Sleep(this.sleepTime)
      }
    }
  }

  private quoteRequest(url: string, jsonProps: AlphaVantageJSONProperties): Promise<SecurityRecord> {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        res.on('data', (data) => {
          const jsonResp = JSON.parse(data)
          try {
            const quote = jsonResp[jsonProps.Header]

            resolve({
              Symbol: quote[jsonProps.SymbolProp],
              Price: parseFloat(quote[jsonProps.PriceProp]),
              Date: new Date(quote[jsonProps.DateProp])
            } as SecurityRecord)
          } catch {
            reject(data)
          }
        })
      })
    })
  }

  private async insertQuotesIntoGnuCash(stockValues: GnuCashStockValue[], quote: SecurityRecord, loopIndex: number) {
    const quoteInfo = `${quote.Symbol}: ${quote.Price.toDollars()} ${quote.Date.toMySqlDateTimeString()}`
    const commodityGuid = stockValues.filter(x => x.stockName === quote.Symbol)[0].commodity_guid
    const price = this.gnuCashPriceService.CalcSimplifiedFraction(quote.Price)

    /* eslint-disable @typescript-eslint/camelcase */
    await this.gnuCashDatabaseService.InsertPriceRecord({
      commodity_guid: commodityGuid,
      currency_guid: this.configService.ConfigData.GnuCashDefaults.CurrencyGUID,
      date: quote.Date,
      source: 'user:price-editor',
      type: 'last',
      value_num: price.Numerator,
      value_denom: price.Denominator
    } as GnuCashPrice).then(
      () => this.sendQuoteImportResponse(true, `Sucessful Insert(${loopIndex}/${stockValues.length}) - ${quoteInfo}`),
      () => this.sendQuoteImportResponse(false, `Failed Insert - ${quoteInfo}`)
    )
  }

  private sendQuoteImportResponse(success: boolean, msg: string) {
    if (win) {
      win.webContents.send('quote-import-response', {
        Success: success,
        Msg: msg
      } as AVQuoteImportResponse)
    }
  }
}
