const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  data = data.split("\n");
  
  console.log(part1(data));
  console.log(part2(data));
});

const part1 = (data) => {
  let antinodeCoords = new Set(); // add in format "0,1" for x: 0, y: 1

  for (let i = 0; i < data.length; i++) {
    const currentRow = data[i].split("");
    if (!currentRow.every(item => item === ".")) {
      for (let j = 0; j < currentRow.length; j++) {
        // if the row contains a frequency, find matching pairs
        if (currentRow[j] !== ".") {
          const currentFreq = currentRow[j];
          for (let foundX = i + 1; foundX < data.length; foundX++) {
            const foundIndices = [...data[foundX]]
              .map((item, index) => item === currentFreq ? index : null)
              .filter(index => index);
            
            foundIndices.forEach(foundY => {
              const dx = foundX - i;
              const dy = foundY - j;

              // Check if within the grid - first check previous coords, then future coords
              if (i - dx >= 0 &&  i - dx < data.length &&
                  j - dy >= 0 && j - dy < data[foundX].length) {
                antinodeCoords.add(`${i - dx},${j - dy}`);
              }
              if (foundX + dx < data.length && foundX + dx >= 0 &&
                  foundY + dy < data[foundX].length && foundY + dy >= 0) {
                antinodeCoords.add(`${foundX + dx},${foundY + dy}`);
              }
            })
          }
        }
      }
    }
  }
  return antinodeCoords.size;
}

const part2 = (data) => {
  let antinodeCoords = new Set();

  for (let i = 0; i < data.length; i++) {
    const currentRow = data[i].split("");
    if (!currentRow.every(item => item === ".")) {
      for (let j = 0; j < currentRow.length; j++) {
        // if the row contains a frequency, find matching pairs
        if (currentRow[j] !== ".") {
          const currentFreq = currentRow[j];
          for (let foundX = i + 1; foundX < data.length; foundX++) {
            const foundIndices = [...data[foundX]]
              .map((item, index) => item === currentFreq ? index : null)
              .filter(index => index);
      
            foundIndices.forEach(foundY => {
              // Add initial frequency and found frequency as antinodes
              antinodeCoords.add(`${i},${j}`);
              antinodeCoords.add(`${foundX},${foundY}`);
              const dx = foundX - i;
              const dy = foundY - j;

              // Use temp variables so as not to reset initial values
              let [currentI, currentJ] = [i, j];
              let [currentX, currentY] = [foundX, foundY];

              while (currentI - dx >= 0 && currentI - dx < data.length &&
                     currentJ - dy >= 0 && currentJ - dy < data[foundX].length) {
                antinodeCoords.add(`${currentI - dx},${currentJ - dy}`);
                [currentI, currentJ] = [currentI - dx, currentJ - dy];

              }
              // Check future frequencies
              while (currentX + dx < data.length && currentX + dx >= 0 &&
                     currentY + dy < data[currentX].length && currentY + dy >= 0) {
                antinodeCoords.add(`${currentX + dx},${currentY + dy}`);
                [currentX, currentY] = [currentX + dx, currentY + dy];
              }
            })
          }
        }
      }
    }
  }
  return antinodeCoords.size;
}
