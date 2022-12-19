const { createReadStream } = require('fs')
const readline = require('readline')
const debug = require('debug')('main')
const Big = require('big.js')

Big.strict = true

const regexes = {
  monkeyLine: /Monkey\s(\d+):/,
  itemsLine: /Starting\sitems: (.*)/,
  operationLine: /Operation:\s+(.*)$/,
  testLine: /Test: divisible by\s+(\d+)/,
  ifTrueLine: /If true: throw to monkey (\d+)/,
  ifFalseLine: /If false: throw to monkey (\d+)/
}

function monkey () {
  return {
    inspected: 0
  }
}

function parseLine (line, monkies) {
  if (line === '') return
  const current = monkies[monkies.length - 1]
  const [key, match] = Object.entries(regexes).reduce((found, [key, regex]) => {
    if (found) return found

    const match = regex.exec(line)
    if (match) return [key, match]
    else return null
  }, null)
  const [, operand] = match
  switch (key) {
    case 'monkeyLine': monkies.push(monkey())
      break
    case 'itemsLine': current.items = operand.split(',').map(s => s.trim()).map(x => new Big(x))
      break
    case 'operationLine': current.operation = operand
      break
    case 'testLine': current.test = operand
      break
    case 'ifTrueLine': current.ifTrue = operand
      break
    case 'ifFalseLine': current.ifFalse = operand
  }
}

const toBigOp = op => {
  if (op === '-') return 'minus'
  if (op === '+') return 'plus'
  if (op === '*') return 'times'
  if (op === '/') return 'div'
}

function applyOperation (operation, worryLevel) {
  const old = worryLevel // eslint-disable-line no-unused-vars
  debug({ operation })
  const [, lhs, op, rhs] = operation.match(/new = (\d+|old) ([+\-*/]) (\d+|old)/)
  return (lhs === 'old' ? old : new Big(lhs))[toBigOp(op)](rhs === 'old' ? old : new Big(rhs))
}

function calculate (monkies) {
  for (const monkey of monkies) {
    for (const worryLevel of monkey.items) {
      monkey.inspected++
      const newWorryLevel = applyOperation(monkey.operation, worryLevel).div('3').round(0, Big.roundDown)
      const toMonkey = newWorryLevel.mod(monkey.test).eq('0')
        ? monkey.ifTrue
        : monkey.ifFalse
      monkies[toMonkey].items.push(newWorryLevel)
      debug(monkies.map(m => ({ i: m.items.map(n => n.toString()) })))
      debug(`${worryLevel.toString()}=>${newWorryLevel.toString()}(${toMonkey})`)
    }
    monkey.items = []
  }
}

const NUM_ROUNDS = 10000
async function main () {
  const stream = createReadStream('./input.txt')

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  })

  const monkies = await parseMonkies(rl)

  console.log('monkey business: ', monkeyBusiness(monkies, 20))
}

async function parseMonkies (iterator) {
  const monkies = []
  for await (const line of iterator) {
    parseLine(line, monkies)
  }
  return monkies
}

function monkeyBusiness (monkies, iterations) {
  for (let i = 0; i < iterations; i++) {
    calculate(monkies)
  }
  const sorted = monkies.slice().sort((a, b) => b.inspected - a.inspected) // descending order
  const [max1, max2] = sorted
  return max1.inspected * max2.inspected
}

if (require.main === module) {
  main()
} else {
  module.exports = { monkeyBusiness, parseMonkies }
}
