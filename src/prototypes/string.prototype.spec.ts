import './string.prototype'
import { expect } from 'chai'

describe('StringPrototype', () => {
  it('Remove dashes removes all occurances of dashes', () => {
    const input = '123-4214-5215-125125'

    const resp = input.removeDashes()

    expect(resp).to.eq('12342145215125125')
  })
})
