const fs = require('fs')
const readline = require('readline')

/*
function fullyContained (first, second, third, fourth) {
  if (first >= third && second <= fourth) return true
  if (third >= first && fourth <= second) return true
  return false
}
*/

// 49-49,3-48
function overlaps (first, second, third, fourth) {
  if (first >= third && first <= fourth) return true
  if (second >= third && second <= fourth) return true
  if (third >= first && third <= second) return true
  if (fourth >= first && fourth <= second) return true
  return false
}

async function main () {
  const stream = fs.createReadStream('./input.txt')

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  })

  let total = 0
  for await (const line of rl) {
    console.log(line)
    const [first, second, third, fourth] = /(\d+)-(\d+),(\d+)-(\d+)/.exec(line).slice(1).map(entry => parseInt(entry))
    if (overlaps(first, second, third, fourth)) total++
    console.log({ first, second, third, fourth, overlaps: overlaps(first, second, third, fourth), total })
  }
}

main()
