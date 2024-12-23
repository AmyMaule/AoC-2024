const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  data = data.split("").map(Number);

  console.log(part1(data));
  console.log(part2(data));
});

const checkSum = data => {
  let checkSum = 0;
  for (let i = 0; i < data.length; i++) {
    if (!isNaN(data[i])) {
      checkSum += Number(data[i]) * i;
    }
  }
  return checkSum;
}

const part1 = (data) => {
  let rawData = [];
  for (let i = 0; i < data.length; i++) {
    const char = i % 2 === 0
      ? (i/2).toString()
      : "."
    rawData.push(...Array(data[i]).fill(char));
  }

  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i] === "." && rawData[i + 1]) {
      if (rawData[rawData.length -1] === ".") {
        while (rawData[rawData.length - 1] === ".") {
          rawData.pop();
        }
      }
      rawData[i] = rawData.pop();
    }
  }
  return checkSum(rawData.filter(num => !isNaN(Number(num))));
}

const part2 = (data) => {
  let rawData = [];
  for (let i = 0; i < data.length; i++) {
    const char = i % 2 === 0
      ? (i/2).toString()
      : "."
    rawData.push(new Array(data[i]).fill(char))
  }

  if (rawData[rawData.length - 1].includes(".")) rawData.pop();

  for (let i = rawData.length - 1; i >= 0; i--) {
    if (!rawData[i].length || rawData[i][0] === ".") continue;
    
    let firstMatchingIndex = rawData.findIndex((item, index) => item.length >= rawData[i].length && item[0] === "." && index < i);
    if (firstMatchingIndex === -1) {
      continue;
    } else {
      // if it can be swapped directly, swap it
      if (rawData[i].length === rawData[firstMatchingIndex].length) {
        [rawData[firstMatchingIndex], rawData[i]] = [rawData[i], rawData[firstMatchingIndex]];
      } else {
        const dotsToAdd = new Array(rawData[firstMatchingIndex].length - rawData[i].length).fill(".");
        // i is the numbers, firstMatchingINdex is the dots
        let numsToMove = rawData[i];
        rawData[i] = rawData[firstMatchingIndex].slice(0, rawData[i].length);
        rawData[firstMatchingIndex] = numsToMove;
        rawData.splice(firstMatchingIndex + 1, 0, dotsToAdd);
      }
    }
  }
  return checkSum(rawData.flat());
}
