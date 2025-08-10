const fs = require("fs");
const inputTxt = "./input.txt";

fs.readFile(inputTxt, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  data = data.split("\n").map(Number);

  console.log(part1(JSON.parse(JSON.stringify(data))));
  console.log(part2(JSON.parse(JSON.stringify(data))));
});

// Use >>> to ensure the result is always positive
const prune = (num) => (num >>> 0) % 16777216;
const mix = (a, b) => (a ^ b) >>> 0;

const generatePrice = num => {
  num = prune(mix(num, num * 64));
  num = prune(mix(num, Math.floor(num / 32)));
  num = prune(mix(num, num * 2048));
  return num;
}

const part1 = data => {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < 2000; j++) {
      data[i] = generatePrice(data[i]);
    }
  }
  return data.reduce((curr, acc) => curr + acc, 0);
}

const part2 = data => {
  // key is pattern of 4 digits as a string, e.g. "7,0,-5,9"
  const bananasPerPattern = new Map();

  for (let buyer = 0; buyer < data.length; buyer++) {
    const checkedPatterns = new Set();
    let currentPattern = [];
    let lastPrice = data[buyer] % 10;

    for (let i = 0; i < 2000; i++) {
      const price = generatePrice(data[buyer]);
      data[buyer] = price;

      // Update pattern
      const currentPrice = price % 10;
      if (currentPattern.length === 4) currentPattern.shift();
      if (lastPrice !== Infinity) currentPattern.push(currentPrice - lastPrice);
      lastPrice = currentPrice;
      if (currentPattern.length < 4) continue;

      // Update bananas, mark pattern as visited for this buyer
      let strPattern = currentPattern.toString();
      if (!checkedPatterns.has(strPattern)) {
        checkedPatterns.add(strPattern);
        if (bananasPerPattern.has(strPattern)) {
          bananasPerPattern.set(strPattern, bananasPerPattern.get(strPattern) + currentPrice);
        } else {
          bananasPerPattern.set(strPattern, currentPrice);
        }
      }
    }
  }
  let maxBananas = 0;
  for (const value of bananasPerPattern.values()) {
    if (value > maxBananas) maxBananas = value;
  }
  return maxBananas;
}
