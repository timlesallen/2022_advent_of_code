const fs = require('fs')
const readline = require('readline')

let X = 1
let cycle = 0
let total = 0

const interesting = [20, 60, 100, 140, 180, 220]

function parseLine (line) {
  const [, instruction, operand] = /(noop|addx)\s?(-?\d+)?/.exec(line)
  cycle += instruction === 'addx' ? 2 : 1

  // add signal strength to total?
  if (interesting.includes(cycle)) total += cycle * X

  // prev cycle
  else if (interesting.includes(cycle - 1) && instruction === 'addx') {
    total += X * (cycle - 1)
  }

  // increment register
  if (instruction === 'addx') X += parseInt(operand)
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
  console.log({ total })
}

main()
