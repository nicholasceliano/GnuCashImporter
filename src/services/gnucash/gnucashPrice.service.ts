import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'
import { Fraction } from '../../models/Fraction'
import { injectable } from 'inversify'

@injectable()
export class GnuCashPriceService {
  SetTransactionValueFractions (transaction: GnuCashTransaction, rootSplit = true): GnuCashTransaction {
    const valueFraction = this.CalcSimplifiedFraction(rootSplit ? transaction.Amount : -transaction.Amount)

    transaction.ValueNum = valueFraction.Numerator
    transaction.ValueDenom = valueFraction.Denominator

    if (!rootSplit && transaction.IsStock && transaction.StockData && transaction.StockData.Quantity) {
      const quantityFraction = this.CalcSimplifiedFraction(transaction.StockData.Quantity)

      transaction.QuantityNum = quantityFraction.Numerator
      transaction.QuantityDenom = quantityFraction.Denominator
    } else {
      transaction.QuantityNum = valueFraction.Numerator
      transaction.QuantityDenom = valueFraction.Denominator
    }

    return transaction
  }

  CalcSimplifiedFraction (price: number, decimalLength = 4): Fraction {
    const priceStr = price.toFixed(decimalLength).toString()
    const num = this.calcFractionNum(priceStr)
    const denom = this.calcFractionDenom(priceStr)

    const simplifiedFrac = Number.prototype.reduce(num, denom)

    if (simplifiedFrac[1] < 0) {
      simplifiedFrac[0] = -simplifiedFrac[0]
      simplifiedFrac[1] = -simplifiedFrac[1]
    }

    return {
      Numerator: simplifiedFrac[0],
      Denominator: simplifiedFrac[1]
    } as Fraction
  }

  private calcFractionNum (price: string): number {
    price = price.replace('.', '')

    if (price.length >= 10) {
      price = price.substring(0, 10)
    } else {
      while (price.length < 10) {
        price = price + '0'
      }
    }

    return parseInt(price)
  }

  private calcFractionDenom (price: string): number {
    const decimalIndex = price.indexOf('.')
    let denom = '1'

    while (denom.length <= (10 - decimalIndex)) {
      denom = denom + '0'
    }

    return parseInt(denom)
  }
}
