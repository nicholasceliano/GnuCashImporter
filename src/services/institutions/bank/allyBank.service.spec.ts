import { AllyBankService } from './allyBank.service'
import { assert, expect } from 'chai'
import { GnuCashTransaction } from '../../../models/gnuCash/GnuCashTransaction'
import { container } from '../../../inversify.config'

describe('AllyBankService', () => {
  let service: AllyBankService
  let csvFile: string

  beforeEach(() => {
    service = container.get(AllyBankService)

    csvFile = 'Date,Time' // Need to get this from file
  })

  xit('ImportCSV', () => {
    const resp = service.ParseCSV(csvFile, '')

    expect(resp).to.be.eq({
      AccountGuid: '',
      Description: '',
      Amount: 1234,
      PostDate: new Date(),
      CreateDate: new Date()
    } as GnuCashTransaction)
  })

  xit('ImportPDF throws Not Implemented', () => {
    assert.throws(() => service.ParsePDF(), 'Not Implemented')
  })
})
