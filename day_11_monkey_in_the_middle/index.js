const { createReadStream } = require('fs')
const readline = require('readline')
const debug = require('debug')('main')

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

const monkies = []
function parseLine (line) {
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
    case 'itemsLine': current.items = operand.split(',').map(x => parseInt(x))
      break
    case 'operationLine': current.operation = operand
      break
    case 'testLine': current.test = parseInt(operand)
      break
    case 'ifTrueLine': current.ifTrue = parseInt(operand)
      break
    case 'ifFalseLine': current.ifFalse = parseInt(operand)
  }
}

function applyOperation (operation, worryLevel) {
  const old = worryLevel // eslint-disable-line no-unused-vars
  return eval(operation.replace('new =', '')) // eslint-disable-line no-eval
}

function calculate (monkies) {
  for (const monkey of monkies) {
    for (const worryLevel of monkey.items) {
      monkey.inspected++
      const newWorryLevel = Math.floor(applyOperation(monkey.operation, worryLevel) / 3)
      const toMonkey = newWorryLevel % monkey.test === 0
        ? monkey.ifTrue
        : monkey.ifFalse
      monkies[toMonkey].items.push(newWorryLevel)
      debug(monkies.map(m => ({ i: m.items })))
      debug(`${worryLevel}=>${newWorryLevel}(${toMonkey})`)
    }
    monkey.items = []
  }
}

async function main () {
  const stream = createReadStream('./input.txt')

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    parseLine(line)
  }

  for (let i = 0; i < 20; i++) {
    calculate(monkies)
  }
  const sorted = monkies.slice().sort((a, b) => b.inspected - a.inspected) // descending order
  const [max1, max2] = sorted
  console.log('monkey business: ', max1.inspected * max2.inspected)
}

main()
