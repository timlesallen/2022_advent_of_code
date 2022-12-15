const fs = require('fs')
const readline = require('readline')

const LINE_WIDTH = 40

let X = 1
let cycle = 0

function printCycle (cycle, X) {
  const spriteMinPos = Math.max(0, X - 1)
  const spriteMaxPos = X + 1
  const pixelDrawn = (cycle % LINE_WIDTH) - 1

  if (spriteMinPos <= pixelDrawn && pixelDrawn <= spriteMaxPos) printChar('#')
  else printChar('.')
}

function parseLine (line) {
  const [, instruction, operand] = /(noop|addx)\s?(-?\d+)?/.exec(line)
  cycle += instruction === 'addx' ? 2 : 1

  if (instruction === 'addx') printCycle(cycle - 1, X) // might need to handle prev cycle
  printCycle(cycle, X)

  if (instruction === 'addx') X += parseInt(operand) // increment register
}

let pixel = 1
function printChar (character) {
  process.stdout.write(character)
  if (pixel % LINE_WIDTH === 0) process.stdout.write('\n')
  pixel++
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
}

main()
