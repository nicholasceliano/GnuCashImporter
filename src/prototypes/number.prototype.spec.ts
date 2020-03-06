import './number.prototype'
import { expect } from 'chai'

describe('NumberPrototype', () => {
  it('Even numbers reduce correctly', () => {
    const resp = Number.prototype.reduce(10000, 100)

    expect(resp).to.be.an('array')
    expect(resp[0]).to.eq(100)
    expect(resp[1]).to.eq(1)
  })

  it('Unreducable numbers return correctly', () => {
    const resp = Number.prototype.reduce(3967, 145)

    expect(resp[0]).to.eq(3967)
    expect(resp[1]).to.eq(145)
  })

  it('Positive ToDollars is formatted correctly', () => {
    const number = 12345.1202
    const resp = number.toDollars()

    expect(resp).eq('$12345.12')
  })

  it('Negative ToDollars is formatted correctly', () => {
    const number = -12345.1202
    const resp = number.toDollars()

    expect(resp).eq('$-12345.12')
  })
})
