import { TDAmeritradeService } from './tdAmeritrade.service'
import { assert } from 'chai'
import { container } from '../../../inversify.config'

describe('TDAmeritradeService', () => {
  let service: TDAmeritradeService

  beforeEach(() => {
    service = container.get(TDAmeritradeService)
  })

  xit('ImportCSV throws Not Implemented', () => {
    service.ParseCSV('', '')
  })

  it('ImportPDF throws Not Implemented', () => {
    assert.throws(() => service.ParsePDF(), 'Not Implemented')
  })
})
