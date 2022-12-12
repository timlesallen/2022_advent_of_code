const fs = require('fs')
const readline = require('readline')

const NUM_KNOTS = 10
const knots = Array.from(Array(NUM_KNOTS), () => [0, 0])

const tailPositions = new Set()
const tail = knots[NUM_KNOTS - 1]

function parseLine (line) {
  const [, direction, magnitude] = /([UDRL])\s(\d+)/.exec(line)

  for (let iterations = magnitude; iterations > 0; iterations--) {
    for (let knotIndex = 0; knotIndex < NUM_KNOTS - 1; knotIndex++) {
      const current = knots[knotIndex]
      const next = knots[knotIndex + 1]
      // The line move only applies to the head
      if (knotIndex === 0) {
        if (direction === 'U') {
          current[1]++
        }
        if (direction === 'D') {
          current[1]--
        }
        if (direction === 'R') {
          current[0]++
        }
        if (direction === 'L') {
          current[0]--
        }
      }
      const nextXDiff = current[0] - next[0]
      const nextYDiff = current[1] - next[1]
      const nextMoves = Math.abs(nextXDiff) >= 2 || Math.abs(nextYDiff) >= 2
      // console.log({ nextMoves, current, next, nextXDiff, nextYDiff, line, knots })
      if (nextMoves) {
        if (Math.abs(nextXDiff) >= 1) next[0] += (nextXDiff > 0 ? 1 : -1)
        if (Math.abs(nextYDiff) >= 1) next[1] += (nextYDiff > 0 ? 1 : -1)
      }
      if (!nextMoves) break
      tailPositions.add(`${tail[0]},${tail[1]}`)
    }
  }
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
  console.log({ size: tailPositions.size })
}

main()
