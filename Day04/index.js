const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const lineStr = data.split("\n");
  const lineArr = lineStr.map(line => line.split(""));

  console.log(part1(lineArr));
  console.log(part2(lineArr));
});

// Get all co-ordinates of a specific letter
const getCoords = (letter, lineArr) => {
  const coords = [];

  for (let i in lineArr) {
    const line = lineArr[i];
    for (let j in line) {
      const char = line[j];
      if (char === letter) {
        coords.push({ x: Number(i), y: Number(j) })
      }
    }
  }
  return coords;
}

const part1 = (lineArr) => {
  const xCoords = getCoords("X", lineArr);
  let xmases = 0;

  // The change in X/Y for each step outwards from "X"
  const directions = [
    { dx: 0, dy: 1 },  // Horizontal forwards
    { dx: 0, dy: -1 }, // Horizontal backwards
    { dx: -1, dy: 0 }, // Vertical up
    { dx: 1, dy: 0 },  // Vertical down
    { dx: -1, dy: -1 }, // Diagonal up-left
    { dx: -1, dy: 1 },  // Diagonal up-right
    { dx: 1, dy: -1 }, // Diagonal down-left
    { dx: 1, dy: 1 },  // Diagonal down-right
  ];

  // Check for "XMAS" in a given direction
  const isXmas = (x, y, dx, dy) => {
    const xmasStr = "XMAS";
    // Take a step for "M" then "A" then "S"
    for (let step = 1; step <= 3; step++) {
      const nextX = x + step * dx;
      const nextY = y + step * dy;
      if (nextX < 0 || nextY < 0 ||  nextX >= lineArr.length || nextY >= lineArr[0].length || lineArr[nextX][nextY] !== xmasStr[step]) {
        return false;
      }
    }
    return true;
  };

  for (let { x, y } of xCoords) {
    for (let { dx, dy } of directions) {
      if (isXmas(x, y, dx, dy)) {
        xmases++;
      }
    }
  }
  return xmases;
}

const part2 = (lineArr) => {
  let xmases = 0;
  const aCoords = getCoords("A", lineArr);
  
  const directions = [
    [
      { dx: -1, dy: -1 }, // Diagonal up-left
      { dx: 1, dy: 1 }  // Diagonal down-right
    ],
    [
      { dx: -1, dy: 1 },  // Diagonal up-right
      { dx: 1, dy: -1 }, // Diagonal down-left
    ]
  ];

  const isMas = (x, y, dx, dy) => {
    const nextX = x + dx;
    const nextY = y + dy;
    if (nextX < 0 || nextY < 0 ||  nextX >= lineArr.length || nextY >= lineArr[0].length) {
      return "";
    }
    return lineArr[nextX][nextY];
  }

  for (let { x, y } of aCoords) {
    let numMas = 0;
    for (let [dir1, dir2] of directions) {
      const letter1 = isMas(x, y, dir1.dx, dir1.dy);
      const letter2 = isMas(x, y, dir2.dx, dir2.dy);
      if ((letter1 === "M" && letter2 === "S") || (letter1 === "S" && letter2 === "M")) {
        numMas++;
      }
    }
    // If both sides have one "M" and one "S", that's an x-MAS
    if (numMas === 2) {
      xmases++;
    }
  }
  return xmases;
}
