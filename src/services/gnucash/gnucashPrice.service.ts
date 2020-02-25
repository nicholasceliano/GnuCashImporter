import { GnuCashTransaction } from '../../models/GnuCashTransaction';
import { Fraction } from '../../models/Fraction';
import { injectable } from 'inversify';

@injectable()
export class GnuCashPriceService {
	SetTransactionValueFractions(transaction: GnuCashTransaction, initialSplit = true): GnuCashTransaction {
		const valueFraction = this.calcValueFraction(initialSplit ? transaction.Amount : -transaction.Amount);

		transaction.ValueNum = valueFraction.Numerator;
		transaction.ValueDenom = valueFraction.Denominator;
		transaction.QuantityNum = valueFraction.Numerator;
		transaction.QuantityDenom = valueFraction.Denominator;

		return transaction;
	}

	private calcValueFraction(price: number): Fraction {
		const num = this.calcValueNum(price.toString());
		const demon = this.calcValueDenom(price.toString());

		const simplifiedFrac = Number.prototype.reduce(num, demon);

		return {
			Numerator: simplifiedFrac[0],
			Denominator: simplifiedFrac[1]
		} as Fraction;
	}

	private calcValueNum(price: string): number {
		price = price.replace('.','')

		if (price.length >= 10) {
			price = price.substring(0, 10);
		} else {
			while (price.length < 10) {
				price = price + '0';
			}
		}

		return parseInt(price);
	}

	private calcValueDenom(price: string): number {
		const decimalIndex = price.indexOf('.')
		let denom = '1'

		while (denom.length <= (10 - decimalIndex)) {
			denom = denom + '0';
		}

		return parseInt(denom)
	}

	private calcQuantityNum(): void {
		throw ('Not Implemented - Required for Investment Transactions');
	}

	private calcQuantityDenom(): void {
		throw ('Not Implemented - Required for Investment Transactions');
	}
}