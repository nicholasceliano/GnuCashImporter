import './date.prototype'
import { expect } from 'chai'

describe('DatePrototype', () => {
  it('MySqlDateTime is formatted correctly when input as ISO time', () => {
    const date = new Date('2/2/2020 10:30:33Z')

    const resp = date.toMySqlDateTimeString()

    expect(resp).to.eq('2020-02-02 10:30:33')
  })

  it('MySqlDateTime is formatted correctly when put in as local time', () => {
    const date = new Date('2/2/2020 10:30:33')

    const resp = date.toMySqlDateTimeString()

    expect(resp).to.eq('2020-02-02 15:30:33')
  })
})
