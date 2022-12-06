const fs = require("fs");
const readline = require("readline");

const shapeScores = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const theirs = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const mine = {
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const LOSE = 0;
const WIN = 6;
const DRAW = 3;

const newScores = {
  X: LOSE,
  Y: DRAW,
  Z: WIN,
};

const outcomes = {
  X: "lose",
  Y: "draw",
  Z: "win",
};

async function main() {
  const stream = fs.createReadStream("./input.txt");

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let total = 0;
  for await (const line of rl) {
    console.log(line);
    const [, t, outcome] = /([A-C])\s+([X-Z])/.exec(line);
    const shape = myShape(theirs[t], outcomes[outcome]);
    const score = newScores[outcome] + shapeScores[shape];
    total += score;
    console.log({
      theirs: theirs[t],
      shape,
      score,
      total,
    });
  }
}

function myShape(them, outcome) {
  if (outcome === "draw") return them;
  if (outcome === "win") {
    if (them === "paper") return "scissors";
    if (them === "scissors") return "rock";
    return "paper";
  }
  // lose
  if (them === "paper") return "rock";
  if (them === "scissors") return "paper";
  return "scissors";
}

main();
