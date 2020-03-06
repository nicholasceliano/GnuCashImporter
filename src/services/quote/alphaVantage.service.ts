import { inject } from 'inversify'
import { ConfigurationService } from '../configuration.service'
import { environment } from '@/environments/environment'
import { SecurityRecord } from '@/models/quotePuller/SecurityRecord'
import http from 'http'

export class AlphaVantageService {
  private apiKey: string;
  private sleepTime: number;

  constructor(@inject(ConfigurationService) private configService: ConfigurationService) {
    this.apiKey = this.configService.ConfigData.AlphaVantageApiKey
    this.sleepTime = 60000 / 5
  }

  GetStockQuotes(tickerSymbols: string[]) {
    this.configService.ConfigData.AlphaVantageApiKey
    const quoteData: SecurityRecord[] = []

    tickerSymbols.forEach(async s => {
      const url = `${environment.alphaVantageAPIUrl}?function=GLOBAL_QUOTE&symbol=${s}&apikey=${this.apiKey}`

      await this.quoteRequest(url, 'Global Quote', '01. symbol', '05. price', '07. latest trading day').then(quote => {
        quoteData.push(quote)
      })
    })

    return quoteData
  }

  GetCommodityQuotes(tickerSymbols: string[]) {
    this.configService.ConfigData.AlphaVantageApiKey
    const quoteData: SecurityRecord[] = []

    tickerSymbols.forEach(async s => {
      const url = `${environment.alphaVantageAPIUrl}?function=CURRENCY_EXCHANGE_RATE&from_currency=${s}&to_currency=USD&apikey=${this.apiKey}`

      await this.quoteRequest(url, 'Realtime Currency Exchange Rate', '1. From_Currency Code', '5. Exchange Rate', '6. Last Refreshed').then(quote => {
        quoteData.push(quote)
      })
    })

    return quoteData
  }

  private quoteRequest(url: string, jsonHeader: string, symbolProp: string, priceProp: string, dateProp: string): Promise<SecurityRecord> {
    return new Promise((resolve) => {
      http.get(url, (res) => {
        res.on('data', (data) => {
          const jsonResp = JSON.parse(data)
          const quote = jsonResp[jsonHeader]

          setTimeout(() => {
            resolve({
              Symbol: quote[symbolProp],
              Price: parseFloat(quote[priceProp]),
              Date: new Date(quote[dateProp])
            } as SecurityRecord)
          }, this.sleepTime)
        })
      })
    })
  }
}
