import { TDAmeritradeService } from './tdAmeritrade.service'
import { assert } from 'chai'

describe('TDAmeritradeService', () => {
  let service: TDAmeritradeService

  beforeEach(() => {
    service = new TDAmeritradeService()
  })

  it('ImportCSV throws Not Implemented', () => {
    assert.throws(() => service.ParseCSV(''), 'Not Implemented')
  })

  it('ImportPDF throws Not Implemented', () => {
    assert.throws(() => service.ParsePDF(), 'Not Implemented')
  })
})
