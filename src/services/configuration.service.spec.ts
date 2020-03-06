import { expect } from 'chai'
import { ConfigurationService } from './configuration.service'

describe('ConfigurationService', () => {
  let service: ConfigurationService

  beforeEach(() => {
    // service = new ConfigurationService()
  })

  xit('GetConfigData works', () => {
    const resp = service.GetConfigData()

    expect(resp).to.eq({})
  })
})
