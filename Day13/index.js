const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  data = data.split("\n\n").map(machine => {
    // Parse data into nested arrays of coordinates
    return [...machine.matchAll(/X[+=](\d+), Y[+=](\d+)/g)].map(match => [parseInt(match[1]), parseInt(match[2])])
  });
``
  console.log("Part 1:", calcCost(data, 0n));
  console.log("Part 2:", calcCost(data, 10000000000000n));
});

const calcCost = (data, offset) => {
  // Convert all numbers to bigInt
  let totalCost = 0n;

  for (let [ btnA, btnB, prize ] of data) {
    const [ax, ay] = btnA.map(BigInt);
    const [bx, by] = btnB.map(BigInt);
    let [px, py] = prize.map(p => BigInt(p) + offset);

    // Get determinant by multiplying opposites of the 2x2 matrix
    // | ax  bx |
    // | ay  by |
    const determinant = ax * by - ay * bx;

    // There is no solution if determinant is 0
    if (determinant === 0n) continue;

    // Use Cramer's rule, ensure they divide evenly as number of button presses must be an integer
    const a_numerator = px * by - py * bx;
    const b_numerator = ax * py - ay * px;
    if (a_numerator % determinant !== 0n || b_numerator % determinant !== 0n) continue;

    const a = a_numerator / determinant;
    const b = b_numerator / determinant;
    const cost = 3n * a + b;
    totalCost += cost;
  }
  return Number(totalCost);
}
