import { GnuCashPriceService } from './gnucashPrice.service'
import '../../prototypes/number.prototype'
import { expect } from 'chai'
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'

describe('GnuCashPriceService', () => {
  let service: GnuCashPriceService
  let bankTransaction: GnuCashTransaction

  beforeEach(() => {
    service = new GnuCashPriceService()

    bankTransaction = {
      AccountGuid: '22488556448',
      Description: 'Test Description',
      Amount: 12345.20,
      PostDate: new Date(),
      CreateDate: new Date()
    } as GnuCashTransaction
  })

  it('Bank Transaction Value is set correctly', () => {
    const resp = service.SetTransactionValueFractions(bankTransaction)

    expect(resp.ValueNum).to.eq(61726)
    expect(resp.ValueDenom).to.eq(5)
  })

  it('Bank Transaction Quantity is set correctly', () => {
    const resp = service.SetTransactionValueFractions(bankTransaction)

    expect(resp.QuantityNum).to.eq(61726)
    expect(resp.QuantityDenom).to.eq(5)
  })

  it('Transaction Amount value is correct when cents are 0', () => {
    bankTransaction.Amount = 12000.00
    const resp = service.SetTransactionValueFractions(bankTransaction)

    expect(resp.ValueNum).to.eq(12000)
    expect(resp.ValueDenom).to.eq(1)
  })

  it('Transaction Amount greater than 10 digits is set correctly', () => {
    bankTransaction.Amount = 1234567891
    const resp = service.SetTransactionValueFractions(bankTransaction)

    expect(resp.ValueNum).to.eq(1234567891)
    expect(resp.ValueDenom).to.eq(1)
  })

  it('Transaction amount is opposite when rootSplit is false', () => {
    const resp = service.SetTransactionValueFractions(bankTransaction, false)

    expect(resp.ValueNum).to.eq(-61726)
    expect(resp.ValueDenom).to.eq(5)
  })
})
