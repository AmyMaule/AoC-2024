const inputTxt = "input.txt";
fetch(inputTxt)
.then(res => res.text())
.then(data => {
  data = data.split("\n").map(line => {
    const matches = line.match(/-?\d+/g).map(Number);
    const [px, py, vx, vy] = matches;
    return { px, py, vx, vy };
  });

  console.log(part1(JSON.parse(JSON.stringify(data))));
  console.log(part2(data, true));
})

const getQuad = (x, y, width, height) => {
  const lowerW = Math.floor(width / 2) - 1;
  const upperW = Math.ceil(width / 2);
  const lowerH = Math.floor(height / 2) - 1;
  const upperH = Math.ceil(height / 2);

  // Return early for robots that don't fit into the quadrants
  if ((x > lowerW && x < upperW) || (y > lowerH && y < upperH)) {
    return null;
  }

  if (x <= lowerW && y <= lowerH) return "q1";
  if (x > lowerW && y <= lowerH) return "q2";
  if (x <= lowerW && y > lowerH) return "q3";
  if (x > lowerW && y > lowerH) return "q4";
}

const part1 = (robots) => {
  const width = 101;
  const height = 103;

  const quadrants = { q1: 0, q2: 0, q3: 0, q4: 0 };

  for (let robot of robots) {
    for (let i = 0; i < 100; i++) {
      robot.px = (robot.px + robot.vx + width) % width;
      robot.py = (robot.py + robot.vy + height) % height;
    }
    const currentQuad = getQuad(robot.px, robot.py, width, height);

    if (currentQuad) quadrants[currentQuad]++;
  }
  return Object.values(quadrants).reduce((acc, curr) => acc * curr, 1);
}

const part2 = (robots, visualizer) => {
  // Make a deep copy of robots so it doesn't mess with the visualizer later
  const robotsCopy = JSON.parse(JSON.stringify(robots));
  const width = 101;
  const height = 103; 

  for (let i = 0; i < 10000; i++) {
    const filledCoords = new Set();
    for (let robot of robotsCopy) {
      robot.px = (robot.px + robot.vx + width) % width;
      robot.py = (robot.py + robot.vy + height) % height;
      filledCoords.add(`${robot.px},${robot.py}`);
      
      const checkNeighbors = (x, y, i) => {
        let neighborCoords = [
          `${x - 1},${y - 1}`,
          `${x},${y - 1}`,
          `${x - 1},${y}`,
          `${x + 1},${y + 1}`,
          `${x},${y + 1}`,
          `${x + 1},${y}`
        ];

        let neighbors = 0;
        for (let coord of neighborCoords) {
          if (filledCoords.has(coord)) {
            neighbors++;
          }
        }
        return neighbors;
      }
      const neighbors = checkNeighbors(robot.px, robot.py, i)
      if (neighbors > 5) {
        winner = i;
        break;
      }
    }
  }

  if (!visualizer) {
    return winner;
  }

  // For fun, also visualize the robots' movement
  const grid = document.querySelector(".grid");
  const rows = 103;
  const cols = 101;

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }

  const moveRobot = robot => {
    grid.children[robot.py].children[robot.px].classList.remove("filled");
    robot.px = (robot.px + robot.vx + width) % width;
    robot.py = (robot.py + robot.vy + height) % height;
    grid.children[robot.py].children[robot.px].classList.add("filled");
  }

  let step = 0;
  // The visualizer can be customized but in its current form, it takes a few seconds to get to the 'winning' configuration
  const visualizeRobotMovement = () => {
    robots.forEach(robot => moveRobot(robot));
    step++;
    if (step === winner) {
      clearInterval(intervalId);
    }
  }
  let intervalId = setInterval(visualizeRobotMovement, 1);
  return winner;
}
