const { createReadStream } = require("fs");
const readline = require("readline");
const zip = require("lodash.zip");
const util = require("util");

type nestedNumberArray = Array<nestedNumberArray | number>;

function ordering(first: nestedNumberArray, second: nestedNumberArray): number {
  if (first === undefined) return -1;
  if (second === undefined) return 1;
  if (!Array.isArray(first)) first = [first];
  if (!Array.isArray(second)) second = [second];
  for (const pair of zip(first, second)) {
    const [a, b] = pair;
    if (Array.isArray(a) || Array.isArray(b)) {
      const order = ordering(a, b);
      if (order !== 0) return order;
      continue;
    }
    if (a === undefined) return -1;
    if (b === undefined) return 1;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

function correctlyOrdered(
  first: nestedNumberArray,
  second: nestedNumberArray
): boolean {
  const order = ordering(first, second);
  if (order <= 0) return true;
  return false;
}

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

const decoder1: nestedNumberArray = [[2]];
const decoder2: nestedNumberArray = [[6]];
function calculate_part2(lines: nestedNumberArray[]) {
  lines.push(decoder1, decoder2);
  lines.sort(ordering);
  lines.forEach((line) => {
    console.log(line);
  });
  return (lines.indexOf(decoder1) + 1) * (lines.indexOf(decoder2) + 1);
}

function inputFile(filename?: string): AsyncIterable<string> {
  const stream = createReadStream(filename ?? "./input.txt");

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  return rl;
}

async function parseInputPaired(
  input: AsyncIterable<string>
): Promise<nestedNumberArray[][]> {
  const lines = [[]];
  for await (const line of input) {
    // if not non-space chars, it's a blank line
    if (line === "") {
      lines.unshift([]); // push new tuple
      continue;
    }
    const parsed = JSON.parse(line);
    lines[0].push(parsed); // put line to current tuple
  }
  return lines;
}

async function parseInput(
  input: AsyncIterable<string>
): Promise<nestedNumberArray[]> {
  const lines: nestedNumberArray[] = [];
  for await (const line of input) {
    // ignore blank lines
    if (line === "") {
      continue;
    }
    const parsed = JSON.parse(line);
    lines.push(parsed);
  }
  return lines;
}

async function main() {
  const pairedLines = await parseInputPaired(inputFile());
  const ordered = calculate(pairedLines);
  console.log({ part1: ordered });

  const lines = await parseInput(inputFile());

  const part2 = calculate_part2(lines);
  console.log({ part2 });
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    correctlyOrdered,
    calculate,
    calculate_part2,
    parseInput,
    parseInputPaired,
    inputFile,
    ordering,
  };
}
