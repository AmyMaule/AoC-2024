const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const rows = data.split("\n").map(row => row.split(""));
  let guardLocation = rows
    .map((row, i) => {
      if (row.includes("^")) {
        // Turn guard icon into a normal traversable space
        const guardLocation = row.indexOf("^")
        rows[i][guardLocation] = ".";
        return { x: i, y: guardLocation }
      }
    })
    .filter(row => row)[0];

  console.log(part1(rows, guardLocation));
  console.log(part2(rows, guardLocation));
});

const directions = {
  "up": { dx: -1, dy: 0, next: "right" },
  "right": { dx: 0, dy: 1, next: "down" },
  "down": { dx: 1, dy: 0, next: "left" },
  "left": { dx: 0, dy: -1, next: "up" },
};

// Get all places guard visits
const getPlacesVisited = (rows, guardLocation) => {
  let placesVisited = new Set();
  let guardDirection = "up";
  let nextGuardLocation;
  while (nextGuardLocation !== null) {
    const { x, y } = guardLocation;
    const { dx, dy} = directions[guardDirection];
    let possibleNextCoords = { x: x + dx, y: y + dy };
    
    // Check if in bounds
    if (possibleNextCoords.x < 0 || possibleNextCoords.x > rows.length - 1|| 
        possibleNextCoords.y < 0 || possibleNextCoords.y > rows[0].length - 1) {
          placesVisited.add(`${x}, ${y}`);
          nextGuardLocation = null;
          break;
    }

    if (rows[possibleNextCoords.x][possibleNextCoords.y] !== ".") {
      guardDirection = directions[guardDirection].next;
    } else {
      guardLocation = possibleNextCoords;
      nextGuardLocation = rows[possibleNextCoords.x][possibleNextCoords.y];
      placesVisited.add(`${x}, ${y}`);
    }
  }
  return placesVisited;
}

const checkInfiniteLoop = (rows, guardLocation) => {
  const placesVisited = new Set();
  let guardDirection = "up";
  let nextGuardLocation;

  while (true) {
    const { x, y } = guardLocation;
    const { dx, dy} = directions[guardDirection];
    let possibleNextCoords = { x: x + dx, y: y + dy };
    
    // Check if guard has been here before, and in the same direction, indicating an infinite loop
    const currentPosition = `${x}, ${y}, ${guardDirection}`
    if (placesVisited.has(currentPosition)) {
      return true;
    }
    placesVisited.add(currentPosition);

    // Check if in bounds
    if (possibleNextCoords.x < 0 || possibleNextCoords.x > rows.length - 1|| 
      possibleNextCoords.y < 0 || possibleNextCoords.y > rows[0].length - 1) {
        return false;
    }

    if (rows[possibleNextCoords.x][possibleNextCoords.y] !== ".") {
      guardDirection = directions[guardDirection].next;
    } else {
      guardLocation = possibleNextCoords;
      nextGuardLocation = rows[possibleNextCoords.x][possibleNextCoords.y];
    }
  }
}

const part1 = (rows, guardLocation) => getPlacesVisited(rows, guardLocation).size;

const part2 = (rows, guardLocation) => {
  // All the places the guard would normally visit (minus starting location)
  const placesVisited = [...getPlacesVisited(rows, guardLocation)].slice(1);
  let infiniteLoops = 0;
  
  for (let i = 0; i < placesVisited.length; i++) {
    const [ obstacleX, obstacleY ] = placesVisited[i].split(", ").map(Number);
    
    // Temporarily change normal tile to obstacle
    rows[obstacleX][obstacleY] = "#";
    
    if (checkInfiniteLoop(rows, guardLocation)) infiniteLoops++;

    // Return obstacle to normal tile
    rows[obstacleX][obstacleY] = ".";
  }
  return infiniteLoops;
}
