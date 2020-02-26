import { TDAmeritradeService } from './tdAmeritrade.service'
import { assert } from 'chai'

describe('TDAmeritradeService', () => {
  let service: TDAmeritradeService

  beforeEach(() => {
    service = new TDAmeritradeService()
  })

  it('ImportCSV throws Not Implemented', () => {
    assert.throws(() => service.ImportCSV(''), 'Not Implemented')
  })

  it('ImportPDF throws Not Implemented', () => {
    assert.throws(() => service.ImportPDF(), 'Not Implemented')
  })
})
