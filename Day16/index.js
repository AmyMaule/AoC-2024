const inputTxt = "input.txt";
fetch(inputTxt)
.then(res => res.text())
.then(data => {
  const grid = data.split("\n").map(row => row.split(""));
  let startPos;
  let endPos;

  grid.forEach((row, i) => {
    row.forEach((col, j) => {
      if (col === "S") startPos = [j, i];
      if (col === "E") endPos = [j, i];
    });
  });

  if (!startPos || !endPos) {
    throw new Error("No start/end position detected");
  }

  console.log(part1(grid, startPos, endPos));
  console.log(part2(grid, startPos, endPos));
});

const areArraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const isOppositeDir = (dir1, dir2) => {
  const opposites = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT",
  };
  return opposites[dir1] === dir2;
};

const getBestPaths = (grid, startPos, endPos) => {
  const visited = {};
  let paths = [];
  let minCost = Infinity;
  const queue = [];
  const directions = { "UP": [-1, 0],  "RIGHT": [0, 1], "DOWN": [1, 0], "LEFT": [0, -1] };

  const first = {
    x: startPos[0],
    y: startPos[1],
    cost: 0,
    path: [],
    direction: "RIGHT",
  }
  queue.push(first);

  while (queue.length) {
    const currentPos = queue.shift();
    const { x, y, direction } = currentPos;
    const key = `${x},${y},${direction}`;
    currentPos.path.push(key);

    if (currentPos.x === endPos[0] && currentPos.y === endPos[1]) {
      if (currentPos.cost < minCost) {
        // Reset paths now that the minCost has decreased
        paths = [currentPos.path];
        minCost = currentPos.cost;
      }

      if (currentPos.cost === minCost) {
        const alreadyExists = paths.some(path => areArraysEqual(path, currentPos.path));
        if (!alreadyExists) paths.push(currentPos.path);
        continue;
      }
    }

    if (!(key in visited)) visited[key] = Infinity;
    if (visited[key] < currentPos.cost || currentPos.cost > minCost) continue;
    visited[key] = currentPos.cost;

    Object.entries(directions).forEach(([newDir, [dx, dy]]) => {
      if (isOppositeDir(direction, newDir) || grid[x + dx][y + dy] === "#") return;
      queue.push({
        x: x + dx,
        y: y + dy,
        cost: newDir === direction ? currentPos.cost + 1 : currentPos.cost + 1001,
        direction: newDir,
        path: [...currentPos.path],
      })
    });
  }
  return { paths, minCost };
}

const part1 = (grid, startPos, endPos) => {
  const { minCost } = getBestPaths(grid, startPos, endPos);
  return minCost;
}

const part2 = (grid, startPos, endPos) => {
  const { paths } = getBestPaths(grid, startPos, endPos);
  const pathCoords = new Set();

  for (const path of paths) {
    for (let coord of path) {
      // Remove the direction, add all coords to a set
      coord = coord.slice(0, coord.lastIndexOf(","));
      pathCoords.add(coord);
    }
  }

  return pathCoords.size;
}
