const fs = require("fs");
const readline = require("readline");
const assert = require('assert');

async function main() {
  const stream = fs.createReadStream("./input.txt");

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let sum = 0;
  for await (const line of rl) {
    const length = line.length;
    const [first, second] = [
      line.substring(0, length / 2),
      line.substring(length / 2, length),
    ];

    let common;
    for (let c of first) {
      if (second.includes(c)) {
        common = c;
        break;
      }
    }
    const code = common.charCodeAt(0);
    const A = "A".charCodeAt(0);
    const Z = "Z".charCodeAt(0);
    const a = "a".charCodeAt(0);
    const z = "z".charCodeAt(0);

    const priority = (a <= code && code <= z) ? code - a + 1 : code - A + 1 + 26;
    sum += priority;
    console.log(line);
    console.log({ first, second, common, priority, sum });
    assert(priority > 0);
  }
}

main();
