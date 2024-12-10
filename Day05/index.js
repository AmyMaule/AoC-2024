const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const [instructions, updates] = data
    .split("\n\n")
    .map(section => section
        .split("\n")
        .map(line => line.split(/[|,]/)));
  const [validUpdates, invalidUpdates] = getValidInvalidUpdates(instructions, updates);

  console.log(part1(validUpdates));
  console.log(part2(instructions, invalidUpdates));
});

const getValidInvalidUpdates = (instructions, updates) => {
  const validUpdates = [];
  const invalidUpdates = [];

  for (let update of updates) {
    let valid = true;
    for (let [first, second] of instructions) {
      const firstIndex = update.indexOf(first);
      const secondIndex = update.indexOf(second);
      if (firstIndex !== -1 && secondIndex !== -1 && firstIndex > secondIndex) {
        valid = false;
        break;
      }
    }
    if (valid) {
      validUpdates.push(update);
    } else {
      invalidUpdates.push(update);
    }
  }
  return [validUpdates, invalidUpdates];
}

const part1 = validUpdates => {
  return validUpdates.reduce((validMiddlePages, update) => 
    validMiddlePages + Number(update[Math.floor(update.length / 2)])
  , 0);
}

const reorderUpdate = (update, instructions) => {
  const sortedUpdate = [...update];
  let reordered = true;

  // If the update needs to be reordered, keep running it through the loop until it is fixed
  while (reordered) {
    reordered = false;
    for (let [first, second] of instructions) {
      const firstIndex = sortedUpdate.indexOf(first);
      const secondIndex = sortedUpdate.indexOf(second);

      if (firstIndex !== -1 && secondIndex !== -1 && firstIndex > secondIndex) {
        // Remove first num, reinsert it before second num
        sortedUpdate.splice(firstIndex, 1);
        sortedUpdate.splice(secondIndex, 0, first);
        reordered = true;
      }
    }
  }
  return sortedUpdate;
};

const part2 = (instructions, invalidUpdates) => {
  return invalidUpdates.reduce((reorderedMiddlePages, update) => {
    const reorderedUpdate = reorderUpdate(update, instructions);
    return reorderedMiddlePages + Number(reorderedUpdate[Math.floor(reorderedUpdate.length / 2)]);
  }, 0);
}
