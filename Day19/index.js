const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  data = data.split("\n\n");
  const patterns = new Set(data[0].split(", "));  // use a set for quicker lookup
  const designs = data[1].split("\n");

  console.log(part1(patterns, designs));
  console.log(part2(patterns, designs))
});

const countValidDesigns = (design, patterns) => {
  const canFormUpToIndex = new Array(design.length + 1).fill(0);
  canFormUpToIndex[0] = 1; // Empty string can only be made one way

  for (let startIndex = 0; startIndex < design.length; startIndex++) {
    if (!canFormUpToIndex[startIndex]) continue;

    for (let endIndex = startIndex + 1; endIndex <= design.length; endIndex++) {
      const currentSegment = design.slice(startIndex, endIndex);
      if (patterns.has(currentSegment)) {
        canFormUpToIndex[endIndex] += canFormUpToIndex[startIndex];
      }
    }
  }
  return canFormUpToIndex[design.length];
};

const part1 = (patterns, designs) => {
 let validDesigns = 0;
  designs.forEach(design => {
    if (countValidDesigns(design, patterns)) validDesigns++;
  });
  return validDesigns;
}

const part2 = (patterns, designs) => {
  let validDesigns = 0;
  designs.forEach(design => {
    validDesigns += countValidDesigns(design, patterns);
  });
  return validDesigns;
}
