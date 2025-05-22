const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  let [boxMap, directions] = data.split("\n\n");
  boxMap = boxMap.split("\n").map(row => row.split(""));
  directions.replaceAll("\n", "");

  // Create double width map
  const widerMap = [];
  boxMap.forEach((row, i) => {
    widerMap.push([]);
    return row.forEach(item => {
      if (item === "." || item === "#") {
        widerMap[i].push(item, item);
      } else if (item === "O") {
        widerMap[i].push("[", "]");
      } else if (item === "@") {
        widerMap[i].push(item, ".");
      }
    })
  });

  console.log(part1(boxMap, directions));
  console.log(part2(widerMap, directions));
});

const getDirectionDeltas = direction => {
  let dx = 0, dy = 0;
  if (direction === "^") dy = -1;
  if (direction === "v") dy = 1;
  if (direction === "<") dx = -1;
  if (direction === ">") dx = 1;
  return [dx, dy];
}

const part1 = (boxMap, directions) => {
  let robotPosition;

  for (let i = 0; i < boxMap.length; i++) {
    let robotStartPos = boxMap[i].indexOf("@");
    if (robotStartPos !== -1) {
      robotPosition = [i, robotStartPos];
    }
  }

  const updateMap = direction => {
    const [ y, x ] = robotPosition;
    const [ dx, dy ] = getDirectionDeltas(direction);
    const nextY = y + dy;
    const nextX = x + dx;
    const nextTile = boxMap[nextY][nextX];

    if (nextTile === "#") {
      return;
    } else if (nextTile === ".") {
      [boxMap[y][x], boxMap[nextY][nextX]] = [boxMap[nextY][nextX], boxMap[y][x]];
      robotPosition = [nextY, nextX];
    } else if (nextTile === "O") {
      let searchY = y;
      let searchX = x;

      // keep looping until a "." is found
      while (boxMap[searchY + dy][searchX + dx] === "O") {
        searchY += dy;
        searchX += dx;
      }

      // if there are only O's, the robot doesn't move
      if (boxMap[searchY + dy][searchX + dx] !== ".") return;

      let fromX = searchX + dx;
      let fromY = searchY + dy;

      while (fromX !== x || fromY !== y) {
        const toX = fromX - dx;
        const toY = fromY - dy;
        [boxMap[fromY][fromX], boxMap[toY][toX]] = [boxMap[toY][toX], boxMap[fromY][fromX]];
        fromX = toX;
        fromY = toY;
      }
      robotPosition = [nextY, nextX];
    }
  }
  
  for (let direction of directions) {
    updateMap(direction);
  }

  let gpsTotal = 0;
  boxMap.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item === "O") gpsTotal += (i * 100) + j;
    })
  })
  return gpsTotal;
}

const part2 = (widerMap, directions) => {
  let robotPosition;

  for (let i = 0; i < widerMap.length; i++) {
    let robotStartPos = widerMap[i].indexOf("@");
    if (robotStartPos !== -1) {
      robotPosition = [i, robotStartPos];
    }
  }

  const updateMap = direction => {
    const [ y, x ] = robotPosition;
    const [ dx, dy ] = getDirectionDeltas(direction);
    const nextY = y + dy;
    const nextX = x + dx;
    const nextTile = widerMap[nextY][nextX];

    if (nextTile === "#") {
      return;
    } else if (nextTile === ".") {
      [widerMap[y][x], widerMap[nextY][nextX]] = [widerMap[nextY][nextX], widerMap[y][x]];
      robotPosition = [nextY, nextX];
      // reuse the code from part 1 if movement is left/right
    } else if ((nextTile === "[" || nextTile === "]") && (direction === ">" || direction === "<")) {
      let searchY = y;
      let searchX = x;

      // keep looping until a "." is found
      while (searchY + dy >= 0 && searchX + dx >= 0 && (widerMap[searchY + dy][searchX + dx] === "[" || widerMap[searchY + dy][searchX + dx] === "]")) {
        searchY += dy;
        searchX += dx;
      }

      // if there are only O's, the robot doesn't move
      if (widerMap[searchY + dy][searchX + dx] !== ".") return;

      let fromX = searchX + dx;
      let fromY = searchY + dy;

      while (fromX !== x || fromY !== y) {
        const toX = fromX - dx;
        const toY = fromY - dy;
        [widerMap[fromY][fromX], widerMap[toY][toX]] = [widerMap[toY][toX], widerMap[fromY][fromX]];
        fromX = toX;
        fromY = toY;
      }
      robotPosition = [nextY, nextX];

      // for up/down movement if the next tile is part of a box
    } else if (nextTile === "[" || nextTile === "]") {
      const moveRobot = (y, x, direction) => {
        let dy = 0;
        if (direction === "^") dy = -1;
        if (direction === "v") dy = 1;
        const nextY = y + dy;
        const nextX = x;

        let tilePair;
        if (nextTile === "[") {
          tilePair = [nextY, nextX + 1];
        } else {
          tilePair = [nextY, nextX - 1];
        }

        const queue = [[nextY, nextX], tilePair];
        const visited = new Set();

        while (queue.length > 0) {
          let [currY, currX] = queue.shift();
          if (visited.has(`${currY},${currX}`)) continue;
          visited.add(`${currY},${currX}`);
          
          // if y - 1 is part of a box, add those coords to queue
          const nextTile = widerMap[currY + dy][currX];
          // If there's a # in the way, immediately return false
          if (nextTile === "#") {
            return false;
          } else if (nextTile === "[") {
            queue.push([currY + dy, currX], [currY + dy, currX + 1]);
          } else if (nextTile === "]") {
            queue.push([currY + dy, currX], [currY + dy, currX - 1]);
          }
        }

        let visitedCoords = [...visited].map(coord => coord.split(",").map(Number));

        // replace coords from top to bottom if direction is up, or vice versa for down
        for (let i = visitedCoords.length - 1; i >= 0; i--) {
          let item = visitedCoords[i];
          const [ visitedY, visitedX ] = item;
          [widerMap[visitedY][visitedX], widerMap[visitedY + dy][visitedX]] = [widerMap[visitedY + dy][visitedX], widerMap[visitedY][visitedX]];
        }
        // Move robot into new position
        [widerMap[y][x], widerMap[nextY][nextX]] = [widerMap[nextY][nextX], widerMap[y][x]];
        robotPosition = [nextY, nextX];
        return true;
      }
      moveRobot(y, x, direction);
    }
  }

  for (let direction of directions) {
    updateMap(direction);
  }

  let gpsTotal = 0;
  widerMap.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item === "[") gpsTotal += (i * 100) + j;
    })
  })
  return gpsTotal;
}
