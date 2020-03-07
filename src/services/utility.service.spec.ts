import { expect } from 'chai'
import { UtilityService } from './utility.service'
import { container } from '../inversify.config'

describe('UtilityService', () => {
  let service: UtilityService

  beforeEach(() => {
    service = container.get(UtilityService)
  })

  it('UtilityService works', (done) => {
    const startTime = new Date().getTime()

    service.Sleep(1000).then(() => {
      const completeTime = new Date().getTime()
      const invalidTime = new Date(startTime + 1100).getTime()
      expect(completeTime).to.be.greaterThan(startTime)
      expect(completeTime).to.be.lessThan(invalidTime)
      done()
    })
  })
})
