const fs = require('fs')
const readline = require('readline')

let prev = []
function parseLine (line) {
  let count = 0
  for (const char of line) {
    count++
    if (prev.size >= 4) prev.shift(char)
    const already = prev.indexOf(char)
    if (already >= 0) {
      prev = prev.slice(already + 1)
    }
    if (already === -1 && prev.length === 3) break
    prev.push(char)
    console.log(char, already, prev)
  }
  console.log(count, line.slice(count - 4, count))
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
