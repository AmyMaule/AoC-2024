const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  console.log("Part 1:", getTotalValidTrails(data));
  console.log("Part 2:", getTotalValidTrails(data, true));
});

const getZeroLocations = data => {
  const zeroLocations = [];
  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    for (let j = 0; j < line.length; j++) {
      const item = line[j];
      if (item === 0) {
        zeroLocations.push([i, j]);
      }
    }
  }
  return zeroLocations;
}

const getValidTrails = (mapArr, startLocation, cumulative) => {
  const directions = [[-1, 0], [0, -1], [1, 0],[0, 1]];
  const visited = new Set();
  let validTrails = 0;
  const queue = [startLocation]; 
  if (!cumulative) visited.add(`${startLocation[0]}, ${startLocation[1]}`)

  while (queue.length > 0) {
    const [currX, currY] = queue.shift();
    if (mapArr[currX][currY] === 9) {
      validTrails++;
    }

    for (let [dx, dy] of directions) {
      const nextX = currX + dx;
      const nextY = currY + dy;
      
      // Check if next coord is within the map
      if (nextX >= 0 && nextY >= 0 && nextX < mapArr.length && nextY < mapArr[0].length) {
        if (mapArr[nextX][nextY] !== (mapArr[currX][currY] + 1)) continue;
        const nextCoordStr = `${nextX}, ${nextY}`;
        // Part2 is cumulative, part1 requires that this coord has not yet been visited
        if (cumulative || !visited.has(nextCoordStr)) {
          queue.push([nextX, nextY]);
          visited.add(nextCoordStr);
        }
      }
    }
  }
  return validTrails;
}

const getTotalValidTrails = (data, cumulative) => {
  let totalValidTrails = 0;
  const mapArr = data.split("\n").map(line => line.split("").map(Number));
  const zeros = getZeroLocations(mapArr);

  for (let zero of zeros) {
    const validTrails = getValidTrails(mapArr, zero, cumulative);
    totalValidTrails += validTrails;
  }
  return totalValidTrails;
}
