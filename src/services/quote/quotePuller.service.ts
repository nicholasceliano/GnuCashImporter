import { injectable, inject } from 'inversify'
import { AlphaVantageService } from './alphaVantage.service'
import { GnuCashDatabaseService } from '../gnucash/gnucashDatabase.service'
import { SecurityRecord } from '@/models/quotePuller/SecurityRecord'
import { GnuCashStockValue } from '@/models/gnuCash/GnuCashStockValue'
import { GnuCashPrice } from '@/models/gnuCash/GnuCashPrice'
import { GnuCashPriceService } from '../gnucash/gnucashPrice.service'
import { ConfigurationService } from '../configuration.service'

@injectable()
export class QuotePullerService {
  constructor(@inject(GnuCashDatabaseService) private gnuCashDatabaseService: GnuCashDatabaseService,
    @inject(AlphaVantageService) private alphaVantageService: AlphaVantageService,
    @inject(GnuCashPriceService) private gnuCashPriceService: GnuCashPriceService,
    @inject(ConfigurationService) private configService: ConfigurationService) {
  }

  private stockList: string[] = []
  private commodityList: string[] = []

  async RetrieveQuotes() {
    this.stockList = []
    this.commodityList = []

    const stockValues = await this.getTickerSymbolsFromGnuCash()
    const quoteData = await this.getQuoteDataFromAPI()
    this.insertQuotesIntoGnuCash(stockValues, quoteData)
  }

  private getTickerSymbolsFromGnuCash(): Promise<GnuCashStockValue[]> {
    return new Promise((resolve) => {
      this.gnuCashDatabaseService.GetAllStockValues().then(stockValues => {
        stockValues.forEach(s => {
          if (s.isCommodity === 1) {
            this.stockList.push(s.stockName)
          } else if (s.isCommodity === 0) {
            this.commodityList.push(s.stockName)
          }
        })

        resolve(stockValues)
      })
    })
  }

  private getQuoteDataFromAPI(): Promise<SecurityRecord[]> {
    return new Promise((resolve) => {
      const quoteData = this.alphaVantageService.GetStockQuotes(this.stockList)
      quoteData.concat(this.alphaVantageService.GetCommodityQuotes(this.commodityList))

      resolve(quoteData)
    })
  }

  private insertQuotesIntoGnuCash(stockValues: GnuCashStockValue[], quoteData: SecurityRecord[]) {
    quoteData.forEach(q => {
      const commodityGuid = stockValues.filter(x => x.stockName === q.Symbol)[0].commoditiy_guid
      const price = this.gnuCashPriceService.CalcValueFraction(q.Price)

      /* eslint-disable @typescript-eslint/camelcase */
      this.gnuCashDatabaseService.InsertPriceRecord({
        commodity_guid: commodityGuid,
        currency_guid: this.configService.ConfigData.GnuCashDefaults.CurrencyGUID,
        date: q.Date,
        source: 'user:price-editor',
        type: 'last',
        value_num: price.Numerator,
        value_denom: price.Denominator
      } as GnuCashPrice).then(response => {
        console.log(response)
      })
    })
  }
}
