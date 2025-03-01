const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const visitedNodes = new Set();
  const regions = [];

  const getRegion = (startNodeY, startNodeX) => {
    let area = 0;
    const queue = [[startNodeY, startNodeX]];
    let currentRegion = new Set();
    
    while (queue.length) {
      let [ currY, currX ] = queue.pop();
      currentRegion.add(`${currY}, ${currX}`);
      if (visitedNodes.has(`${currY}, ${currX}`)) continue;
      visitedNodes.add(`${currY}, ${currX}`);
      let plotValue = data[currY]?.[currX];
      area++;
  
      // Check in each direction, if within the same area, add to queue
      if (data[currY - 1]?.[currX] === plotValue) queue.push([currY - 1, currX]);
      if (data[currY + 1]?.[currX] === plotValue) queue.push([currY + 1, currX]);
      if (data[currY]?.[currX - 1] === plotValue) queue.push([currY, currX - 1]);
      if (data[currY]?.[currX + 1] === plotValue) queue.push([currY, currX + 1]);
    }
    return [...currentRegion];
  }

  data = data.split("\n").map(row => row.split(""));
  data.forEach((row, i) => {
    row.forEach((plot, j) => {
      if (!visitedNodes.has(`${j}, ${i}`)) {
        regions.push(getRegion(j, i));
      }
    })
  });

  part1(regions);
  part2(regions);
});

const getPerimeter = (currY, currX, region) => {
  let currentPerimeter = 0;
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  directions.forEach(([dy, dx]) => {
    if (!region.includes(`${currY + dy}, ${currX + dx}`)) {
      currentPerimeter++;
    }
  });
  return currentPerimeter;
};

const part1 = (regions) => {
  let totalPrice = 0;
  regions.forEach(region => {
    let perimeter = 0;
    region.forEach(plot => {
      let [ currY, currX ] = plot.split(", ").map(coord => parseInt(coord));
      perimeter += getPerimeter(currY, currX, region);
    });
    totalPrice += perimeter * region.length;
  })
  return totalPrice;
}

// there will be the same number of edges as corners, so count corners
const getCorners = (currY, currX, region) => {
  let corners = 0;
  const topLeft = `${currY - 1}, ${currX - 1}`;
  const top = `${currY - 1}, ${currX}`;
  const topRight = `${currY - 1}, ${currX + 1}`;
  const left = `${currY}, ${currX - 1}`;
  const right = `${currY}, ${currX + 1}`;
  const bottomLeft = `${currY + 1}, ${currX - 1}`;
  const bottom = `${currY + 1}, ${currX}`;
  const bottomRight = `${currY + 1}, ${currX + 1}`;

  // Check the 3 types of corners
  if ([topLeft, top, left].every(coord => !region.includes(coord))) corners++;
  if ([top, topRight, right].every(coord => !region.includes(coord))) corners++;
  if ([right, bottomRight, bottom].every(coord => !region.includes(coord))) corners++;
  if ([bottom, bottomLeft, left].every(coord => !region.includes(coord))) corners++;
    
  if (region.includes(top) && region.includes(left) && !region.includes(topLeft)) corners++;
  if (region.includes(top) && region.includes(right) && !region.includes(topRight)) corners++;
  if (region.includes(bottom) && region.includes(right) && !region.includes(bottomRight)) corners++;
  if (region.includes(bottom) && region.includes(left) && !region.includes(bottomLeft)) corners++;

  if (region.includes(topLeft) && !region.includes(top) && !region.includes(left)) corners++;
  if (region.includes(topRight) && !region.includes(top) && !region.includes(right)) corners++;
  if (region.includes(bottomRight) && !region.includes(right) && !region.includes(bottom)) corners++;
  if (region.includes(bottomLeft) && !region.includes(left) && !region.includes(bottom)) corners++;

  return corners;
}

const part2 = (regions) => {
  let totalPrice = 0;
  for (let region of regions) {
    let currentCorners = 0;
    for (let plot of region) {
      const [ currY, currX ] = plot.split(", ").map(item => parseInt(item));;
      currentCorners += getCorners(currY, currX, region);
    }
    totalPrice += region.length * currentCorners;
  }
  return totalPrice;
}
