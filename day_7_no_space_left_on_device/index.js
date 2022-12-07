const fs = require('fs')
const readline = require('readline')

const regexes = {
  command: /\$ (?<command>\S+)\s?(?<operand>\S*)/,
  dir: /dir (?<name>\S+)/,
  file: /(?<size>\d+) (?<name>\S+)/
}

function parseLine (line) {
  for (const type in regexes) {
    const result = line.match(regexes[type])
    if (result) return { type, ...result.groups }
  }
}

function dir (name, parent) {
  return {
    name,
    size: 0,
    dirs: {},
    parent
  }
}

function select (root, cond) {
  const thisOne = cond(root) ? [root] : []
  const children = Object.entries(root.dirs).map(([, dir]) => select(dir, cond))
  return thisOne.concat(children).flat()
}

async function main () {
  const stream = fs.createReadStream('./input.txt')

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  })

  // process input file
  const root = dir('/')
  let current
  for await (const line of rl) {
    console.log(line)
    const { type, command, operand, name, size } = parseLine(line)
    if (command === 'cd') {
      if (operand === '/') current = root
      else if (operand === '..') current = current.parent
      else current = current.dirs[operand]
    } else if (type === 'file') {
      current.size += parseInt(size)
      // push size up to parents
      let parent = current.parent
      while (parent) {
        parent.size += parseInt(size)
        parent = parent.parent
      }
    } else if (type === 'dir') {
      if (!current.dirs[name]) current.dirs[name] = dir(name, current)
    }
    console.log(root)

    // now need to sum dir sizes with size > 100000
    console.log(select(root, node => node.size <= 100000))
    console.log(select(root, node => node.size <= 100000).reduce((acc, node) => acc + node.size, 0))
  }
}

main()
