const { createReadStream } = require("fs");
const readline = require("readline");
const zip = require("lodash.zip");

function parseLine(lines: Array<Array<any>>, line: string) {
  // if not non-space chars, it's a blank line
  if (line === "") {
    lines.unshift([]);
    return;
  }
  const parsed = JSON.parse(line);
  lines[0].push(parsed);
}

function ordering(first: nestedNumberArray, second: nestedNumberArray): number {
  if (first === undefined) return 1;
  if (second === undefined) return -1;
  if (!Array.isArray(first)) first = [first];
  if (!Array.isArray(second)) second = [second];
  for (const pair of zip(first, second)) {
    const [a, b] = pair;
    if (Array.isArray(a) || Array.isArray(b)) {
      const order = ordering(a, b);
      if (order !== 0) return order;
      continue;
    }
    if (a === undefined) return 1;
    if (b === undefined) return -1;
    if (a < b) return 1;
    if (a > b) return -1;
  }
  return 0;
}

function correctlyOrdered(
  first: nestedNumberArray,
  second: nestedNumberArray
): boolean {
  const order = ordering(first, second);
  if (order >= 0) return true;
  return false;
}

type nestedNumberArray = Array<nestedNumberArray | number>;
function calculate(lines: nestedNumberArray[][]) {
  let sum = 0;
  let index = 1;
  while (lines.length > 0) {
    const [first, second] = lines.pop();
    const correct = correctlyOrdered(first, second);
    if (correct) sum += index;
    index++;
  }
  return sum;
}

async function givenInput(): Promise<nestedNumberArray[][]> {
  const lines = [[]];
  const stream = createReadStream("./input.txt");

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    parseLine(lines, line);
  }
  return lines;
}

async function main() {
  const lines = await givenInput();
  const ordered = calculate(lines);
  console.log({ ordered });
}

if (require.main === module) {
  main();
} else {
  module.exports = { correctlyOrdered, calculate, givenInput };
}
