const fs = require('fs')
const readline = require('readline')

const head = [0, 0]
const tail = [0, 0]
const tailPositions = new Set()

function parseLine (line) {
  const [, direction, magnitude] = /([UDRL])\s(\d+)/.exec(line)

  let iterations = magnitude
  while (iterations-- > 0) {
    if (direction === 'U') {
      head[1]++
    }
    if (direction === 'D') {
      head[1]--
    }
    if (direction === 'R') {
      head[0]++
    }
    if (direction === 'L') {
      head[0]--
    }
    const tailXDiff = head[0] - tail[0]
    const tailYDiff = head[1] - tail[1]
    const tailMoves = Math.abs(tailXDiff) >= 2 || Math.abs(tailYDiff) >= 2
    if (tailMoves) {
      if (Math.abs(tailXDiff) >= 1) tail[0] += (tailXDiff > 0 ? 1 : -1)
      if (Math.abs(tailYDiff) >= 1) tail[1] += (tailYDiff > 0 ? 1 : -1)
    }
    tailPositions.add(`${tail[0]},${tail[1]}`)
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
    // console.log({ line, head, tail, tailPositions })
  }
  console.log({ size: tailPositions.size })
}

main()
