const fs = require('fs')
const readline = require('readline')

const isStackLine = /\[/
const isMoveLine = /move/

const noStacks = 9
const stacks = Array(noStacks).fill().map(() => [])
const moves = []
function parseLine (line) {
  if (isStackLine.test(line)) {
    const stackLine = parseStackLine(line)
    stackLine.forEach((entry, index) => {
      // unshift() b/c we want the top to to stay at start so we can pop() it,
      // and here we are top first, deeper subsequently (so so we want deep
      // AFTER the top)
      if (entry) stacks[index].unshift(entry)
    })
  }
  if (isMoveLine.test(line)) moves.push(parseMoveLine(line))
}

// [V] [Z] [D]     [P] [W] [G] [F] [Z]
function parseStackLine (line) {
  line += ' ' // HACK(Tim): simplify regex with space after each one
  const result = []
  let next
  const parser = /(\[[A-Z]+\]|\s{3})\s/g
  while ((next = parser.exec(line)) !== null) {
    result.push(next[1].trim())
  }
  return result
}

// move 9 from 1 to 2
function parseMoveLine (line) {
  const [, amount, from, to] = /move (\d+) from (\d+) to (\d+)/.exec(line)
  return { amount: parseInt(amount), from: parseInt(from), to: parseInt(to) }
}

function applyMove (move, stacks) {
  const { amount, from, to } = move
  let counter = amount
  console.log('applyMove()', amount, from, to)
  while (counter-- > 0) {
    const taken = stacks[from - 1].pop()
    const onto = stacks[to - 1]
    onto.push(taken)
  }

  console.log(move, stacks)
}

async function main () {
  const stream = fs.createReadStream('./input.txt')

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    parseLine(line)
  }

  moves.forEach(move => {
    applyMove(move, stacks)
  })
}

main()
