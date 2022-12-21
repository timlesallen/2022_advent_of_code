const { createReadStream } = require('fs')
const readline = require('readline')
const debug = require('debug')('main')

interface node {
  visited: false | boolean,
  height: string
}

function node (height): node {
  return {
    visited: false,
    height
  }
}

let start
const grid = <node[][]> []
function parseLine (line) {
  if (line === '') return
  const currentLine = <node[]> []
  for (const height of line) {
    if (/\W/.test(height)) return
    if (height === 'S') start = [grid.length, currentLine.length ]
    currentLine.push(node(height))
  }
  grid.push(currentLine)
}

const lookup = pos => {
  if (pos === null || pos === undefined) return null
  const [x, y] = pos
  return grid[x][y]
}

const charCode = (height: string): number => {
  if (height === 'S') return 'a'.charCodeAt(0)
  if (height === 'E') return 'z'.charCodeAt(0)
  return height.charCodeAt(0)
}

const heightDifference = (node1: node, node2: node): number => charCode(node2.height) - charCode(node1.height)

function shortestPath (start, steps): number {
  const node = lookup(start)
  if (!node) return Infinity
  if (node.visited !== false && node.visited <= steps) return Infinity
  if (node.height === 'E') return 0

  node.visited = steps

  const directions = ['up', 'down', 'right', 'left']
  const possibles = directions.map(direction => {
    const next = neighbour(start, direction)
    const nextNode = lookup(next)
    if (!nextNode || heightDifference(node, nextNode) > 1) return Infinity
    return shortestPath(next, steps + 1)
  })
  const min = Math.min(...possibles)
  if (Number.isFinite(min)) console.log({ start, height: node.height, direction: directions[possibles.findIndex(i => i === min)], result: 1 + min})
  return 1 + min
}

function neighbour (current: number[], direction: string): number[] {
  const [row, col] = current
  switch (direction) {
    case 'up': return row > 0 ? [row - 1, col] : null
    case 'down': return row < grid.length - 1 ? [row + 1, col] : null
    case 'left': return col > 0 ? [row, col - 1] : null
    case 'right': return col < grid[row].length - 1 ? [row, col + 1] : null
    default: throw new Error('unknown direction: ' + direction)
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

  console.log({ shortestPath: shortestPath(start, 0) })
}

if (require.main === module) {
  main()
} else {
  module.exports = { }
}
