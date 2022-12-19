const expect = require('chai').expect
const readline = require('readline')
const { createReadStream } = require('fs')
const { parseMonkies, monkeyBusiness } = require('..')

describe('index', () => {
  it('gets the right answer', async () => {
    const iterations = 20

    const stream = createReadStream('./input.txt')

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    })

    const monkies = await parseMonkies(rl)
    expect(monkeyBusiness(monkies, iterations)).to.equal(119715)
  })
})
