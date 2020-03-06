import { expect } from 'chai'
import { QuotePullerService } from './quotePuller.service'
import { container } from '../../inversify.config'

describe('QuotePullerService', () => {
  let service: QuotePullerService

  beforeEach(() => {
    service = container.get(QuotePullerService)
  })

  xit('QuotePullerService works', () => {
    const resp = service.RetrieveQuotes()

    expect(resp).to.eq({})
  })
})
