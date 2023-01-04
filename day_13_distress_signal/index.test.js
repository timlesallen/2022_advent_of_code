const expect = require("chai").expect;
const {
  calculate,
  calculate_part2,
  correctlyOrdered,
  parseInput,
  parseInputPaired,
  inputFile,
} = require("./out/index");

describe("correctlyOrdered", () => {
  it("orders simple case array correctly", () => {
    expect(correctlyOrdered([1, 2, 3], [4, 5, 6])).to.equal(true);
    expect(correctlyOrdered([4, 5, 6], [1, 2, 3])).to.equal(false);
    expect(correctlyOrdered([1, 2, 3], [1, 2, 3])).to.equal(true);
  });
  it("handles shorter RHS", () => {
    expect(correctlyOrdered([1, 2, 3], [1, 2])).to.equal(false);
    expect(correctlyOrdered([1, 2], [1, 2, 3])).to.equal(true);
  });
  it("handles nesting", () => {
    expect(correctlyOrdered([1, 2, 3], [[1], [2]])).to.equal(false);
    expect(correctlyOrdered([1, 2], [1, [2, 3]])).to.equal(true);
  });
  it("given examples", () => {
    expect(correctlyOrdered([[1], [2, 3, 4]], [[1], 4])).to.equal(true);
    expect(correctlyOrdered([9], [[8, 7, 6]])).to.equal(false);
    expect(correctlyOrdered([[4, 4], 4, 4], [[4, 4], 4, 4, 4])).to.equal(true);
    expect(correctlyOrdered([], [3])).to.equal(true);
    expect(correctlyOrdered([[[]]], [[]])).to.equal(false);
    expect(
      correctlyOrdered(
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
      )
    ).to.equal(false);
  });
  it("empty array edge case", () => {
    expect(
      correctlyOrdered(
        [[4, 3, 4, [2]]],
        [[], [6, 7, 1, 0], [0, 9], [3, [0], 2], [4, [2, 7]]]
      )
    ).to.equal(false);
  });
  it("part 1 answer", async () => {
    expect(calculate(await parseInputPaired(inputFile()))).to.equal(5003);
  });
  it("part 2 worked example", async () => {
    expect(
      calculate_part2(await parseInput(inputFile("./example.txt")))
    ).to.equal(140);
  });
});
