const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const grid = data.split("\n").map(row => row.split(""));
  let startPos;
  let endPos;
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "S") startPos = [y, x];
      if (cell === "E") endPos = [y, x];
    })
  });
  console.log("Part 1:", getCheatCount(grid, startPos, endPos, 2));
  console.log("Part 1:", getCheatCount(grid, startPos, endPos, 20));
});


const getDistances = (grid, startPos) => {
  const [ startY, startX ] = startPos;
  const queue = [startPos];
  const visitedPositions = new Set();
  const distances = new Array(grid.length).fill(null).map(() => new Array(grid[0].length).fill(Infinity));
  distances[startY][startX] = 0;

  // Up, right, down, left
  const directions = [
    [-1, 0], [0, 1], [1, 0], [0, -1]
  ];

  while (queue.length > 0) {
    const [ currY, currX ] = queue.shift();
    const currentDistance = distances[currY][currX];

    for (const [dy, dx] of directions) {
      const nextY = currY + dy;
      const nextX = currX + dx;
      if (
          nextX >= 0 && nextX < grid[0].length &&
          nextY >= 0 && nextY < grid.length &&
          grid[nextY][nextX] !== "#" &&
          !visitedPositions.has(`${nextY},${nextX}`)
        ) {
        distances[nextY][nextX] = currentDistance + 1;
        visitedPositions.add(`${currY},${currX}`);
        queue.push([ nextY, nextX ]);
      }
    }
  }
  return distances;
}

const calcEndPoints = (grid, startPos, maxCheatLength) => {
  const [startY, startX] = startPos;
  const endPoints = new Map();

  for (let y = Math.max(0, startY - maxCheatLength); y <= Math.min(grid.length - 1, startY + 20); y++) {
    for (let x = Math.max(0, startX - maxCheatLength); x <= Math.min(grid[0].length - 1, startX + 20); x++) {
      if (grid[y][x] === "#") continue;

      const manhattanDist = Math.abs(y - startY) + Math.abs(x - startX);
      if (manhattanDist === 0 || manhattanDist > maxCheatLength) continue;

      const key = `${y},${x}`;
      if (!endPoints.has(key) || manhattanDist < endPoints.get(key)) {
        endPoints.set(key, manhattanDist);
      }
    }
  }
  return [...endPoints.entries()];
};

const getCheatCount = (grid, startPos, endPos, maxCheatLength) => {
  let cheatCount = 0;
  const distancesFromStart = getDistances(grid, startPos);
  const distancesFromEnd = getDistances(grid, endPos);
  const bestTimeNoCheating = distancesFromStart[endPos[0]][endPos[1]];
  
  distancesFromStart.forEach((row, startY) => {
    row.forEach((cell, startX) => {
      if (cell !== Infinity) {
        const endPoints = calcEndPoints(grid, [startY, startX], maxCheatLength);
        for (let [ coords, cheatLength ] of endPoints) {
          const [endY, endX] = coords.split(",").map(Number);
          const startDist = distancesFromStart[startY][startX];
          const endDist = distancesFromEnd[endY][endX];
          const timeSaving = bestTimeNoCheating - (startDist + cheatLength + endDist);
          if (timeSaving >= 100) cheatCount++;
        }
      }
    });
  });
  return cheatCount;
}
