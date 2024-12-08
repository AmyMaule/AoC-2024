const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  data = data.split("\n").map(line => line.split(" ").map(Number));
  console.log(part1(data));
  console.log(part2(data));
});


const part1 = (data) => {
  const allowedDifferences = new Set([-3, -2, -1, 1, 2, 3]);
  let safeReports = 0;

  for (let line of data) {
    if (checkIfSafe(line, allowedDifferences)) {
      safeReports++;
    }
  }
  return safeReports;
}

const checkIfSafe = (line, allowedDifferences) => {
  let increasing, decreasing;

  for (let i = 1; i < line.length; i++) {
    const difference = line[i] - line[i - 1];
    if (!allowedDifferences.has(difference)) {
      return false;
    }
    
    if (difference < 0) decreasing = true;
    if (difference > 0) increasing = true;

    if (i === line.length - 1 && !(increasing && decreasing)) {
      return true
    }
  }
  return false;
}

const part2 = (data) => {
  const allowedDifferences = new Set([-3, -2, -1, 1, 2, 3]);
  let safeReports = 0;

  for (let line of data) {
    if (checkIfSafe(line, allowedDifferences)) {
      safeReports++;
    } else {
      // check permutations of line
      for (let j = 0; j < line.length; j++) {
        const lineMinusJ = line.filter((num, index) => index !== j);
        if (checkIfSafe(lineMinusJ, allowedDifferences)) {
          safeReports++;
          break;
        }
      }
    }
  }
  return safeReports;
}
