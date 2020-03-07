import { expect } from 'chai'
import { AlphaVantageService } from './alphaVantage.service'
import { container } from '../../inversify.config'

describe('AlphaVantageService', () => {
  let service: AlphaVantageService

  beforeEach(() => {
    service = container.get(AlphaVantageService)
  })

  xit('AlphaVantageService works', () => {
    const resp = service.GetQuotes([])

    expect(resp).to.eq({})
  })
})
