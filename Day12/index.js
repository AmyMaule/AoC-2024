const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  data = data.split("\n").map(row => row.split(""))

  console.log(part1(data));
  // console.log(part2(data));
  // part2(data);
});

const part1 = data => {
  const visitedNodes = new Set();
  let totalPrice = 0;

  const bfs = (startNodeX, startNodeY) => {
    let perimeter = 0;
    let area = 0;
    const queue = [[startNodeX, startNodeY]];
    
    while (queue.length) {
      let [ currX, currY ] = queue.pop();
      if (visitedNodes.has(`${currX}, ${currY}`)) continue;
      visitedNodes.add(`${currX}, ${currY}`);
      let plotValue = data[currX][currY];
      area++;
      
      // Check in each direction, if within the same area, add to queue, else add to perimeter
      if (data[currX - 1]?.[currY] === plotValue) {
        queue.push([currX - 1, currY]);
      } else perimeter++;
      if (data[currX + 1]?.[currY] === plotValue) {
        queue.push([currX + 1, currY]);
      } else perimeter++;
      if (data[currX]?.[currY - 1] === plotValue) {
        queue.push([currX, currY - 1]);
      } else perimeter++;
      if (data[currX]?.[currY + 1] === plotValue) {
        queue.push([currX, currY + 1]);
      } else perimeter++;
    }
    return perimeter * area;
  }

  data.forEach((row, i) => {
    row.forEach((plot, j) => {
      if (!visitedNodes.has(`${i}, ${j}`)) {
        const areaPrice = bfs(i, j);
        totalPrice += areaPrice;
      }
    })
  })

  return totalPrice;
}

// const part2 = (data) => {}