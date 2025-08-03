const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  data = data.split("\n").map(line => line.split(",").map(Number));
  const length = 71;
  const grid = [...Array(length)].map(_ => Array(length).fill("."));

  console.log(part1(data, grid));
  console.log(part2(data, grid));
});

const bfs = grid => {
  // queue has y, x and distance
  const queue = [[0, 0, 0]];
  const visitedPositions = new Set();

  // Up, right, down, left
  const directions = [
    [-1, 0], [0, 1], [1, 0], [0, -1]
  ];

  while (queue.length > 0) {
    const [currY, currX, distance] = queue.shift();
    
    if (currY === grid.length - 1 && currX === grid.length - 1) {
      return distance;
    }
    
    if (visitedPositions.has(`${currY},${currX}`)) continue;
    visitedPositions.add(`${currY},${currX}`)
    
    for (const [dy, dx] of directions) {
      const nextY = currY + dy;
      const nextX = currX + dx;
      if (
          nextX >= 0 && nextX < grid.length &&
          nextY >= 0 && nextY < grid.length &&
          grid[nextY][nextX] !== "#" &&
          !visitedPositions.has(`${nextY},${nextX}`)
        ) {
        queue.push([nextY, nextX, distance + 1]);
      }
    }
  }
  return null;
}

const part1 = (data, grid) => { 
  for (let i = 0; i < 1024; i++) {
    const [ x, y ] = data[i];
    grid[y][x] = "#";
  }
  return bfs(grid);
}

const part2 = (data, grid) => {
  let i = 0;
  while (i < 1024) {
    const [ x, y ] = data[i];
    grid[y][x] = "#";
    i++;
  }

  let shortestDistance = bfs(grid);
  // while there is still a possible exit, increment i and try again
  while (shortestDistance && i < data.length - 1) {
    i++;
    const [ x, y ] = data[i];
    grid[y][x] = "#";
    shortestDistance = bfs(grid);
  }
  return data[i].toString();
}
