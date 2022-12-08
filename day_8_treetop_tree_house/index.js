const fs = require('fs')
const readline = require('readline')

const trees = []
function parseLine (line) {
  trees.push(line.split('').map(h => parseInt(h)))
}

async function main () {
  const stream = fs.createReadStream('./input.txt')

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  })

  const lines = []
  for await (const line of rl) {
    lines.push(parseLine(line))
  }

  // for each row, for each col
  //   check max height to the left, right, above, below
  //   if any of those four maxes is less than this one, then tree is visible

  let total = 0
  let maxScenic = 0
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < trees[i].length; j++) {
      const tree = trees[i][j]
      const row = trees[i]
      const left = row.slice(0, j).reverse()
      const right = row.slice(j + 1)
      const above = trees.filter((tree, index) => index < i).map(tree => tree[j]).reverse()
      const below = trees.filter((tree, index) => index > i).map(tree => tree[j])
      const visible = Math.max(...left) < tree || Math.max(...right) < tree || Math.max(...above) < tree || Math.max(...below) < tree
      if (visible) total++
      const biggerLeft = left.findIndex(elem => elem >= tree)
      const biggerRight = right.findIndex(elem => elem >= tree)
      const biggerAbove = above.findIndex(elem => elem >= tree)
      const biggerBelow = below.findIndex(elem => elem >= tree)
      const scenicScore =
        (biggerLeft > -1
          ? biggerLeft + 1
          : left.length
        ) *
        (biggerRight > -1
          ? biggerRight + 1
          : right.length
        ) *
        (biggerAbove > -1
          ? biggerAbove + 1
          : above.length
        ) *
        (biggerBelow > -1
          ? biggerBelow + 1
          : below.length
        )
      maxScenic = Math.max(scenicScore, maxScenic)

      // if (scenicScore > 0) console.log({ i, j, scenicScore, tree, above, below, left, right })
      // console.log({ i, j, tree, above, below, left, right, visible, scenicScore, firstAboveBlocker, firstBelowBlocker, firstLeftBlocker, firstRightBlocker })
    }
  }
  console.log({ total, maxScenic })
}

main()
