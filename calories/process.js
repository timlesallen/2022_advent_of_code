async function main() {
  const  fs = require('fs');
  const readline = require('readline');

  const stream = fs.createReadStream('./calories.txt');

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const newMaxes = (maxes, current) => {
    if (maxes.size < 3) {
      maxes.add(current);
      return maxes;
    }
    const leastReplacable = [...maxes].reduce((soFar, m) => {
      return (current > m && m < soFar) ? m : soFar;
    }, Infinity);
    console.log({leastReplacable})
    if (leastReplacable !== Infinity) {
      maxes.delete(leastReplacable);
      maxes.add(current);
    }
    return maxes;
  };

  let current = 0;
  let maxes = new Set(); /* ascending */
  for await (const line of rl) {
    console.log(line);
    if (!/\d+/.test(line)) {
      maxes = newMaxes(maxes, current);
      console.log({ maxes, current })
      current = 0;
      continue;
    }
    current += parseInt(line);
  }

  if (current != 0) {
    maxes = newMaxes(maxes, current);
    console.log({ maxes, current })
  }

}

main()
