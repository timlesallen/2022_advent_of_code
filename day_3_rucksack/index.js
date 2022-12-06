const fs = require("fs");
const readline = require("readline");
const assert = require('assert');


const A = "A".charCodeAt(0);
const Z = "Z".charCodeAt(0);
const a = "a".charCodeAt(0);
const z = "z".charCodeAt(0);
function priority(code) {
  return (a <= code && code <= z) ? code - a + 1 : code - A + 1 + 26;
}

async function main() {
  const stream = fs.createReadStream("./input.txt");

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let sum = 0;
  const lines = [];
  let groups = 0;
  let linecount = 0;
  for await (const line of rl) {
    linecount++;
    lines.push(line)
    if (lines.length < 3) {
      continue;
    }

    groups++;

    const [first, second, third ] = lines;
    lines.length = 0;

    console.log({ first, second, third })

    let common;
    for (let c of first) {
      if (second.includes(c) && third.includes(c)) {
        common = c;
        break;
      }
    }
    const code = common.charCodeAt(0);
    sum += priority(code);
    console.log({ common, priority: priority(code), sum, groups, linecount })
  }
}

main();
