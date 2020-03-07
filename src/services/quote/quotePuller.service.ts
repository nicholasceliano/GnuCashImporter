import { injectable, inject } from 'inversify'
import { AlphaVantageService } from './alphaVantage.service'
import { GnuCashDatabaseService } from '../gnucash/gnucashDatabase.service'

@injectable()
export class QuotePullerService {
  constructor(@inject(GnuCashDatabaseService) private gnuCashDatabaseService: GnuCashDatabaseService,
    @inject(AlphaVantageService) private alphaVantageService: AlphaVantageService) {
  }

  async RetrieveQuotes() {
    const stockValues = await this.gnuCashDatabaseService.GetAllStockValues()
    await this.alphaVantageService.GetQuotes(stockValues)
  }
}
